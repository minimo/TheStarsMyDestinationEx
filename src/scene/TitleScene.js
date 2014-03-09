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

        this.title1 = tm.display.OutlineLabel("The stars", 30).addChildTo(this);
        this.title1.x = 100;
        this.title1.y = 100;
        this.title1.fontFamily = "'Orbitron'";
        this.title1.align     = "left";
        this.title1.baseline  = "middle";
        this.title1.fontSize = 50;
        this.title1.fontWeight = 700;
        this.title1.outlineWidth = 2;

        this.title2 = tm.display.OutlineLabel("My destination", 30).addChildTo(this);
        this.title2.x = this.title1.x + 50;
        this.title2.y = this.title1.y + 50;
        this.title2.fontFamily = "'Orbitron'";
        this.title2.align     = "left";
        this.title2.baseline  = "middle";
        this.title2.fontSize = 50;
        this.title2.fontWeight = 700;
        this.title2.outlineWidth = 2;
    },
    update: function() {
        this.time++;
        app.replaceScene(app.gameScene);
    },
    onnextscene: function() {
        app.background = "rgba(0, 0, 16, 0.8)";
        app.replaceScene(app.gameScene);
    }
});

