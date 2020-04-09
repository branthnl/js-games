const D = document;
D.c = (c) => D.createElement(c);
D.q = (q) => D.querySelector(q);

const C = {
	red: '#f1334d',
	blue: 'blue',
	gray: 'gray',
	black: 'black',
	white: 'white',
	purple: '#483a6e',
	dkblue: '#060229',
	ltgray: 'lightgray',
	ltpurple: '#586abe',
	yellow: '#f8b500'
}

const Align = {
	l: 'left',
	r: 'right',
	c: 'center',
	t: 'top',
	m: 'middle',
	b: 'bottom'
}

const Shape = {
	rect: 'rect',
	star: 'star',
	circle: 'circle'
}

const Cap = {
	butt: 'butt',
	round: 'round',
	square: 'square'
}

const Comp = {
	sourceOver: 'source-over',
	destinationIn: 'destination-in',
	destinationOver: 'destination-over',
}

Math.clamp = function(a, b, c) {
	return Math.min(c, Math.max(b, a));
}

Math.range = function(min, max) {
	return Math.random() * (max - min) + min;
}

Math.degtorad = function(d) {
	return d * Math.PI / 180;
}

Math.radtodeg = function(r) {
	return r * 180 / Math.PI;
}

Math.lendirx = function(l, d) {
	return -Math.sin(Math.degtorad(d)) * l;
}

Math.lendiry = function(l, d) {
	return Math.cos(Math.degtorad(d)) * l;
}

Math.randomNegator = function(n) {
	return Math.range(0, 100) < (n || 50)? 1 : -1;
}

function BranthTime() {
	this.time = 0;
	this.lastTime = 0;
	this.deltaTime = 0;
	this.fixedDeltaTime = 1000 / 60;
	this.update = function(t) {
		this.lastTime = this.time || 0;
		this.time = t || 0;
		this.deltaTime = this.time - this.lastTime || this.fixedDeltaTime;
	}
	this.toSeconds = function(t) {
		return Math.ceil(t / 1000);
	}
	this.toMinutes = function(t) {
		return Math.ceil(t / 60000);
	}
	this.toClockSeconds = function(t) {
		return Math.floor(t / 1000) % 60;
	}
	this.toClockMinutes = function(t) {
		return Math.floor(t / 60000) % 60;
	}
	this.toClockSeconds0 = function(t) {
		let s = Math.abs(this.toClockSeconds(t));
		return (s < 10? '0' : '') + s;
	}
	this.toClockMinutes0 = function(t) {
		let m = Math.abs(this.toClockMinutes(t));
		return (m < 10? '0' : '') + m;
	}
}

function BranthCanvas(w, h) {
	this.c = D.c('canvas');
	this.x = this.c.offsetLeft;
	this.y = this.c.offsetTop;
	this.w = w;
	this.h = h;
	this.mid = {
		x: 0,
		y: 0,
		w: w / 2,
		h: h / 2
	}
	this.end = {
		x: 0,
		y: 0
	}
	this.setDimension = function(w, h) {
		this.c.width = w;
		this.c.height = h;
		this.w = this.c.width;
		this.h = this.c.height;
		this.update();
	}
	this.update = function() {
		this.x = this.c.offsetLeft;
		this.y = this.c.offsetTop;
		this.mid.w = this.w / 2;
		this.mid.h = this.h / 2;
		this.mid.x = this.x + this.mid.w;
		this.mid.y = this.y + this.mid.h;
		this.end.x = this.x + this.w;
		this.end.y = this.y + this.h;
	}
	this.setDimension(w, h);
}

