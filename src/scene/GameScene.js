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

    //前フレームポインティングデバイス情報
    beforePointing: {
        x: 0,
        y: 0,
        click: false,
        drag: false,
        mouseoverObject: null,
    },

    //クリック間隔
    clickInterval: 0,
    
    //矢印的なアレ
    arrow: null,
    
    //勝者決定フラグ
    winner: 0,
    winCount: 0,

    //経過フレーム
    frame: 0,

    init: function() {
        this.superInit();

        this.base = tm.app.Object2D().addChildTo(this);
        this.world = tiger.World().addChildTo(this.base);
        this.map = tiger.WorldMap(640-160, 0, 160, this.world).addChildTo(this);

        //デバッグ表示
        var sc = tm.app.Label("");
        sc.fillStyle = "white";
        sc.fontSize = 15;
        sc.x = 0;
        sc.y = 13;
        sc.width = 200;
        var that = this;
        sc.update = function() {
            var p = app.pointing;
            this.text = "x:"+p.position.x+" y:"+p.position.y+" size:"+that.world.size;
//            this.text = "x:"+that.world.base.x+" y:"+that.world.base.y+" size:"+that.world.size;
        }
        this.addChild(sc);
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
        var scale = this.base.scaleX;
        var click = p.getPointing();
        var drag = false;

        //初回クリック
        if (click && !this.beforePointing.click) {
            //惑星orユニット選択チェック
            var pl = this.world.getPlanet(wx, wy);
            if (pl.planet.alignment == TYPE_PLAYER && pl.distance < 32*pl.planet.power) {
                //惑星が選択された
                this.control = CTRL_PLANET;
                this.selectFrom = pl.planet;
                pl.planet.select = true;
                this.arrow = tiger.Arrow(pl.planet, {x: wx, y:wy}).addChildTo(this.world);
            } else {
                var un = this.world.getUnit(wx, wy);
                if (un && un.unit.alignment == TYPE_PLAYER && un.distance < 20) {
                    //ユニットが選択された
                    this.control = CTRL_UNIT;
                    this.selectFrom = un.unit;
                    un.unit.select = true;
                    var units = this.world.getUnitGroup(un.unit.groupID);

                    //選択矢印を配列で持つ
                    this.arrow = [];
                    for (var i = 0; i < units.length; i++) {
                        this.arrow.push(tiger.Arrow(units[i], {x: wx, y:wy}).addChildTo(this.world));
                    }
                    this.world.selectUnitGroup(un.unit.groupID, true);
                } else {
                    //どれにも該当しないのでマップ操作
                    this.control = CTRL_MAP;
                }
            }
        }

        //クリック中
        if (click && this.beforePointing.click) {
            drag = true;
            //選択中
            if (this.arrow) {
                var pl = this.world.getPlanet(wx, wy);
                if (pl.distance < 32*pl.planet.power) {
                    this.selectTo = pl.planet;
                    if (this.control == CTRL_PLANET) {
                        this.arrow.to = pl.planet;
                    } else {
                        for (var i = 0, len = this.arrow.length; i < len; i++) this.arrow[i].to = pl.planet;
                    }
                    pl.planet.select = true;
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
                    if (this.control == CTRL_PLANET) {
                        this.arrow.to = {x: wx, y: wy};
                    } else {
                        for (var i = 0, len = this.arrow.length; i < len; i++) this.arrow[i].to = {x: wx, y: wy};
                    }

                    //画面端スクロール
                    if (sx < 60 || sx>SC_W-60 || sy < 60 || sy > SC_H-60) {
                        //ポインタの位置によりスクロール量を計算
                        this.screenX = clamp(this.screenX+(sx-SC_W/2)/32, 0, this.world.size*scale-SC_W);
                        this.screenY = clamp(this.screenY+(sy-SC_H/2)/32, 0, this.world.size*scale-SC_H);
                    }
                }
            }
        }

        //クリック終了
        if (!click && this.beforePointing.click) {
            if (this.selectFrom && this.selectFrom !== this.selectTo) {
                //艦隊派遣
                if (this.selectFrom instanceof tiger.Planet) {
                    if (this.selectTo instanceof tiger.Planet) {
                        this.world.enterUnit(this.selectFrom, this.selectTo);
                    }
                }
                //艦隊進行目標変更
                if (this.selectFrom instanceof tiger.Unit && this.selectFrom !== this.selectTo) {
                    if (this.selectTo instanceof tiger.Planet) {
                        this.world.setDestinationUnitGroup(this.selectFrom.groupID,this.selectTo);
                    }
                }
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

            //選択矢印解放            
            if (this.arrow) {
                if (this.control == CTRL_PLANET) {
                    this.arrow.active = false;
                    this.arrow = null;
                } else {
                    for (var i = 0, len = this.arrow.length; i < len; i++) {
                        this.arrow[i].active = false;
                    }
                    this.arrow = null;
                }
            }
            this.control = CTRL_NOTHING;
        }

        //非クリック状態
        if (!click && !this.beforePointing.click) {
            var pl = this.world.getPlanet(wx, wy);
            if (pl.distance < 32*pl.planet.power) {
                pl.planet.mouseover = true;
                this.mouseoverObject = pl.planet;
            }
        }

        //マップ操作
        if (this.control == CTRL_MAP) {
            var mx = (p.position.x-p.prevPosition.x)/scale;
            var my = (p.position.y-p.prevPosition.y)/scale;
            this.screenX = clamp(this.screenX-mx, 0, this.world.size*scale-SC_W);
            this.screenY = clamp(this.screenY-my, 0, this.world.size*scale-SC_H);
        }

        //惑星選択
        if (this.control == CTRL_PLANET) {
        }

        //マップ上マウスオーバー検出
        if (this.map.x < sx && sx < this.map.x+this.map.size && this.map.y < sy && sy < this.map.y+this.map.size) {
            this.map.mouseover = true;
        } else {
            this.map.mouseover = false;
        }
    
        this.thinkCPU();
        this.world.update();

        //前フレーム情報保存
        this.beforePointing = {x: 0, y: 0, click: click, drag: drag};
        this.frame++;
    },

    //勝敗判定
    judgment: function() {
    },

    //ＣＰＵ思考ルーチン
    thinkCPU: function() {
        if (this.frame < 300)return;
        //５秒に１回思考する
        if (this.frame % 60 * 5 != 0) return;

        //領土に一番近い惑星で自分の７割程度なら艦隊を派遣
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
            if (target1 && target1.HP < p.HP * 0.7) {
                this.world.enterUnit(p, target1, 0.7);
                break;
            } else if (target2 && target2.HP < p.HP * 0.7) {
                this.world.enterUnit(p, target2, 0.7);
            }
        }
    },

    //ワールド座標への変換
    toWorldX: function(x) {return (-this.world.base.x+x)/this.base.scaleX;},
    toWorldY: function(y) {return (-this.world.base.y+y)/this.base.scaleY;},
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


