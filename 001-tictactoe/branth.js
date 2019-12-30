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
	for (let key in KeyCode) {
		this.key.push(new BranthKey(KeyCode[key]));
	}
	this.keyUp = function(keyCode) {
		for (let i = 0; i < this.key.length; i++) {
			const k = this.key[i];
			if (keyCode === k.keyCode) {
				if (k.released) {
					return true;
				}
			}
		}
		return false;
	}
	this.keyDown = function(keyCode) {
		for (let i = 0; i < this.key.length; i++) {
			const k = this.key[i];
			if (keyCode === k.keyCode) {
				if (k.pressed) {
					return true;
				}
			}
		}
		return false;
	}
	this.keyHold = function(keyCode) {
		for (let i = 0; i < this.key.length; i++) {
			const k = this.key[i];
			if (keyCode === k.keyCode) {
				if (k.hold) {
					return true;
				}
			}
		}
		return false;
	}
	this.up = function(e) {
		for (let i = 0; i < this.key.length; i++) {
			const k = this.key[i];
			if (e.which == k.keyCode || e.keyCode == k.keyCode) {
				k.up();
			}
		}
	}
	this.down = function(e) {
		for (let i = 0; i < this.key.length; i++) {
			const k = this.key[i];
			if (e.which == k.keyCode || e.keyCode == k.keyCode) {
				if (!k.hold) k.down();
			}
		}
	}
	this.update = function() {
		for (let i = 0; i < this.key.length; i++) {
			this.key[i].update();
		}
	}
}

function BranthCanvas(w, h, c) {
	let cnv = document.createElement('canvas');
	cnv.width = w;
	cnv.height = h;
	cnv.style.backgroundColor = c;
	return cnv;
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
	this.setHValign = function(h, v) {
		this.setHalign(h);
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
	this.font = function(s) {
		ctx.font = s + ' Montserrat, sans-serif';
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
	this.rect = function(x, y, w, h) {
		ctx.fillRect(x, y, w, h);
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
		this.polyEnd();
	}
	this.clearRect = function(x, y, w, h) {
		ctx.clearRect(x, y, w, h);
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

function BranthParticle(k, x, y, dx, dy, r, d, dd, a, c, life, shape, grav) {
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
	this.setAngleSpeed = function(min, max) {
		this.dspd.min = min;
		this.dspd.max = max;
	}
	this.setAlpha = function(min, max) {
		this.a.min
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
				this.setAngleSpeed(-5, 5);
				this.setAlpha(0.5, 1);
				this.setColor(C.yellow);
				this.setLife(1000, 2000);
				this.setShape(Shape.star);
				this.setGravity(0.1, 0.1);
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
			delay: 500,
			interval: 1000
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
					Emtr.setArea(Room.mid.x, Room.end.x, Room.y, Room.end.y);
					Emtr.setColor(C.blue);
					Emtr.emit(1);
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
};

const Time = new BranthTime();
const Room = new BranthScene(0, 0, 640, 360);
const View = new BranthScene(0, 0, 640, 360);
const Inpt = new BranthInput();
const Canv = new BranthCanvas(View.w, View.h, C.black);
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