/*
 *  TheStarsMyDestination tmlib.js version
 *  Planet.js
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//艦隊管理クラス
Frigate = tm.createClass({
    superClass: tm.app.Sprite,

    //戦力
    HP: 0,

    //属性（0:中立 1:プレイヤー 2:エネミー）
    alignment: 0,   //※仕様上中立は無い（予定）
    
    //目的地
    destination: null,
    
    //所属グループＩＤ
    group:0,
    
    init: function() {
        this.superInit("firgate", 32, 32);
    },
    update: function() {
    },
});
