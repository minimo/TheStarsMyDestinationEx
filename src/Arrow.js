/*
 *  TheStarsMyDestination tmlib.js version
 *  Arrow.js
 *  2014/03/01
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//選択矢印
tm.define("tiger.Arrow", {
    superClass: tm.display.Sprite,

    //始点と終点
    from: null,
    to: null,

    //アクティブフラグ
    active: true,
    
    //フォアグラウンドレイヤフラグ
    foreground: true,

    init: function(from, to) {
        this.superInit("arrow", 160, 16);
        this.setPosition(from.x, from.y);

        this.originX = 0;
        this.originY = 0.5;
        this.from = from;
        this.to = to;
        this.alpha = 0.0;
    },

    update: function() {
        //中心点からの直線を計算
        var fx = this.from.x, fy = this.from.y;
        var tx = this.to.x, ty = this.to.y;
        var dx = tx-fx, dy = ty-fy;

        //始点が惑星の場合円周上にする
        if (this.from instanceof tiger.Planet) {
            var len = 38*this.from.power/Math.sqrt(dx*dx+dy*dy);
            fx = fx*(1-len)+tx*len;
            fy = fy*(1-len)+ty*len;
            dx = tx-fx, dy = ty-fy;
        }

        //終点が惑星の場合円周上にする
        if (this.to instanceof tiger.Planet) {
            var len = 38*this.to.power/Math.sqrt(dx*dx+dy*dy);
            tx = fx*len+tx*(1-len);
            ty = fy*len+ty*(1-len);
            dx = tx-fx, dy = ty-fy;
        }
        
        if (this.from === this.to) {
            this.visible = false;
        } else {
            this.visible = true;
        }

        //再計算
        this.x = fx;
        this.y = fy;
        this.rotation = Math.atan2(dy, dx)*toDeg;   //二点間の角度
        this.scaleX = Math.sqrt(dx*dx+dy*dy)/160;

        if (this.active) {
            this.alpha += 0.05;
            if (this.alpha > 0.7)this.alpha = 0.7;
        } else {
            this.alpha -= 0.05;
            if (this.alpha < 0.0)this.remove();
        }
    },
    
    getLength: function() {
        return distance(this.from, this.to);
    },
});
