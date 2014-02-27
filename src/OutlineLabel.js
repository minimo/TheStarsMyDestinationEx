/*
 *  OutlineLabel.js
 *  縁取りラベル
 *  2014/02/27
 *  @auther minimo  
 *  This Program is MIT license.
 *
 */

//マップ管理クラス
tm.display.OutlineLabel = tm.createClass({
    superClass: tm.display.CanvasElement,
//    superClass: tm.display.Label,

    //縁取り用
    outline: null,

    //メイン
    main: null,

    init: function(scene) {
        this.superInit();

        //アウトライン作成
        for (var i = 0; i < 4; i++) {
        }
    },    
});
