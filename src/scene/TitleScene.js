/*
 *  TheStarsMyDestination tmlib.js version
 *  TitleScene.js
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//タイトルシーン
tm.define("tiger.TitleScene", {
    superClass: tm.app.Scene,

    init: function() {
        this.superInit();
        this.time = 0;
        app.background = "rgba(0,0,0,0.2)";

        //バックグラウンドの追加
        this.bg = tm.display.Sprite("bg1",3848, 1280).addChildTo(this);
        this.bg.x = 0;
        this.bg.y = 0;
        this.bg.originX = this.bg.originY = 0;

        var baseY = 200;

        var t1 = this.title1 = tm.display.OutlineLabel("我赴くは星の大海", 30).addChildTo(this);
        t1.x = 320;
        t1.y = baseY;
        t1.fontFamily = "'UbuntuMono'";
        t1.align     = "center";
        t1.baseline  = "middle";
        t1.fontSize = 70;
        t1.fontWeight = 700;
        t1.outlineWidth = 2;

        var t2 = this.title2 = tm.display.OutlineLabel("～The stars my destination～", 30).addChildTo(this);
        t2.x = 320;
        t2.y = baseY+100;
        t2.fontFamily = "'Orbitron'";
        t2.align     = "center";
        t2.baseline  = "middle";
        t2.fontSize = 30;
        t2.fontWeight = 700;
        t2.outlineWidth = 2;
        t2.fillStyle = "aqua";

        var ct = this.clickortouch = tm.display.OutlineLabel("Click or Touch", 30).addChildTo(this);
        ct.x = 320;
        ct.y = 500;
        ct.fontFamily = "'UbuntuMono'";
        ct.align     = "center";
        ct.baseline  = "middle";
        ct.fontSize = 40;
        ct.fontWeight = 700;
        ct.outlineWidth = 2;
    },

    update: function() {
        this.bg.x -=0.5;
        if (this.bg.x < -2000)this.bg.x = 0;

        this.time++;
    },

    ontouchend: function() {
        app.background = "rgba(0, 0, 0, 0.8)";
//        app.replaceScene(tiger.TutorialScene());
        app.replaceScene(app.gameScene);
    },
});

