/*
 *  TheStarsMyDestination tmlib.js version
 *  Arrow.js
 *  2014/03/01
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//選択矢印
tm.define("tiger.Cursor", {
    superClass:  tm.display.CanvasElement,

    init: function() {
        this.superInit();
    },

    draw: function() {
        canvas.lineWidth = 10;
        canvas.globalCompositeOperation = "source-over";
        canvas.fillStyle = "rgba(0, 0, 0, 0)";
        canvas.strokeStyle =  tm.graphics.LinearGradient( 0, 0, 0, 100).addColorStopList([
                { offset:0.0, color:"rgba(0, 255, 0, 1.0)" },
                { offset:1.0, color:"rgba(0, 255, 0, 1.0)" },
        ]).toStyle()
    },
});
