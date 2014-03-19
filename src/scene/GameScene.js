/*
 *  TheStarsMyDestination tmlib.js version
 *  GameScene.js
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 *
 *  Worldに対する操作、CPUの思考ルーチンを処理
 *
 */

//コントロールフラグ
CTRL_NOTHING = 0;
CTRL_MAP = 1;
CTRL_PLANET = 2;
CTRL_UNIT = 3;
CTRL_RATE = 4;
CTRL_SCALE = 5;
CTRL_ALLPLANETS = 6;

//ゲームシーン
tm.define("tiger.GameScene", {
    superClass: tm.app.Scene,

    //ポーズフラグ
    pause: false,

    //ワールド管理
    world: null,
    base: null,

    //マップビュー
    map: null,

    //勢力天秤
    balance: null,

    //派兵レート表示
    rateLabel: null,

    //時間表示
    timeLabel: null,

    //準備完了フラグ
    ready: false,

    //操作中フラグ
    //0:操作無し
    //1:マップ操作
    //2:惑星選択中
    //3:艦隊選択中
    control: 0,

    //起点選択オブジェクト
    selectFrom: null,

    //終点選択オブジェクト
    selectTo: null,

    //選択リスト
    selectList: null,

    //前フレームポインティングデバイス情報
    beforePointing: {
        x: 0,
        y: 0,
        click: false,
        mouseoverObject: null,
        selectFrom: null,
        selectTo: null,
    },

    //長押し中フラグ
    longpress: false,

    //長押しフレーム数
    longPressFrame: 30,

    //クリック情報等
    clickInterval: 0,   //間隔
    clickFrame: 0,      //経過
    startX: 0,          //クリック始点等
    startY: 0,
    rateTemp: 0.5,      //派兵レートテンポラリ
    scaleTemp: 1,       //スケールテンポラリ

    //矢印的なアレ
    arrow: null,

    //スケール用カーソル
    scaleCursor: null,

    //勝者決定フラグ
    winner: 0,

    //経過フレーム
    frame: 0,

    init: function() {
        this.superInit();

        this.base = tm.app.Object2D().addChildTo(this);
        this.world = tiger.World().addChildTo(this.base);

        this.scaleCursor = tiger.ScaleCursor().addChildTo(this);
        this.map = tiger.WorldMap(640-160, 0, 160, this.world).addChildTo(this);
        this.balance = tiger.CosmicBalance(0, 640-24, 500, this.world).addChildTo(this);

        var that = this;
        //派兵レートラベル
        var lb = this.rateLabel = tm.display.OutlineLabel("50%", 30).addChildTo(this);
        lb.x = 580;
        lb.y = 620;
        lb.fontFamily = "'Orbitron'";
        lb.align     = "center";
        lb.baseline  = "middle";
        lb.fontSize = 30;
        lb.fontWeight = 700;
        lb.outlineWidth = 2;
        lb.update = function() {
            if (that.control == CTRL_RATE) {
                this.fontSize++;
            } else {
                this.fontSize--;
            }
            this.fontSize = clamp(this.fontSize, 30, 40);
            this.text = that.world.rate + "%";
        };

        //時間表示ラベル
        var tl = this.timeLabel = tm.display.OutlineLabel("00:00", 30).addChildTo(this);
        tl.x = 320;
        tl.y = 10;
        tl.fontFamily = "'Orbitron'";
        tl.align     = "center";
        tl.baseline  = "top";
        tl.fontSize = 20;
        tl.fontWeight = 700;
        tl.outlineWidth = 2;
        tl.update = function() {
            var sec = ~~(that.frame/60);
            var min = ""+~~(sec/60);
            sec = ""+sec%60;
            if (min.length == 1)min = "0"+min;
            if (sec.length == 1)sec = "0"+sec;
            this.text = min+":"+sec;
        };

        //デバッグ用
        if (DEBUG) {
            this.debugCursor = tm.display.CircleShape(30, 30, {
                fillStyle: "rgba(0,0,0,0)",
                strokeStyle: tm.graphics.LinearGradient(0,0,0,30).addColorStopList([
                    { offset:0.0, color:"rgba(0,255,0,0.0)" },
                    { offset:0.3, color:"rgba(0,255,0,0.8)" },
                    { offset:0.5, color:"rgba(0,255,0,1.0)" },
                    { offset:0.7, color:"rgba(0,255,0,0.8)" },
                    { offset:1.0, color:"rgba(0,255,0,0.0)" },
                ]).toStyle(),
                lineWidth: 4.0,
            });
            this.debugCursor.isForeground = true;
            this.debugCursor.update = function() {
                this.rotation++;
            };
            this.debugCursor.addChildTo(this.world)

            var d1 = this.debug1 = tm.display.OutlineLabel("00:00", 30).addChildTo(this);
            d1.x = 0;
            d1.y = 200;
            d1.fontFamily = "'Orbitron'";
            d1.align     = "left";
            d1.baseline  = "top";
            d1.fontSize = 20;
            d1.fontWeight = 700;
            d1.outlineWidth = 2;
            d1.update = function() {
                if (that.arrow) {
                    this.text = "arrow:"+that.arrow.length;
                } else {
                    this.text = "arrow:nothing";
                }
            };
            var d2 = this.debug2 = tm.display.OutlineLabel("00:00", 30).addChildTo(this);
            d2.x = 0;
            d2.y = 280;
            d2.fontFamily = "'Orbitron'";
            d2.align     = "left";
            d2.baseline  = "top";
            d2.fontSize = 20;
            d2.fontWeight = 700;
            d2.outlineWidth = 2;
            d2.update = function() {
                if (that.selectList) {
                    this.text = "select:"+that.selectList.length;
                } else {
                    this.text = "select:nothing";
                }
            };
        }
    },

    update: function() {
        if (!this.ready) {
            //マップ構築
            this.world.build();

            //準備完了
            this.ready = true;
            return;
        }

        if (this.mouseoverObject) {
            this.mouseoverObject.mouseover = false;
            this.mouseoverObject = null;
        }

        //マウスorタッチ情報
        var p = app.pointing;
        var sx = p.position.x, sy = p.position.y;
        var wx = this.toWorldX(sx), wy = this.toWorldY(sy);
        var scale = this.world.scaleX;
        var click = p.getPointing();

        if (DEBUG) {
            this.debugCursor.setPosition(wx, wy);
        }

        //クリック開始
        if (click && !this.beforePointing.click) {
        }

        //クリック中
        if (click && this.beforePointing.click) {
        }

        //クリック終了
        if (!click && this.beforePointing.click) {
        }

        //非クリック状態
        if (!click && !this.beforePointing.click) {
            var pl = this.world.getPlanet(wx, wy);
            if (pl.distance < 32*pl.planet.power) {
                pl.planet.mouseover = true;
                this.mouseoverObject = pl.planet;
            }
        }

        //惑星選択
        if (this.control == CTRL_PLANET) {
        }

        //全体マップマウスオーバー検出
        if (this.map.x < sx && sx < this.map.x+this.map.size && this.map.y < sy && sy < this.map.y+this.map.size) {
            this.map.mouseover = true;
        } else {
            this.map.mouseover = false;
        }

        //勢力天秤マウスオーバー検出
        if (sy > 608 && sx < 500) {
            this.balance.mouseover = true;
        } else {
            this.balance.mouseover = false;
        }
    
        this.thinkCPU();
        this.world.update();
        this.judgment();

        //前フレーム情報保存
        this.beforePointing = {x: sx, y: sy, click: click, selectFrom: this.selectFrom, selectTo: this.selectTo};
        this.frame++;
    },

    //タッチorクリック開始処理
    ontouchesstart: function(e) {
        var sx = e.pointing.x;
        var sy = e.pointing.y;
        var wx = this.toWorldX(sx), wy = this.toWorldY(sy);
        var scale = this.world.scaleX;

        //派兵レート変更
        if (500 < sx && 600 < sy) {
            this.control = CTRL_RATE;
            //始点を記録
            this.startX = sx;
            this.startY = sy;
            this.rateTemp = this.world.rate;
        }
        //惑星orユニット選択チェック
        var pl = this.world.getPlanet(wx, wy);
        if (pl.distance < 32*pl.planet.power) {
            if (this.control == CTRL_NOTHING) {
                //惑星が選択された
                this.control = CTRL_PLANET;
                this.selectFrom = pl.planet;
                pl.planet.select = true;
                if (pl.planet.alignment == TYPE_PLAYER) {
                    if (!this.arrow) this.arrow = [];
                    this.arrow.push(tiger.Arrow(pl.planet, {x: wx, y:wy}).addChildTo(this.world));
                }
            }
        }

        //ユニット選択チェック
        if (this.control == CTRL_NOTHING || !this.selctList) {
            var un = this.world.getUnit(wx, wy);
            if (un && un.unit.alignment == TYPE_PLAYER && un.distance < 20) {
                //ユニットが選択された
                this.control = CTRL_UNIT;
                this.selectFrom = un.unit;
                un.unit.select = true;
                var units = this.world.getUnitGroup(un.unit.groupID);

                //選択矢印
                this.clearArrow();
                this.arrow = [];
                for (var i = 0; i < units.length; i++) {
                    this.arrow.push(tiger.Arrow(units[i], {x: wx, y:wy}, 4).addChildTo(this.world));
                }
                this.world.selectUnitGroup(un.unit.groupID, true);
                this.clearSelectList();
            }
        }

        //どれにも該当しない場合はマップ操作
        if (this.control == CTRL_NOTHING) {
            this.control = CTRL_MAP;
        }

        this.clickFrame = 0;
        this.longPress = true;
    },

    //タッチorクリック移動処理
    ontouchesmove: function(e) {
        var sx = e.pointing.x;
        var sy = e.pointing.y;
        var wx = this.toWorldX(sx), wy = this.toWorldY(sy);
        var scale = this.world.scaleX;

        //通常選択モード（惑星、ユニット）
        if (this.control == CTRL_PLANET || this.control == CTRL_UNIT) {
            var pl = this.world.getPlanet(wx, wy);
            if (pl.distance < 32*pl.planet.power) {
                this.selectTo = pl.planet;
                this.selectTo.select = true;
                if (this.arrow) {
                    for (var i = 0, len = this.arrow.length; i < len; i++) this.arrow[i].to = pl.planet;
                }

                //選択元と先が違う場合、長押し状態キャンセル
                if (this.selectFrom != this.selectTo) {
                    this.longPress = false;
                }

                //長押しで全選択モードに移行
                if (this.selectFrom == this.selectTo && this.longPress && this.clickFrame > this.longPressFrame) {
                    this.control = CTRL_ALLPLANETS;
                    //選択矢印
                    this.clearArrow();
                    this.arrow = [];
                    if (!this.selectList) {
                        //全選択
                        var planets = this.world.getPlanetGroup(TYPE_PLAYER);
                        for (var i = 0; i < planets.length; i++) {
                            this.arrow.push(tiger.Arrow(planets[i], this.selectFrom).addChildTo(this.world));
                        }
                        this.world.selectPlanetGroup(TYPE_PLAYER, true);
                    } else {
                        //部分選択
                        for (var i = 0; i < this.selectList.length; i++) {
                            this.arrow.push(tiger.Arrow(this.selectList[i], this.selectFrom).addChildTo(this.world));
                        }
                    }
                }
            } else {
                if (this.selectTo) {
                    //選択中だったらキャンセル
                    if (this.selectTo instanceof tiger.Planet && this.selectTo !== this.selectFrom) {
                        this.selectTo.select = false;
                    }
                    if (this.selectTo instanceof tiger.Unit) {
                        this.world.selectUnitGroup(this.selectTo.groupID, false);
                    }
                    this.selectTo = null;
                }
                if (this.arrow) {
                    for (var i = 0, len = this.arrow.length; i < len; i++) this.arrow[i].to = {x: wx, y: wy};
                }

                //画面端スクロール
                if (sx < 60 || sx>SC_W-60 || sy < 60 || sy > SC_H-60) {
                    //ポインタの位置によりスクロール量を計算
                    this.screenX = clamp(this.screenX+(sx-SC_W/2)/32, 0, this.world.size*scale-SC_W);
                    this.screenY = clamp(this.screenY+(sy-SC_H/2)/32, 0, this.world.size*scale-SC_H);
                }

                //移動したので長押し状態はキャンセル
                this.longPress = false;
            }
        }

        //全選択モード時
        if (this.control == CTRL_ALLPLANETS) {
            var pl = this.world.getPlanet(wx, wy);
            if (!(this.selectFrom == pl.planet && pl.distance < 32*pl.planet.power)) {
                //ポインタが外れてたら選択キャンセル
                this.control = CTRL_NOTHING;
                this.world.selectPlanetGroup(TYPE_PLAYER, false);
                this.clearArrow();
                this.clearSelectList();
            }
        }

        //マップ操作
        if (this.control == CTRL_MAP) {
            this.control = CTRL_MAP;
            var mx = (e.position.x-e.prevPosition.x)/scale;
            var my = (e.position.y-e.prevPosition.y)/scale;
            this.screenX = clamp(this.screenX-mx, 0, this.world.size-SC_W/scale);
            this.screenY = clamp(this.screenY-my, 0, this.world.size-SC_H/scale);

            //マップ操作時ポインタ移動検出
            var bx = Math.abs(this.beforePointing.x-sx);
            var by = Math.abs(this.beforePointing.y-sy);
            if (bx > 3 || by > 3) {
                this.longPress = false;
            }
        }

        //マップ操作時長押しでスケール操作へ移行
        if (this.control == CTRL_MAP && this.longPress) {
            var bx = this.beforePointing.x;
            var by = this.beforePointing.y;
            if (bx-3 < sx && sx < bx+5 && by-3 < sy && sy < by+5) {
                if (this.clickFrame > this.longPressFrame) {
                    this.control = CTRL_SCALE;
                    this.scaleCursor.active = true;
                    this.scaleCursor.setPosition(sx, sy);
                    this.scaleCursor.value = this.world.scaleX*100;
                    //初期位置を記録
                    this.startX = sx;
                    this.startY = sy;
                    this.scaleTemp = this.world.scaleX*100;
                }
            } else {
                this.clickFrame = 0;
            }
        }

        //派兵レート変更
        if (this.control == CTRL_RATE) {
            var v = sx - this.startX;
            this.world.rate = ~~(this.rateTemp+(v/2));
            this.world.rate = clamp(this.world.rate, 10, 90);
        }

        //スケール変更
        if (this.control == CTRL_SCALE) {
            var v = (sy - this.startY)/2;
            var sc = clamp(this.scaleTemp+v, 50, 200);
            this.world.setScale(sc/100);
            this.scaleCursor.value = sc;

            this.screenX = clamp(this.screenX, 0, this.world.size-SC_W/scale);
            this.screenY = clamp(this.screenY, 0, this.world.size-SC_H/scale);
        }
        this.clickFrame++;
    },

    //タッチorクリック終了処理
    ontouchesend: function(e) {
        var sx = e.pointing.x;
        var sy = e.pointing.y;
        var wx = this.toWorldX(sx), wy = this.toWorldY(sy);
        var scale = this.world.scaleX;

        if (this.control == CTRL_PLANET || this.control == CTRL_UNIT) {
            //惑星、ユニット操作処理
            if (this.selectFrom && this.selectFrom !== this.selectTo) {
                //艦隊派遣
                if (!this.selecList) {
                    //単独選択
                    if (this.selectFrom instanceof tiger.Planet && this.selectTo instanceof tiger.Planet) {
                        this.world.enterUnit(this.selectFrom, this.selectTo);
                    }
                } else {
                    //複数選択
                    for (var i = 0; i < this.selectList.length; i++) {
                        this.world.enterUnit(this.selectList[i], this.selectTo);
                    }
                }
                //艦隊進行目標変更
                if (this.selectFrom instanceof tiger.Unit && this.selectFrom !== this.selectTo) {
                    if (this.selectTo instanceof tiger.Planet) {
                        this.world.setDestinationUnitGroup(this.selectFrom.groupID,this.selectTo);
                    }
                }
                this.clearArrow();
                this.clearSelectList();
            }
            //選択リスト追加／削除
            if (this.selectFrom && this.selectFrom.alignment == TYPE_PLAYER && this.selectFrom === this.selectTo) {
                if (this.selectList == null) {
                    this.selectList = [];
                }
                var found = -1;
                var len = this.selectList.length;
                for (var i = 0; i < len; i++) {
                    if (this.selectFrom === this.selectList[i]) found = i;
                }
                if (found == -1) {
                    //リスト内に無い場合は追加
                    this.selectList.push(this.selectFrom);
                } else {
                    //リスト内にある場合は削除
                    this.selectList[found].select = false;
                    this.selectList.splice(found, 1);
                    if (this.selectList.length == 0)this.selectList = null;
                }
                this.selectFrom = this.selectTo = null; //選択中の為後続の解放処理をしないようにする
            }
        } else if (this.control == CTRL_ALLPLANETS) {
            //艦隊派遣
            if (!this.selectList) {
                var planets = this.world.getPlanetGroup(TYPE_PLAYER);
                for (var i = 0; i < planets.length; i++) {
                    if (this.selectFrom != planets[i]) this.world.enterUnit(planets[i], this.selectFrom);
                }
                this.world.selectPlanetGroup(TYPE_PLAYER, false);
            } else {
                for (var i = 0; i < this.selectList.length; i++) {
                    var sl = this.selectList[i];
                    sl.select = false;
                    if (sl.alignment != TYPE_PLAYER) continue;
                    if (sl instanceof tiger.Planet) {
                        if (this.selectFrom != sl) this.world.enterUnit(sl, this.selectFrom);
                    }
                }
            }
            this.clearArrow();
            this.clearSelectList();
        } else if (this.control == CTRL_MAP) {
            //長押し中フラグが立っている＆マップ操作＝マウス移動無し
            if (this.longPress && this.selectList) this.clearSelectList();
        }

        //選択中オブジェクト解放
        if (this.selectFrom) {
            if (this.selectFrom instanceof tiger.Planet) this.selectFrom.select = false;
            if (this.selectFrom instanceof tiger.Unit) this.world.selectUnitGroup(this.selectFrom.groupID, false);
            this.selectFrom = null;
        }
        if (this.selectTo) {
            if (this.selectTo instanceof tiger.Planet) this.selectTo.select = false;
            if (this.selectTo instanceof tiger.Unit) this.world.selectUnitGroup(this.selectTo.groupID, false);
            this.selectTo = null;
        }

        this.scaleCursor.active = false;
        this.control = CTRL_NOTHING;
    },

    //選択矢印解放
    clearArrow: function() {
        if (this.arrow) {
            for (var i = 0, len = this.arrow.length; i < len; i++) this.arrow[i].active = false;
            this.arrow = null;
        }
    },

    //選択リストクリア
    clearSelectList: function() {
        if (this.selectList) {
            for (var i = 0; i < this.selectList.length; i++) this.selectList[i].select = false;
            this.selectList = null;
        }
    },

    //勝敗判定
    judgment: function() {
        if (this.winner != 0)return;
        var enemy = this.world.getPowerOfPlanet(TYPE_ENEMY)+this.world.getPowerOfUnit(TYPE_ENEMY);
        if (enemy == 0) {
            this.winner = TYPE_PLAYER;
            var label = tm.display.OutlineLabel("WIN!!", 30).addChildTo(this);
            label.x = 320;
            label.y = 320;
            label.fontFamily = "'UbuntuMono'";
            label.align     = "center";
            label.baseline  = "middle";
            label.fontSize = 100;
            label.fontWeight = 700;
            label.outlineWidth = 2;
        }

        var player = this.world.getPowerOfPlanet(TYPE_PLAYER)+this.world.getPowerOfUnit(TYPE_PLAYER);
        if (player == 0) {
            this.winner = TYPE_ENEMY;
            var label = tm.display.OutlineLabel("LOSE!!", 30).addChildTo(this);
            label.x = 320;
            label.y = 320;
            label.fontFamily = "'UbuntuMono'";
            label.align     = "center";
            label.baseline  = "middle";
            label.fontSize = 100;
            label.fontWeight = 700;
            label.outlineWidth = 2;
        }
    },

    //ＣＰＵ思考ルーチン
    thinkCPU: function() {
        if (this.frame < 300)return;
        //１０秒に１回思考する
        if (this.frame % 600 != 0) return;

        //領土に一番近い惑星で自分の６割程度なら艦隊を派遣
        var len = this.world.planets.length;
        for (var i = 0; i < len; i++) {
            var p = this.world.planets[i];
            if (p.alignment != TYPE_ENEMY) continue;
            if (p.HP < 10) continue;
            var min1 = 99999;
            var min2 = 99999;
            var target1 = null;
            var target2 = null;
            for (var j = 0; j < len; j++) {
                var e = this.world.planets[j];
                if (i == j || e.alignment == TYPE_ENEMY) continue;
                var dis = distance(p, e);
                if (dis < min1) {
                    min1 = dis;
                    target1 = e;
                } else if (dis < min2) {
                    min2 = dis;
                    target2 = e;
                }
            }
            if (target1 && target1.HP < p.HP * 0.6) {
                this.world.enterUnit(p, target1, 70);
                break;
            } else if (target2 && target2.HP < p.HP * 0.6) {
                this.world.enterUnit(p, target2, 70);
            }
        }
    },

    //ワールド座標への変換
    toWorldX: function(x) {return -this.world.base.x+(x/this.world.scaleX);},
    toWorldY: function(y) {return -this.world.base.y+(y/this.world.scaleY);},
});

//スクリーン座標操作
tiger.GameScene.prototype.accessor("screenX", {
    "get": function()   { return -this.world.base.x/this.base.scaleX; },
    "set": function(x)  { this.world.base.x = -x*this.base.scaleX; }
});
tiger.GameScene.prototype.accessor("screenY", {
    "get": function()   { return -this.world.base.y/this.base.scaleY; },
    "set": function(y)  { this.world.base.y = -y*this.base.scaleY; }
});


