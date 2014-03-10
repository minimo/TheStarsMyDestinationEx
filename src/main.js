/*
 *  TheStarsMyDestination tmlib.js version
 *  main.js
 *  2014/02/11
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//乱数発生器
var mt = new MersenneTwister();

//定数
//デバッグフラグ
var debug = true;

//スクリーンサイズ
SC_W = 640;
SC_H = 640;

//ユニット、惑星タイプ
TYPE_NEUTRAL = 0;
TYPE_PLAYER = 1;
TYPE_ENEMY  = 2;

//レイヤー区分
LAYER_SYSTEM = 6;           //システム表示
LAYER_FOREGROUND = 5;       //フォアグラウンド
LAYER_EFFECT_UPPER = 4;     //エフェクト上位
LAYER_UNIT = 3;             //ユニット
LAYER_EFFECT_LOWER = 2;     //エフェクト下位
LAYER_PLANET = 1;           //惑星
LAYER_BACKGROUND = 0;       //バックグラウンド

//惑星名
PLANET_SUN = 0;
PLANET_MERCURY = 1;
PLANET_VENUS = 2;
PLANET_EARTH = 3;
PLANET_MOON = 4;
PLANET_MARS = 5;
PLANET_JUPITER = 6;
PLANET_SATURN = 7;
PLANET_URANUS = 8;
PLANET_NEPTUNE = 9;
PLANET_PLUTO = 10;

//太陽系配列
solarSystem = [1,2,3,5,6,7,8,9,10];

var toRad = 3.14159/180;    //弧度法toラジアン変換
var toDeg = 180/3.14159;    //ラジアンto弧度法変換
var sec = function(s) { return ~~(60 * s) };               //秒からフレーム数へ変換
var rand = function(min, max) { return mt.nextInt(min, max); };    //乱数発生
//var rand = function(max) {return ~~(Math.random() * max);}

//距離計算
var distance = function(from, to) {
    var x = from.x-to.x;
    var y = from.y - to.y;
    return Math.sqrt(x*x+y*y);
}
//距離計算（ルート無し版）
var distanceSq = function(from, to) {
    var x = from.x-to.x;
    var y = from.y - to.y;
    return x*x+y*y;
}
//数値の制限
var clamp = function(x, min, max) {
    return (x<min)?min:((x>max)?max:x);
};

//インスタンス
app = {};

//アプリケーションメイン
tm.main(function() {

    tiger.Effect.setup();

    app = tiger.CanvasApp("#world");
//    app.enableStats();
    app.run();
});

