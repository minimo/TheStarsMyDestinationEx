/*
 *  TheStarsMyDestination tmlib.js version
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 */

//アセット登録
var assets = {
    //images
    "arrow":        "assets/arrow.png",
    "planet":       "assets/planet.png",
    "planet_mono":  "assets/planet_mono.png",
    "frigate":      "assets/frigate1.png",
    "bg1":          "assets2/5212712025_93cca9e023_o.jpg",
    "bg2":          "assets2/201106290800.jpg",
}

//namespace tiger
tiger = {
    core: null,
};

tm.define("tiger.CanvasApp", {
    superClass: tm.app.CanvasApp,

    //オンライン対戦フラグ
    online: false,

    //オンライン対戦ＩＤ
    onlineID: false,

    //スコア
    score: 0,

    //ゲームシーン
    gameScene: null,

    //難易度
    difficulty: 0,

    init: function(id) {
        this.superInit(id);

        tiger.core = this;
        this.resize(SC_W, SC_H).fitWindow();
        this.fps = 60;
        this.background = "rgba(0, 0, 0, 0)";
        
        this.keyboard = tm.input.Keyboard(window);
        this.gameScene = tiger.GameScene();

        var loadingScene = tm.ui["LoadingScene"]({
            assets: assets,
            width: SC_W,
            height: SC_H,
            nextScene: function() {
                this._onLoadAssets();
                return tiger.TitleScene();
            }.bind(this),
        });
        loadingScene.bg.canvas.clearColor("black");
        this.replaceScene(loadingScene);
   },

    _onLoadAssets: function() {
    },

    exitApp: function() {
        this.stop();
        tm.social.Nineleap.postRanking(this.highScore, "");
    }
});
