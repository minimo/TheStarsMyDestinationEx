/*
 *  TheStarsMyDestination tmlib.js version
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 */

//アセット登録
var ASSETS = {
    //images
    "planet":       "assets/planet.png",
    "planet_mono":  "assets/planet_mono.png",
    "frigate":      "assets/frigate.png",
}

//namespace tiger
tiger = {
    core: null,
};

tiger.CanvasApp = tm.createClass({
    superClass: tm.app.CanvasApp,
    score: 0,
    highScore: 0,       //ハイスコア
    highScoreStage: 0,  //ハイスコア時ステージ
    mainScene: null,

    init: function(id) {
        this.superInit(id);

        tiger.core = this;
        this.resize(SCREEN_WIDTH, SCREEN_HEIGHT).fitWindow();
        this.fps = 60;
        this.background = "rgba(0, 0, 0, 0)";

        this.keyboard = tm.input.Keyboard(window);

        //ローディングシーンを投入
        this.replaceScene(tm.app.LoadingScene({
            assets:ASSETS,
            nextScene: function() {
                this._onLoadAssets();
//                return tiger.TitleScene();    //次シーンはタイトル
                return tiger.MainScene();
            }.bind(this),
        }));
    },

    _onLoadAssets: function() {
    },

    exitApp: function() {
        this.stop();
        tm.social.Nineleap.postRanking(this.highScore, "");
    }
});
