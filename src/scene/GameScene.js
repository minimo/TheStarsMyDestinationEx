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
tiger.GameScene = tm.createClass({
    superClass: tm.app.Scene,

    //ポーズフラグ
    pause: false,

    //マップクラス
    world: null,

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

    //経過フレーム
    frame: 0,

    init: function() {
        this.superInit();

        this.world = tiger.World();
        this.addChild(this.world);

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
        var click = p.getPointing();
        var drag = false;

        //初回クリック
        if (click && !this.beforePointing.click) {
            //惑星選択チェック
            var pl = this.world.getPlanet(sx, sy);
            if (pl.planet.alignment == TYPE_PLAYER && pl.distance < 32*pl.planet.power) {
                this.control = CTRL_PLANET;
                this.selectFrom = pl.planet;
                pl.planet.select = true;
                var wx = this.toWorldX(sx);
                var wy = this.toWorldY(sy);
                this.setupArrow(pl.planet, {x: wx, y:wy});
                this.control = CTRL_PLANET;
            } else {
                this.control = CTRL_MAP;
            }
        }

        //クリック中
        if (click && this.beforePointing.click) {
            drag = true;
            if (this.arrow) {
                //惑星選択
                var pl = this.world.getPlanet(sx, sy);
                if (pl.distance < 32*pl.planet.power && pl.planet != this.selectFrom) {
                    this.selectTo = pl.planet;
                    this.arrow.to = pl.planet;
                    pl.planet.select = true;
                } else {
                    if (this.selectTo) {
                        if (this.selectTo instanceof tiger.Planet) {
                            this.selectTo.select = false;
                            this.selectTo = null;
                        }
                    }
                    this.arrow.to = {x: this.toWorldX(sx), y: this.toWorldY(sy)};

                    //画面端スクロール
                    if (sx < 120 || sx>SC_W-120 || sy < 120 || sy > SC_H-120) {
                        //ポインタの位置によりスクロール量を計算
                        this.screenX = clamp(this.screenX+(sx-SC_W/2)/32, 0, SC_W);
                        this.screenY = clamp(this.screenY+(sy-SC_H/2)/32, 0, SC_H);
                    }
                }
            }
        }

        //クリック終了
        if (!click && this.beforePointing.click) {

            //艦隊派遣
            if (this.control == CTRL_PLANET) {
                if (this.selectTo instanceof tiger.Planet) {
                    this.world.enterUnit(this.selectFrom, this.selectTo);
                }
            }

            //選択中オブジェクト解放
            if (this.selectFrom) {
                if (this.selectFrom instanceof tiger.Planet) {
                    this.selectFrom.select = false;
                    this.selectFrom = null;
                }
            }
            if (this.selectTo) {
                if (this.selectTo instanceof tiger.Planet) {
                    this.selectTo.select = false;
                    this.selectTo = null;
                }
            }

            //選択矢印解放            
            if (this.arrow) {
                this.arrow.active = false;
                this.arrow = null;
            }
            this.control = CTRL_NOTHING;
        }

        //非クリック状態
        if (!click && !this.beforePointing.click) {
            var pl = this.world.getPlanet(sx, sy);
            if (pl.distance < 32*pl.planet.power) {
                pl.planet.mouseover = true;
                this.mouseoverObject = pl.planet;
            }
        }

        //マップ操作
        if (this.control == CTRL_MAP) {
            this.screenX = clamp(this.screenX-(p.position.x-p.prevPosition.x), 0, SC_W);
            this.screenY = clamp(this.screenY-(p.position.y-p.prevPosition.y), 0, SC_H);
        }

        //惑星選択
        if (this.control == CTRL_PLANET) {
        }

        this.thinkCPU();
        this.world.update();

        //前フレーム情報保存
        this.beforePointing = {x: 0, y: 0, click: click, drag: drag};
        this.frame++;
    },

    //ＣＰＵ思考ルーチン
    thinkCPU: function() {
        //５秒に１回思考する
        if (this.frame % 30 * 5 != 0) return;

        //領土に一番近い惑星で自分の７割程度なら艦隊を派遣
        var len = this.world.planets.length;
        for (var i = 0; i < len; i++) {
            var p = this.world.planets[i];
            if (p.alignment != TYPE_ENEMY) continue;
            if (p.HP < 10) continue;
            var min = 99999;
            var target1 = null;
            var target2 = null;
            for (var j = 0; j < len; j++) {
                var e = this.world.planets[j];
                if (i == j || e.alignment == TYPE_ENEMY) continue;
                var dis = distance(p, e);
                if (dis < min) {
                    min = dis;
                    target1 = e;
                }
            }
            if (target1 && target1.HP < p.HP * 0.7) {
                this.world.enterUnit(p, target1, 0.7);
                break;
            }
        }
    },

    //ワールド座標への変換
    toWorldX: function(x) {return x-this.world.base.x;},
    toWorldY: function(y) {return y-this.world.base.y;},

    //選択矢印セットアップ
    setupArrow: function(from, to) {
        if (this.arrow == null) {
            this.arrow = tm.display.Sprite("arrow", 160, 16);
            this.arrow.setPosition(from.x, from.y);
            this.arrow.originX = 0;
            this.arrow.foreground = true;
            this.arrow.from = from;
            this.arrow.to = to;
            this.arrow.alpha = 0.0;
            this.arrow.active = true;
            this.arrow.update = function() {
                //中心点からの直線を計算
                var fx = this.from.x, fy = this.from.y;
                var tx = this.to.x, ty = this.to.y;
                var dx = tx-fx, dy = ty-fy;

                //始点が惑星の場合円周上にする
                if (this.from instanceof tiger.Planet) {
                    var len = 38*this.from.power/Math.sqrt(dx*dx+dy*dy);
                    fx = fx*(1-len)+tx*len;
                    fy = fy*(1-len)+ty*len;
                    dx = tx-fx, dy = ty-fy;
                }

                //終点が惑星の場合円周上にする
                if (this.to instanceof tiger.Planet) {
                    var len = 38*this.to.power/Math.sqrt(dx*dx+dy*dy);
                    tx = fx*len+tx*(1-len);
                    ty = fy*len+ty*(1-len);
                    dx = tx-fx, dy = ty-fy;
                }

                //再計算
                this.x = fx;
                this.y = fy;
                this.rotation = Math.atan2(dy, dx)*toDeg;   //二点間の角度
                this.scaleX = Math.sqrt(dx*dx+dy*dy)/160;

                if (this.active) {
                    this.alpha += 0.05;
                    if (this.alpha > 0.7)this.alpha = 0.7;
                } else {
                    this.alpha -= 0.05;
                    if (this.alpha < 0.0)this.remove();
                }
            };
            this.world.addChild(this.arrow);
        }
    },
});

//スクリーン座標操作
tiger.GameScene.prototype.accessor("screenX", {
    "get": function()   { return -this.world.base.x; },
    "set": function(x)  { this.world.base.x = -x; }
});
tiger.GameScene.prototype.accessor("screenY", {
    "get": function()   { return -this.world.base.y; },
    "set": function(y)  { this.world.base.y = -y; }
});



