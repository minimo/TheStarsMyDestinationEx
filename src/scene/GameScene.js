/*
 *  TheStarsMyDestination tmlib.js version
 *  GameScene.js
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 */

//コントロールフラグ
CTRL_NOTHING = 0;
CTRL_MAP = 1;
CTRL_PLANET = 2;
CTRL_FRIGATE = 3;

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
        this.addChild(this.world.base);

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
                    this.arrow.to = {x: this.toWorldX(sx), y: this.toWorldX(sy)};
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

        //マップ操作
        if (this.control == CTRL_MAP) {
            var dx = p.position.x - p.prevPosition.x;
            var dy = p.position.y - p.prevPosition.y;
            this.screenX -= dx;
            this.screenY -= dy;

            if (this.screenX < 0)this.screenX = 0;
            if (this.screenY < 0)this.screenY = 0;
            if (this.screenX > this.world.size+SC_W)this.screenX = this.world.size-SC_W;
            if (this.screenY > this.world.size+SC_H)this.screenY = this.world.size-SC_H;
        }

        //惑星選択
        if (this.control == CTRL_PLANET) {
        }

        this.world.update();

        this.beforePointing = {x: 0, y: 0, click: click, drag: drag};
        this.frame++;
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



