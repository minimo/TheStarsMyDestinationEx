/*
 *  TheStarsMyDestination tmlib.js version
 *  TutorialScene.js
 *  2014/03/05
 *  @auther minimo  
 *  This Program is MIT license.
 */

//チュートリアルシーン
tm.define("tiger.TutorialScene", {
    superClass: tm.app.Scene,

    //チュートリアルフェーズ
    phase: 0,
    phaseMax: 1,

    init: function() {
        this.superInit();
        app.background = "rgba(0, 0, 0, 0)";

        //バックグラウンドの追加
        this.bg = tm.display.Sprite("bg1", 3848, 1280).addChildTo(this);
        this.bg.x = 0;
        this.bg.y = 0;
        this.bg.originX = this.bg.originY = 0;

        var t1 = this.title1 = tm.display.OutlineLabel("How to play", 40).addChildTo(this);
        t1.x = 320;
        t1.y = 60;
        t1.fontFamily = "'Orbitron'";
        t1.align     = "center";
        t1.baseline  = "middle";
        t1.fontWeight = 700;

        var skip = this.skip = tm.display.OutlineLabel("SKIP", 40).addChildTo(this);
        skip.x = 640;
        skip.y = 10;
        skip.fontFamily = "'Orbitron'";
        skip.align     = "right";
        skip.baseline  = "top";
        skip.fontWeight = 700;
    },

    update: function() {
    },

    ontouchend: function() {
        app.background = "rgba(0, 0, 0, 0.8)";
        this.phase++;
        if (this.phase == this.phaseMax) app.replaceScene(app.gameScene);
    },
});
