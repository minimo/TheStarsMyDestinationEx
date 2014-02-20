/*
 *  TheStarsMyDestination tmlib.js version
 *  Unit.js
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//ユニット管理クラス
tiger.Unit = tm.createClass({
    superClass: tm.display.Sprite,

    //戦力
    HP: 0,

    //攻撃力
    power: 1,

    //属性（0:中立 1:プレイヤー 2:エネミー）
    alignment: 0,   //※仕様上中立は無い（予定）

    //所属艦隊ＩＤ
    group:0,

    //目的地
    destination: null,

    //進行速度
    speed: 0.5,

    init: function(x, y, alignment, HP, power) {
        this.superInit("frigate", 32, 32);
        this.x = x || 0;
        this.y = y || 0;
        this.alignment = alignment || 0;
        this.HP = HP || 1;
        this.power = power || 1;
        this.setFrameIndex(0, 32, 32);
    },

    update: function() {
        if (this.destination) {
            var dx = this.destination.x-this.x;
            var dy = this.destination.y-this.y;
            var dir = Math.atan2(dy, dx);
            this.x += Math.sin(dir)*this.speed;
            this.y += Math.cos(dir)*this.speed;

            //目標に到達したっぽい
            if (this.destination instanceof tiger.Planet) {
            }
        }
    },

    //目的地座標設定    
    setDestination: function(d) {
        if (d instanceof tiger.Planet) {
            this.destination = d;
        }
    },

    //特定ワールド座標からの距離
    distance: function(x, y) {
        var dx = this.x-x;
        var dy = this.y-y;
        return Math.sqrt(dx*dx+dy*dy);
    },
});

