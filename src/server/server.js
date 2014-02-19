/*

    TheStarsMyDestination serverside
	2014/02/10
	This program is MIT lisence.

*/

var log = console.log;

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);	//ポートを設定
//    app.set('port', process.env.PORT || 80);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

//サーバー定義
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

var robby = [];     //待機中プレイヤー（playerID）
var sessionID = 0;  //セッションＩＤ

//ロビー
io.of('/tiger').on('connection', function(socket) {
    //クライアントに接続成功とＩＤを通知
    socket.emit('connected', socket.id);
    log('connected', socket.id);

    if (robby.length > 0) {
        //ロビーに人がプレイヤーが居れば対戦成立
        sessionID++;

        var hostID = robby[0];      //先にロビーに居た方がホストになる
        var guestID = socket.id;

        //対戦成立とセッション情報を通知
        socket.emit('msg matching player', {id: sessionID, host: hostID, guest:guestID});
        socket.broadcast.emit('msg matching player', {id: sessionID, host: hostID, guest:guestID}); 

        log('matching(sessionID:'+sessionID+'):'+robby[0]+' & '+socket.id);

        robby.splice(0,1);
        startBattle(sessionID);
    } else {
        //ロビーに人が居ないので待機する
        robby.push(socket.id);
        log('waiting :'+socket.id);
        this.emit('msg wait');
    }

    //クライアントが切断した
    socket.on('disconnect', function() {
        log('disconnect :'+socket.id);
        robby.splice(0,1);
    });
});


// 通信対戦を始める
function startBattle(id){
    // /tiger/:battleId に対する接続を待ち受けるイベントリスナ
    var battle = io.of('/tiger/'+id).on('connection', function(socket){
 
        //ゲーム準備完了通知受信
        socket.on('msg gameready', function(){
            log('game started');
            socket.emit('msg gamestart');
            socket.broadcast.emit('msg gamestart');
        });

        //惑星を追加した
        socket.on('msg enter planet', function(msg){
            log('eneter planet');
            socket.broadcast.emit('msg enter planet', msg);
        });

        //ユニット追加
        socket.on('msg enter unit', function(msg){
            log('enter unit:'+socket.id);
            socket.broadcast.emit('msg enter unit', msg);
        });

        //ユニット操作
        socket.on('msg control unit', function(msg){
            log('control unit:'+socket.id);
            socket.broadcast.emit('msg control unit', msg);
        });
        
        //ユニットデータ同期
        socket.on('msg sync unitdata', function(msg) {
            socket.broadcast.emit('msg sync unitdata', msg);
        });

        //惑星データ再送要求
        socket.on('msg resend planet', function(msg) {
            socket.broadcast.emit('msg resend planet', msg);
        });

        //惑星データ同期
        socket.on('msg sync planet', function(msg) {
            socket.broadcast.emit('msg sync planet', msg);
        });

        //相手通信確認（送信）
        socket.on('msg seng ping', function(msg) {
            socket.broadcast.emit('msg send ping', msg);
        });
        //相手通信確認（受信）
        socket.on('msg recv ping', function(msg) {
            socket.broadcast.emit('msg recv ping', msg);
        });

        //クライアントが切断した
        socket.on('disconnect', function() {
            log('disconnect :'+socket.id);
            socket.broadcast.emit('msg userdisconnect');
        });
    });
}


//ユニークＩＤ生成
function uniqueID(){
    var randam = Math.floor(Math.random()*1000)
    var date = new Date();
    var time = date.getTime();
    return randam + time.toString();
}

