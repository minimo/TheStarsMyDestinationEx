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

    "laser_b":      "assets/laser_b.png",
    "laser_r":      "assets/laser_r.png",
    "laser_h":      "assets/laser_h.png",
    "laser_head":   "assets/laser_head.png",

    "explode":      "assets/explode.png",

    "bg1":          "assets/5212712025_93cca9e023_o.jpg",
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

    //実行環境情報
    userAgent: "",
    soundEnable: false,
    smartphone: false,

    init: function(id) {
        this.superInit(id);

        tiger.core = this;
        this.resize(SC_W, SC_H).fitWindow();
        this.fps = 60;
        this.background = "rgba(0, 0, 0, 0)";

        this.detectEnvironment();

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
    },

    //実行環境取得
    detectEnvironment: function() {
        if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0) {
            this.userAgent = "iOS";
            this.soundEnable = false;
            this.smartphone = true;
        } else if (navigator.userAgent.indexOf('Android') > 0) {
            this.userAgent = "Android";
            this.soundEnable = false;
            this.smartphone = true;
        } else if (navigator.userAgent.indexOf('Chrome') > 0) {
            this.userAgent = "Chrome";
            this.soundEnable = true;
            this.smartphone = false;
        } else if (navigator.userAgent.indexOf('Firefox') > 0) {
            this.userAgent = "Firefox";
            this.soundEnable = false;
            this.smartphone = false;
        } else if (navigator.userAgent.indexOf('Safari') > 0) {
            this.userAgent = "Safari";
            this.soundEnable = false;
            this.smartphone = false;
        } else if (navigator.userAgent.indexOf('IE') > 0) {
            this.userAgent = "IE";
            this.soundEnable = false;
            this.smartphone = false;
        } else {
            this.userAgent = "unknown";
            this.soundEnable = false;
            this.smartphone = false;
        }
    },
});


