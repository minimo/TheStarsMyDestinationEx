/*
 *  TheStarsMyDestination tmlib.js version
 *  World.js
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 */

//マップ管理クラス
tiger.World = tm.createClass({
    
    //惑星リスト
    planets: null,

    //ユニットリスト    
    units: null,

    init: function() {
        this.planets = [];
        this.units = [];
    },
    
    build: function(num) {
    },

});
