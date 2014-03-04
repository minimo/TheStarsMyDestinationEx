/*
 * License
 * http://daishihmr.mit-license.org/
 */
(function() {

tiger.Effect = {};
tiger.Effect.setup = function() {
    //衝撃波
    tiger.Effect["shockwaveImage"] = tm.graphics.Canvas()
        .resize(100, 100)
        .setStrokeStyle("rgba(0,0,0,0)")
        .setFillStyle(tm.graphics.RadialGradient(50, 50, 0, 50, 50, 50)
            .addColorStopList([
                { offset: 0.00, color: "rgba(255,255,255,0)" },
                { offset: 0.70, color: "rgba(255,255,255,0)" },
                { offset: 0.95, color: "rgba(255,255,255,1)" },
                { offset: 1.00, color: "rgba(255,255,255,0)" },
            ]).toStyle())
        .fillCircle(50, 50, 50);
};

//衝撃波生成
tiger.Effect.genShockwave = function(x, y, scaleTo) {
    scaleTo = scaleTo || 1.8;
    var scale = 0.1;
    var sw = tm.display.Sprite()
        .setPosition(x, y)
        .setScale(scale)
        .setBlendMode("lighter");
    sw.isEffect = true;
    sw.image = tiger.Effect["shockwaveImage"];
    sw.tweener
        .clear()
        .to({
            scaleX: scaleTo,
            scaleY: scaleTo,
            alpha: 0.0
        }, 800, "easeOutQuad")
        .call(function() {
            sw.remove();
        });
    return sw;
};

//収束衝撃波生成
tiger.Effect.genShockwaveRev = function(x, y, scaleFrom) {
    scaleFrom = scaleFrom || 1.8;
    var scaleTo = 0.1;
    var sw = tm.display.Sprite()
        .setPosition(x, y)
        .setScale(scaleFrom)
        .setBlendMode("lighter");
    sw.isEffect = true;
    sw.image = tiger.Effect["shockwaveImage"];
    sw.tweener
        .clear()
        .to({
            scaleX: scaleTo,
            scaleY: scaleTo,
            alpha: 0.0
        }, 800, "easeOutQuad")
        .call(function() {
            sw.remove();
        });

    return sw;
};

//衝撃波（大）生成
tiger.Effect.genShockwaveL = function(x, y) {
    var shockwave = tm.display.CircleShape(300, 300, {
        strokeStyle: "rgba(0,0,0,0)",
        fillStyle: tm.graphics.RadialGradient(150, 150, 0, 150, 150, 150)
            .addColorStopList([
                { offset: 0.0, color: "rgba(255,255,255,0)" },
                { offset: 0.5, color: "rgba(255,255,255,0)" },
                { offset: 0.9, color: "rgba(255,255,255,1)" },
                { offset: 1.0, color: "rgba(255,255,255,0)" },
            ])
            .toStyle()
    }).setPosition(x, y).setScale(0.1, 0.1)
    shockwave.isEffect = true;
    shockwave.tweener.clear()
        .to({
            scaleX: 5,
            scaleY: 5,
            alpha: 0,
        }, 500, "easeOutQuad")
        .call(function() {
            this.remove();
        }.bind(shockwave));

    return shockwave;
};

//レーザー
tiger.Effect.genLaser = function(color, from, to) {
    var dis = distance(from, to);
    var ls = tm.display.RectangleShape(dis, 1, {
        strokeStyle: "rgba(1.0, 1.0, 1.0, 1.0)",
        fillStyle: tm.graphics.RadialGradient(150, 150, 0, 150, 150, 150)
            .addColorStopList([
                { offset: 0.0, color: "rgba(255,255,255,0)" },
                { offset: 0.2, color: "rgba(255,255,255,1)" },
                { offset: 1.0, color: "rgba(255,255,255,1)" },
            ])
            .toStyle()
    }).setPosition(from.x, from.y);
    ls.rotation = Math.atan2(to.y-from.y, to.x-from.x)*toDeg;   //二点間の角度
    ls.isEffect = true;
    ls.tweener.clear()
        .wait(1000)
        .call(function() {
            this.remove();
        }.bind(ls));

    return ls;
};


})();

