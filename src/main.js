/*
 *  TheStarsMyDestination tmlib.js version
 *  main.js
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 */

//乱数発生器
var mt = new MersenneTwister(0);

//定数
//デバッグ
var _DEBUG = true;
if (_DEBUG) {
    DISP_DATA = true;
    DISP_COLLISION = false;
    DISP_ADVANCE = false;
}

//スクリーンサイズ
SCREEN_WIDTH = 640;
SCREEN_HEIGHT= 640;
SCREEN_WIDTH_HALF = SCREEN_WIDTH/2;
SCREEN_HEIGHT_HALF = SCREEN_HEIGHT/2;

//マップサイズ
WORLD_SIZE = 640*3;

//レイヤー区分
LAYER_SYSTEM = 6;           //システム表示
LAYER_FOREGROUND = 5;       //フォアグラウンド
LAYER_EFFECT_UPPER = 4;     //エフェクト上位
LAYER_FRIGATE = 3;          //艦隊
LAYER_EFFECT_UNDER = 1;     //エフェクト下位
LAYER_PLANET = 2;           //惑星
LAYER_BACKGROUND = 0;       //バックグラウンド

var toRad = 3.14159/180;    //弧度法toラジアン変換
var toDeg = 180/3.14159;    //ラジアンto弧度法変換
var sec = function(s) { return ~~(60 * s) };               //秒からフレーム数へ変換
var rand = function(max) { return mt.nextInt(0, max); };    //乱数発生
//var rand = function(max) {return ~~(Math.random() * max);}

//アプリケーションメイン
tm.main(function() {
    app = tiger.CanvasApp("#world");
//    app.enableStats();
    app.run();
});
