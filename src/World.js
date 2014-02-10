/*
 *  TheStarsMyDestination tmlib.js version
 *  World.js
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 */

//マップ管理クラス
World = tm.createClass({
//    superClass: tm.app.Sprite,

    //戦力
    HP: 0,

    //属性（0:中立 1:プレイヤー 2:エネミー）
    alignment: 0,
    
    init: function() {
        this.superInit("planet", 32, 32);
    },
    update: function() {
    },
});
