/*
 *  TheStarsMyDestination tmlib.js version
 *  CosmicBalance.js
 *  2014/03/05
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//勢力天秤
tm.define("tiger.CosmicBalance", {
    superClass: "tm.display.CanvasElement",

    app: null,

    //Worldクラス
    world: null,

    //幅
    width: 640,

    //マウスオーバーフラグ
    mouseover: false,

    init: function(x, y, width, world) {
        this.superInit();
        this.app = app;
        this.blendMode = "lighter";
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 640;
        this.world = world || null;
    },

    update: function() {
    },

    draw: function(canvas) {
        if (!this.mouseover) {
            this.alpha+=0.1;
            if (this.alpha > 1.0)this.alpha = 1.0;
        } else {
            this.alpha-=0.1;
            if (this.alpha < 0.0)this.alpha = 0.0;
        }
        canvas.lineWidth = 16;
        canvas.globalCompositeOperation = "source-over";
        canvas.fillStyle = "rgba(64, 64, 64, 0.8)";
        canvas.fillRect(0, 0, this.width, 32);

        //勢力図作成
        if (this.world) {
            //各陣営
            var playerPlanet = this.world.getPowerOfPlanet(TYPE_PLAYER);
            var playerUnit = this.world.getPowerOfUnit(TYPE_PLAYER);
            var enemyPlanet = this.world.getPowerOfPlanet(TYPE_ENEMY);
            var enemyUnit = this.world.getPowerOfUnit(TYPE_ENEMY);
            var neutralPlanet = this.world.getPowerOfPlanet(TYPE_NEUTRAL);

            //全体
            var all = playerPlanet+playerUnit+enemyPlanet+enemyUnit+neutralPlanet;

            //勢力比率
            var player = (playerPlanet+playerUnit)/all;
            var enemy = (enemyPlanet+enemyUnit)/all;
            var neutral = (neutralPlanet)/all;

            var bl = this.width-20;
            canvas.fillStyle = "rgba(0, 64, 255, 0.8)";
            canvas.fillRect(10, 4, bl*player, 32-8);
            canvas.fillStyle = "rgba(180, 180, 180, 0.8)";
            canvas.fillRect(bl*player+10, 4, bl*neutral, 32-8);
            canvas.fillStyle = "rgba(255, 64, 64, 0.8)";
            canvas.fillRect(bl*player+bl*neutral+10, 4, bl*enemy, 32-8);
        }
    }
});
