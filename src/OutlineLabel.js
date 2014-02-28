/*
 * OutlineLabel.js
 */

tm.display = tm.display || {};

(function() {

    tm.display.OutlineLabel = tm.createClass({
        superClass: tm.display.CanvasElement,

        //縁取り用
        labels: null,

        /**
         * @constructor
         */
        init: function(text, size) {
            this.superInit();

            this.outlineColor = "black";

            //アウトライン作成
            this.labels = [];
            var n = 0;
            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    this.labels[n] = tm.display.Label(text, size);
                    this.labels[n].x = i;
                    this.labels[n].y = j;
                    if (i == 0 && j == 0){
                        this.labels[n].fillStyle = 'white';
                    } else {
                        this.labels[n].fillStyle = 'black';
                        this.labels[n].addChildTo(this);
                    }
                    n++;
                }
            }
            this.labels[4].addChildTo(this);
        },

        setAlign: function(align) {
            for (var i = 0; i < 9; i++)this.labels[i].align = align;
            return this;
        },

        setBaseline: function(baseline) {
            for (var i = 0; i < 9; i++)this.labels[i].baseline = baseline;
            return this;
        },
        
        setFontSize: function(size) {
            for (var i = 0; i < 9; i++)this.labels[i].fontSize = size;
            return this;
        },
        
        setFontFamily: function(family) {
            for (var i = 0; i < 9; i++)this.labels[i].fontFamily= family;
            return this;
        },

        setFontWeight: function(weight) {
            for (var i = 0; i < 9; i++)this.labels[i].fontWeight= weight;
            return this;
        },
    });

    /**
     * @property    text
     * 文字
     */
    tm.display.OutlineLabel.prototype.accessor("text", {
        "get": function() { return this.labels[0].text; },
        "set": function(v){
            if (v == null || v == undefined) {
                for (var i = 0; i < 9; i++)this.labels[i].text = "";
            } else {
                for (var i = 0; i < 9; i++)this.labels[i].text = v;
            }
        }
    });

    /**
     * @property    fontSize
     * フォントサイズ
     */
    tm.display.OutlineLabel.prototype.accessor("fontSize", {
        "get": function() { return this.labels[0].fontSize; },
        "set": function(v) {
            for (var i = 0; i < 9; i++)this.labels[i].fontSize = v;
        }
    });

    /**
     * @property    fontFamily
     * フォント
     */
    tm.display.OutlineLabel.prototype.accessor("fontFamily", {
        "get": function() { return this.labels[0].fontFamily; },
        "set": function(v){
            for (var i = 0; i < 9; i++)this.labels[i].fontFamily = v;
        }
    });

    /**
     * @property    fontWeight
     */
    tm.display.OutlineLabel.prototype.accessor("fontWeight", {
        "get": function() { return this.labels[0].fontWeight; },
        "set": function(v) {
            for (var i = 0; i < 9; i++)this.labels[i].fontWeight = v;
        },
    });

    /**
     * @property lineHeight
     */
    tm.display.OutlineLabel.prototype.accessor("lineHeight", {
        "get": function() { return this.labels[0].lineHeight; },
        "set": function(v) {
            for (var i = 0; i < 9; i++)this.labels[i].lineHeight = v;
        },
    });

    /**
     * @property fillStyle
     */
    tm.display.OutlineLabel.prototype.accessor("fillStyle", {
        "get": function() { return this.labels[4].fillStyle; },
        "set": function(fillStyle) {
            this.labels[4].fillStyle = fillStyle;
        },
    });

    /**
     * @property fillStyle
     */
    tm.display.OutlineLabel.prototype.accessor("outlineFillStyle", {
        "get": function() { return this.labels[0].fillStyle; },
        "set": function(fillStyle) {
            for (var i = 0; i < 9; i++) {
                if (i != 4)this.labels[i].fillStyle = fillStyle;
            }
        },
    });

    /**
     * @property    align
     */
    tm.display.OutlineLabel.prototype.accessor("align", {
        "get": function() { return this.labels[0].align; },
        "set": function(align) {
            for (var i = 0; i < 9; i++)this.labels[i].align = align;
        }
    });

    /**
     * @property    align
     */
    tm.display.OutlineLabel.prototype.accessor("align", {
        "get": function() { return this.labels[0].align; },
        "set": function(align) {
            for (var i = 0; i < 9; i++)this.labels[i].align = align;
        }
    });

    /**
     * @property    baseline
     */
    tm.display.OutlineLabel.prototype.accessor("baseline", {
        "get": function() { return this.labels[0].baseline; },
        "set": function(baseline) {
            for (var i = 0; i < 9; i++)this.labels[i].baseline = baseline;
        }
    });

})();