function BranthDraw(ctx) {
	this.ctx = ctx;
	this.setAlpha = function(n) {
		ctx.globalAlpha = n;
	}
	this.setColor = function(s) {
		ctx.fillStyle = s;
		ctx.strokeStyle = s;
	}
	this.setHAlign = function(s) {
		ctx.textAlign = s;
	}
	this.setVAlign = function(s) {
		ctx.textBaseline = s;
	}
	this.setHVAlign = function(h, v) {
		this.setHAlign(h);
		this.setVAlign(v);
	}
	this.setShadow = function(x, y, b, c) {
		ctx.shadowBlur = b || 0;
		ctx.shadowColor = c || C.black;
		ctx.shadowOffsetX = x;
		ctx.shadowOffsetY = y;
	}
	this.resetShadow = function() {
		this.setShadow(0, 0, 0, C.black);
	}
	this.composite = function(s) {
		ctx.globalCompositeOperation = s;
	}
	this.font = function(s) {
		ctx.font = s + ' Fresca, sans-serif';
	}
	this.text = function(x, y, text) {
		ctx.fillText(text, x, y);
	}
	this.lineCap = function(s) {
		ctx.lineCap = s;
	}
	this.lineWidth = function(n) {
		ctx.lineWidth = n;
	}
	this.beginPath = function() {
		ctx.beginPath();
	}
	this.closePath = function() {
		ctx.closePath();
	}
	this.fill = function() {
		ctx.fill();
	}
	this.stroke = function() {
		ctx.stroke();
	}
	this.arc = function(x, y, r, start, end) {
		ctx.arc(x, y, r, start, end);
	}
	this.moveTo = function(x, y) {
		ctx.moveTo(x, y);
	}
	this.lineTo = function(x, y) {
		ctx.lineTo(x, y);
	}
	this.rect = function(x, y, w, h, outline) {
		if (outline) ctx.strokeRect(x, y, w, h);
		else ctx.fillRect(x, y, w, h);
	}
	this.circle = function(x, y, r, outline) {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.closePath();
		if (outline) ctx.stroke();
		else ctx.fill();
	}
	this.polyBegin = function(x, y) {
		ctx.beginPath();
		ctx.moveTo(x, y);
	}
	this.vertex = function(x, y) {
		ctx.lineTo(x, y);
	}
	this.polyEnd = function(outline) {
		ctx.closePath();
		if (outline) ctx.stroke();
		else ctx.fill();
	}
	this.star = function(x, y, r, d) {
		const sr = r * 0.5;
		const lp = [
			{
				x: Math.lendirx(r, d + 180),
				y: Math.lendiry(r, d + 180)
			},
			{
				x: Math.lendirx(r, d + 252),
				y: Math.lendiry(r, d + 252)
			},
			{
				x: Math.lendirx(r, d + 324),
				y: Math.lendiry(r, d + 324)
			},
			{
				x: Math.lendirx(r, d + 36),
				y: Math.lendiry(r, d + 36)
			},
			{
				x: Math.lendirx(r, d + 108),
				y: Math.lendiry(r, d + 108)
			}
		];
		const sp = [
			{
				x: Math.lendirx(sr, d + 216),
				y: Math.lendiry(sr, d + 216)
			},
			{
				x: Math.lendirx(sr, d + 288),
				y: Math.lendiry(sr, d + 288)
			},
			{
				x: Math.lendirx(sr, d + 0),
				y: Math.lendiry(sr, d + 0)
			},
			{
				x: Math.lendirx(sr, d + 72),
				y: Math.lendiry(sr, d + 72)
			},
			{
				x: Math.lendirx(sr, d + 144),
				y: Math.lendiry(sr, d + 144)
			}
		];
		this.polyBegin(x + lp[0].x, y + lp[0].y);
		this.vertex(x + sp[0].x, y + sp[0].y);
		this.vertex(x + lp[1].x, y + lp[1].y);
		this.vertex(x + sp[1].x, y + sp[1].y);
		this.vertex(x + lp[2].x, y + lp[2].y);
		this.vertex(x + sp[2].x, y + sp[2].y);
		this.vertex(x + lp[3].x, y + lp[3].y);
		this.vertex(x + sp[3].x, y + sp[3].y);
		this.vertex(x + lp[4].x, y + lp[4].y);
		this.vertex(x + sp[4].x, y + sp[4].y);
		this.polyEnd(false);
	}
	this.rectd = function(x, y, w, h, d) {
		w /= 2;
		h /= 2;
		const r = Math.sqrt(w ** 2 + h ** 2);
		const p = [
			{
				x: Math.lendirx(r, d + 225),
				y: Math.lendiry(r, d + 225)
			},
			{
				x: Math.lendirx(r, d + 315),
				y: Math.lendiry(r, d + 315)
			},
			{
				x: Math.lendirx(r, d + 45),
				y: Math.lendiry(r, d + 45)
			},
			{
				x: Math.lendirx(r, d + 135),
				y: Math.lendiry(r, d + 135)
			}
		];
		this.polyBegin(x + p[0].x, y + p[0].y);
		this.vertex(x + p[1].x, y + p[1].y);
		this.vertex(x + p[2].x, y + p[2].y);
		this.vertex(x + p[3].x, y + p[3].y);
		this.polyEnd(false);
	}
	this.clearRect = function(x, y, w, h) {
		ctx.clearRect(x, y, w, h);
	}
	this.ticO = function(x, y, r, progress, lineW) {
		const startPos = -Math.PI / 2 + Math.PI / 4 * progress;
		this.setShadow(0, 0, 20, C.blue);
		this.lineCap(Cap.round);
		ctx.beginPath();
		this.setColor(C.blue);
		this.lineWidth(lineW * (1 + 1 * (1 - progress)));
		ctx.arc(x, y, Math.abs(r), startPos, startPos + Math.PI * 2 * Math.min(1, progress * 1.5));
		ctx.stroke();
		this.setColor(C.white);
		let t = progress;
		this.lineWidth(
			lineW *
				(t < 0.4? 2 - 1.4 * (t / 0.4) :
				(t < 0.6? 0.6 :
				(t < 0.8? 0.6 + 0.4 * ((t - 0.6) / 0.2) :
					1 - 0.2 * ((t - 0.8) / 0.2)))
			)
		);
		ctx.stroke();
		this.setAlpha(
			t < 0.6? 0 :
			(t < 0.8? 0 + 0.075 * ((t - 0.6) / 0.2) :
				0.075 - 0.025 * ((t - 0.8) / 0.2))
		);
		ctx.fill();
		this.setAlpha(1);
		this.lineCap(Cap.butt);
		this.resetShadow();
	}
	this.ticX = function(x, y, r, progress, lineW) {
		r *= 1.2;
		const startPos = -Math.PI / 2 + Math.PI / 4 * progress;
		this.setShadow(0, 0, 20, C.red);
		this.lineCap(Cap.round);
		ctx.beginPath();
		this.setColor(C.red);
		this.lineWidth(lineW * (1 + 1 * (1 - progress)));
		const vtx = [{
			x: x + Math.lendirx(r, 225),
			y: y + Math.lendiry(r, 225)
		}];
		vtx.push({
			x: vtx[0].x + Math.lendirx(r * 2 * Math.min(1, progress * 4), 45),
			y: vtx[0].y + Math.lendiry(r * 2 * Math.min(1, progress * 4), 45)
		});
		vtx.push({
			x: x + Math.lendirx(r, 135),
			y: y + Math.lendiry(r, 135)
		});
		vtx.push({
			x: vtx[2].x + Math.lendirx(r * 2 * Math.clamp((progress - 0.25) * 4, 0, 1), 315),
			y: vtx[2].y + Math.lendiry(r * 2 * Math.clamp((progress - 0.25) * 4, 0, 1), 315)
		});
		ctx.moveTo(vtx[0].x, vtx[0].y);
		ctx.lineTo(vtx[1].x, vtx[1].y);
		if (progress > 0.25) {
			ctx.moveTo(vtx[2].x, vtx[2].y);
			ctx.lineTo(vtx[3].x, vtx[3].y);
		}
		ctx.stroke();
		this.setColor(C.white);
		let t = progress;
		this.lineWidth(
			lineW *
				(t < 0.4? 2 - 1.4 * (t / 0.4) :
				(t < 0.6? 0.6 :
				(t < 0.8? 0.6 + 0.4 * ((t - 0.6) / 0.2) :
					1 - 0.2 * ((t - 0.8) / 0.2)))
			)
		);
		ctx.stroke();
		this.lineCap(Cap.butt);
		this.resetShadow();
	}
	this.ticLineGlow = function(x1, y1, x2, y2, lineW, c, progress) {
		this.setShadow(0, 0, 20, c);
		this.lineCap(Cap.round);
		ctx.beginPath();
		this.setColor(c);
		this.lineWidth(lineW);
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
		this.setColor(C.white);
		this.lineWidth(lineW * (0.8 + (0.6 * (1 - progress))));
		ctx.stroke();
		this.lineCap(Cap.butt);
		this.resetShadow();
	}
	this.hocPaddle = function(x, y, r, c, lineW) {
		this.setShadow(0, 0, 20, c);
		this.lineCap(Cap.round);
		ctx.beginPath();
		this.setColor(c);
		this.lineWidth(lineW);
		ctx.arc(x, y, Math.abs(r), 0, 2 * Math.PI);
		ctx.stroke();
		this.setColor(C.white);
		this.lineWidth(lineW * 0.8);
		ctx.stroke();
		this.lineCap(Cap.butt);
		this.resetShadow();
	}
	this.hocBall = function(x, y, r, c) {
		this.setShadow(0, 0, 20, c);
		ctx.beginPath();
		this.setColor(c);
		ctx.arc(x, y, Math.abs(r), 0, 2 * Math.PI);
		ctx.fill();
		ctx.beginPath();
		this.setColor(C.white);
		ctx.arc(x, y, Math.abs(r) * 0.9, 0, 2 * Math.PI);
		ctx.fill();
		this.resetShadow();
	}
	this.hocWall = function(x1, y1, x2, y2, c, lineW) {
		lineW *= (1 + 0.1 * Math.clamp(Math.sin(Time.time / 200), 0, 1))
		this.setShadow(0, 0, 20 + 5 * Math.clamp(Math.sin(Time.time / 400), 0, 1), c);
		this.lineCap(Cap.round);
		ctx.beginPath();
		this.setColor(c);
		this.lineWidth(lineW);
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
		this.setColor(C.white);
		this.lineWidth(lineW * 0.8);
		ctx.stroke();
		this.lineCap(Cap.butt);
		this.resetShadow();
	}
}

function BranthObject(k) {
	this.k = k;
	this.o = [];
	for (let i = 0; i < this.k.length; i++) {
		this.o.push([]);
	}
	this.getIndex = function(k) {
		for (let i = 0; i < this.k.length; i++) {
			if (k == this.k[i]) {
				return i;
			}
		}
		return -1;
	}
	this.add = function(k, o) {
		let i = this.getIndex(k);
		this.o[i].push(o);
	}
	this.take = function(k) {
		let i = this.getIndex(k);
		return this.o[i];
	}
	this.trash = function(k, j) {
		let i = this.getIndex(k);
		delete this.o[i][j];
	}
	this.clear = function(k) {
		let i = this.getIndex(k);
		this.o[i] = [];
	}
	this.clearAll = function() {
		for (let i = 0; i < this.o.length; i++) {
			this.o[i] = [];
		}
	}
	this.getNotNullLength = function(k) {
		let i = this.getIndex(k);
		let count = 0;
		for (let j = 0; j < this.o[i].length; j++) {
			if (this.o[i][j] != null) {
				count++;
			}
		}
		return count;
	}
	this.update = function() {
		for (let i = 0; i < this.o.length; i++) {
			for (let j = 0; j < this.o[i].length; j++) {
				let o = this.o[i][j];
				if (o != null) {
					o.update();
				}
			}
		}
	}
}

function BranthParticle(k, x, y, dx, dy, r, d, dr, dd, a, c, life, shape, grav) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.r = r;
	this.d = d;
	this.a = a;
	this.c = c;
	this.life = life;
	this.shape = shape;
	this.i = OBJ.take(k).length;
	this.update = function() {
		this.a = Math.max(0, this.a - Time.deltaTime / this.life);
		if (this.a <= 0) {
			OBJ.trash(k, this.i);
		}
		this.x += this.dx;
		this.y += this.dy;
		this.r = Math.max(0, this.r + dr);
		this.d += dd;
		this.dy += grav;
		this.render();
	}
	this.render = function() {
		Draw.setAlpha(this.a);
		Draw.setColor(this.c);
		switch (this.shape) {
			case Shape.rect:
				Draw.rectd(this.x, this.y, this.r, this.r, this.d);
				break;
			case Shape.star:
				Draw.star(this.x, this.y, this.r, this.d);
				break;
			case Shape.circle:
				Draw.circle(this.x, this.y, this.r, false);
				break;
			default: break;
		}
		Draw.setAlpha(1);
	}
}

