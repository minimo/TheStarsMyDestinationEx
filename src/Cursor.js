/*
 *  TheStarsMyDestination tmlib.js version
 *  Cursor.js
 *  2014/03/01
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//スケール用カーソル
tm.define("tiger.ScaleCursor", {
    superClass:  tm.display.CanvasElement,

    //アクティブフラグ
    active: false,

    //始点
    start:0,

    //終点
    end: 360,

    init: function() {
        this.superInit();
        
        this.alpha = 0;
    },

    update: function() {
        if (this.active) {
            this.alpha+=0.05;
            if (this.alpha > 1.0)this.alpha = 1.0;
        } else {
            this.alpha-=0.05;
            if (this.alpha < 0.0)this.alpha = 0.0;
        }
    },

    draw: function(canvas) {
        canvas.lineWidth = 30;
        canvas.globalCompositeOperation = "lighter";
        
        var start = this.start*toRad;
        var end = this.end*toRad;
        var clock = true;
        if (start<0)clock = false;

        canvas.strokeStyle = 'red';
        canvas.strokeArc(0, 0, 40, end, start, clock);

        canvas.strokeStyle = 'lime';
        canvas.strokeArc(0, 0, 40, start, 0, clock);
    },
});
