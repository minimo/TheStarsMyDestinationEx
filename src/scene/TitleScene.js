/*
 *  TheStarsMyDestination tmlib.js version
 *  TitleScene.js
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//タイトルシーン
tm.define("tiger.TitleScene", {
    superClass: tm.app.TitleScene,

    init: function() {
        this.superInit({
            title: "Tiger!Tiger!",
            width: SC_W,
            height: SC_H
        });
        this.time = 0;
        app.background = "rgba(0,0,0,0.2)";
    },
    update: function() {
        this.time++;
    },
    onnextscene: function() {
        app.background = "rgba(0, 0, 16, 0.8)";
        app.replaceScene(app.gameScene);
    }
});

