/*
 *  TheStarsMyDestination tmlib.js version
 *  touches.js
 *  2014/03/19
 *  @auther minimo  
 *  This Program is MIT license.
 *
 */

//マルチタッチ補助クラス
tm.define("tiger.Touches", {
    superClass: "tm.display.CanvasElement",

    //タッチID
    touchID: 0,

    //タッチ中ポイントリスト
    touchList: null,

    //強制シングル化フラグ
    single: false,

    init: function(x, y, width, height) {
        this.superInit();

        this.touchList = [];        
    },

    
});