function BranthEmitter(key) {
	this.key = key;
	this.x = {
		min: 0,
		max: 100
	}
	this.y = {
		min: 0,
		max: 100
	}
	this.spd = {
		min: 1,
		max: 2
	}
	this.r = {
		min: 2,
		max: 8
	}
	this.d = {
		min: 0,
		max: 360
	}
	this.sspd = {
		min: -0.02,
		max: -0.02
	}
	this.dspd = {
		min: 5,
		max: 10
	}
	this.a = {
		min: 1,
		max: 1
	}
	this.c = C.black;
	this.life = {
		min: 3000,
		max: 4000
	}
	this.shape = Shape.rect;
	this.grav = {
		min: 0.01,
		max: 0.01
	}
	this.setKey = function(k) {
		this.key = k;
	}
	this.resetKey = function() {
		this.key = key;
	}
	this.setArea = function(xmin, xmax, ymin, ymax) {
		this.x.min = xmin;
		this.x.max = xmax;
		this.y.min = ymin;
		this.y.max = ymax;
	}
	this.setSpeed = function(min, max) {
		this.spd.min = min;
		this.spd.max = max;
	}
	this.setSize = function(min, max) {
		this.r.min = min;
		this.r.max = max;
	}
	this.setDirection = function(min, max) {
		this.d.min = min;
		this.d.max = max;
	}
	this.setSizeSpeed = function(min, max) {
		this.sspd.min = min;
		this.sspd.max = max;
	}
	this.setAngleSpeed = function(min, max) {
		this.dspd.min = min;
		this.dspd.max = max;
	}
	this.setAlpha = function(min, max) {
		this.a.min = min;
		this.a.max = max;
	}
	this.setColor = function(c) {
		this.c = c;
	}
	this.setLife = function(min, max) {
		this.life.min = min;
		this.life.max = max;
	}
	this.setShape = function(s) {
		this.shape = s;
	}
	this.setGravity = function(min, max) {
		this.grav.min = min;
		this.grav.max = max;
	}
	this.preset = function(s) {
		switch (s) {
			case 'puff':
				this.setSpeed(2, 3);
				this.setSize(5, 10);
				this.setDirection(0, 360);
				this.setSizeSpeed(0, 0);
				this.setAngleSpeed(0, 0);
				this.setAlpha(0.8, 1);
				this.setColor(C.white);
				this.setLife(250, 400);
				this.setShape(Shape.circle);
				this.setGravity(0, 0);
				break;
			case 'starpuff':
				this.setSpeed(4, 5);
				this.setSize(5, 8);
				this.setDirection(0, 360);
				this.setSizeSpeed(0, 0);
				this.setAngleSpeed(-5, 5);
				this.setAlpha(0.5, 1);
				this.setColor(C.yellow);
				this.setLife(1000, 2000);
				this.setShape(Shape.star);
				this.setGravity(0.1, 0.1);
				break;
			case 'sparkle':
				this.setSpeed(1, 1);
				this.setSize(5, 6);
				this.setDirection(0, 360);
				this.setSizeSpeed(-0.1, -0.1);
				this.setAngleSpeed(-5, 5);
				this.setAlpha(1, 1);
				this.setColor(C.white);
				this.setLife(500, 1000);
				this.setShape(Shape.star);
				this.setGravity(-0.05, -0.05);
				break;
			case 'bigsparkle':
				this.setSpeed(0.5, 0.5);
				this.setSize(10, 20);
				this.setDirection(0, 360);
				this.setSizeSpeed(-0.1, -0.1);
				this.setAngleSpeed(0, 0);
				this.setAlpha(0.2, 0.2);
				this.setColor(C.purple);
				this.setLife(40000, 40000);
				this.setShape(Shape.star);
				this.setGravity(-0.1, -0.1);
				break;
			default: break;
		}
	}
	this.emit = function(n) {
		for (let i = 0; i < n; i++) {
			const len = Math.range(this.spd.min, this.spd.max);
			const dir = Math.range(this.d.min, this.d.max);
			const p = new BranthParticle(
				this.key,
				Math.range(this.x.min, this.x.max),
				Math.range(this.y.min, this.y.max),
				Math.lendirx(len, dir),
				Math.lendiry(len, dir),
				Math.range(this.r.min, this.r.max),
				dir,
				Math.range(this.sspd.min, this.sspd.max),
				Math.range(this.dspd.min, this.dspd.max),
				Math.range(this.a.min, this.a.max),
				this.c,
				Math.range(this.life.min, this.life.max),
				this.shape,
				Math.range(this.grav.min, this.grav.max)
			);
			OBJ.add(this.key, p);
		}
	}
}

function BranthAudioSource(name) {
	const a = document.createElement('audio');
	const s1 = document.createElement('source');
	const s2 = document.createElement('source');
	s1.src = name + '.ogg';
	s2.src = name + '.mp3';
	s1.type = 'audio/ogg';
	s2.type = 'audio/mpeg';
	a.appendChild(s1);
	a.appendChild(s2);
	return a;
}

function BranthAudio(k) {
	this.k = k;
	this.s = [];
	this.setS = function() {
		for (let i = 0; i < this.k.length; i++) {
			this.s.push(new BranthAudioSource('audios/' + this.k[i]));
		}
	}
	this.getIndex = function(k) {
		for (let i = 0; i < this.k.length; i++) {
			if (k === this.k[i]) {
				return i;
			}
		}
		return -1;
	}
	this.isPlaying = function(k) {
		if (k != null) {
			const i = this.getIndex(k);
			const s = this.s[i];
			if (s != null) {
				if (s.currentTime > 0 && !s.paused) {
					return true;
				}
			}
		}
		return false;
	}
	this.play = function(k) {
		if (k != null) {
			const i = this.getIndex(k);
			const s = this.s[i];
			if (s != null) {
				s.pause();
				s.currentTime = 0;
				s.play();
			}
		}
	}
	this.loop = function(k) {
		if (k != null) {
			const i = this.getIndex(k);
			const s = this.s[i];
			if (s != null) {
				s.loop = true;
				this.play(k);
			}
		}
	}
	this.stop = function(k) {
		if (k != null) {
			const i = this.getIndex(k);
			const s = this.s[i];
			if (s != null) {
				s.pause();
				s.currentTime = 0;
				s.loop = false;
			}
		}
	}
	this.setS();
}

const BranthRequestAnimationFrame = window.requestAnimationFrame
	|| window.msRequestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| function(f) { return setTimeout(f, 1000 / 60) }

const Time = new BranthTime();
const TicCanvas = D.q('.ticCanvas');
const Canv = new BranthCanvas(TicCanvas.clientWidth, TicCanvas.clientHeight);
const Draw = new BranthDraw(Canv.c.getContext('2d'));
const OBJ = new BranthObject(['bparticle', 'ticBoard', 'ticLine', 'hocPaddle', 'hocBall', 'hocWall', 'particle']);
const Emtr = new BranthEmitter('particle');
const Audi = new BranthAudio(['ticBgm', 'ticO', 'ticX', 'ticBell', 'hocHit']);
Audi.s[Audi.getIndex('ticBgm')].volume = 0.2;

