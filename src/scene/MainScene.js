/*
 *  TheStarsMyDestination tmlib.js version
 *  MainScene.js
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 */

//メインシーン
tiger.MainScene = tm.createClass({
    superClass: tm.app.Scene,

    //ポーズフラグ
    pause: false,
    
    init: function() {
        this.superInit();

        this.base = tm.app.Object2D().addChildTo(this);

        //通常表示レイヤー（数字が大きい程優先度が高い）
        this.layer = [];
        for (var i = 0; i < LAYER_SYSTEM+1; i++) {
            var gr = tm.app.Object2D().addChildTo(this.base);
            this.layer.push(gr);
        }
    },

    update: function() {
    },

    //任意レイヤーへオブジェクトを追加
    addChildToLayer: function(layer, obj) {
        layer = layer || LAYER_PLANET;
        if (layer < 0)return false;
        if (layer > LAYER_SYSTEM)return false;
        this.layer[layer].addChild(obj);
        return true;
    },

    //マップ構築
    buildMap: function(val) {
        //プレイヤー主星
        this.addPlanet( TYPE_PLAYER, 32, 32);

        //エネミー主星
        this.addPlanet( TYPE_ENEMY, WORLD_SIZE-32, WORLD_SIZE-32);

        for (var i = 0; i < NUM_MAXPLANETS; i++) {
            var x = rand(32, WORLD_SIZE-32);
            var y = rand(32, WORLD_SIZE-32);
            this.addPlanet( TYPE_NUTRAL, x, y);
        }
    },

    //マップへ惑星を追加
    addPlanet: function(alignment, x, y) {
        var p = tiger.Planet();
        p.x = x;
        p.y = y;
        p.alignment = alignment;
        p.HP = rand(10, 300);
        this.addChild(p);
    },

    //addChildオーバーロード
    addChild: function(child) {
        if (child instanceof tiger.Unit) {
            //ユニットレイヤ
            this.layer[LAYER_UNIT].addChild(child);
        } else if (child instanceof tiger.Planet) {
            //マップレイヤ
            this.layer[LAYER_PLANET].addChild(child);
        } else {
            if (child.isEffect) {
                //エフェクト用レイヤ
                this.layer[LAYER_EFFECT_UPPER].addChild(child);
            } else {
                this.layer[LAYER_EFFECT_BACKGROUND].addChild(child);
//                this.superClass.prototype.addChild.apply(this, arguments);
            }
        }
    },
});

