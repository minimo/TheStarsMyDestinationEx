/*
 *  TheStarsMyDestination tmlib.js version
 *  Planet.js
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 */

//惑星管理クラス
tm.define("tiger.Planet", {
    superClass: tm.display.Sprite,    

    //惑星ＩＤ
    ID: 0,

    //惑星タイプ
    //0: 中立
    //1: プレイヤー
    //2: エネミー
    type: 0,

    //生産力(0.5-2.0)
    power: 1,

    //戦力
    HP: 0,

    //属性（0:中立 1:プレイヤー 2:エネミー）
    alignment: 0,

    //選択中フラグ
    select: false,

    //マウスオーバーフラグ
    mouseover: false,

    //経過フレーム数
    frame: 0,
    
    //所属ワールド
    world: null,

    init: function(x, y, alignment, HP, power, type) {
        this.alignment = alignment || 0;
        if (this.alignment == TYPE_NEUTRAL) {
            this.superInit("planet_mono", 64, 64);
        } else {
            this.superInit("planet", 64, 64);
        }
        this.x = x || 0;
        this.y = y || 0;
        this.HP = HP || 100;
        this.power = power || 1;
        this.type = type || 0;

        this.setFrameIndex(this.type, 64, 64);
        this.setScale(this.power);

        var that = this;
        //選択カーソル
        this.cursor = tm.display.CircleShape(80, 80, {
            fillStyle: "rgba(0,0,0,0)",
            strokeStyle: tm.graphics.LinearGradient(0,0,0,80).addColorStopList([
                { offset:0.0, color:"rgba(0,255,0,0.0)" },
                { offset:0.3, color:"rgba(0,255,0,0.8)" },
                { offset:0.5, color:"rgba(0,255,0,1.0)" },
                { offset:0.7, color:"rgba(0,255,0,0.8)" },
                { offset:1.0, color:"rgba(0,255,0,0.0)" },
            ]).toStyle(),
            lineWidth: 4.0,
        }).addChildTo(this);
        this.cursor.blendMode = "lighter";
        this.cursor.alpha = 0;
        this.cursor.update = function() {
            if (that.select) {
                this.rotation++;
                this.alpha+=0.05*SPD;
                if (this.alpha > 1.0)this.alpha = 1.0;
            } else {
                this.alpha-=0.05*SPD;
                if (this.alpha < 0.0)this.alpha = 0.0;
            }
        };

        //HP表示
        this.label = tm.display.OutlineLabel("", 30).addChildTo(this);
        this.label.fontFamily = "'Orbitron'";
        this.label.align     = "center";
        this.label.baseline  = "middle";
        this.label.fontSize = 20;
        this.label.fontWeight = 700;
        this.label.outlineWidth = 2;
        this.label.setScale(1/this.power);
        this.label.update = function() {
            this.text = "" + ~~that.HP;
            switch (that.alignment) {
                case TYPE_NEUTRAL:
                    this.fillStyle = "rgba(255, 255, 255, 1.0)";
                    break;
                case TYPE_PLAYER:
                    this.fillStyle = "rgba(0, 64, 255, 1.0)";
                    break;
                case TYPE_ENEMY:
                    this.fillStyle = "rgba(255, 64, 64, 1.0)";
                    break;
            }
            if (that.select || that.mouseover) {
                this.fontSize+=5;
                if (this.fontSize > 50)this.fontSize = 50;
            } else {
                this.fontSize-=5;
                if (this.fontSize < 25)this.fontSize = 25;
            }
        };
    },

    update: function() {
        if (this.alignment != TYPE_NEUTRAL) {
            var rev = 1;
            if (this.alpha == TYPE_ENEMY) {
                rev = this.world.handicap;
            }
            if (this.frame % 30 == 0){
                this.HP += this.power * rev * 0.5;
            }
        }
        this.frame++;
    },

    //攻撃を受ける
    damage: function(alignment, power) {
        if (this.alignment == alignment) {
            this.HP += power;
        } else {
            this.HP -= power;
            if (this.HP < 0) {
                this.HP *= -1;
                this.alignment = alignment;
                this.image = tm.asset.Manager.get("planet");
                this.setFrameIndex(this.type, 64, 64);
                this.world.addChild(tiger.Effect.genShockwave(this.x, this.y, 3*this.power));
            }
        }
    },

    //特定ワールド座標からの距離
    distance: function(x, y) {
        var dx = this.x-x;
        var dy = this.y-y;
        return Math.sqrt(dx*dx+dy*dy);
    },

    //選択カーソル色変更
    changeCursolColor: function(color) {
        if (color == "green") {
            this.cursor.strokeStyle = tm.graphics.LinearGradient(0,0,0,80).addColorStopList([
                { offset:0.0, color:"rgba(0,255,0,0.0)" },
                { offset:0.3, color:"rgba(0,255,0,0.8)" },
                { offset:0.5, color:"rgba(0,255,0,1.0)" },
                { offset:0.7, color:"rgba(0,255,0,0.8)" },
                { offset:1.0, color:"rgba(0,255,0,0.0)" },
            ]).toStyle();
        }
        if (color == "red") {
            this.cursor.strokeStyle = tm.graphics.LinearGradient(0,0,0,80).addColorStopList([
                { offset:0.0, color:"rgba(255,0,0,0.0)" },
                { offset:0.3, color:"rgba(255,0,0,0.8)" },
                { offset:0.5, color:"rgba(255,0,0,1.0)" },
                { offset:0.7, color:"rgba(255,0,0,0.8)" },
                { offset:1.0, color:"rgba(255,0,0,0.0)" },
           ]).toStyle();
        }
    },
});