function TicBoard(x, y) {
	this.x = 0;
	this.y = 0;
	this.point = {
		x: x,
		y: y
	}
	this.player = '';
	this.alarm = [];
	this.setPlayer = function(s) {
		this.player = s;
		if (this.player != '') {
			Audi.play('tic' + this.player);
			this.alarm[0] = TIC.player.animInterval;
		}
	}
	this.update = function() {
		this.x = TIC.board.startPosition.x + this.point.x * TIC.board.w;
		this.y = TIC.board.startPosition.y + this.point.y * TIC.board.h;
		this.render();
		this.alarmUpdate();
	}
	this.render = function() {
		Draw.setColor(C.ltpurple);
		Draw.setShadow(0, 0, 30, C.purple);
		Draw.lineWidth(TIC.board.lineWidth);
		Draw.rect(this.x, this.y, TIC.board.w, TIC.board.h, true);
		Draw.resetShadow();
		const pl = {
			x: this.x + TIC.board.mid.w,
			y: this.y + TIC.board.mid.h,
			w: TIC.board.mid.w * 0.7,
			pgs: 1 - (this.alarm[0] / TIC.player.animInterval) || 0,
			lineW: TIC.player.lineWidth
		}
		switch (this.player) {
			case 'O': Draw.ticO(pl.x, pl.y, pl.w, pl.pgs, pl.lineW); break;
			case 'X': Draw.ticX(pl.x, pl.y, pl.w, pl.pgs, pl.lineW); break;
			default: break;
		}
		if (this.alarm[0] != null) {
			if (this.alarm[0] > 0) {
				const ticOStartPos = 180 + Math.radtodeg(Math.PI / 4 * pl.pgs);
				let progressPosition = {
					x: pl.x + Math.lendirx(pl.w, ticOStartPos + 360 * pl.pgs),
					y: pl.y + Math.lendiry(pl.w, ticOStartPos + 360 * pl.pgs)
				};
				if (this.player === 'X') {
					const t = pl.pgs;
					const r = pl.w * 1.2;
					// First line
					if (t < 0.25) {
						progressPosition = {
							x: pl.x + Math.lendirx(r, 225) + Math.lendirx(r * 2 * Math.min(1, t * 4), 45),
							y: pl.y + Math.lendiry(r, 225) + Math.lendiry(r * 2 * Math.min(1, t * 4), 45)
						};
					}
					else {
						// Second line
						progressPosition = {
							x: pl.x + Math.lendirx(r, 135) + Math.lendirx(r * 2 * Math.clamp((t - 0.25) * 4, 0, 1), 315),
							y: pl.y + Math.lendiry(r, 135) + Math.lendiry(r * 2 * Math.clamp((t - 0.25) * 4, 0, 1), 315)
						};
					}
				}
				Emtr.preset('sparkle');
				Emtr.setSize(pl.lineW / 2, pl.lineW / 2);
				Emtr.setSizeSpeed(-pl.lineW / 20, -pl.lineW / 20);
				Emtr.setArea(
					progressPosition.x - pl.lineW * 0.75, progressPosition.x + pl.lineW * 0.75,
					progressPosition.y - pl.lineW * 0.75, progressPosition.y + pl.lineW * 0.75
				);
				if (this.player === 'X') {
					if (pl.pgs < 0.5) {
						Emtr.emit(1);
					}
				}
				else {
					Emtr.emit(1);
				}
				// Background particle
				Emtr.preset('bigsparkle');
				Emtr.setArea(0, Canv.w, 0, Canv.h);
				Emtr.setKey('bparticle');
				Emtr.emit(1);
				Emtr.resetKey();
			}
		}
	}
	this.alarmUpdate = function() {
		if (this.alarm != null) {
			for (let i = 0; i < this.alarm.length; i++) {
				if (this.alarm[i] != null) {
					if (this.alarm[i] > 0) {
						this.alarm[i] = Math.max(0, this.alarm[i] - Time.deltaTime);
					}
					else if (this.alarm[i] != -1) {
						switch (i) {
							case 0:
								// Reserved for player animation
								break;
							default: break;
						}
						if (this.alarm[i] <= 0) this.alarm[i] = -1;
					}
				}
			}
		}
	}
}

function TicLine() {
	this.match = {
		from: 0,
		to: 0,
		color: C.blue
	}
	this.pos = {
		x: 0,
		y: 0,
		dif: {
			x: 0,
			y: 0
		}
	}
	this.noMatch = true;
	this.alarm = [-1];
	this.setMatch = function(match, c) {
		this.match = match;
		this.match.color = c;
		const bdFrom = OBJ.take('ticBoard')[this.match.from];
		const bdTo = OBJ.take('ticBoard')[this.match.to];
		this.pos.x = bdFrom.x + TIC.board.mid.w;
		this.pos.y = bdFrom.y + TIC.board.mid.h;
		this.pos.dif.x = this.pos.x - (bdTo.x + TIC.board.mid.w);
		this.pos.dif.y = this.pos.y - (bdTo.y + TIC.board.mid.h);
		this.noMatch = false;
		this.alarm[0] = TIC.line.animInterval;
	}
	this.resetMatch = function() {
		this.noMatch = true;
	}
	this.update = function() {
		this.render();
		this.alarmUpdate();
	}
	this.render = function() {
		if (TIC.gameOver && !this.noMatch) {
			const bdFrom = OBJ.take('ticBoard')[this.match.from];
			const bdTo = OBJ.take('ticBoard')[this.match.to];
			const linePt = {
				from: {
					x: bdFrom.x + TIC.board.mid.w,
					y: bdFrom.y + TIC.board.mid.h
				},
				to: {
					x: this.pos.x - this.pos.dif.x * (1 - this.alarm[0] / TIC.line.animInterval),
					y: this.pos.y - this.pos.dif.y * (1 - this.alarm[0] / TIC.line.animInterval)
				}
			}
			const lw = TIC.player.lineWidth * 1.5;
			Draw.ticLineGlow(linePt.from.x, linePt.from.y, linePt.to.x, linePt.to.y, lw, this.match.color, Math.clamp(1 - this.alarm[0] / TIC.line.animInterval, 0, 1));
			if (this.alarm[0] > 0) {
				Emtr.preset('sparkle');
				Emtr.setSize(lw / 2, lw / 2);
				Emtr.setSizeSpeed(-lw / 20, -lw / 20);
				Emtr.setArea(linePt.to.x - lw, linePt.to.x + lw, linePt.to.y - lw, linePt.to.y + lw);
				Emtr.emit(1);
			}
		}
	}
	this.alarmUpdate = function() {
		if (this.alarm != null) {
			for (let i = 0; i < this.alarm.length; i++) {
				if (this.alarm[i] != null) {
					if (this.alarm[i] > 0) {
						this.alarm[i] = Math.max(0, this.alarm[i] - Time.deltaTime);
					}
					else if (this.alarm[i] != -1) {
						switch (i) {
							case 0:
								// Reserved for line animation
								break;
							default: break;
						}
						if (this.alarm[i] <= 0) this.alarm[i] = -1;
					}
				}
			}
		}
	}
}

function HocPaddle(x, y, r, c) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.c = c;
	this.to = {
		x: x,
		y: y
	}
	this.xp = x;
	this.yp = y;
	this.bound = {
		l: x - r,
		r: x + r,
		t: y - r,
		b: y + r
	}
	this.isAI = (World.mode === 'Computer' && c === C.red);
	this.alarm = [-1, -1];
	this.isPlayingSoundHit = false;
	this.setTarget = function(x, y) {
		this.to.x = Math.clamp(x, HOC.paddle.r + HOC.paddle.lineWidth, Canv.w - HOC.paddle.r - HOC.paddle.lineWidth);
		if (this.c === C.red) {
			this.to.y = Math.clamp(y, HOC.paddle.r + HOC.paddle.lineWidth, Canv.mid.h);
		}
		else {
			this.to.y = Math.clamp(y, Canv.mid.h, Canv.h - HOC.paddle.r - HOC.paddle.lineWidth);
		}
	}
	this.boundUpdate = function() {
		const newR = this.r + HOC.paddle.lineWidth / 2;
		this.bound.l = this.x - newR;
		this.bound.r = this.x + newR;
		this.bound.t = this.y - newR;
		this.bound.b = this.y + newR;
	}
	this.playSoundHit = function() {
		if (!this.isPlayingSoundHit) {
			Audi.play('hocHit');
			this.isPlayingSoundHit = true;
			this.alarm[1] = 60;
		}
	}
	this.update = function() {
		this.r = HOC.paddle.r;
		if (this.isAI && !HOC.gameOver) {
			this.setTarget(OBJ.take('hocBall')[0].x, this.to.y);
		}
		this.xp = this.x;
		this.yp = this.y;
		const spd = 0.25 * (this.isAI? 0.5 : 1);
		this.x -= (this.x - this.to.x) * spd;
		this.y -= (this.y - this.to.y) * spd;
		this.boundUpdate();
		this.render();
		this.alarmUpdate();
	}
	this.render = function() {
		Draw.hocPaddle(this.x, this.y, this.r, this.c, HOC.paddle.lineWidth);
		// Debug bound
		/*
		Draw.setColor(C.yellow);
		Draw.circle(this.bound.l, this.y, 5, false);
		Draw.circle(this.bound.r, this.y, 5, false);
		Draw.circle(this.x, this.bound.t, 5, false);
		Draw.circle(this.x, this.bound.b, 5, false);
		*/
	}
	this.alarmUpdate = function() {
		if (this.alarm != null) {
			for (let i = 0; i < this.alarm.length; i++) {
				if (this.alarm[i] != null) {
					if (this.alarm[i] > 0) {
						this.alarm[i] = Math.max(0, this.alarm[i] - Time.deltaTime);
					}
					else if (this.alarm[i] != -1) {
						switch (i) {
							case 0:
								// Reserved for AI y move interval
								if (World.mode === 'Computer') {
									if (HOC.gameOver) {
										this.setTarget(Math.range(0, Canv.w), Math.range(0, Canv.mid.h));
									}
									else {
										this.to.y = Math.range(0, Canv.mid.h);
									}
									this.alarm[0] = Math.range(500, 1000);
								}
								break;
							case 1:
								this.isPlayingSoundHit = false;
								break;
							default: break;
						}
						if (this.alarm[i] <= 0) this.alarm[i] = -1;
					}
				}
			}
		}
	}
	if (this.isAI) {
		this.alarm[0] = Math.range(500, 1000);
	}
}

