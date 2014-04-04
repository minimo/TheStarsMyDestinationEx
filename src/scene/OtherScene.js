/*
 *  TheStarsMyDestination tmlib.js version
 *  OtherScene.js
 *  2014/04/04
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//メニューシーン
tm.define("tiger.MenuScene", {
    superClass: tm.app.Scene,

    init: function() {
        this.superInit();

        var t2 = this.title2 = tm.display.OutlineLabel("PAUSE", 30).addChildTo(this);
        t2.x = 320;
        t2.y = 320;
        t2.fontFamily = "'Orbitron'";
        t2.align     = "center";
        t2.baseline  = "middle";
        t2.fontSize = 60;
        t2.fontWeight = 700;
        t2.outlineWidth = 2;
        t2.fillStyle = "aqua";

        var ct = this.clickortouch = tm.display.OutlineLabel("Click or Touch to Return", 30).addChildTo(this);
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
    },

    ontouchend: function() {
//        app.background = "rgba(0, 0, 0, 0.8)";
        app.replaceScene(app.gameScene);
    },
});

