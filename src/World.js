/*
 *  TheStarsMyDestination tmlib.js version
 *  World.js
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 *
 *  配置した惑星やユニットの移動、戦闘その他を自動で処理
 *  操作はGameSceneから行う
 *
 */

//マップ管理クラス
tm.define("tiger.World", {
    superClass: tm.app.Object2D,

    //親シーン
    scene: null,

    //マップの一辺のサイズ
    size: 640*2,

    //ベースレイヤー
    base: null,

    //スプライトレイヤー
    layers: null,

    //最大惑星数
    maxPlanets: 20,

    //惑星リスト
    planets: null,

    //ユニットリスト
    units: null,

    //惑星ＩＤ連番
    planetID: 0,

    //ユニットＩＤ連番
    unitID: 0,
    unitGroupID: 0,

    //艦隊派遣時戦力レート(0.1 - 1.0)
    rate: 0.5,

    init: function(scene) {
        this.superInit();
        this.scene = scene;
        this.planets = [];
        this.units = [];

        this.base = tm.app.Object2D();
        this.base.originX = 0;
        this.base.originY = 0;
        this.superClass.prototype.addChild.call(this, this.base);

        //表示レイヤー構築（数字が大きい程優先度が高い）
        this.layers = [];
        for (var i = 0; i < LAYER_SYSTEM+1; i++) {
            this.layers[i] = tm.app.Object2D().addChildTo(this.base);
        }
    },

    update: function() {
        //ユニット対惑星
        for (var i = 0, len = this.units.length; i < len; i++) {
            var unit = this.units[i];
            if (unit.HP <= 0)continue;
            var planet = unit.destination;
            //到着判定
            var dis = distance(unit, planet);
            if (dis < 32*planet.power) {
                planet.damage(unit.alignment, unit.HP);
                unit.HP = 0;
                if (planet.alignment != unit.alignment) {
                    unit.destroy();
                }
            }

            //領空内判定
            if (dis < 40*planet.power) {
            }
        }

        //ユニット対ユニット
        len = this.units.length;
        for (var i = 0; i < len; i++) {
            var unit1 = this.units[i];
            if (unit1.HP <= 0)continue;
            for (var j = 0; j < len; j++) {
                if (i == j)continue;
                var unit2 = this.units[j];
                if (unit2.HP <= 0)continue;
                var dis = distance(unit1, unit2);
                if (dis < 40) {
                }
            }
        }

        //破壊ユニット掃除
        for (var i = 0; i < len; i++) {
            var unit = this.units[i];
            if (unit.HP <= 0) {
                unit.remove();
                this.units.splice(i, 1);
            }
        }
    },
    
    //マップの構築
    build: function() {
        //バックグラウンドの追加
        var bg = tm.display.Sprite("bg1", this.size, this.size).addChildTo(this);
        bg.originX = bg.originY = 0;

        //プレイヤー主星
        this.enterPlanet(64, 64, TYPE_PLAYER, 100, 1, 3);

        //エネミー主星
        this.enterPlanet(this.size-64, this.size-64, TYPE_ENEMY, 100, 1, 3);

        //中立惑星配置
        for (var i = 0; i < this.maxPlanets; i++) {
            var x = rand(64, this.size-64);
            var y = rand(64, this.size-64);
            var ok = true;
            //一定距離内に配置済み惑星が無いか確認
            for (var j = 0; j < this.planets.length; j++) {
                var p = this.planets[j];
                var dx = p.x-x, dy = p.y-y;
                var dis = dx*dx+dy*dy;
                if (dis < 132*132){ok = false;break;}
            }
            if (!ok) {i--;continue;}
            this.enterPlanet(x, y);
        }
    },

    //惑星の追加
    enterPlanet: function(x, y, alignment, HP, power, type) {
        alignment = alignment || TYPE_NEUTRAL;
        power = power || rand(50, 200)/100;
        HP = HP || ~~(rand(30, 70)*power);
        type = type || rand(0, 5);

        var p = tiger.Planet(x, y, alignment, HP, power, type).addChildTo(this);
        p.ID = this.planetID;
        this.planetID++;
    },

    //艦隊投入
    enterUnit: function(from, to, rate) {
        rate = rate || this.rate;
        if (rate > 0.9)rate = 0.9;

        if (from.HP < 10)return null;
        var HP = from.HP * rate;
        from.HP -= HP;
        if (from.HP < 0)from.HP = 1;
        var num = ~~(HP/10)+1;
        var unitHP = 10;
        if (num > 20) {
            unitHP = 20;
            num = ~~(num/2)+1;
        }
        for (var i = 0; i < num; i++) {
            var r = 24 * from.power+rand(0, 20);
            var d = rand(0, 360)*toRad;
            var x = from.x + Math.sin(d) * r;
            var y = from.y + Math.cos(d) * r;
            var unit = tiger.Unit(x, y, from.alignment, unitHP).addChildTo(this);
            unit.setDestination(to);
            unit.ID = this.unitID;
            this.unitID++;
            unit.groupID = this.unitGroupID;
        }
        this.unitGroupID++;
    },

    //指定座標から一番近い惑星を取得
    getPlanet: function(x, y){
        var bd = 99999999;
        var pl = null;
        for (var i = 0; i < this.planets.length; i++) {
            var p = this.planets[i];
            var dx = p.x-x;
            var dy = p.y-y;
            var dis = dx*dx+dy*dy;
            if (dis < bd){
                pl = p;
                bd = dis;
            }
        }
        return {planet: pl, distance: Math.sqrt(bd)};
    },

    //指定座標から一番近い艦隊を取得
    getUnit: function(x, y) {
        if (this.units.length == 0)return null;
        var bd = 99999999;
        var unit = null;
        for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            var dx = u.x-x;
            var dy = u.y-y;
            var dis = dx*dx+dy*dy;
            if (dis < bd){
                unit = u;
                bd = dis;
            }
        }
        return {unit: unit, distance: Math.sqrt(bd)};
    },

    //特定のグループＩＤのユニットを配列で取得
    getUnitGroup: function(groupID) {
        var units = [];
        for (var i = 0; i < this.units.length; i++) {
            if (this.units[i].groupID == groupID) units.push(this.units[i]);
        }
        return units.length == 0? null : units;
    },

    //特定のユニットグループを選択／非選択にする
    selectUnitGroup: function(groupID, select) {
        for (var i = 0, len = this.units.length; i < len; i++) {
            var u = this.units[i];
            if (u.groupID == groupID)u.select = select;
        }
    },

    //特定のユニットグループの目標を変更する
    setDestinationUnitGroup: function(groupID, destination) {
        for (var i = 0, len = this.units.length; i < len; i++) {
            var u = this.units[i];
            if (u.groupID == groupID)u.setDestination(destination);
        }
    },

    //惑星戦力合計を算出
    getPowerOfPlanet: function(alignment) {
        var val = 0;
        for (var i = 0, len = this.planets.length; i < len; i++) {
            var p = this.planets[i];
            if (p.alignment == alignment) val += p.HP;
        }
        return val;
    },

    //艦隊戦力合計を算出
    getPowerOfUnit: function(alignment) {
        var val = 0;
        for (var i = 0, len = this.unit.length; i < len; i++) {
            var p = this.units[i];
            if (p.alignment == alignment) val += p.HP;
        }
        return val;
    },

    //addChildオーバーライド
    addChild: function(child) {
        //ユニットレイヤ
        if (child instanceof tiger.Unit) {
            child.world = this;
            this.layers[LAYER_UNIT].addChild(child);
            this.units[this.units.length] = child;
            return;
        }

        //マップレイヤ
        if (child instanceof tiger.Planet) {
            child.world = this;
            this.layers[LAYER_PLANET].addChild(child);
            this.planets[this.planets.length] = child;
            return;
        }

        //エフェクトレイヤ
        if (child.isEffect) {
            if (!child.isLower) {
                this.layers[LAYER_EFFECT_UPPER].addChild(child);
                return;
            } else {
                this.layers[LAYER_EFFECT_LOWER].addChild(child);
                return;
            }
        }

        //フォアグラウンドレイヤ
        if (child.isForeground) {
            this.layers[LAYER_FOREGROUND].addChild(child);
            return;
        }

        //システム表示レイヤ
        if (child.isSystem) {
            this.layers[LAYER_SYSTEM].addChild(child);
            return;
        }

        //どれにも該当しない場合はバックグラウンドへ追加
        this.layers[LAYER_BACKGROUND].addChild(child);
//        this.superClass.prototype.addChild.apply(this, arguments);
    },
});