function HocBall(x, y, r, c) {
	this.active = true;
	this.x = x;
	this.y = y;
	this.r = r;
	this.c = c;
	this.dx = 0;
	this.dy = 0;
	this.xp = x;
	this.yp = y;
	this.drawPos = {
		x: x,
		y: y
	}
	this.bound = {
		l: x - r,
		r: x + r,
		t: y - r,
		b: y + r
	}
	this.alarm = [-1, -1];
	this.isPlayingSoundHit = false;
	this.reset = function() {
		this.x = Canv.mid.w;
		this.y = Canv.mid.h;
		this.dx = 0;
		this.dy = 0;
		this.active = false;
		if (!HOC.gameOver) {
			this.alarm[0] = HOC.ball.resetInterval;
		}
		Audi.play('ticBell');
	}
	this.spark = function(x, y, dmin, dmax) {
		// Spark preset
		Emtr.setSpeed(Canv.w / 300, Canv.w / 400);
		Emtr.setSize(Canv.w / 40, Canv.w / 60);
		Emtr.setDirection(dmin + 20, dmax - 20);
		Emtr.setSizeSpeed(-Canv.w / 600, -Canv.w / 800);
		Emtr.setAngleSpeed(-20, 20);
		Emtr.setAlpha(0.5, 0.7);
		Emtr.setColor(C.white);
		Emtr.setLife(500, 1000);
		Emtr.setShape(Shape.star);
		Emtr.setGravity(0, 0);
		Emtr.setArea(x, x, y, y);
		Emtr.emit(10);
	}
	this.confetti = function(x, y, dmin, dmax) {
		// Confetti preset
		Emtr.setSpeed(Canv.w / 60, Canv.w / 80);
		Emtr.setSize(Canv.w / 40, Canv.w / 60);
		Emtr.setDirection(dmin + 40, dmax - 40);
		Emtr.setSizeSpeed(-Canv.w / 4000, -Canv.w / 6000);
		Emtr.setAngleSpeed(0, 0);
		Emtr.setAlpha(1, 1);
		Emtr.setColor(C.white);
		Emtr.setLife(500, 1000);
		Emtr.setShape(Shape.star);
		let grav = Canv.w / 4000;
		if (y < Canv.mid.h) grav = -grav;
		Emtr.setGravity(grav, grav);
		Emtr.setArea(x, x, y, y);
		Emtr.emit(20);
	}
	this.playSoundHit = function() {
		if (!this.isPlayingSoundHit) {
			Audi.play('hocHit');
			this.isPlayingSoundHit = true;
			this.alarm[1] = 60;
		}
	}
	this.boundUpdate = function() {
		this.bound.l = this.x - this.r;
		this.bound.r = this.x + this.r;
		this.bound.t = this.y - this.r;
		this.bound.b = this.y + this.r;
	}
	this.wallCollision = function() {
		const wallWidth = HOC.paddle.lineWidth / 2;
		// Side wall check
		if (this.bound.l <= wallWidth) {
			if (this.dx < 0) {
				this.x = this.xp;
				this.dx = -this.dx;
				this.spark(this.bound.l + 5, this.y, 180, 360);
				this.playSoundHit();
			}
		}
		if (this.bound.r >= Canv.w - wallWidth) {
			if (this.dx > 0) {
				this.x = this.xp;
				this.dx = -this.dx;
				this.spark(this.bound.r - 5, this.y, 0, 180);
				this.playSoundHit();
			}
		}
		// Goal wall check
		if (this.bound.t <= wallWidth || this.bound.b >= Canv.h - wallWidth) {
			// Is coming
			if (this.y < Canv.mid.h) {
				if (this.dy >= 0) {
					return;
				}
			}
			else {
				if (this.dy <= 0) {
					return;
				}
			}
			// Not in goal range check
			if (!(this.bound.l > Canv.mid.w - (Canv.mid.h / 4 + 20)
			 && this.bound.r < Canv.mid.w + (Canv.mid.h / 4 + 20))) {
				this.y = this.yp;
				this.dy = -this.dy;
				if (this.y < Canv.mid.h) {
					this.spark(this.x, this.bound.t + 5, -90, 90);
				}
				else {
					this.spark(this.x, this.bound.b - 5, 90, 270);
				}
				this.playSoundHit();
			}
		}
	}
	this.paddleCollision = function() {
		for (let i = 0; i < OBJ.take('hocPaddle').length; i++) {
			const p = OBJ.take('hocPaddle')[i];
			if (this.bound.l <= p.bound.r && this.bound.r >= p.bound.l
			 && this.bound.t <= p.bound.b && this.bound.b >= p.bound.t) {
			 	let sparkPos = {
			 		x: 0,
			 		y: 0
			 	}
			 	if (this.x < p.xp) {
			 		if (this.y < p.yp) {
			 			while (this.x >= p.bound.l && this.y >= p.bound.t) {
			 				this.x--;
			 				this.y--;
			 			}
			 			sparkPos.x = this.bound.r;
			 			sparkPos.y = this.bound.b;
			 		}
			 		else {
			 			while (this.x >= p.bound.l && this.y <= p.bound.b) {
			 				this.x--;
			 				this.y++;
			 			}
			 			sparkPos.x = this.bound.r;
			 			sparkPos.y = this.bound.t;
			 		}
			 	}
			 	else {
			 		if (this.y < p.yp) {
			 			while (this.x >= p.bound.l && this.y >= p.bound.t) {
			 				this.x++;
			 				this.y--;
			 			}
			 			sparkPos.x = this.bound.l;
			 			sparkPos.y = this.bound.b;
			 		}
			 		else {
			 			while (this.x >= p.bound.l && this.y <= p.bound.b) {
			 				this.x++;
			 				this.y++;
			 			}
			 			sparkPos.x = this.bound.l;
			 			sparkPos.y = this.bound.t;
			 		}
			 	}
				this.dx = (this.x - p.xp) * HOC.ball.spd * Math.range(0.9, 1.05);
				this.dy = (this.y - p.yp) * HOC.ball.spd * Math.range(0.9, 1.05);
				if (!p.isPlayingSoundHit) {
					this.spark(sparkPos.x, sparkPos.y, 0, 360);
				}
				p.playSoundHit();
			}
		}
	}
	this.goalUpdate = function() {
		if (this.bound.t > Canv.h || this.bound.b < 0) {
			if (this.y < Canv.mid.h) {
				HOC.score[1]++;
				HOC.gameOverCheck();
				this.confetti(Canv.mid.w, 0, -90, 90);
			}
			else {
				HOC.score[0]++;
				HOC.gameOverCheck();
				this.confetti(Canv.mid.w, Canv.h, 90, 270);
			}
			this.reset();
		}
	}
	this.update = function() {
		if (this.active) {
			this.xp = this.x;
			this.yp = this.y;
			this.x += this.dx;
			this.y += this.dy;
			this.boundUpdate();
			this.wallCollision();
			this.paddleCollision();
			this.goalUpdate();
		}
		if (!HOC.gameOver) {
			this.render();
		}
		this.alarmUpdate();
	}
	this.render = function() {
		const sc = Math.clamp(this.alarm[0] / HOC.ball.resetInterval, 0, 1);
		Draw.setAlpha(Math.clamp(1 - sc, 0, 1));
		this.drawPos.x -= (this.drawPos.x - this.x) * 0.5;
		this.drawPos.y -= (this.drawPos.y - this.y) * 0.5;
		Draw.hocBall(this.drawPos.x, this.drawPos.y, this.r * (1 + 1 * sc), this.c);
		Draw.setAlpha(1);
	}
	this.alarmUpdate = function() {
		if (this.alarm != null) {
			for (let i = 0; i < this.alarm.length; i++) {
				if (this.alarm[i] != null) {
					if (this.alarm[i] > 0) {
						this.alarm[i] = Math.max(0, this.alarm[i] - Time.deltaTime);
					}
					else if (this.alarm[i] != -1) {
						switch (i) {
							case 0:
								// Reserved for reset animation
								this.active = true;
								break;
							case 1:
								this.isPlayingSoundHit = false;
								break;
							default: break;
						}
						if (this.alarm[i] <= 0) this.alarm[i] = -1;
					}
				}
			}
		}
	}
}

