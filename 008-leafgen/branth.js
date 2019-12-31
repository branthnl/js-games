const FONT_FAMILY = 'Fresca, sans-serif';
const C = {
	red: '#f1334d',
	blue: '#68c2ff',
	gray: 'gray',
	black: 'black',
	white: 'white',
	ltgray: 'lightgray',
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

const KeyCode = {
	W: 87,
	S: 83,
	A: 65,
	D: 68,
	Up: 38,
	Down: 40,
	Left: 37,
	Right: 39,
	Space: 32,
	Enter: 13,
	U: 85,
	Escape: 27
}

Math.clamp = (a, b, c) => Math.min(c, Math.max(b, a));
Math.range = (min, max) => Math.random() * (max - min) + min;
Math.degtorad = (d) => d * Math.PI / 180;
Math.radtodeg = (r) => r * 180 / Math.PI;
Math.lendirx = (l, d) => l * Math.cos(Math.degtorad(d));
Math.lendiry = (l, d) => l * Math.sin(Math.degtorad(d));
Math.lendir = function(l, d) {
	return {
		x: Math.lendirx(l, d),
		y: Math.lendiry(l, d)
	}
}
Math.randomNegator = (n) => Math.range(0, 100) < (n || 50)? 1 : -1; // The higher n the more likely it gets to positive 1;

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

function BranthScene(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.def = {
		x: x,
		y: y
	}
	this.mid = {
		x: x + w / 2,
		y: y + h / 2,
		w: w / 2,
		h: h / 2
	}
	this.end = {
		x: x + w,
		y: y + h
	}
	this.alarm = [];
	this.shakeInterval = 0;
	this.shakeMagnitude = 0;
	this.shake = function(mag, int) {
		this.shakeInterval = int;
		this.shakeMagnitude = mag;
		this.alarm[0] = this.shakeInterval;
	}
	this.update = function() {
		this.mid.x = this.x + this.mid.w;
		this.mid.y = this.y + this.mid.h;
		this.end.x = this.x + this.w;
		this.end.y = this.y + this.h;
		if (this.alarm[0] > 0) {
			let intervalScale = this.alarm[0] / this.shakeInterval;
			this.x = this.shakeMagnitude * Math.randomNegator() * intervalScale;
			this.y = this.shakeMagnitude * Math.randomNegator() * intervalScale;
		}
		this.alarmUpdate();
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
								this.x = this.def.x;
								this.y = this.def.y;
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

function BranthKey(keyCode) {
	this.keyCode = keyCode;
	this.hold = false;
	this.pressed = false;
	this.released = false;
	this.triggerCount = 0;
	this.triggerCountThreshold = 2;
	this.up = function() {
		this.hold = false;
		this.released = true;
		this.triggerTime = 0;
	}
	this.down = function() {
		this.hold = true;
		this.pressed = true;
		this.triggerTime = 0;
	}
	this.update = function() {
		this.triggerTime++;
		if (this.triggerTime >= this.triggerCountThreshold) {
			this.pressed = false;
			this.released = false;
		}
	}
}

function BranthInput() {
	this.key = [];
	for (i in KeyCode) { // KeyCode is a const listing all keycodes
		this.key.push(new BranthKey(KeyCode[i]));
	}
	this.keyUp = function(keyCode) {
		for (k of this.key) {
			if (keyCode === k.keyCode) {
				if (k.released) {
					return true;
				}
			}
		}
		return false;
	}
	this.keyDown = function(keyCode) {
		for (k of this.key) {
			if (keyCode === k.keyCode) {
				if (k.pressed) {
					return true;
				}
			}
		}
		return false;
	}
	this.keyHold = function(keyCode) {
		for (k of this.key) {
			if (keyCode === k.keyCode) {
				if (k.hold) {
					return true;
				}
			}
		}
		return false;
	}
	this.up = function(e) {
		for (k of this.key) {
			if (e.which == k.keyCode || e.keyCode == k.keyCode) {
				k.up();
			}
		}
	}
	this.down = function(e) {
		for (k of this.key) {
			if (e.which == k.keyCode || e.keyCode == k.keyCode) {
				if (!k.hold) {
					k.down();
				}
			}
		}
	}
	this.update = function() {
		for (k of this.key) {
			k.update();
		}
	}
}

function BranthCanvas(w, h) {
	let c = document.createElement('canvas');
	c.width = w; c.height = h;
	return c;
}

function BranthDraw(ctx) {
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
	this.font = function(s) { // ex. '24px', 'bold 12px', 'italic 18px Comic Sans';
		ctx.font = `${s} ${FONT_FAMILY}`;
	}
	this.text = function(x, y, text) {
		ctx.fillText(text, x, y);
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
	this.moveTo = function(x, y) {
		ctx.moveTo(x, y);
	}
	this.lineTo = function(x, y) {
		ctx.lineTo(x, y);
	}
	this.draw = function(outline) {
		if (outline) {
			ctx.stroke();
		}
		else {
			ctx.fill();
		}
	}
	this.rect = function(x, y, w, h, outline) {
		ctx.beginPath();
		ctx.rect(x, y, w, h);
		ctx.closePath();
		this.draw(outline);
	}
	this.circle = function(x, y, r, outline) {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.closePath();
		this.draw(outline);
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
		this.draw(outline);
	}
	this.star = function(x, y, r, outline) {
		this.starTransformed(x, y, r, 0, outline);
	}
	this.starTransformed = function(x, y, r, d = 0, outline) {
		const lp = [ // Large part (polygon)
			Math.lendir(r, d + 270),
			Math.lendir(r, d + 342),
			Math.lendir(r, d + 54),
			Math.lendir(r, d + 126),
			Math.lendir(r, d + 198)
		];
		const sr = r * 0.5; // Small radius
		const sp = [ // Small part (polygon)
			Math.lendir(sr, d + 306),
			Math.lendir(sr, d + 18),
			Math.lendir(sr, d + 90),
			Math.lendir(sr, d + 162),
			Math.lendir(sr, d + 234)
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
		this.polyEnd(outline);
	}
	this.rectTransformed = function(x, y, w, h, d, outline) {
		const r = Math.hypot(w / 2, h / 2);
		const p = [
			Math.lendir(r, d + 225),
			Math.lendir(r, d + 315),
			Math.lendir(r, d + 45),
			Math.lendir(r, d + 135)
		];
		this.polyBegin(x + p[0].x, y + p[0].y);
		this.vertex(x + p[1].x, y + p[1].y);
		this.vertex(x + p[2].x, y + p[2].y);
		this.vertex(x + p[3].x, y + p[3].y);
		this.polyEnd(outline);
	}
	this.clearRect = function(x, y, w, h) {
		ctx.clearRect(x, y, w, h);
	}
}

function BranthObject(k) {
	this.k = k;
	this.o = [];
	for (i in this.k) {
		this.o.push([]);
	}
	this.getId = function(k) {
		for (i in this.k) {
			if (k == this.k[i]) {
				return +i;
			}
		}
		return -1;
	}
	this.add = function(k, o) {
		this.o[this.getId(k)].push(o);
	}
	this.take = function(k) {
		return this.o[this.getId(k)];
	}
	this.trash = function(k, j) {
		delete this.o[this.getId(k)][j];
	}
	this.clear = function(k) {
		this.o[this.getId(k)] = [];
	}
	this.clearAll = function() {
		for (let i = 0; i < this.o.length; i++) {
			this.o[i] = [];
		}
	}
	this.getNotNullLength = function(k) {
		const i = this.getId(k);
		let count = 0;
		for (j in this.o[i]) {
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

function BranthParticle(k, x, y, spd, spdinc, size, sizeinc, d, dinc, r, rinc, a, c, life, shape, grav) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.spd = spd;
	this.dx = Math.lendirx(spd, d);
	this.dy = Math.lendiry(spd, d);
	this.d = d;
	this.r = r;
	this.a = a;
	this.g = grav;
	this.i = OBJ.take(k).length;
	this.update = function() {
		this.a = Math.max(0, this.a - Time.deltaTime / life);
		if (this.a <= 0) {
			OBJ.trash(k, this.i);
		}
		this.x += this.dx;
		this.y += this.dy;
		this.size = Math.max(this.size + sizeinc, 0);
		this.spd += spdinc;
		this.dx = Math.lendirx(this.spd, this.d);
		this.g += grav;
		this.dy = Math.lendiry(this.spd, this.d) + Math.lendiry(this.g, 90); // 90 is downwards
		this.d += dinc;
		this.r += rinc;
		this.render();
	}
	this.render = function() {
		Draw.setAlpha(this.a);
		Draw.setColor(c);
		switch (shape) {
			case Shape.rect:
				Draw.rectTransformed(this.x, this.y, this.size, this.size, this.r);
				break;
			case Shape.star:
				Draw.starTransformed(this.x, this.y, this.size, this.r);
				break;
			case Shape.circle:
				Draw.circle(this.x, this.y, this.size);
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
	this.spdinc = {
		min: 0,
		max: 0
	}
	this.size = {
		min: 2,
		max: 8
	}
	this.sizeinc = {
		min: 0,
		max: 0
	}
	this.d = {
		min: 0,
		max: 360
	}
	this.dinc = {
		min: 5,
		max: 10
	}
	this.r = {
		min: 0,
		max: 360
	}
	this.rinc = {
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
	this.setSpeedInc = function(min, max) {
		this.spdinc.min = min;
		this.spdinc.max = max;
	}
	this.setSize = function(min, max) {
		this.size.min = min;
		this.size.max = max;
	}
	this.setSizeInc = function(min, max) {
		this.sizeinc.min = min;
		this.sizeinc.max = max;
	}
	this.setDirection = function(min, max) {
		this.d.min = min;
		this.d.max = max;
	}
	this.setDirectionInc = function(min, max) {
		this.dinc.min = min;
		this.dinc.max = max;
	}
	this.setRotation = function(min, max) {
		this.r.min = min;
		this.r.max = max;
	}
	this.setRotationInc = function(min, max) {
		this.rinc.min = min;
		this.rinc.max = max;
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
				this.setSpeedInc(0, 0);
				this.setSize(5, 10);
				this.setSizeInc(0, 0);
				this.setDirection(0, 360);
				this.setDirectionInc(0, 0);
				this.setRotation(0, 360);
				this.setRotationInc(0, 0);
				this.setAlpha(0.8, 1);
				this.setColor(C.white);
				this.setLife(250, 400);
				this.setShape(Shape.circle);
				this.setGravity(0, 0);
				break;
			case 'starpuff':
				this.setSpeed(4, 4);
				this.setSpeedInc(0.02, 0.02);
				this.setSize(8, 10);
				this.setSizeInc(-0.04, -0.04);
				this.setDirection(315, 315);
				this.setDirectionInc(-2, -2);
				this.setRotation(0, 0);
				this.setRotationInc(-5, -5);
				this.setAlpha(0.8, 1);
				this.setColor(C.yellow);
				this.setLife(4000, 4000);
				this.setShape(Shape.star);
				this.setGravity(0.08, 0.08);
				break;
			default: break;
		}
	}
	this.emit = function(n) {
		for (let i = 0; i < n; i++) {
			// BranthParticle(k, x, y, spd, spdinc, size, sizeinc, d, dinc, r, rinc, a, c, life, shape, grav)
			const p = new BranthParticle(
				this.key,
				Math.range(this.x.min, this.x.max),
				Math.range(this.y.min, this.y.max),
				Math.range(this.spd.min, this.spd.max),
				Math.range(this.spdinc.min, this.spdinc.max),
				Math.range(this.size.min, this.size.max),
				Math.range(this.sizeinc.min, this.sizeinc.max),
				Math.range(this.d.min, this.d.max),
				Math.range(this.dinc.min, this.dinc.max),
				Math.range(this.r.min, this.r.max),
				Math.range(this.rinc.min, this.rinc.max),
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

/* Objects goes here
*
*
*
* */

const BranthRequestAnimationFrame = window.requestAnimationFrame
	|| window.msRequestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| function(f) { return setTimeout(f, 1000 / 60) }

window.addEventListener('keyup', (e) => { Inpt.up(e); });
window.addEventListener('keydown', (e) => { Inpt.down(e); });

const World = {
	scene: {
		c: '',
		list: {
			menu: 'menu',
			game: 'game'
		},
		transition: {
			time: 0,
			alpha: 0,
			color: C.white,
			delay: 0,
			interval: 10
		},
		isTransitioning: false
	},
	startTransition: function() {
		this.scene.transition.time = 0;
		this.scene.transition.alpha = 1;
		this.scene.isTransitioning = true;
	},
	changeScene: function(s) {
		OBJ.clearAll();
		this.scene.c = s;
		this.start();
	},
	start: function() {
		switch (this.scene.c) {
			case this.scene.list['menu']:
				Emtr.preset('puff');
				Emtr.setArea(Room.x, Room.mid.x, Room.y, Room.end.y);
				Emtr.setColor(C.red);
				Emtr.emit(20);
				break;
			case this.scene.list['game']:
				Emtr.preset('puff');
				Emtr.setArea(Room.mid.x, Room.end.x, Room.y, Room.end.y);
				Emtr.setColor(C.blue);
				Emtr.emit(20);
				break;
			default:
				this.changeScene(this.scene.list['menu']);
				break;
		}
	},
	update: function() {
		if (this.scene.isTransitioning) {
			this.scene.transition.time += Time.deltaTime;
			if (this.scene.transition.time >= this.scene.transition.delay) {
				this.scene.transition.alpha = Math.clamp(this.scene.transition.alpha - (Time.deltaTime / this.scene.transition.interval), 0, 1);
			}
			if (this.scene.transition.alpha <= 0) {
				this.scene.isTransitioning = false;
			}
		}
		switch (this.scene.c) {
			case this.scene.list['menu']:
				if (!this.scene.isTransitioning) {
					Emtr.preset('starpuff');
					Emtr.setArea(Room.x, Room.end.x, Room.y, Room.end.y);
					Emtr.setColor(C.blue);
					if (Math.round(Time.time / 100) % 4 == 0) Emtr.emit(1);
					if (Inpt.keyDown(KeyCode.Enter)) {
						this.changeScene(this.scene.list['game']);
					}
				}
				break;
			case this.scene.list['game']:
				Emtr.preset('starpuff');
				Emtr.setArea(Room.x, Room.mid.x, Room.y, Room.end.y);
				Emtr.setColor(C.red);
				Emtr.emit(1);
				if (Inpt.keyDown(KeyCode.Escape)) {
					this.changeScene(this.scene.list['menu']);
				}
				break;
			default: break;
		}
	}
}

const Time = new BranthTime();
const Room = new BranthScene(0, 0, 640, 360);
const View = new BranthScene(0, 0, 640, 360);
const Inpt = new BranthInput();
const Canv = new BranthCanvas(View.w, View.h);
const Draw = new BranthDraw(Canv.getContext('2d'));
const OBJ = new BranthObject(['particle']);
const Emtr = new BranthEmitter('particle');

const UI = {
	update: function() {
		this.render();
	},
	render: function() {
		switch (World.scene.c) {
			case World.scene.list['menu']:
				Draw.setColor(C.white);
				Draw.text(32, 32, 'Menu');
				Draw.text(32, 48, 'enter');
				break;
			case World.scene.list['game']:
				Draw.setColor(C.white);
				Draw.text(32, 32, 'Game');
				Draw.text(32, 48, 'esc');
				break;
			default: break;
		}
		if (World.scene.isTransitioning) {
			Draw.setAlpha(World.scene.transition.alpha);
			Draw.setColor(World.scene.transition.color);
			Draw.rect(View.x, View.y, View.w, View.h);
			Draw.setAlpha(1);
		}
	}
}

const Game = {
	start: function() {
		World.startTransition();
		World.start();
		this.update();
	},
	update: function(t) {
		World.update();
		Time.update(t);
		Room.update();
		View.update();
		Inpt.update();
		Draw.clearRect(View.x, View.y, View.w, View.h);
		OBJ.update();
		UI.update();
		BranthRequestAnimationFrame(Game.update);
	}
}

window.onload = function() {
	body = document.querySelector('body');
	function preventScroll(e) {
		const keyCodes = [32, 37, 38, 39, 40];
		if (keyCodes.includes(e.keyCode)) {
			e.preventDefault();
		}
	}
	body.addEventListener('keydown', preventScroll, false);
	body.appendChild(Canv);
	Game.start();
}