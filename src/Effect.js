/*
 * License
 * http://daishihmr.mit-license.org/
 */
(function() {

tiger.Effect = {};
tiger.Effect.setup = function() {

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

    /** @const */
    var size = 16;
    tiger.Effect["particle16"] = tiger.Particle(size, 1.0, 0.9, tm.graphics.Canvas()
        .resize(size, size)
        .setFillStyle(
            tm.graphics.RadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
                .addColorStopList([
                    {offset:0.0, color: "rgba(255,255,255,1.0)"},
                    {offset:1.0, color: "rgba(255,128,  0,0.0)"},
                ]).toStyle()
        )
        .fillRect(0, 0, size, size)
        .element
    );

};

tiger.Effect.genParticle = function(x, y, scene) {
    var p = tiger.Effect["particle16"].clone().setPosition(x, y);
    p.isEffect = true;
    p.addChildTo(scene);
    var speed = tiger.math.randf(5, 20);
    var dir = tiger.math.randf(Math.PI,Math.PI*2);
    p.dx = Math.cos(dir) * speed;
    p.dy = Math.sin(dir) * speed;
    var scaleMin = 0.1;
    var scaleMax = 0.5;
    p.scaleX = p.scaleY = (tiger.math.randf(scaleMin, scaleMax) + tiger.math.randf(scaleMin, scaleMax)) / 2;
    p.addEventListener("enterframe", function() {
        this.x += this.dx;
        this.y += this.dy;
        this.dx *= 0.9;
        this.dy *= 0.9;
    });
};

tiger.Effect.genShockwave = function(x, y, scene, scaleTo) {
    scaleTo = scaleTo || 1.8;
    var scale = 0.1;
    var sw = tm.display.Sprite()
        .setPosition(x, y)
        .setScale(scale)
        .setBlendMode("lighter");
    sw.isEffect = true;
    sw.addChildTo(scene);
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
};

tiger.Effect.genShockwaveRev = function(x, y, scene, scaleFrom) {
    scaleFrom = scaleFrom || 1.8;
    var scaleTo = 0.1;
    var sw = tm.display.Sprite()
        .setPosition(x, y)
        .setScale(scaleFrom)
        .setBlendMode("lighter");
    sw.isEffect = true;
    sw.addChildTo(scene);
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
};

tiger.Effect.genShockwaveL = function(x, y, scene) {
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
    shockwave.addChildTo(scene);
    shockwave.tweener.clear()
        .to({
            scaleX: 5,
            scaleY: 5,
            alpha: 0,
        }, 500, "easeOutQuad")
        .call(function() {
            this.remove();
        }.bind(shockwave));
};


})();
