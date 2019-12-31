const C = {
	red: '#f1334d',
	blue: '#68c2ff',
	black: 'black',
	white: 'white'
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
	circle: 'circle'
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

Math.lengthDirX = function(l, d) {
	return -Math.sin(Math.degtorad(d)) * l;
}

Math.lengthDirY = function(l, d) {
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

function BranthMouse() {
	this.hold = false;
	this.pressed = false;
	this.released = false;
	this.holdTime = 0;
	this.triggerTime = 0;
	this.lastHoldTime = 0;
	this.confirmThreshold = 2000;
	this.startConfirmThreshold = 300;
	this.reachConfirmThreshold = false;
	this.up = function() {
		this.hold = false;
		this.released = true;
		this.lastHoldTime = this.holdTime;
		this.holdTime = 0;
		this.triggerTime = 0;
	}
	this.down = function() {
		this.hold = true;
		this.pressed = true;
		this.holdTime = 0;
		this.triggerTime = 0;
	}
	this.update = function(t) {
		if (this.hold) {
			this.holdTime += t.deltaTime;
		}
		if (this.triggerTime < t.fixedDeltaTime * 60) {
			this.triggerTime += t.deltaTime;
			if (this.pressed && this.triggerTime > t.deltaTime) {
				this.pressed = false;
			}
			if (this.released && this.triggerTime > t.deltaTime) {
				this.released = false;
			}
		}
		this.reachConfirmThreshold = this.holdTime >= this.confirmThreshold;
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
	}
	this.setHAlign = function(s) {
		ctx.textAlign = s;
	}
	this.setVAlign = function(s) {
		ctx.textBaseline = s;
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
	this.rect = function(x, y, w, h) {
		ctx.fillRect(x, y, w, h);
	}
	this.circle = function(x, y, r) {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
	this.clearRect = function(x, y, w, h) {
		ctx.clearRect(x, y, w, h);
	}
}

function AudioSource(urlWithoutExtension) {
	let a = document.createElement('audio');
	let s1 = document.createElement('source');
	let s2 = document.createElement('source');
	s1.src = urlWithoutExtension + '.ogg';
	s2.src = urlWithoutExtension + '.mp3';
	s1.type = 'audio/ogg';
	s2.type = 'audio/mpeg';
	a.appendChild(s1);
	a.appendChild(s2);
	return a;
}

function Particle(x, y, dx, dy, size, life, c, shape, opacity, key) {
	this.x = x;
	this.y = y;
	this.r = size / 2;
	this.mid = {
		w: size / 2,
		h: size / 2
	}
	this.size = size;
	this.dx = dx;
	this.dy = dy;
	this.c = c;
	this.a = opacity;
	this.i = OBJ.take(key).length;
	this.life = life;
	this.opacityShift = 1 - opacity;
	this.update = function() {
		this.a = Math.max(0, (this.a) - (Time.deltaTime / this.life));
		if (this.a <= 0) {
			OBJ.trash(key, this.i);
		}
		this.x += this.dx;
		this.y += this.dy;
	}
	this.render = function() {
		Draw.setAlpha(this.a);
		Draw.setColor(this.c);
		switch (shape) {
			case Shape.rect: Draw.rect(this.x - this.mid.w, this.y - this.mid.h, this.size, this.size); break;
			case Shape.circle: Draw.circle(this.x, this.y, this.r); break;
			default: break;
		}
		Draw.setAlpha(1);
	}
}

function BranthEmitter() {
	this.x = {
		min: 0,
		max: 100
	}
	this.y = {
		min: 0,
		max: 100
	}
	this.size = {
		min: 5,
		max: 10
	}
	this.life = {
		min: 2000,
		max: 4000
	}
	this.speed = {
		min: 2,
		max: 5
	}
	this.color = C.red;
	this.shape = Shape.rect;
	this.opacity = {
		min: 1,
		max: 1
	}
	this.direction = {
		min: 0,
		max: 360
	}
	this.objectKey = 'particle';
	this.setArea = function(xmin, xmax, ymin, ymax) {
		this.x.min = xmin;
		this.x.max = xmax;
		this.y.min = ymin;
		this.y.max = ymax;
	}
	this.setSize = function(min, max) {
		this.size.min = min;
		this.size.max = max;
	}
	this.setLife = function(min, max) {
		this.life.min = min;
		this.life.max = max;
	}
	this.setSpeed = function(min, max) {
		this.speed.min = min;
		this.speed.max = max;
	}
	this.setColor = function(c) {
		this.color = c;
	}
	this.setShape = function(s) {
		this.shape = s;
	}
	this.setOpacity = function(min, max) {
		this.opacity.min = min;
		this.opacity.max = max;
	}
	this.setDirection = function(min, max) {
		this.direction.min = min;
		this.direction.max = max;
	}
	this.preset = function(k) {
		switch (k) {
			case 'dot':
				this.setSize(5, 10);
				this.setLife(500, 500);
				this.setSpeed(0, 0);
				this.setColor(C.white);
				this.setShape(Shape.circle);
				this.setOpacity(0.8, 1);
				this.setDirection(0, 0);
			break;
			case 'fire':
				this.setSize(3, 5);
				this.setLife(500, 1000);
				this.setSpeed(1, 2);
				this.setColor(C.red);
				this.setShape(Shape.circle);
				this.setOpacity(0.5, 0.5);
				this.setDirection(170, 190);
			break;
			case 'puff':
				this.setSize(5, 10);
				this.setLife(250, 400);
				this.setSpeed(2, 3);
				this.setColor(C.white);
				this.setShape(Shape.circle);
				this.setOpacity(0.8, 1);
				this.setDirection(0, 360);
			break;
			case 'freeze':
				this.setSize(3, 5);
				this.setLife(500, 1000);
				this.setSpeed(1, 2);
				this.setColor(C.blue);
				this.setShape(Shape.circle);
				this.setOpacity(0.5, 0.5);
				this.setDirection(170, 190);
			break;
			case 'largefire':
				this.setSize(20, 30);
				this.setLife(2000, 4000);
				this.setSpeed(1, 2);
				this.setColor(C.red);
				this.setShape(Shape.circle);
				this.setOpacity(0.5, 0.5);
				this.setDirection(170, 190);
			break;
			default: break;
		}
	}
	this.emit = function(amount) {
		for (let i = 0; i < amount; i++) {
			let spd = Math.range(this.speed.min, this.speed.max);
			let dir = Math.range(this.direction.min, this.direction.max);
			OBJ.add(this.objectKey, new Particle(
				Math.range(this.x.min, this.x.max),
				Math.range(this.y.min, this.y.max),
				Math.lengthDirX(spd, dir),
				Math.lengthDirY(spd, dir),
				Math.range(this.size.min, this.size.max),
				Math.range(this.life.min, this.life.max),
				this.color,
				this.shape,
				Math.range(this.opacity.min, this.opacity.max),
				this.objectKey
			));
		}
	}
	this.spawn = function(x, y, c, shape) {
		let spd = Math.range(this.speed.min, this.speed.max);
		let dir = Math.range(this.direction.min, this.direction.max);
		OBJ.add(this.objectKey, new Particle(
			x, y,
			Math.lengthDirX(spd, dir),
			Math.lengthDirY(spd, dir),
			Math.range(this.size.min, this.size.max),
			Math.range(this.life.min, this.life.max),
			c, shape, Math.range(this.opacity.min, this.opacity.max), this.objectKey
		));
	}
}

const Time = new BranthTime();
const Room = new BranthScene(0, 0, 640, 360 - 32);
const View = new BranthScene(0, 0, 640, 360);
const Mouse = new BranthMouse();
const canvas = new BranthCanvas(View.w, View.h, C.black);
const Draw = new BranthDraw(canvas.getContext('2d'));
const Emitter = new BranthEmitter();

window.addEventListener('mouseup', () => Mouse.up(), false);
window.addEventListener('touchend', () => Mouse.up(), false);
window.addEventListener('mousedown', () => Mouse.down(), false);
window.addEventListener('touchstart', () => Mouse.down(), false);
window.addEventListener('keyup', (e) => {
	if (e.which == 32 || e.keyCode == 32) {
		Mouse.up();
	}
});
window.addEventListener('keydown', (e) => {
	if (e.which == 32 || e.keyCode == 32) {
		if (!Mouse.hold) Mouse.down();
	}
});

const audios = [
	new AudioSource('sounds/pong_hit1'),
	new AudioSource('sounds/pong_hit2'),
	new AudioSource('sounds/pong_hit3'),
	new AudioSource('sounds/pong_result'),
	new AudioSource('sounds/pong_score1'),
	new AudioSource('sounds/pong_score2')
];

const Audio = {
	s: audios,
	getIndex: function(k) {
		let i = 0;
		switch (k) {
			case 'score2': i++;
			case 'score1': i++;
			case 'result': i++;
			case 'hit3': i++;
			case 'hit2': i++;
			case 'hit1':
			default: break;
		}
		return i;
	},
	play: function(k) {
		if (k != null) {
			let i = this.getIndex(k);
			let s = this.s[i];
			if (s != null) {
				s.pause();
				s.currentTime = 0;
				s.play();
			}
		}
	}
}

const OBJ = {
	o: [[], [], [], [], [], []],
	getIndex: function(k) {
		let i = 0;
		switch (k) {
			case 'snowball': i++;
			case 'particle': i++;
			case 'paddle': i++;
			case 'ball': i++;
			case 'aim': i++;
			case 'bparticle':
			default: break;
		}
		return i;
	},
	add: function(k, o) {
		let i = this.getIndex(k);
		this.o[i].push(o);
	},
	take: function(k) {
		let i = this.getIndex(k);
		return this.o[i];
	},
	trash: function(k, j) {
		let i = this.getIndex(k);
		delete this.o[i][j];
	},
	clear: function(k) {
		let i = this.getIndex(k);
		this.o[i] = [];
	}
}

const World = {
	time: 180900,
	scores: [0, 0],
	ball: {
		r: 8,
		spd: 3,
		mpd: 10,
		apd: 1,
		ipd: 2
	},
	paddle: {
		w: 12,
		h: 64,
		spd: 5,
		mid: {
			w: 8,
			h: 32
		},
		shotInterval: 1000,
		chaseInterval: 100,
		freezeInterval: 2000
	},
	snowball: {
		r: 4,
		spd: 8
	},
	shake: {
		mag: 0.4,
		int: 400
	}
}

function Ball(x, y, r) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.xp = x;
	this.yp = y;
	this.dx = 0;
	this.dy = 0;
	this.count = 0;
	this.bound = {
		l: x - r,
		r: x + r,
		t: y - r,
		b: y + r
	}
	this.reach = {
		l: {
			x: Room.x,
			y: y
		},
		r: {
			x: Room.end.x,
			y: y
		}
	}
	this.alarm = [];
	this.active = true;
	this.visible = true;
	this.reset = function() {
		this.x = Room.mid.x;
		this.y = Room.mid.y;
		this.bound.l = this.x - this.r;
		this.bound.r = this.x + this.r;
		this.bound.t = this.y - this.r;
		this.bound.b = this.y + this.r;
		this.dy = 0;
		this.count = 0;
		this.reach.l.y = this.y;
		this.active = false;
		this.alarm[0] = 2000;
		this.alarm[1] = 200;
		this.alarm[2] = 2500;
	}
	this.update = function() {
		if (this.active) {
			this.xp = this.x;
			this.yp = this.y;
			this.x += this.dx;
			this.y += this.dy;
			this.bound.l = this.x - this.r;
			this.bound.r = this.x + this.r;
			this.bound.t = this.y - this.r;
			this.bound.b = this.y + this.r;
			if (this.bound.t <= Room.y || this.bound.b >= Room.end.y) {
				this.y = this.yp;
				this.dy = -this.dy;
				let py = this.dy > 0? this.bound.t : this.bound.b;
				Emitter.setArea(this.x, this.x, py, py);
				Emitter.preset('puff');
				Emitter.emit(20);
				Room.shake(World.shake.mag, World.shake.int);
				Audio.play(this.dx > 0? 'hit1' : 'hit2');
			}
			if (World.time > 0) {
				if (this.bound.l > Room.end.x || this.bound.r < Room.x) {
					if (this.x > Room.mid.x) {
						if (World.time > 0) {
							World.scores[0]++;
							Audio.play('score1');
						}
						this.dx = -World.ball.spd;
					}
					else {
						if (World.time > 0) {
							World.scores[1]++;
							Audio.play('score2');
						}
						this.dx = World.ball.spd;
					}
					this.reset();
				}
			}
			else {
				if (this.bound.l <= Room.x || this.bound.r >= Room.end.x) {
					this.x = this.xp;
					this.dx = -this.dx;
					let px = this.dx > 0? this.bound.l : this.bound.r;
					Emitter.setArea(px, px, this.y, this.y);
					Emitter.preset('puff');
					Emitter.emit(20);
					Room.shake(World.shake.mag, World.shake.int);
					Audio.play(this.dx > 0? 'hit1' : 'hit2');
				}
			}
			for (let i = 0; i < OBJ.take('paddle').length; i++) {
				let p = OBJ.take('paddle')[i];
				if (p != null) {
					if (p.x > Room.mid.x) {
						if (this.dx > 0) {
							if (this.bound.r > p.x && this.bound.r < p.end.x
							 && this.bound.b > p.y && this.bound.t < p.end.y) {
							 	// Bounce
							 	p.count++;
								this.dx = -this.dx;
								let yhit = (this.y - p.mid.y) / p.mid.h;
								this.dy += yhit * World.ball.spd;
								if (this.dy > 0) {
									this.dy = Math.min(World.ball.mpd, this.dy);
								}
								if (this.dy < 0) {
									this.dy = Math.max(-World.ball.mpd, this.dy);
								}
								this.count++;
								if (this.count != 0 && this.count % World.ball.ipd == 0) {
									this.dx = Math.sign(this.dx) * Math.min(World.ball.mpd, Math.abs(this.dx) + World.ball.apd);
								}
								Emitter.setArea(this.bound.r, this.bound.r, this.y, this.y);
								Emitter.preset('puff');
								Emitter.setDirection(20, 160);
								Emitter.emit(10);
								Room.shake(World.shake.mag, World.shake.int);
								Audio.play('hit2');
								// Calculate reach
								let p0 = OBJ.take('paddle')[0];
								if (p0 != null) {
									this.reach.l.x = p0.end.x;
									let cb = {
										x: this.x,
										y: this.y,
										r: this.r,
										xp: this.xp,
										yp: this.yp,
										dx: this.dx,
										dy: this.dy,
										bound: {
											l: this.x - this.r,
											r: this.x + this.r,
											t: this.y - this.r,
											b: this.y + this.r
										}
									}
									if (cb.dx < 0) {
										let count = 0;
										while (cb.bound.l > this.reach.l.x) {
											cb.xp = cb.x;
											cb.yp = cb.y;
											cb.x += cb.dx;
											cb.y += cb.dy;
											cb.bound.l = cb.x - cb.r;
											cb.bound.r = cb.x + cb.r;
											cb.bound.t = cb.y - cb.r;
											cb.bound.b = cb.y + cb.r;
											if (cb.bound.t <= Room.y || cb.bound.b >= Room.end.y) {
												cb.y = cb.yp;
												cb.dy = -cb.dy;
											}
											if (count % 10 === 0 && World.time <= 0) {
												OBJ.add('aim', new Aim(cb.x, cb.y, Math.min(0.5, ((Room.end.x - cb.x) / Room.w)) * cb.r, count * Math.abs(cb.dx) * 10));
											}
											count++;
										}
										this.reach.l.y = cb.y;
									}
								}
							}
						}
					}
					else {
						if (this.dx < 0) {
							if (this.bound.l > p.x && this.bound.l < p.end.x
							 && this.bound.b > p.y && this.bound.t < p.end.y) {
							 	// Bounce
								p.count++;
								this.dx = -this.dx;
								let yhit = (this.y - p.mid.y) / p.mid.h;
								this.dy += yhit * World.ball.spd;
								if (this.dy > 0) {
									this.dy = Math.min(World.ball.mpd, this.dy);
								}
								if (this.dy < 0) {
									this.dy = Math.max(-World.ball.mpd, this.dy);
								}
								Emitter.setArea(this.bound.l, this.bound.l, this.y, this.y);
								Emitter.preset('puff');
								Emitter.setDirection(200, 340);
								Emitter.emit(10);
								Room.shake(World.shake.mag, World.shake.int);
								Audio.play('hit1');
								// Calculate reach
								let p1 = OBJ.take('paddle')[1];
								if (p1 != null) {
									this.reach.r.x = p1.x;
									let cb = {
										x: this.x,
										y: this.y,
										r: this.r,
										xp: this.xp,
										yp: this.yp,
										dx: this.dx,
										dy: this.dy,
										bound: {
											l: this.x - this.r,
											r: this.x + this.r,
											t: this.y - this.r,
											b: this.y + this.r
										}
									}
									if (cb.dx > 0) {
										let count = 0;
										while (cb.bound.r < this.reach.r.x) {
											cb.xp = cb.x;
											cb.yp = cb.y;
											cb.x += cb.dx;
											cb.y += cb.dy;
											cb.bound.l = cb.x - cb.r;
											cb.bound.r = cb.x + cb.r;
											cb.bound.t = cb.y - cb.r;
											cb.bound.b = cb.y + cb.r;
											if (cb.bound.t <= Room.y || cb.bound.b >= Room.end.y) {
												cb.y = cb.yp;
												cb.dy = -cb.dy;
											}
											if (count % 10 === 0 && World.time <= 0) {
												OBJ.add('aim', new Aim(cb.x, cb.y, Math.min(0.5, ((cb.x - Room.x) / Room.w)) * cb.r, count * Math.abs(cb.dx) * 10));
											}
											count++;
										}
										this.reach.r.y = cb.y;
									}
								}
							}
						}
					}
				}
			}
		}
		for (let i = 0; i < this.alarm.length; i++) {
			if (this.alarm[i] != null) {
				if (this.alarm[i] > 0) {
					this.alarm[i] = Math.max(0, this.alarm[i] - Time.fixedDeltaTime);
				}
				else if (this.alarm[i] != -1) {
					switch (i) {
						case 0:
							this.active = true;
						break;
						case 1:
							if (Math.abs(this.dx) > World.ball.mpd * 0.5 || World.time <= 0) {
								Emitter.preset('dot');
								Emitter.setSize(this.r, this.r);
								Emitter.objectKey = 'bparticle';
								Emitter.spawn(this.x, this.y, Emitter.color, Emitter.shape);
								Emitter.objectKey = 'particle';
							}
							this.alarm[1] = 200;
						break;
						case 2:
						break;
						default: break;
					}
					if (this.alarm[i] <= 0) this.alarm[i] = -1;
				}
			}
		}
	}
	this.render = function() {
		if (this.visible) {
			Draw.setColor(C.red);
			Draw.circle(Room.x + this.x, Room.y + this.y, this.r);
			if (this.alarm[2] > 0 || Math.abs(this.dx) > World.ball.mpd * 0.75 || World.time <= 0) {
				Emitter.setArea(this.bound.l, this.bound.r, this.bound.t, this.bound.b);
				Emitter.preset('fire');
				Emitter.emit(1);
			}
		}
	}
}

function Paddle(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.mid = {
		x: x,
		y: y,
		w: w / 2,
		h: h / 2
	}
	this.end = {
		x: x + w,
		y: y + h
	}
	this.yto = y;
	this.spd = 0.1;
	this.ammo = 0;
	this.alarm = [];
	this.count = 0;
	this.chase = true;
	this.player = true;
	this.active = true;
	this.visible = true;
	this.freeze = function() {
		if (World.time > 0) {
			this.active = false;
			this.alarm[3] = World.paddle.freezeInterval;
		}
		Audio.play('hit3');
	}
	this.update = function() {
		this.mid.x = this.x + this.mid.w;
		this.mid.y = this.y + this.mid.h;
		this.end.x = this.x + this.w;
		this.end.y = this.y + this.h;
		if (this.active) {
			let ydif = this.y - this.yto;
			if (Math.abs(ydif) > 0) this.y -= ydif * this.spd;
			if (this.count > 4 && this.ammo <= 0) {
				this.ammo = 3;
			}
			if (World.time <= 0) {
				this.ammo = 1;
			}
			if (this.player) {
				if (Mouse.pressed) {
					if (this.ammo > 0) {
						OBJ.add('snowball', new Snowball(this.x, this.mid.y, World.snowball.r, -World.snowball.spd));
						this.ammo -= 1;
						if (this.ammo <= 0) {
							this.count = 0;
						}
					}
				}
				if (Mouse.hold) {
					this.yto = Math.max(Room.y, this.yto - World.paddle.spd);
				}
				else {
					this.yto = Math.min(Room.end.y - this.h, this.yto + World.paddle.spd);
				}
			}
			else {
				let b = OBJ.take('ball')[0];
				if (b != null) {
					if (this.chase) {
						if (b.dx < 0) {
							let yyto = b.reach.l.y - this.mid.h;
							let yydif = this.yto - yyto;
							if (Math.abs(yydif) > 0) this.yto = Math.clamp(this.yto - Math.sign(yydif) * World.paddle.spd, Room.y, Room.end.y - this.h);
						}
						else {
							this.alarm[0] = 0;
						}
					}
					else {
						this.yto = Math.min(Room.end.y - this.h, this.yto + World.paddle.spd);
					}
				}
				else {
					this.yto = Math.min(Room.end.y - this.h, this.yto + World.paddle.spd);
				}
			}
		}
		for (let i = 0; i < this.alarm.length; i++) {
			if (this.alarm[i] != null) {
				if (this.alarm[i] > 0) {
					this.alarm[i] = Math.max(0, this.alarm[i] - Time.fixedDeltaTime);
				}
				else if (this.alarm[i] != -1) {
					switch (i) {
						case 0:
							if (Math.abs(this.y - this.yto) < this.mid.h) {
								let b = OBJ.take('ball')[0];
								if (b != null) {
									if (b.dx < 0) {
										if (this.yto > Room.y) {
											this.chase = false;
										}
									}
									else {
										this.chase = false;
									}
								}
								else {
									this.chase = false;
								}
							}
							this.alarm[1] = World.paddle.chaseInterval;
						break;
						case 1:
							this.chase = true;
							this.alarm[0] = World.paddle.chaseInterval * 5;
						break;
						case 2:
							if (this.active) {
								if (Math.randomNegator() > 0) {
									if (this.ammo > 0) {
										OBJ.add('snowball', new Snowball(this.x, this.mid.y, World.snowball.r, World.snowball.spd));
										this.ammo -= 1;
										if (this.ammo <= 0) {
											this.count = 0;
										}
									}
								}
							}
							this.alarm[2] = World.paddle.shotInterval;
						break;
						case 3:
							this.active = true;
						break;
						default: break;
					}
					if (this.alarm[i] <= 0) this.alarm[i] = -1;
				}
			}
		}
	}
	this.render = function() {
		if (this.visible) {
			Draw.setColor(C.white);
			Draw.rect(Room.x + this.x, Room.y + this.y, this.w, this.h);
			if (this.active) {
				if (this.ammo > 0) {
					Emitter.preset('freeze');
					Emitter.setArea(this.x, this.end.x, this.y, this.end.y);
					Emitter.emit(1);
				}
			}
			else {
				Emitter.preset('puff');
				Emitter.setArea(this.mid.x, this.mid.x, this.y, this.end.y);
				Emitter.emit(1);
			}
		}
	}
}

function Aim(x, y, r, life, c) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.a = 1;
	this.c = c || C.white;
	this.i = OBJ.take('aim').length;
	this.life = life;
	this.update = function() {
		this.a = Math.max(0, this.a - (Time.deltaTime / this.life));
		if (this.a <= 0) {
			OBJ.trash('aim', this.i);
		}
	}
	this.render = function() {
		Draw.setAlpha(this.a);
		Draw.setColor(this.c);
		Draw.circle(this.x, this.y, this.r);
		Draw.setAlpha(1);
	}
}

function Snowball(x, y, r, dx) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.dx = dx;
	this.bound = {
		l: x - r,
		r: x + r,
		t: y - r,
		b: y + r
	}
	this.i = OBJ.take('snowball').length;
	this.update = function() {
		this.x += this.dx;
		this.bound.l = this.x - this.r;
		this.bound.r = this.x + this.r;
		this.bound.t = this.y - this.r;
		this.bound.b = this.y + this.r;
		if (this.bound.l > Room.end.x || this.bound.r < Room.x) {
			OBJ.trash('snowball', this.i);
		}
		for (let i = 0; i < OBJ.take('paddle').length; i++) {
			let p = OBJ.take('paddle')[i];
			if (p != null) {
				if (p.x > Room.mid.x) {
					if (this.dx > 0) {
						if (this.bound.r > p.x && this.bound.r < p.end.x
						 && this.bound.b > p.y && this.bound.t < p.end.y) {
						 	Emitter.setArea(this.x, this.x, this.y, this.y);
						 	Emitter.preset('puff');
						 	Emitter.emit(10);
							OBJ.trash('snowball', this.i);
							p.freeze();
						}
					}
				}
				else {
					if (this.dx < 0) {
						if (this.bound.l > p.x && this.bound.l < p.end.x
						 && this.bound.b > p.y && this.bound.t < p.end.y) {
						 	Emitter.setArea(this.x, this.x, this.y, this.y);
						 	Emitter.preset('puff');
						 	Emitter.emit(10);
						 	OBJ.trash('snowball', this.i);
						 	p.freeze();
						 }
					}
				}
			}
		}
	}
	this.render = function() {
		Draw.setColor(C.blue);
		Draw.circle(this.x, this.y, this.r);
		Emitter.preset('freeze');
		Emitter.setArea(this.bound.l, this.bound.r, this.bound.t, this.bound.b);
		Emitter.emit(1);
	}
}

let focus = false;

const UI = {
	update: function() {
		let b = OBJ.take('ball')[0];
		if (Math.abs(b.dx) > World.ball.mpd / 2 || World.time <= 0) {
			Emitter.preset('largefire');
			Emitter.setArea(View.x, View.end.x, View.end.y, View.end.y);
			if (b.dx < 0) Emitter.setColor(C.blue);
			Emitter.objectKey = 'bparticle';
			Emitter.emit(1);
			Emitter.objectKey = 'particle';
		}
		if (World.time > 0) {
			World.time = Math.max(0, World.time - Time.deltaTime);
			if (World.time <= 0) {
				Audio.play('result');
			}
		}
		else {
			if (Mouse.reachConfirmThreshold) {
				let p = OBJ.take('paddle');
				b.reset();
				b.dx = World.ball.spd;
				p[0].alarm[0] = 0;
				p[0].alarm[2] = World.paddle.shotInterval;
				p[0].ammo = 0;
				p[1].ammo = 0;
				p[0].count = 0;
				p[1].count = 0;
				World.time = 180900;
				World.scores = [0, 0];
				OBJ.clear('snowball');
				OBJ.clear('particle');
				OBJ.clear('bparticle');
				Audio.play('result');
			}
		}
	},
	render: function() {
		Draw.setColor(C.blue);
		Draw.rect(View.x, View.end.y, View.w, -32);
		let p = OBJ.take('paddle');
		if (World.time > 0) {
			Draw.setColor(C.white);
			Draw.setHAlign(Align.c);
			Draw.setVAlign(Align.m);
			Draw.font('16px');
			Draw.setShadow(0, 1, 3, C.black);
			let t = {
				m: Time.toClockMinutes(World.time),
				s: Time.toClockSeconds(World.time)
			}
			Draw.text(View.mid.x, View.h - 16, ':');
			Draw.setHAlign(Align.l);
			Draw.text(View.mid.x + 10, View.h - 16, (t.s < 10? '0' : '') + t.s);
			Draw.text(View.x + 10, View.h - 16, p[0].active? (p[0].count > 4? p[0].ammo + ' o' : '(' + (5 - p[0].count) + ')') : 'FREEZE ' + Time.toSeconds(p[0].alarm[3]) + 's');
			Draw.setHAlign(Align.r);
			Draw.text(View.mid.x - 10, View.h - 16, (t.m < 10? '0' : '') + t.m);
			Draw.text(View.end.x - 10, View.h - 16,
				p[1].active?
					(p[1].count > 4? 'You have ' + p[1].ammo + ' snowball' + (p[1].ammo > 1? 's' : '')
						: (5 - p[1].count) + ' hit' + (p[1].count < 4? 's' : '') + ' to go')
					: Time.toSeconds(p[1].alarm[3]) + 's FREEZE'
			);
			Draw.font('24px');
			Draw.setHAlign(Align.r);
			Draw.text(View.mid.x - 48, View.h - 16, World.scores[0]);
			Draw.setHAlign(Align.l);
			Draw.text(View.mid.x + 48, View.h - 16, World.scores[1]);
			Draw.resetShadow();
		}
		else {
			Draw.setAlpha(0.3);
			Draw.setColor(C.blue);
			Draw.rect(View.x, View.y, View.w, View.h);
			Draw.setAlpha(1);
			Draw.setColor(C.white);
			Draw.setHAlign(Align.c);
			Draw.setVAlign(Align.b);
			Draw.font('36px');
			Draw.setShadow(0, 1, 3, C.black);
			let sc = World.scores;
			Draw.text(View.mid.x, View.mid.y - 40 + Math.cos(Time.time / 500) * 5, sc[0] < sc[1]? 'YOU WIN!' : (sc[0] > sc[1]? 'COMPUTER WIN!' : "IT'S A TIE!"));
			Draw.font('24px');
			Draw.setVAlign(Align.m);
			Draw.text(View.mid.x, View.mid.y, 'VS');
			Draw.font('28px');
			Draw.setHAlign(Align.r);
			Draw.text(View.mid.x - 50, View.mid.y, sc[0]);
			Draw.setHAlign(Align.l);
			Draw.text(View.mid.x + 50, View.mid.y, sc[1]);
			Draw.setHAlign(Align.c);
			Draw.font('16px');
			Draw.text(View.mid.x, View.end.y - 48, 'Hold to play again.');
			let barW = View.w * 0.35;
			Draw.setColor(C.black);
			Draw.rect(View.mid.x - barW / 2, View.end.y - 23, barW, 6);
			Draw.setColor(C.white);
			Draw.resetShadow();
			Draw.rect(View.mid.x - barW / 2, View.end.y - 23, (Math.min(Mouse.confirmThreshold, Mouse.holdTime) / Mouse.confirmThreshold) * barW, 6);
		}
		if (!focus) {
			Draw.setAlpha(0.3);
			Draw.setColor(C.blue);
			Draw.rect(View.x, View.y, View.w, View.h);
			Draw.setAlpha(1);
			Draw.setColor(C.white);
			Draw.setHAlign(Align.l);
			Draw.setVAlign(Align.t);
			Draw.setShadow(0, 1, 3, C.black);
			Draw.font('36px');
			Draw.text(View.x + 20, View.y + 20, 'COMPUTER');
			Draw.setHAlign(Align.r);
			Draw.text(View.end.x - 20, View.y + 20, 'YOU');
			Draw.font('24px');
			Draw.setHAlign(Align.c);
			Draw.setVAlign(Align.m);
			Draw.text(View.mid.x, Room.mid.y, 'Click or <space> to control.');
			Draw.resetShadow();
			if (Mouse.pressed) {
				let b = OBJ.take('ball')[0];
				let p = OBJ.take('paddle');
				b.reset();
				b.dx = World.ball.spd;
				p[0].alarm[0] = 0;
				p[0].alarm[2] = World.paddle.shotInterval;
				p[0].ammo = 0;
				p[1].ammo = 0;
				p[0].count = 0;
				p[1].count = 0;
				World.time = 180900;
				World.scores = [0, 0];
				OBJ.clear('snowball');
				OBJ.clear('particle');
				OBJ.clear('bparticle');
				Audio.play('result');
				focus = true;
			}
		}
	}
}

const Game = {
	start: function() {
		console.log("%c  ***  Created by Branth  ***  ", "color: white; background: black");
		let b = new Ball(Room.mid.x, Room.mid.y, World.ball.r);
		b.reset();
		b.dx = World.ball.spd;
		let p0 = new Paddle(Room.x + 24, Room.mid.y - World.paddle.mid.h, World.paddle.w, World.paddle.h);
		p0.player = false;
		p0.alarm[0] = 0;
		p0.alarm[2] = World.paddle.shotInterval;
		let p1 = new Paddle(Room.end.x - 24 - World.paddle.w, Room.mid.y - World.paddle.mid.h, World.paddle.w, World.paddle.h);
		OBJ.add('ball', b);
		OBJ.add('paddle', p0);
		OBJ.add('paddle', p1);
		this.update();
	},
	update: function(t) {
		Time.update(t);
		Room.update();
		View.update();
		Mouse.update(Time);
		Draw.clearRect(View.x, View.y, View.w, View.h);
		for (let i = 0; i < OBJ.o.length; i++) {
			for (let j = 0; j < OBJ.o[i].length; j++) {
				let o = OBJ.o[i][j];
				if (o != undefined) {
					if (o != null) {
						o.update();
						o.render();
					}
				}
			}
		}
		UI.update();
		UI.render();
		window.requestAnimationFrame(Game.update);
	}
}

function appendStuff() {
	for (let i = 0; i < audios.length; i++) {
		document.body.appendChild(audios[i]);
	}
	document.body.appendChild(canvas);
}

window.onload = function() {
	appendStuff();
	Game.start();
}