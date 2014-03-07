/*
 *  TheStarsMyDestination tmlib.js version
 *  UserInterface.js
 *  2014/02/27
 *  @auther minimo  
 *  This Program is MIT license.
 *
 */

//スライダーバー
tm.define("tiger.Sliderbar", {
    superClass: "tm.display.CanvasElement",

    //現在値
    _value: 50,

    //最小値
    _min: 0,

    //最大値
    _max: 100,

    init: function(x, y, width, height) {
        this.superInit();
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 100;
        this.height = height || 16;

        this.interactive = true;
    },

    draw: function(canvas) {
        var now = this._value/(this._max-this._min);

        canvas.lineWidth = 3;
        canvas.globalCompositeOperation = "source-over";

        canvas.fillStyle = "rgba(100, 100, 100, 1.0)";
        canvas.fillRoundRect(0, this.height/3, this.width*now, this.height/3, this.height/6);
        canvas.fillStyle = "rgba(128, 128, 128, 1.0)";
        canvas.fillRoundRect(this.width*now, this.height/3, this.width*(1-now), this.height/3, this.height/6);

        canvas.fillStyle = "rgba(200, 200, 200, 1.0)";
        canvas.fillCircle(this.width*now, this.height/2, this.height/2);
    },

    pointing: function(e) {
    },
});

