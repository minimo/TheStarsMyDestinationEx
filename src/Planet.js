/*
 *  TheStarsMyDestination tmlib.js version
 *  Planet.js
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 */

//惑星管理クラス
tiger.Planet = tm.createClass({
    superClass: tm.display.Sprite,    

    //惑星タイプ
    type: 0,
    
    //生産力(0.5-2.0)
    power: 1,

    //戦力
    HP: 0,
    //属性（0:中立 1:プレイヤー 2:エネミー）
    alignment: 0,

    init: function() {
        this.superInit("planet", 64, 64);
        this.setFrameIndex(0, 64, 64);

        this.label = tm.display.Label("", 20).addChildTo(this);
        var that = this;
        this.label.update = function() {
            this.text = ""+that.HP; 
            if (that.alignment == TYPE_NUTRAL) {
                this.fillStyle = "white";
            } else if (that.alignment == TYPE_PLAYER){
                this.fillStyle = "blue";
            } else {
                this.fillStyle = "red";
            }
        };
    },

    update: function() {
    },
});
