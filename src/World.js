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
    size: 640*2,

    //レイヤーベース
    base: null,

    //最大惑星数
    maxPlanets: 16,
    
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

        //表示レイヤー構築（数字が大きい程優先度が高い）
        this.layer = [];
        for (var i = 0; i < LAYER_SYSTEM+1; i++) {
            var gr = tm.app.Object2D().addChildTo(this.base);
            this.layer[i] = gr;
        }
    },

    build: function() {
        //バックグラウンドの追加
        var bg = tm.display.Sprite("bg1", 1024, 698).addChildTo(this);

        //プレイヤー主星
        this.addPlanet(32, 32, TYPE_PLAYER, 100, 1);

        //エネミー主星
        this.addPlanet(this.size-32, this.size-32, TYPE_ENEMY, 100, 1);

        for (var i = 0; i < this.maxPlanets; i++) {
            var x = rand(32, this.size-32);
            var y = rand(32, this.size-32);
            this.addPlanet(x, y);
        }
    },

    //惑星の追加
    addPlanet: function(x, y, alignment, HP, power, type) {
        alignment = alignment || TYPE_NUTRAL;
        HP = HP || rand(30, 300);
        power = power || rand(0, 200)/100+0.5;
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
