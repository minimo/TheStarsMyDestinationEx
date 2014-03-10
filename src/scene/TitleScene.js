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

        var t1 = this.title1 = tm.display.OutlineLabel("The stars", 30).addChildTo(this);
        t1.x = 50;
        t1.y = 150;
        t1.fontFamily = "'Orbitron'";
        t1.align     = "left";
        t1.baseline  = "middle";
        t1.fontSize = 60;
        t1.fontWeight = 700;
        t1.outlineWidth = 2;

        var t2 = this.title2 = tm.display.OutlineLabel("My destination", 30).addChildTo(this);
        t2.x = this.title1.x + 50;
        t2.y = this.title1.y + 100;
        t2.fontFamily = "'Orbitron'";
        t2.align     = "left";
        t2.baseline  = "middle";
        t2.fontSize = 60;
        t2.fontWeight = 700;
        t2.outlineWidth = 2;

        var t3 = this.title2 = tm.display.OutlineLabel("Click or Touch", 30).addChildTo(this);
        t3.x = 320;
        t3.y = 500;
        t3.fontFamily = "'UbuntuMono'";
        t3.align     = "center";
        t3.baseline  = "middle";
        t3.fontSize = 40;
        t3.fontWeight = 700;
        t3.outlineWidth = 2;
    },

    update: function() {
        this.bg.x -=0.5;
        if (this.bg.x < -2000)this.bg.x = 0;

        this.time++;
    },

    ontouchend: function() {
        app.background = "rgba(0, 0, 0, 0.8)";
        app.replaceScene(tiger.TutorialScene());
    },
});

