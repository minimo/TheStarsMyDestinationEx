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

    //選択中オブジェクト
    selectObject: null,
    
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

        var p = app.pointing;
        var px = p.position.x, py = p.position.y;
        var click = p.getPointing();
        var drag = false;

        //初回クリック
        if (click && !this.beforePointing.click) {
            //惑星選択チェック
            var pl = this.world.getPlanet(px, py);
            if (pl.distance < 32*pl.planet.power) {
                this.control = CTRL_PLANET;
                this.selectObject = pl.planet;
                pl.planet.select = true;

                //選択矢印作成
                var that = this;
                this.arrow = tm.display.TriangleShape(64, pl.distance);
                this.arrow.setPosition(pl.planet.x, pl.planet.y);
                this.arrow.foreground = true;
                this.arrow.addChildTo(this.world);
                this.arrow.from = {x: pl.planet.x, y: pl.planet.y};
                this.arrow.to =   {x: pl.planet.x, y: pl.planet.y};
            } else {
                this.control = CTRL_MAP;
            }
        }

        //クリック中
        if (click && this.beforePointing.click) {
            drag = true;
        }

        //クリック終了
        if (!click && this.beforePointing.click) {
            this.control = CTRL_NOTHING;
            
            //選択中オブジェクト解放
            if (this.selectObject) {
                if (this.selectObject instanceof tiger.Planet) {
                    this.selectObject.select = false;
                    this.selectObject = null;
                }
            }

            //選択矢印解放            
            if (this.arrow) {
                this.arrow.remove();
                this.arrow = null;
            }
        }

        //マップ操作
        if (this.control == CTRL_MAP) {
            var dx = px - p.prevPosition.x;
            var dy = py - p.prevPosition.y;
            this.world.base.x += dx;
            this.world.base.y += dy;
            
            if (this.world.base.x > 0)this.world.base.x = 0;
            if (this.world.base.y > 0)this.world.base.y = 0;
            if (this.world.base.x < -this.world.size+SC_W)this.world.base.x = -this.world.size+SC_W;
            if (this.world.base.y < -this.world.size+SC_H)this.world.base.y = -this.world.size+SC_H;
        }

        //惑星選択        
        if (this.control == CTRL_PLANET) {
        }

        this.beforePointing = {x: 0, y: 0, click: click, drag: drag};
        
        this.frame++;
    },
});

