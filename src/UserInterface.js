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
    value: 50,

    //最小値
    min: 0,

    //最大値
    max: 100,

    init: function(width, height) {
        this.superInit();
        this.width = width || 100;
        this.height = height || 16;
    },

    draw: function(canvas) {
        canvas.fillStyle = "rgba(0, 64, 255, 0.8)";
        canvas.fillRoundRect(0, this.height/3, this.width, this.height/3, this.height/6);
    },
});
