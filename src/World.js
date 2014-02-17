/*
 *  TheStarsMyDestination tmlib.js version
 *  World.js
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 */

//マップ管理クラス
tiger.World = tm.createClass({

    //親シーン
    scene: null,

    //マップの一辺のサイズ
    size: 640*1,

    //マップの現在スケール
    scale: 1,

    //ベースレイヤー
    base: null,

    //最大惑星数
    maxPlanets: 5,
    
    //惑星リスト
    planets: null,

    //ユニットリスト    
    units: null,

    //スプライトレイヤー
    layer: null,

    init: function(scene) {
        this.scene = scene;
        this.planets = [];
        this.units = [];

        this.base = tm.app.Object2D();
        this.base.originX = 0;
        this.base.originY = 0;

        //表示レイヤー構築（数字が大きい程優先度が高い）
        this.layer = [];
        for (var i = 0; i < LAYER_SYSTEM+1; i++) {
            var gr = tm.app.Object2D().addChildTo(this.base);
            this.layer[i] = gr;
        }
    },

    //マップの構築
    build: function() {
        //バックグラウンドの追加
        var bg = tm.display.Sprite("bg1", this.size, this.size).addChildTo(this);
        bg.originX = bg.originY = 0;

        //プレイヤー主星
        this.addPlanet(64, 64, TYPE_PLAYER, 100, 1, 3);

        //エネミー主星
        this.addPlanet(this.size-64, this.size-64, TYPE_ENEMY, 100, 1, 3);

        //中立惑星配置
        for (var i = 0; i < this.maxPlanets; i++) {
            var x = rand(64, this.size-64);
            var y = rand(64, this.size-64);
            var ok = true;
            //一定距離内に配置済み惑星が無いか確認
            for (var j = 0; j < this.planets.length; j++) {
                var p = this.planets[j];
                var dx = p.x-x, dy = p.y-y;
                var dis = Math.sqrt(dx*dx+dy*dy);
                if (dis < 132){ok = false;break;}
            }
            if (!ok) {i--;continue;}
            this.addPlanet(x, y);
        }
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
        return pl;
    },

    //惑星の追加
    addPlanet: function(x, y, alignment, HP, power, type) {
        alignment = alignment || TYPE_NUTRAL;
        HP = HP || rand(30, 300);
        power = power || rand(0, 150)/100+0.5;
        type = type || rand(0, 5);

        var p = tiger.Planet(x, y, alignment, HP, power, type);
        this.addChild(p);
    },

    //オブジェクトを表示レイヤーに追加
    addChild: function(child) {
        if (child instanceof tiger.Unit) {
            //ユニットレイヤ
            this.layer[LAYER_UNIT].addChild(child);
            this.units[this.units.length] = child;
        } else if (child instanceof tiger.Planet) {
            //マップレイヤ
            this.layer[LAYER_PLANET].addChild(child);
            this.planets[this.planets.length] = child;
        } else {
            if (child.isEffect) {
                //エフェクト用レイヤ
                this.layer[LAYER_EFFECT_UPPER].addChild(child);
            } else {
                this.layer[LAYER_BACKGROUND].addChild(child);
//                this.superClass.prototype.addChild.apply(this, arguments);
            }
        }
    },
});
