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
/*
        //スコア表示
        var sc = tm.app.Label("SCORE: 0");
        sc.fillStyle = "white";
        sc.fontSize = 15;
        sc.x = 0;
        sc.y = 13;
        sc.width = 200;
        sc.update = function() {
            this.text = "SCORE :"+app.score;
        }
        this.addChild(sc);
*/
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
        }
    },
});

