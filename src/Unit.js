/*
 *  TheStarsMyDestination tmlib.js version
 *  Unit.js
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//ユニット管理クラス
tm.define("tiger.Unit", {
    superClass: tm.display.Sprite,

    //ＩＤ
    ID: 0,

    //所属艦隊ＩＤ
    groupID: 0,

    //戦力
    HP: 0,

    //攻撃力
    power: 1,

    //属性（0:中立 1:プレイヤー 2:エネミー）
    alignment: 0,   //※仕様上中立は無い（予定）

    //目的地
    destination: null,

    //進行用パラメータ
    vx: 0,
    vy: 0,
    speed: 1,

    //所属ワールド
    world: null,

    //選択フラグ
    select: false,

    //有効フラグ
    active: true,

    //マウスオーバーフラグ
    mouseover: false,

    init: function(x, y, alignment, HP, power) {
        this.superInit("frigate", 64, 64);
        this.x = x || 0;
        this.y = y || 0;
        this.alignment = alignment || 0;
        this.HP = HP || 1;
        this.power = power || 1;
        this.setFrameIndex(0, 64, 64);

        var that = this;
        //選択カーソル
        this.cursor = tm.display.CircleShape(50, 50, {
            fillStyle: "rgba(0,0,0,0)",
            strokeStyle: tm.graphics.LinearGradient(0,0,0,50).addColorStopList([
                { offset:0.0, color:"rgba(0,255,0,0.0)" },
                { offset:0.3, color:"rgba(0,255,0,0.8)" },
                { offset:0.5, color:"rgba(0,255,0,1.0)" },
                { offset:0.7, color:"rgba(0,255,0,0.8)" },
                { offset:1.0, color:"rgba(0,255,0,0.0)" },
            ]).toStyle(),
            lineWidth: 3.0,
        }).addChildTo(this);
        this.cursor.blendMode = "lighter";
        this.cursor.alpha = 0;
        this.cursor.update = function() {
            if (that.select || that.mouseover) {
                this.rotation++;
                this.alpha+=0.05;
                if (this.alpha > 1.0)this.alpha = 1.0;
            } else {
                this.alpha-=0.05;
                if (this.alpha < 0.0)this.alpha = 0.0;
            }
        };
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

    //目標到着処理
    arrival: function() {
        this.world.addChild(tiger.Effect.genShockwave(this.x, this.y, 1));
        this.active = false;
    },

    //破壊処理
    destroy: function() {
        this.world.enterExplode(this);
        this.active = false;
    }
});

