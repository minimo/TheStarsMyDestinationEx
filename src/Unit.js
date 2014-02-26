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

    //進行用パラメータ
    vx: 0,
    vy: 0,
    speed: 0.5,

    init: function(x, y, alignment, HP, power) {
        this.superInit("frigate", 64, 64);
        this.x = x || 0;
        this.y = y || 0;
        this.alignment = alignment || 0;
        this.HP = HP || 1;
        this.power = power || 1;
        this.setFrameIndex(0, 64, 64);
    },

    update: function() {
        if (this.destination) {
            this.x += this.vx;
            this.y += this.vy;

            //進行方向を計算する
            var rot = Math.atan2(this.vy, this.vx)*toDeg;
            if (rot < 0) {
                rot += 350;  //右から時計回りで３６０になる様にする
            } else {
                rot += 5;  //補正
            }
            this.setFrameIndex(~~(rot/10), 64, 64);
        }
    },

    //目的地座標設定
    setDestination: function(d) {
        this.destination = d;
        var gx = this.x;
        var gy = this.y;
        var tx = d.x;
        var ty = d.y;
        var dis = Math.sqrt((tx-gx)*(tx-gx) + (ty-gy)*(ty-gy));
        if (dis == 0)return;
        this.vx = (tx-gx)/dis*this.speed;
        this.vy = (ty-gy)/dis*this.speed;
    },

    //特定ワールド座標からの距離
    getDistance: function(x, y) {
        var dx = this.x-x;
        var dy = this.y-y;
        return Math.sqrt(dx*dx+dy*dy);
    },

    //被ダメージ処理    
    damage: function(pow) {
        this.HP -= pow;
        if (this.HP < 0)this.destroy();
    },

    //破壊処理
    destroy: function() {
    }
});

