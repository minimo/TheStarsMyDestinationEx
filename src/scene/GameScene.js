/*
 *  TheStarsMyDestination tmlib.js version
 *  GameScene.js
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 */

//ゲームシーン
tiger.GameScene = tm.createClass({
    superClass: tm.app.Scene,

    //ポーズフラグ
    pause: false,

    //マップクラス
    world: null,

    //準備完了フラグ
    ready: false,

    init: function() {
        this.superInit();

        this.world = tiger.World();
        this.addChild(this.world.base);

        //スコア表示
        var sc = tm.app.Label("");
        sc.fillStyle = "white";
        sc.fontSize = 15;
        sc.x = 0;
        sc.y = 13;
        sc.width = 200;
        var that = this;
        sc.update = function() {
            var p = app.pointing;
            this.text = "x:"+p.position.x+" y:"+p.position.y+" size:"+that.world.size;
//            this.text = "x:"+that.world.base.x+" y:"+that.world.base.y+" size:"+that.world.size;
        }
        this.addChild(sc);
    },

    update: function() {
        if (!this.ready) {
            //ゲームスタート準備
            this.world.build();

            //準備完了
            this.ready = true;
            return;
        }
        var p = app.pointing;
        if (p.getPointing()) {
            var dx = p.position.x - p.prevPosition.x;
            var dy = p.position.y - p.prevPosition.y;
            this.world.base.x += dx;
            this.world.base.y += dy;
            if (this.world.base.x > 0)this.world.base.x = 0;
            if (this.world.base.y > 0)this.world.base.y = 0;
            if (this.world.base.x < -this.world.size+SC_W)this.world.base.x = -this.world.size+SC_W;
            if (this.world.base.y < -this.world.size+SC_H)this.world.base.y = -this.world.size+SC_H;
        }
    },
});

