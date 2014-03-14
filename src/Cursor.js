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

    //最小値
    min: 50,

    //中央値
    center: 100,

    //最大値
    max: 200,

    //現在値
    _value: 100,

    init: function() {
        this.superInit();
        this.alpha = 0;

        //スケール表示
        var that = this;
        this.label = tm.display.OutlineLabel("", 30).addChildTo(this);
        this.label.fontFamily = "'Orbitron'";
        this.label.align     = "center";
        this.label.baseline  = "middle";
        this.label.fontSize = 30;
        this.label.fontWeight = 700;
        this.label.outlineWidth = 2;
        this.fillStyle = "rgba(255, 255, 255, 1.0)";
        this.label.update = function() {
            this.text = ~~(that.value) + "%";
        };
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

        var rad = 0;
        var value = (this._value-this.center);
        var clock = true;
        var color = 'lime'
        if (value < 0) {
            clock = false;
            color = 'blue';
            var u = this.center - this.min;
            rad = (360/u)*toRad*value;
        } else {
            var u = this.max - this.center;
            rad = (360/u)*toRad*value;
        }

        canvas.strokeStyle = 'red';
        canvas.strokeArc(0, 0, 40, Math.PI*2, rad, clock);

        canvas.strokeStyle = color;
        canvas.strokeArc(0, 0, 40, rad, 0, clock);
    },
});

tiger.ScaleCursor.prototype.accessor("value", {
    "get": function()   { return this._value; },
    "set": function(v)  { this._value = clamp(v, this.min, this.max); }
});
