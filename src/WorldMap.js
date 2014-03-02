/*
 *  TheStarsMyDestination tmlib.js version
 *  WorldMap.js
 *  2014/03/01
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//マップ
tm.define("tiger.WorldMap", {
    superClass: "tm.display.CanvasElement",

    app: null,

    //Worldクラス
    world: null,

    //サイズ
    size: 100,

    init: function(x, y, size, world) {
        this.superInit();
        this.app = app;
        this.blendMode = "lighter";
        this.x = x || 0;
        this.y = y || 0;
        this.size = size || 80;
        this.world = world || null;
    },

    update: function() {
    },

    draw: function(canvas) {
        canvas.lineWidth = 16;
        canvas.globalCompositeOperation = "source-over";
        canvas.fillStyle = "rgba(64, 64, 64, 0.8)";
        canvas.fillRect(0, 0, this.size, this.size);

        if (this.world) {
            //惑星位置の描画
            for (var i = 0, len = this.world.planets.length; i < len; i++) {
                var p = this.world.planets[i];
                switch (p.alignment) {
                    case TYPE_NEUTRAL:
                        canvas.fillStyle = "white";
                        break;
                    case TYPE_PLAYER:
                        canvas.fillStyle = "aqua";
                        break;
                    case TYPE_ENEMY:
                        canvas.fillStyle = "red";
                        break;
                }
                var x = (p.x/this.world.size)*this.size;
                var y = (p.y/this.world.size)*this.size;
                canvas.fillRect(x-2, y-2, 4, 4);
            }
            //ユニット位置の描画
            for (var i = 0, len = this.world.units.length; i < len; i++) {
                var u = this.world.units[i];
                switch (u.alignment) {
                    case TYPE_PLAYER:
                        canvas.fillStyle = "aqua";
                        break;
                    case TYPE_ENEMY:
                        canvas.fillStyle = "red";
                        break;
                }
                var x = (u.x/this.world.size)*this.size;
                var y = (u.y/this.world.size)*this.size;
                canvas.fillRect(x-1, y-1, 2, 2);
            }
        }
    }
});