function HocWall(type, i, j) {
	this.update = function() {
		this.render();
	}
	this.render = function() {
		const goalWall = {
			x1: 10 + (-10 + Canv.w - 10) * i,
			y1: 10 + (-10 + Canv.h - 10) * j,
			x2: Canv.mid.w - (Canv.mid.h / 4 + 10) * (1 - 2 * i),
			y2: 10 + (-10 + Canv.h - 10) * j,
			c: j > 0? C.blue : C.red
		}
		const sideWall = {
			x1: 10 + (-10 + Canv.w - 10) * i,
			y1: 20 + (-20 + Canv.h - 20) * j,
			x2: 10 + (-10 + Canv.w - 10) * i,
			y2: Canv.mid.h - 5 * (1 - 2 * j),
			c: j > 0? C.blue : C.red
		}
		const p = (type === 'goal'? goalWall : sideWall);
		Draw.hocWall(p.x1, p.y1, p.x2, p.y2, p.c, HOC.paddle.lineWidth / 2);
	}
}

const World = {
	scene: 'TIC',
	mode: 'Computer',
	font: {
		s: 16,
		m: 24,
		l: 32
	},
	se: true,
	changeScene: function(s) {
		this.scene = s;
		switch (this.scene) {
			case 'TIC': OBJ.clearAll(); TIC.start(); break;
			case 'HOC': OBJ.clearAll(); HOC.start(); break;
			default: break;
		}
		if (!TicHeaderReset.classList.contains('disabled')) {
			TicHeaderReset.classList.toggle('disabled');
		}
		if (!Audi.isPlaying('ticBgm')) {
			Audi.loop('ticBgm');
		}
	},
	changeMode: function(s) {
		this.mode = s;
		this.changeScene(this.scene);
	},
	update: function() {
		switch (this.scene) {
			case 'TIC': TIC.update(); break;
			case 'HOC': HOC.update(); break;
			default: break;
		}
	}
}

const TIC = {
	gameOver: false,
	score: [0, 0],
	board: {
		startPosition: {
			x: 0,
			y: 0
		},
		w: 32,
		h: 32,
		mid: {
			w: 16,
			h: 16
		},
		lineWidth: 5
	},
	player: {
		lineWidth: 5,
		animInterval: 700
	},
	line: {
		animInterval: 500
	},
	turn: 0, // 0 = PLAYER, 1 = Opponent
	turnInterval: 1000,
	alarm: [-1],
	UI: {
		turnT: 0.5,
	},
	checkMatch: function() {
		// Convert to ' ', 'O', or 'X' for easier debug
		let convertedBoard = [];
		for (let i = 0; i < OBJ.take('ticBoard').length; i++) {
			const bd = OBJ.take('ticBoard')[i];
			convertedBoard.push(bd.player || '-');
		}
		// Initialize
		let theWinner = '';
		let matchLine = {
			from: 0,
			to: 0
		}
		// Brute force!
		const cb = convertedBoard;
		// Debug
		/*
		console.log(`${cb[0]} | ${cb[1]} | ${cb[2]}`);
		console.log(`${cb[3]} | ${cb[4]} | ${cb[5]}`);
		console.log(`${cb[6]} | ${cb[7]} | ${cb[8]}`);
		*/
		// Match to check: 3 Rows, 3 Columns, 2 Diagonals
		const rowCheck = (i) => (cb[i] != '-' && cb[i] === cb[i + 1] && cb[i] === cb[i + 2]);
		const columnCheck = (i) => (cb[i] != '-' && cb[i] === cb[i + 3] && cb[i] === cb[i + 6]);
		const diagonalCheck = (i1, i2, i3) => (cb[i1] != '-' && cb[i1] === cb[i2] && cb[i1] === cb[i3]);
		// Diagonal check
		if (diagonalCheck(0, 4, 8)) {
			theWinner = cb[0];
			matchLine.from = 0;
			matchLine.to = 8;
		}
		else if (diagonalCheck(2, 4, 6)) {
			theWinner = cb[2];
			matchLine.from = 2;
			matchLine.to = 6;
		}
		// Row check
		else if (rowCheck(0)) {
			theWinner = cb[0];
			matchLine.from = 0;
			matchLine.to = 2;
		}
		else if (rowCheck(3)) {
			theWinner = cb[3];
			matchLine.from = 3;
			matchLine.to = 5;
		}
		else if (rowCheck(6)) {
			theWinner = cb[6];
			matchLine.from = 6;
			matchLine.to = 8;
		}
		// Column check
		else if (columnCheck(0)) {
			theWinner = cb[0];
			matchLine.from = 0;
			matchLine.to = 6;
		}
		else if (columnCheck(1)) {
			theWinner = cb[1];
			matchLine.from = 1;
			matchLine.to = 7;
		}
		else if (columnCheck(2)) {
			theWinner = cb[2];
			matchLine.from = 2;
			matchLine.to = 8;
		}
		// Brute force done.
		if (theWinner != '') {
			let matchColor = C.blue;
			switch (theWinner) {
				case 'O': this.score[0]++; break;
				case 'X': this.score[1]++; matchColor = C.red; break;
				default: break;
			}
			OBJ.take('ticLine')[0].setMatch(matchLine, matchColor);
			return true;
		}
		return !cb.includes('-');
	},
	setTurn: function(n) {
		if (!this.gameOver) {
			this.turn = n;
			if (this.checkMatch()) {
				this.gameOver = true;
				TicHeaderReset.classList.toggle('disabled');
				Audi.play('ticBell');
			}
			else {
				if (World.mode === 'Computer') {
					if (this.turn === 1) {
						this.alarm[0] = this.turnInterval;
					}
				}
			}
		}
	},
	reset: function() {
		// Reset everything except score
		for (let i = 0; i < OBJ.take('ticBoard').length; i++) {
			OBJ.take('ticBoard')[i].setPlayer('');
		}
		this.gameOver = false;
		this.turn = 0;
		this.UI.turnT = Math.max(0.5, this.UI.turnT);
		OBJ.take('ticLine')[0].resetMatch();
		Audi.play('ticBell');
	},
	start: function() {
		for (let i = 0; i < 9; i++) {
			OBJ.add('ticBoard', new TicBoard(i % 3, Math.floor(i / 3)));
		}
		OBJ.add('ticLine', new TicLine());
		this.gameOver = false;
		this.score = [0, 0];
		this.turn = 0;
		this.UI.turnT = 0.5;
		Audi.play('ticBell');
	},
	update: function() {
		this.board.startPosition.x = Canv.w * 0.05;
		this.board.w = Canv.w * 0.3;
		this.board.h = this.board.w;
		this.board.mid.w = this.board.w / 2;
		this.board.mid.h = this.board.h / 2;
		this.board.startPosition.y = Canv.mid.h - this.board.h * 1.5;
		this.board.lineWidth = this.board.w / 50;
		this.player.lineWidth = this.board.w / 10;
		this.render();
		this.alarmUpdate();
	},
	render: function() {
		const grad = Draw.ctx.createRadialGradient(Canv.mid.w, Canv.mid.h, Canv.mid.w, Canv.mid.w, Canv.mid.h, Canv.mid.w * 2);
		grad.addColorStop(0, C.dkblue);
		grad.addColorStop(1, C.black);
		Draw.setColor(grad);
		Draw.rect(0, 0, Canv.w, Canv.h, false);
	},
	UIRender: function() {
		const header = {
			y: 0,
			h: TIC.board.startPosition.y,
			mid: {
				y: TIC.board.startPosition.y / 2
			},
			end: {
				y: TIC.board.startPosition.y
			}
		}
		const playerRep = {
			y: header.mid.y - header.h * 0.15,
			w: header.h * 0.15
		}

		// Draw player representative
		Draw.ticO(Canv.w * 0.2, playerRep.y, playerRep.w, 1, this.player.lineWidth / 2);
		Draw.ticX(Canv.w * 0.8, playerRep.y, playerRep.w, 1, this.player.lineWidth / 2);

		// Draw whose turn indicator
		this.UI.turnT -= (this.UI.turnT - this.turn) * 0.15;
		const t = this.UI.turnT;
		const turnColor = 'rgb(' + (255 * t) + ', 0, ' + (255 * (1 - t)) + ')';
		Draw.setShadow(0, 0, 30, turnColor);
		Draw.beginPath();
		Draw.moveTo(Canv.w * (0.2 + 0.6 * t) - playerRep.w, header.mid.y + header.h * 0.15);
		Draw.lineTo(Canv.w * (0.2 + 0.6 * t) + playerRep.w, header.mid.y + header.h * 0.15);
		Draw.lineCap(Cap.round);
		Draw.setColor(turnColor);
		Draw.lineWidth(this.player.lineWidth / 2);
		Draw.stroke();
		Draw.setColor(C.white);
		Draw.lineWidth(this.player.lineWidth / 3);
		Draw.stroke();
		Draw.lineCap(Cap.butt);
		Draw.resetShadow();

		// Draw score text
		Draw.setColor(C.white);
		Draw.setHVAlign(Align.c, Align.m);
		Draw.font(Canv.w / 10 + 'px');
		Draw.setShadow(0, 0, 20, C.blue);
		Draw.text(Canv.mid.w, header.mid.y, this.score[0] + ' - ' + this.score[1]);
		Draw.setShadow(0, 3, 0, C.black);
		Draw.text(Canv.mid.w, header.mid.y, this.score[0] + ' - ' + this.score[1]);
		Draw.resetShadow();

		// Draw reset text
		if (this.gameOver) {
			const tLine = OBJ.take('ticLine')[0];
			let goTxt = "It's a draw!";
			if (!tLine.noMatch) {
				if (tLine.match.color === C.blue) {
					goTxt = (World.mode === 'Friend'? 'Player 1 win!' : 'You win!');
				}
				else if (tLine.match.color === C.red) {
					goTxt = (World.mode === 'Friend'? 'Player 2 win!' : 'Computer win!')
				}
			}
			Draw.setColor(C.white);
			Draw.setHVAlign(Align.c, Align.m);
			Draw.font(Canv.w / 10 + 'px');
			Draw.setShadow(0, 0, 20, C.blue);
			Draw.text(Canv.mid.w, Canv.h - header.mid.y, goTxt);
			Draw.setShadow(0, 3, 0, C.black);
			Draw.text(Canv.mid.w, Canv.h - header.mid.y, goTxt);
			Draw.resetShadow();
		}
	},
	alarmUpdate: function() {
		if (this.alarm != null) {
			for (let i = 0; i < this.alarm.length; i++) {
				if (this.alarm[i] != null) {
					if (this.alarm[i] > 0) {
						this.alarm[i] = Math.max(0, this.alarm[i] - Time.deltaTime);
					}
					else if (this.alarm[i] != -1) {
						switch (i) {
							case 0:
								// Computer action
								if (!this.gameOver) {
									bestMove();
								}
								break;
							default: break;
						}
						if (this.alarm[i] <= 0) this.alarm[i] = -1;
					}
				}
			}
		}
	}
}

