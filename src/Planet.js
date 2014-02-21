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

    init: function(x, y, alignment, HP, power, type) {
        this.alignment = alignment || 0;
        if (this.alignment == TYPE_NEUTRAL) {
            this.superInit("planet_mono", 64, 64);
        } else {
            this.superInit("planet", 64, 64);
        }
        //this.image = tm.asset.AssetManager.get(obj.imagename);
        this.x = x || 0;
        this.y = y || 0;
        this.HP = HP || 100;
        this.power = power || 1;
        this.type = type || 0;

        this.setFrameIndex(this.type, 64, 64);
        this.setScale(this.power);

        var that = this;
        //HP表示
        this.label = tm.display.Label("", 30).addChildTo(this);
        this.label.fontFamily = "'Orbitron'";
        this.label.align     = "center";
        this.label.baseline  = "middle";
        this.label.fontSize = 20;
        this.label.fontWeight = 700;
        this.label.update = function() {
            this.text = ""+that.HP;
            switch (that.alignment) {
                case TYPE_NEUTRAL:
                    this.fillStyle = "black";
                    this.fillStyle = "rgba(0, 0, 0, 1.0)";
                    break;
                case TYPE_PLAYER:
                    this.fillStyle = "blue";
                    this.fillStyle = "rgba(64, 64, 200, 1.0)";
                    break;
                case TYPE_ENEMY:
                    this.fillStyle = "red";
                    this.fillStyle = "rgba(255, 64, 64, 1.0)";
                    break;
            }
            this.setScale(1/that.power);
        };

        //選択カーソル
        this.cursol = tm.display.CircleShape(80, 80, {
            fillStyle: "rgba(0,0,0,0)",
            strokeStyle: tm.graphics.LinearGradient(0,0,0,80).addColorStopList([
                { offset:0.0, color:"rgba(0,255,0,0.0)" },
                { offset:0.3, color:"rgba(0,255,0,0.8)" },
                { offset:0.5, color:"rgba(0,255,0,1.0)" },
                { offset:0.7, color:"rgba(0,255,0,0.8)" },
                { offset:1.0, color:"rgba(0,255,0,0.0)" },
            ]).toStyle(),
            lineWidth: 6.0,
        }).addChildTo(this);
        this.cursol.blendMode = "lighter";
        this.cursol.alpha = 0;
        this.cursol.update = function() {
            if (that.select) {
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
    },

    //ダメージ処理
    damage: function(alignment, pow) {
        this.HP -= pow;
    },

    //特定ワールド座標からの距離
    distance: function(x, y) {
        var dx = this.x-x;
        var dy = this.y-y;
        return Math.sqrt(dx*dx+dy*dy);
    },

    //領空内に入っているか
    inTerritory: function(x, y) {
        var dis = this.distance(x, y);
        if (dis < 32*this.power)return true;
        return false;
    },

    //防空領空内に入っているか
    inDefenceZone: function(x, y) {
        var dis = this.distance(x, y);
        if (dis < 50*this.power)return true;
        return false;
    },

    //選択カーソル色変更
    changeCursolColor: function(color) {
        if (color == "green") {
            this.cursol.strokeStyle = tm.graphics.LinearGradient(0,0,0,80).addColorStopList([
                { offset:0.0, color:"rgba(0,255,0,0.0)" },
                { offset:0.3, color:"rgba(0,255,0,0.8)" },
                { offset:0.5, color:"rgba(0,255,0,1.0)" },
                { offset:0.7, color:"rgba(0,255,0,0.8)" },
                { offset:1.0, color:"rgba(0,255,0,0.0)" },
            ]).toStyle();
        }
        if (color == "red") {
            this.cursol.strokeStyle = tm.graphics.LinearGradient(0,0,0,80).addColorStopList([
                { offset:0.0, color:"rgba(255,0,0,0.0)" },
                { offset:0.3, color:"rgba(255,0,0,0.8)" },
                { offset:0.5, color:"rgba(255,0,0,1.0)" },
                { offset:0.7, color:"rgba(255,0,0,0.8)" },
                { offset:1.0, color:"rgba(255,0,0,0.0)" },
           ]).toStyle();
        }
    },
});
