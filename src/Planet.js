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

    //選択中フラグ
    select: false,

    init: function(x, y, alignment, HP, power, type) {
        this.alignment = alignment || 0;
        if (this.alignment == TYPE_NUTRAL) {
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
        this.label.align     = "center";
        this.label.baseline  = "middle";
        this.label.fontSize = 20;
        this.label.update = function() {
            this.text = ""+that.HP;
            switch (that.alignment) {
                case TYPE_NUTRAL:
                    this.fillStyle = "black";
                    break;
                case TYPE_PLAYER:
                    this.fillStyle = "blue";
                    break;
                case TYPE_ENEMY:
                    this.fillStyle = "red";
                    break;
            }
        };

        //選択カーソル
        this.cursol = tm.display.CircleShape(80, 80, {
            fillStyle: "rgba(0,0,0,0)",
            strokeStyle: tm.graphics.LinearGradient(0, 0, 0, 80).addColorStopList([
                { offset:0.0, color:"rgba(0,255,0,0.0)" },
                { offset:0.1, color:"rgba(0,255,0,0.3)" },
                { offset:0.5, color:"rgba(0,255,0,1.0)" },
                { offset:0.9, color:"rgba(0,255,0,0.3)" },
                { offset:1.0, color:"rgba(0,255,0,0.0)" },
            ]).toStyle(),
            lineWidth: 6.0,
        }).addChildTo(this);
        this.cursol.blendMode = "lighter";
        this.cursol.update = function() {
            this.rotation++;
//            this.visible = that.select;
        };
    },

    update: function() {
    },

    damage: function(alignment, pow) {
        this.HP -= pow;
    },
});