const eq=(e,t,l)=>e==t&&t==l&&""!==e,cw=()=>{let e=null;let t=OBJ.take("ticBoard").map(e=>e.player);for(let l=0;l<3;++l){const a=3*l;eq(t[a],t[a+1],t[a+2])&&(e=t[a]),eq(t[l],t[l+3],t[l+6])&&(e=t[l])}(eq(t[0],t[4],t[8])||eq(t[2],t[4],t[6]))&&(e=t[4]);let l=t.filter(e=>""==e);return null==e&&0==l.length&&(e="tie"),e},bestMove=()=>{let e=-1,t=-1/0;let l=OBJ.take("ticBoard");for(let a=0;a<9;a++)if(""==l[a].player){l[a].player="X";let r=mm(l,0,!1);l[a].player="",r>t&&(t=r,e=a)}l[e].setPlayer("X"),TIC.setTurn(0)};function mm(e,t,l){let a=cw();if(null!==a)return{X:10,O:-10,tie:0}[a];if(l){let e=-1/0;const l=OBJ.take("ticBoard");for(let a=0;a<9;a++)if(""==l[a].player){l[a].player="X";let r=mm(l,t+1,!1);l[a].player="",e=Math.max(r,e)}return e}{let e=1/0;let l=OBJ.take("ticBoard");for(let a=0;a<9;a++)if(""==l[a].player){l[a].player="O";let r=mm(l,t+1,!0);l[a].player="",e=Math.min(r,e)}return e}}

const HOC = {
	gameOver: false,
	score: [0, 0],
	scoreToWin: 7,
	ball: {
		r: 16,
		c: C.yellow,
		spd: 0.2,
		resetInterval: 1000
	},
	paddle: {
		r: 24,
		lineWidth: 5
	},
	player: {
		setTarget: function(x, y) {
			const p = OBJ.take('hocPaddle')[1];
			if (p != null) {
				p.setTarget(x, y);
			}
		}
	},
	player2: {
		setTarget: function(x, y) {
			const p = OBJ.take('hocPaddle')[0];
			if (p != null) {
				p.setTarget(x, y);
			}
		}
	},
	reset: function() {
		// HOC have no reset
	},
	gameOverCheck: function() {
		if (this.score[0] >= this.scoreToWin) {
			this.gameOver = true;
		}
		else if (this.score[1] >= this.scoreToWin) {
			this.gameOver = true;
		}
	},
	start: function() {
		this.gameOver = false;
		this.score = [0, 0];
		OBJ.add('hocBall', new HocBall(Canv.mid.w, Canv.mid.h, this.ball.r, this.ball.c));
		OBJ.add('hocPaddle', new HocPaddle(Canv.mid.w, Canv.mid.h / 4 + this.paddle.r * 1.5, this.paddle.r, C.red));
		OBJ.add('hocPaddle', new HocPaddle(Canv.mid.w, Canv.h - Canv.mid.h / 4 - this.paddle.r * 1.5, this.paddle.r, C.blue));
		for (let i = 0; i < 2; i++) {
			for (let j = 0; j < 2; j++) {
				const w1 = OBJ.add('hocWall', new HocWall('goal', i, j));
				const w2 = OBJ.add('hocWall', new HocWall('side', i, j));
			}
		}
		OBJ.take('hocBall')[0].reset();
	},
	update: function() {
		this.paddle.r = Canv.w / 20;
		this.paddle.lineWidth = Canv.w / 20;
		this.render();
	},
	render: function() {
		const grad = Draw.ctx.createRadialGradient(Canv.mid.w, Canv.mid.h, Canv.mid.w, Canv.mid.w, Canv.mid.h, Canv.mid.w * 2);
		grad.addColorStop(0, C.black);
		grad.addColorStop(1, C.dkblue);
		Draw.setColor(grad);
		Draw.rect(0, 0, Canv.w, Canv.h, false);
		Draw.lineWidth(Canv.w / 60);
		Draw.setAlpha(0.5);
		Draw.setColor(C.black);
		Draw.setShadow(0, 0, 10, C.white);
		// Top circle
		Draw.beginPath();
		Draw.arc(Canv.mid.w, 0, Canv.mid.h / 4, 0, 2 * Math.PI);
		Draw.closePath();
		Draw.stroke();
		// Bottom circle
		Draw.beginPath();
		Draw.arc(Canv.mid.w, Canv.h, Canv.mid.h / 4, 0, 2 * Math.PI);
		Draw.closePath();
		Draw.stroke();
		// Middle circle
		Draw.beginPath();
		Draw.moveTo(0, Canv.mid.h);
		Draw.lineTo(Canv.w, Canv.mid.h);
		Draw.arc(Canv.mid.w, Canv.mid.h, Canv.mid.h / 4, 0, 2 * Math.PI);
		Draw.closePath();
		Draw.stroke();
		Draw.resetShadow();
		Draw.setAlpha(1);
	},
	UIRender: function() {
		// Draw score text
		Draw.setColor(C.white);
		Draw.setHAlign(Align.r);
		Draw.font(Canv.w / 10 + 'px');
		Draw.setShadow(0, 0, 20, C.blue);
		Draw.setVAlign(Align.b);
		Draw.text(Canv.w - 30, Canv.mid.h - Canv.w / 20, this.score[0]);
		Draw.setVAlign(Align.m);
		Draw.text(Canv.w - 30, Canv.mid.h, '-');
		Draw.setVAlign(Align.t);
		Draw.text(Canv.w - 30, Canv.mid.h + Canv.w / 20, this.score[1]);
		Draw.setShadow(0, 3, 0, C.black);
		Draw.setVAlign(Align.b);
		Draw.text(Canv.w - 30, Canv.mid.h - Canv.w / 20, this.score[0]);
		Draw.setVAlign(Align.m);
		Draw.text(Canv.w - 30, Canv.mid.h, '-');
		Draw.setVAlign(Align.t);
		Draw.text(Canv.w - 30, Canv.mid.h + Canv.w / 20, this.score[1]);
		Draw.resetShadow();
		// Draw reset text
		if (this.gameOver) {
			const goTxt = {
				y: (this.score[0] > this.score[1]? Canv.h * 0.25 : (this.score[0] < this.score[1]? Canv.h * 0.75 : Canv.h * 0.5)),
				txt: (this.score[0] > this.score[1]? (World.mode === 'Friend'? 'Player 2 win!' : 'Computer win!') : (this.score[0] < this.score[1]? (World.mode === 'Friend'? 'Player 1 win!' : 'You win!') : "It's a draw!"))
			}
			Draw.setColor(C.white);
			Draw.setHVAlign(Align.c, Align.m);
			Draw.font(Canv.w / 10 + 'px');
			Draw.setShadow(0, 0, 20, C.blue);
			Draw.text(Canv.mid.w, goTxt.y, goTxt.txt);
			Draw.setShadow(0, 3, 0, C.black);
			Draw.text(Canv.mid.w, goTxt.y, goTxt.txt);
			Draw.resetShadow();
		}
	}
}

