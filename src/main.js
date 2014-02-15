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
SC_W = 640;
SC_H = 640;

//ユニット、惑星タイプ
TYPE_NUTRAL = 0;
TYPE_PLAYER = 1;
TYPE_ENEMY = 2;

//レイヤー区分
LAYER_SYSTEM = 6;           //システム表示
LAYER_FOREGROUND = 5;       //フォアグラウンド
LAYER_EFFECT_UPPER = 4;     //エフェクト上位
LAYER_UNIT = 3;             //ユニット
LAYER_EFFECT_LOWER = 1;     //エフェクト下位
LAYER_PLANET = 2;           //惑星
LAYER_BACKGROUND = 0;       //バックグラウンド

var toRad = 3.14159/180;    //弧度法toラジアン変換
var toDeg = 180/3.14159;    //ラジアンto弧度法変換
var sec = function(s) { return ~~(60 * s) };               //秒からフレーム数へ変換
var rand = function(min, max) { return mt.nextInt(min, max); };    //乱数発生
//var rand = function(max) {return ~~(Math.random() * max);}

//インスタンス
app = {};

//アプリケーションメイン
tm.main(function() {
    app = tiger.CanvasApp("#world");
//    app.enableStats();
    app.run();
});