const UI = {
	update: function() {
		switch (World.scene) {
			case 'TIC': TIC.UIRender(); break;
			case 'HOC': HOC.UIRender(); break;
			default: break;
		}
	}
}

const Game = {
	start: function() {
		World.changeScene('TIC');
		this.update();
	},
	update: function(t) {
		Time.update(t);
		Draw.clearRect(0, 0, Canv.w, Canv.h);
		World.update();
		OBJ.update();
		UI.update();
		BranthRequestAnimationFrame(Game.update);
	}
}

const TicHeaderScene = D.q('.ticHeaderScene');
TicHeaderScene.onchange = function() {
	if (TicHeaderScene.value != World.scene) {
		World.changeScene(TicHeaderScene.value);
	}
}

const TicHeaderMode = D.q('.ticHeaderMode');
TicHeaderMode.onchange = function() {
	if (TicHeaderMode.value != World.mode) {
		World.changeMode(TicHeaderMode.value);
	}
}

// Header buttons
function IsActKey(e) {
	const actKey = [13, 32];
	return (actKey.includes(e.which) || actKey.includes(e.keyCode));
}

// Restart button
const TicHeaderRestart = D.q('.ticHeaderRestart');
function TicHeaderRestartClick() {
	World.changeScene(World.scene);
}
TicHeaderRestart.addEventListener('click', TicHeaderRestartClick);
TicHeaderRestart.addEventListener('keydown', (e) => { if (IsActKey(e)) TicHeaderRestartClick(); });

// Reset button
const TicHeaderReset = D.q('.ticHeaderReset');
function TicHeaderResetClick() {
	if (!TicHeaderReset.classList.contains('disabled')) {
		switch (World.scene) {
			case 'TIC': TIC.reset(); break;
			case 'HOC': HOC.reset(); break;
			default: break;
		}
		TicHeaderReset.classList.toggle('disabled');
	}
}
TicHeaderReset.addEventListener('click', TicHeaderResetClick);
TicHeaderReset.addEventListener('keydown', (e) => { if (IsActKey(e)) TicHeaderResetClick(); });

// BGM toggle
const TicHeaderBgm = D.q('.ticHeaderBgm');
function TicHeaderBgmClick() {
	TicHeaderBgm.classList.toggle('disabled');
	if (TicHeaderBgm.classList.contains('disabled')) {
		Audi.s[Audi.getIndex('ticBgm')].volume = 0;
	}
	else {
		Audi.s[Audi.getIndex('ticBgm')].volume = 0.2;
	}
}
TicHeaderBgm.addEventListener('click', TicHeaderBgmClick);
TicHeaderBgm.addEventListener('keydown', (e) => { if (IsActKey(e)) TicHeaderBgmClick(); });

// SE toggle
const TicHeaderSe = D.q('.ticHeaderSe');
function TicHeaderSeClick() {
	TicHeaderSe.classList.toggle('disabled');
	if (TicHeaderSe.classList.contains('disabled')) {
		Audi.s[Audi.getIndex('ticO')].volume = 0;
		Audi.s[Audi.getIndex('ticX')].volume = 0;
		Audi.s[Audi.getIndex('hocHit')].volume = 0;
		Audi.s[Audi.getIndex('ticBell')].volume = 0;
	}
	else {
		Audi.s[Audi.getIndex('ticO')].volume = 1;
		Audi.s[Audi.getIndex('ticX')].volume = 1;
		Audi.s[Audi.getIndex('hocHit')].volume = 1;
		Audi.s[Audi.getIndex('ticBell')].volume = 1;
	}
}
TicHeaderSe.addEventListener('click', TicHeaderSeClick);
TicHeaderSe.addEventListener('keydown', (e) => { if (IsActKey(e)) TicHeaderSeClick(); });

TicCanvas.addEventListener('click', (e) => {
	const m = {
		x: e.clientX - Canv.x,
		y: e.clientY - Canv.y
	}
	switch (World.scene) {
		case 'TIC':
			Emtr.preset('puff');
			Emtr.setSize(Canv.w / 80, Canv.w / 80);
			Emtr.setArea(m.x, m.x, m.y, m.y);
			Emtr.emit(5);
			if (!TIC.gameOver && (World.mode === 'Friend' || TIC.turn === 0)) {
				for (let i = 0; i < OBJ.take('ticBoard').length; i++) {
					const bd = OBJ.take('ticBoard')[i];
					if (m.x > bd.x && m.x < (bd.x + TIC.board.w)
					 && m.y > bd.y && m.y < (bd.y + TIC.board.h)) {
						if (bd.player === '') {
							if (TIC.turn === 0) {
								bd.setPlayer('O');
								TIC.setTurn(1);
							}
							else {
								bd.setPlayer('X');
								TIC.setTurn(0);
							}
						}
						break;
					}
				}
			}
			break;
		case 'HOC':
			break;
		default: break;
	}
});

function mouseMove(e) {
	const m = {
		x: e.clientX - Canv.x,
		y: e.clientY - Canv.y
	}
	switch (World.scene) {
		case 'HOC':
			HOC.player.setTarget(m.x, m.y);
			break;
		default: break;
	}
}

let hocPlayerTouchIndex = [-1, -1];

function touchStart(e) {
	switch (World.scene) {
		case 'HOC':
			const i = e.touches.length - 1;
			const m = {
				x: e.touches[i].clientX - Canv.x,
				y: e.touches[i].clientY - Canv.y
			}
			if (m.y > Canv.mid.h) {
				hocPlayerTouchIndex[0] = i;
				if (hocPlayerTouchIndex[1] === hocPlayerTouchIndex[0]) {
					hocPlayerTouchIndex[1] = -1;
				}
			}
			else {
				hocPlayerTouchIndex[1] = i;
				if (hocPlayerTouchIndex[0] === hocPlayerTouchIndex[1]) {
					hocPlayerTouchIndex[0] = -1;
				}
			}
			break;
		default: break;
	}
}

function touchMove(e) {
	switch (World.scene) {
		case 'HOC':
			if (e.touches[hocPlayerTouchIndex[0]] != undefined) {
				const m1 = {
					x: e.touches[hocPlayerTouchIndex[0]].clientX - Canv.x,
					y: e.touches[hocPlayerTouchIndex[0]].clientY - Canv.y
				}
				HOC.player.setTarget(m1.x, m1.y);
			}
			if (e.touches[hocPlayerTouchIndex[1]] != undefined) {
				const m2 = {
					x: e.touches[hocPlayerTouchIndex[1]].clientX - Canv.x,
					y: e.touches[hocPlayerTouchIndex[1]].clientY - Canv.y
				}
				HOC.player2.setTarget(m2.x, m2.y);
			}
			break;
		default: break;
	}
}

window.addEventListener('mousemove', mouseMove);
window.addEventListener('touchmove', touchMove);
window.addEventListener('touchstart', touchStart);

window.onresize = function() {
	Canv.setDimension(TicCanvas.clientWidth, TicCanvas.clientHeight);
}

window.onload = function() {
	TicCanvas.appendChild(Canv.c);
	Canv.setDimension(TicCanvas.clientWidth, TicCanvas.clientHeight);
	Game.start();
}