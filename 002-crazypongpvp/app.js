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
	this.triggerTime = 0;
	this.triggerThreshold = Time.fixedDeltaTime;
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
		this.triggerTime += Time.deltaTime;
		if (this.triggerTime > Time.deltaTime * (World.scene === World.sceneType.menu? 0.8 : 1)) {
			this.pressed = false;
			this.released = false;
		}
	}
}

function BranthInput() {
	this.key = [
		new BranthKey(KeyCode.W),
		new BranthKey(KeyCode.S),
		new BranthKey(KeyCode.A),
		new BranthKey(KeyCode.D),
		new BranthKey(KeyCode.Up),
		new BranthKey(KeyCode.Down),
		new BranthKey(KeyCode.Left),
		new BranthKey(KeyCode.Right),
		new BranthKey(KeyCode.Space),
		new BranthKey(KeyCode.Enter),
		new BranthKey(KeyCode.U),
		new BranthKey(KeyCode.Escape)
	];
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

function BranthObject(k) {
	this.k = k;
	this.o = [];
	this.setO = function() {
		for (let i = 0; i < this.k.length; i++) {
			this.o.push([]);
		}
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
	this.setO();
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

function BranthParticle(x, y, dx, dy, size, life, c, shape, opacity, key) {
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
		this.render();
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

function BranthEmitter(defLayer) {
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
	this.objectKey = defLayer;
	this.defaultLayer = defLayer;
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
	this.setLayer = function(layer) {
		this.objectKey = layer;
	}
	this.resetLayer = function() {
		this.objectKey = this.defaultLayer;
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
			OBJ.add(this.objectKey, new BranthParticle(
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
		OBJ.add(this.objectKey, new BranthParticle(
			x, y,
			Math.lengthDirX(spd, dir),
			Math.lengthDirY(spd, dir),
			Math.range(this.size.min, this.size.max),
			Math.range(this.life.min, this.life.max),
			c, shape, Math.range(this.opacity.min, this.opacity.max), this.objectKey
		));
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
			this.s.push(new BranthAudioSource('sounds/crazy_pong_' + this.k[i]));
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

function Ball(x, y, r) {
	this.active = true;
	this.visible = true;
	this.x = x;
	this.y = y;
	this.r = r;
	this.xp = x;
	this.yp = y;
	this.dx = World.ball.spd;
	this.dy = 0;
	this.score = 1;
	this.def = {
		x: x,
		y: y
	}
	this.bound = {
		l: x - r,
		r: x + r,
		t: y - r,
		b: y + r
	}
	this.reach = {
		x: Room.mid.x,
		y: Room.mid.y,
		step: 0
	}
	this.alarm = [];
	this.hitCount = 0;
	this.stickGapY = 0;
	this.isSticking = false;
	this.playerToStick = null;
	this.isIllusioning = false;
	this.playerUseIllusion = null;
	this.boundUpdate = function() {
		this.bound.l = this.x - this.r;
		this.bound.r = this.x + this.r;
		this.bound.t = this.y - this.r;
		this.bound.b = this.y + this.r;
	}
	this.reset = function() {
		this.x = this.def.x;
		this.y = this.def.y;
		this.dy = 0;
		this.boundUpdate();
		this.reach.y = Room.mid.y;
		this.hitCount = 0;
		this.active = false;
		this.reach.step = 100 + Math.round(World.ball.resetTime / Time.fixedDeltaTime); // Hard coded
		this.alarm[0] = World.ball.resetTime;
		this.alarm[3] = World.ball.burnTime;
	}
	this.bouncePaddleCheck = function(p) {
		if (this.bound.r > p.x && this.bound.l < p.end.x) {
			if (p.isInverting) {
				if (this.bound.b > Room.y && this.bound.t < p.y
				 || this.bound.b > p.end.y && this.bound.t < Room.end.y) {
					this.bouncePaddle(p);
				}
			}
			else {
				if (this.bound.b > p.y && this.bound.t < p.end.y) {
					this.bouncePaddle(p);
				}
			}
		}
	}
	this.bouncePaddle = function(p) {
		this.x = this.xp;
		this.dx = -this.dx;
		if (!p.isInverting) {
			let yhit = (this.y - p.mid.y) / p.mid.h;
			this.dy += yhit * World.ball.spd;
			if (this.dy > 0) {
				this.dy = Math.min(World.ball.spdMax, this.dy);
			}
			if (this.dy < 0) {
				this.dy = Math.max(-World.ball.spdMax, this.dy);
			}
		}
		this.hitCount++;
		if (this.hitCount != 0 && this.hitCount % World.ball.spdIncInterval === 0) {
			this.dx = Math.sign(this.dx) * Math.min(World.ball.spdMax, Math.abs(this.dx) + World.ball.spdIncrement);
			this.alarm[3] = World.ball.burnTime;
		}
		p.hitCount++;
		if (p.active && p.isSticky) {
			this.active = false;
			this.isSticking = true;
			this.playerToStick = p;
			this.stickGapY = this.y - p.y;
			this.alarm[1] = p.alarm[2];
			// I finally found what makes it chase a sticky ball!
			// Now it's time to fix it!
			this.reach.step += Math.round(this.alarm[1] / Time.fixedDeltaTime);
		}
		else {
			this.calculateReach(p);
		}
		if (p.x > Room.mid.x) {
			Emtr.setArea(this.bound.r, this.bound.r, this.y, this.y);
			Emtr.preset('puff');
			Emtr.setDirection(20, 160);
			Emtr.emit(10);
		}
		else {
			Emtr.setArea(this.bound.l, this.bound.l, this.y, this.y);
			Emtr.preset('puff');
			Emtr.setDirection(200, 340);
			Emtr.emit(10);
		}
		if (this.r >= World.ball.r) {
			Room.shake(World.shake.mag, World.shake.int);
		}
		Audi.play('hit1');
	}
	this.calculateReach = function(pfrom) {
		if (pfrom != null) {
			let idx = 0;
			if (pfrom.x < Room.mid.x || this.dx > 0) {
				idx = 1;
			}
			const pto = OBJ.take('paddle')[idx];
			this.reach.x = idx === 0? pto.end.x : pto.x;
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
			let count = 0;
			const maxIteration = 300;
			while (((idx === 0 && cb.bound.l > this.reach.x) || (idx === 1 && cb.bound.r < this.reach.x)) && count < maxIteration) {
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
				count++;
			}
			this.reach.step = count;
			this.reach.y = cb.y;
		}
	}
	this.spawnIllusionBall = function(px) {
		const targetIndex = Math.round(Math.range(0, World.illusionball.amount - 1));
		for (let i = 0; i < World.illusionball.amount; i++) {
			let ib = new IllusionBall(this.x, this.y, this.r);
			ib.dx = Math.max(World.ball.spd, Math.abs(this.dx)) * Math.sign(this.dx);
			ib.dy = Math.max(World.ball.spd, Math.abs(this.dy)) * (-1 + i) * Math.range(0.8, 1);
			if (i === targetIndex) {
				ib.isTarget = true;
			}
			OBJ.add('illusionball', ib);
		}
		if (this.dx > 0 && this.x < Room.x + Room.w / 4 || this.dx < 0 && this.x > Room.end.x - Room.w / 4) {
			this.dy = Math.max(World.ball.spd, Math.abs(this.dy)) * Math.randomNegator() * Math.range(0, 1);
		}
		this.isIllusioning = true;
		this.playerUseIllusion = OBJ.take('paddle')[px < Room.mid.x? 0 : 1];
		this.calculateReach(this.playerUseIllusion);
		this.alarm[2] = World.illusionball.life;
	}
	this.update = function() {
		if (this.active) {
			this.xp = this.x;
			this.yp = this.y;
			this.x += this.dx;
			this.y += this.dy;
			this.boundUpdate();
			if (this.bound.t <= Room.y || this.bound.b >= Room.end.y) {
				this.y = this.yp;
				this.dy = -this.dy;
				let py = this.dy > 0? this.bound.t : this.bound.b;
				Emtr.setArea(this.x, this.x, py, py);
				Emtr.preset('puff');
				Emtr.emit(20);
				if (this.r >= World.ball.r) {
					Room.shake(World.shake.mag, World.shake.int);
				}
				Audi.play('hit' + Math.floor(Math.range(1, 4)));
			}
			if (this.bound.l > Room.end.x || this.bound.r < Room.x) {
				if (World.scene === World.sceneType.result) {
					this.dx = 0;
					this.dy = 0;
				}
				else {
					if (this.x > Room.mid.x) {
						World.score[0] += this.score;
						this.dx = -World.ball.spd;
						this.reach.x = OBJ.take('paddle')[0].end.x;
						Audi.play('score1');
					}
					else {
						World.score[1] += this.score;
						this.dx = World.ball.spd;
						this.reach.x = OBJ.take('paddle')[1].x;
						Audi.play('score2');
					}
					this.reset();
				}
			}
			for (let i = 0; i < OBJ.take('paddle').length; i++) {
				let p = OBJ.take('paddle')[i];
				if (p.x > Room.mid.x) {
					if (this.dx > 0) {
						this.bouncePaddleCheck(p);
					}
				}
				else {
					if (this.dx < 0) {
						this.bouncePaddleCheck(p);
					}
				}
			}
		}
		else {
			if (this.isSticking) {
				if (this.playerToStick != null) {
					this.y = Math.clamp(this.playerToStick.y + this.stickGapY, Room.y + this.r, Room.end.y - this.r);
					this.boundUpdate();
				}
			}
		}
		this.reach.step = Math.max(0, this.reach.step - 1);
		this.render();
		this.alarmUpdate();
	}
	this.render = function() {
		if (this.visible) {
			if (this.alarm[0] > 0 && this.alarm[0] != null) {
				Draw.setAlpha(1 - Math.clamp((this.alarm[0] / World.ball.resetTime), 0, 1));
			}
			Draw.setColor(C.red);
			Draw.circle(Room.x + this.x, Room.y + this.y, this.r);
			Draw.setAlpha(1);
			if (this.alarm[3] > 0 || Math.abs(this.dx) >= World.ball.spdMax) {
				Emtr.setArea(this.bound.l, this.bound.r, this.bound.t, this.bound.b);
				Emtr.preset('fire');
				Emtr.emit(1);
			}
		}
		if (World.debug) {
			if (Math.abs(this.dx) > 0 || this.isSticking) {
				const boundR = this.r * 0.25;
				Draw.setColor(C.blue);
				Draw.circle(Room.x + this.bound.l, Room.y + this.y, boundR);
				Draw.circle(Room.x + this.bound.r, Room.y + this.y, boundR);
				Draw.circle(Room.x + this.x, Room.y + this.bound.t, boundR);
				Draw.circle(Room.x + this.x, Room.y + this.bound.b, boundR);
				Draw.setColor(C.white);
				Draw.setHAlign(Align.c);
				Draw.setVAlign(Align.t);
				Draw.font('bold 12px');
				Draw.text(this.x, 32, this.score);
				if (Math.abs(this.reach.x - Room.mid.x) > Room.mid.w / 2) {
					const reachR = this.r * (5 / 8);
					const reachScale = Math.clamp(Math.abs(this.x - this.reach.x) / Room.w, 0, 1);
					Draw.setColor(C.white);
					if (!this.active) {
						Draw.setColor(this.isSticking? C.yellow : C.gray);
					}
					if (this.reach.x > Room.mid.x) {
						Draw.rect(this.reach.x - reachR * 0.6, this.reach.y - 1, -this.reach.step, 2);
					}
					else {
						Draw.rect(this.reach.x + reachR * 0.6, this.reach.y - 1, this.reach.step, 2);
					}
					Draw.circle(this.reach.x, this.reach.y, reachR + reachR * reachScale);
					Draw.setColor(C.red);
					Draw.circle(this.reach.x, this.reach.y, reachR * 0.6);
				}
			}
		}
	}
	this.alarmUpdate = function() {
		for (let i = 0; i < this.alarm.length; i++) {
			if (this.alarm[i] != null) {
				if (this.alarm[i] > 0) {
					this.alarm[i] = Math.max(0, this.alarm[i] - Time.deltaTime);
				}
				else if (this.alarm[i] != -1) {
					switch (i) {
						case 0:
							this.active = true;
						break;
						case 1:
							this.active = true;
							this.isSticking = false;
							this.calculateReach(this.playerToStick);
						break;
						case 2:
							this.isIllusioning = false;
						break;
						case 3:
							// Reserved for burn alarm
						break;
						default: break;
					}
					if (this.alarm[i] <= 0) this.alarm[i] = -1;
				}
			}
		}
	}
}

function Paddle(x, y, w, h) {
	this.active = true;
	this.visible = true;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.yy = y;
	this.spd = World.paddle.spd;
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
	this.ability = 0;
	this.hitCount = 0;
	this.isSticky = false;
	this.isFreezing = false;
	this.isInverting = false;
	this.canUseAbility = false;
	this.useAbilityInterval = World.paddle.useAbilityInterval.min;
	this.aiTargetGapY = Math.range(0, h / 4) * Math.randomNegator();
	this.control = function(keyW, keyS, keyA, keyD, keyAction) {
		if (Inpt.keyHold(keyW)) {
			this.yy = Math.max(this.yy - this.spd, Room.y);
		}
		if (Inpt.keyHold(keyS)) {
			this.yy = Math.min(this.yy + this.spd, Room.end.y - this.h);
		}
		if (Inpt.keyDown(keyA)) {
			if (this.ability <= 0) {
				this.ability = World.paddle.ability.length - 1;
			}
			else {
				this.ability = Math.max(0, this.ability - 1);
			}
		}
		if (Inpt.keyDown(keyD)) {
			if (this.ability >= World.paddle.ability.length - 1) {
				this.ability = 0;
			}
			else {
				this.ability = Math.min(World.paddle.ability.length - 1, this.ability + 1);
			}
		}
		if (World.game.type === World.gameType.crazy && World.scene === World.sceneType.game) {
			if (Inpt.keyDown(keyAction)) {
				if (this.canUseAbility) {
					this.useAbility();
				}
			}
		}
	}
	this.towardUs = function(b) {
		if (this.x > Room.mid.x) {
			return (b.dx > 0);
		}
		else {
			return (b.dx < 0);
		}
	}
	this.AIControl = function() {
		// Find closest target
		let mainBall = OBJ.take('ball')[0];
		let closestBall = mainBall;
		for (let i = 1; i < OBJ.take('ball').length; i++) {
			const b = OBJ.take('ball')[i];
			if (b.active) {
				// Is b towards us?
				if (this.towardUs(b)) {
					// Okay, but is it not sticking though?
					if (!b.isSticking) {
						// Well, is current closest ball towards us?
						if (this.towardUs(closestBall)) {
							// If yes, compare which one is the closest
							if (b.reach.step < closestBall.reach.step) {
								// If b closer than current closest ball, set b to be the closest ball
								closestBall = b;
							}
						}
						else {
							// If NOT set b to be the closest ball
							closestBall = b;
						}
					}
				}
			}
		}
		// Now we have the closest ball, let's move into its reach y
		// Double check if the closest ball really towards us
		if (this.towardUs(closestBall)) {
			let yto = closestBall.reach.y - this.mid.h; // set our target
			// Is there any illusion ball?
			if (OBJ.getNotNullLength('illusionball') > 0) {
				// We know the illusion ball goes the same direction with the main ball
				// So using the main ball, we able to check if the illusion ball towards us?
				if (this.towardUs(mainBall)) {
					// If yes check through all of them, one of them is set to be our target
					for (let i = 0; i < OBJ.take('illusionball').length; i++) {
						const ib = OBJ.take('illusionball')[i];
						// Sadly, previous illusion ball is still in the array but empty
						// So we have to check if ib exists?
						if (ib != null && ib != undefined) {
							// Is ib the target?
							if (ib.isTarget) {
								// Yes. Now check if the closest ball, our current target is still far away
								if (closestBall.reach.step > 100) {
									// If the closest ball have default speed, the number generated above roughly means:
									// If the closest ball is more than half room away from reaching its point
									// equivalent to:
									// (Math.abs(closestBall.x - closestBall.reach.x) > Room.mid.w)
									// But we're not using it bcoz it has no reach.step value
									// So anyway..
									// If the closest ball still far away, change our target to ib
									yto = ib.y -  this.mid.h;
									// Happy following illusion!
								}
							}
						}
					}
				}
			}
			// Move to target not immediately, but using this.spd
			const ydif = this.yy - Math.clamp(yto + this.aiTargetGapY, Room.y, Room.end.y - this.h);
			this.yy -= Math.sign(ydif) * Math.min(this.spd * 0.85, Math.abs(ydif));
		}
		// Randomize hit point
		if (this.alarm[3] == null || this.alarm[3] < 0) {
			this.alarm[3] = World.paddle.aiTargetGapYInterval;
		}
		// Handle ability
		// Basically, at the moment we got canUseAbility = true, choose an ability, then set a timer as when we using it
		if (World.game.type === World.gameType.crazy && World.scene === World.sceneType.game) {
			if (this.canUseAbility) {
				if (this.alarm[4] == null || this.alarm[4] < 0) {
					const mainBall = OBJ.take('ball')[0];
					const ballAmount = OBJ.take('ball').length;
					this.ability = Math.range(0, 10) > 3 + Math.min(2, ballAmount)? 0 : 3;
					if (this.x > Room.mid.x && mainBall.dx < 0 || this.x <= Room.mid.x && mainBall.dx > 0) {
						if (Math.range(0, 10) > 2 + Math.min(3, ballAmount)) {
							this.ability = 2;
						}
					}
					let intvMin = World.paddle.useAbilityInterval.min;
					let intvMax = World.paddle.useAbilityInterval.max;
					if (this.ability === 2) {
						intvMax = Math.min(intvMin, intvMin + ((intvMax - intvMin) / 2));
					}
					if (this.ability === 3) {
						intvMin = Math.min(intvMax, intvMin + ((intvMax - intvMin) / 2));
					}
					this.useAbilityInterval = Math.range(intvMin, intvMax);
					this.alarm[4] = this.useAbilityInterval;
				}
			}
		}
	}
	this.useAbility = function() {
		switch (this.ability) {
			case 0:
				OBJ.add('snowball', new Snowball(this.x > Room.mid.x? this.x : this.end.x, this.mid.y, World.snowball.r, World.snowball.spd * (this.x > Room.mid.x? -1 : 1)));
				break;
			case 1:
				this.isInverting = true;
				this.alarm[1] = World.paddle.invertInterval;
				Emtr.preset('puff');
				Emtr.setArea(this.x, this.end.x, Room.y, Room.end.y);
				Emtr.emit(50);
				break;
			case 2:
				OBJ.take('ball')[0].spawnIllusionBall(this.x);
				break;
			case 3:
				this.isSticky = true;
				this.alarm[2] = World.paddle.stickyInterval;
				Emtr.preset('puff');
				Emtr.setColor(C.yellow);
				Emtr.setArea(this.x, this.end.x, this.y, this.end.y);
				Emtr.emit(10);
				break;
			default: break;
		}
		this.hitCount = 0;
		this.canUseAbility = false;
		Audi.play('ability');
	}
	this.gotHitBySnowball = function() {
		this.active = false;
		this.isFreezing = true;
		this.alarm[0] = World.paddle.freezeInterval;
	}
	this.update = function() {
		this.mid.x = this.x + this.mid.w;
		this.mid.y = this.y + this.mid.h;
		this.end.x = this.x + this.w;
		this.end.y = this.y + this.h;
		if (this.active) {
			if (World.game.isAIVAI) {
				this.AIControl();
			}
			else {
				if (this.x > Room.mid.x) {
					this.control(KeyCode.Up, KeyCode.Down, KeyCode.Left, KeyCode.Right, KeyCode.Enter);
				}
				else {
					if (World.game.isPVP) {
						this.control(KeyCode.W, KeyCode.S, KeyCode.A, KeyCode.D, KeyCode.Space);
					}
					else {
						this.AIControl();
					}
				}
			}
			const yydif = this.y - this.yy;
			if (Math.abs(yydif) > 0) {
				this.y -= yydif * 0.2;
			}
		}
		if (this.hitCount >= World.paddle.abilityCost) {
			this.canUseAbility = true;
		}
		this.render();
		this.alarmUpdate();
	}
	this.render = function() {
		if (this.visible) {
			Draw.setColor(C.white);
			if (this.isSticky) {
				Draw.setColor(C.yellow);
			}
			if (this.isFreezing) {
				Draw.setColor(C.ltgray);
				Emtr.preset('puff');
				Emtr.setArea(this.mid.x, this.mid.x, this.y, this.end.y);
				Emtr.emit(1);
			}
			if (this.isInverting) {
				Draw.rect(Room.x + this.x, Room.y + this.y, this.w, -(this.y - Room.y));
				Draw.rect(Room.x + this.x, Room.y + this.end.y, this.w, Room.end.y - this.end.y);
			}
			else {
				Draw.rect(Room.x + this.x, Room.y + this.y, this.w, this.h);
			}
		}
		if (World.debug) {
			Draw.setColor(C.white);
			Draw.rect(this.x - 10, this.yy, this.w + 20, -2);
			Draw.setHAlign(Align.c);
			Draw.setVAlign(Align.b);
			Draw.font('12px');
			Draw.text(this.mid.x, this.yy - 12, this.hitCount + (World.game.type === World.gameType.crazy? ' / ' + World.paddle.abilityCost : ''));
			if (World.game.isAIVAI || (!World.game.isPVP && this.x < Room.mid.x)) {
				Draw.rect(Room.x + (this.x > Room.mid.x? this.end.x + 2 : this.x - 4), Room.y + this.mid.y, 2, -this.aiTargetGapY);
				Draw.circle(Room.x + (this.x > Room.mid.x? this.end.x + 3 : this.x - 3), Room.y + this.mid.y - this.aiTargetGapY, 2);
				if (this.alarm[4] > 0 && this.alarm[4] != null) {
					Draw.setColor(World.paddle.abilityColor[this.ability]);
					Draw.rect((this.x > Room.mid.x? this.end.x + 5 : this.x - 7), this.yy, 2, this.h * (this.alarm[4] / this.useAbilityInterval));
				}
			}
		}
	}
	this.alarmUpdate = function() {
		for (let i = 0; i < this.alarm.length; i++) {
			if (this.alarm[i] != null) {
				if (this.alarm[i] > 0) {
					this.alarm[i] = Math.max(0, this.alarm[i] - Time.deltaTime);
				}
				else if (this.alarm[i] != -1) {
					switch (i) {
						case 0:
							this.active = true;
							this.isFreezing = false;
						break;
						case 1:
							this.isInverting = false;
						break;
						case 2:
							this.isSticky = false;
						break;
						case 3:
							this.aiTargetGapY = Math.range(0, h / 4) * Math.randomNegator();
						break;
						case 4:
							if (World.game.type === World.gameType.crazy && World.scene === World.sceneType.game) {
								if (this.active && this.canUseAbility) {
									this.useAbility();
								}
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

function Snowball(x, y, r, dx) {
	this.active = true;
	this.visible = true;
	this.x = x;
	this.y = y;
	this.r = r;
	this.i = OBJ.take('snowball').length;
	this.xp = x;
	this.dx = dx;
	this.bound = {
		l: x - r,
		r: x + r,
		t: y - r,
		b: y + r
	}
	this.boundUpdate = function() {
		this.bound.l = this.x - this.r;
		this.bound.r = this.x + this.r;
		this.bound.t = this.y - this.r;
		this.bound.b = this.y + this.r;
	}
	this.hitPaddle = function(p) {
		p.gotHitBySnowball();
		Emtr.setArea(this.x, this.x, this.y, this.y);
	 	Emtr.preset('puff');
	 	Emtr.emit(10);
		OBJ.trash('snowball', this.i);
	}
	this.update = function() {
		if (this.active) {
			this.xp = this.x;
			this.x += this.dx;
			this.boundUpdate();
			if (this.bound.l > Room.end.x || this.bound.r < Room.x) {
				OBJ.trash('snowball', this.i);
			}
			for (let i = 0; i < OBJ.take('paddle').length; i++) {
				let p = OBJ.take('paddle')[i];
				if (p.x > Room.mid.x) {
					if (this.dx > 0) {
						if (this.x > p.mid.x && this.xp <= p.mid.x
						 && this.bound.b > p.y && this.bound.t < p.end.y) {
							this.hitPaddle(p);
						}
					}
				}
				else {
					if (this.dx < 0) {
						if (this.x < p.mid.x && this.xp >= p.mid.x
						 && this.bound.b > p.y && this.bound.t < p.end.y) {
							this.hitPaddle(p);
						}
					}
				}
			}
		}
		this.render();
	}
	this.render = function() {
		if (this.visible) {
			Draw.setColor(C.blue);
			Draw.circle(Room.x + this.x, Room.y + this.y, this.r);
			Emtr.preset('fire');
			Emtr.setColor(C.blue);
			Emtr.setArea(this.bound.l, this.bound.r, this.bound.t, this.bound.b);
			Emtr.emit(1);
		}
	}
}

function IllusionBall(x, y, r) {
	this.active = true;
	this.visible = true;
	this.x = x;
	this.y = y;
	this.r = r;
	this.i = OBJ.take('illusionball').length;
	this.xp = x;
	this.yp = y;
	this.bound = {
		l: x - r,
		r: x + r,
		t: y - r,
		b: y + r
	}
	this.alarm = [World.illusionball.life];
	this.isTarget = false;
	this.boundUpdate = function() {
		this.bound.l = this.x - this.r;
		this.bound.r = this.x + this.r;
		this.bound.t = this.y - this.r;
		this.bound.b = this.y + this.r;
	}
	this.update = function() {
		if (this.active) {
			this.xp = this.x;
			this.yp = this.y;
			this.x += this.dx;
			this.y += this.dy;
			this.boundUpdate();
			if (this.bound.t <= Room.y || this.bound.b >= Room.end.y) {
				this.y = this.yp;
				this.dy = -this.dy;
			}
		}
		this.render();
		this.alarmUpdate();
	}
	this.render = function() {
		if (this.visible) {
			Draw.setColor(C.red);
			Draw.setAlpha(Math.clamp((this.alarm[0] / (World.illusionball.life * 0.2)), 0, 1));
			if (this.alarm[0] <= 0) {
				Draw.setAlpha(0);
			}
			Draw.circle(Room.x + this.x, Room.y + this.y, this.r);
			Draw.setAlpha(1);
			Emtr.setArea(this.bound.l, this.bound.r, this.bound.t, this.bound.b);
			Emtr.preset('fire');
			Emtr.emit(1);
		}
		if (World.debug) {
			if (this.isTarget && (!World.game.isPVP && this.dx < 0 || World.game.isAIVAI)) {
				const gap = 7;
				const size = 1;
				Draw.setAlpha(Math.clamp((this.alarm[0] / (World.illusionball.life * 0.2)), 0, 1));
				if (this.alarm[0] <= 0) {
					Draw.setAlpha(0);
				}
				Draw.setColor(C.white);
				Draw.rect(Room.x + this.bound.l - gap, Room.y + this.y - size, (this.r + gap) * 2, size * 2);
				Draw.rect(Room.x + this.x - size, Room.y + this.bound.t - gap, size * 2, (this.r + gap) * 2);
				Draw.circle(Room.x + this.x, Room.y + this.y, this.r + size * 2);
				Draw.setColor(C.red);
				Draw.circle(Room.x + this.x, Room.y + this.y, this.r);
				Draw.setAlpha(1);
			}
		}
	}
	this.alarmUpdate = function() {
		for (let i = 0; i < this.alarm.length; i++) {
			if (this.alarm[i] != null) {
				if (this.alarm[i] > 0) {
					this.alarm[i] = Math.max(0, this.alarm[i] - Time.deltaTime);
				}
				else if (this.alarm[i] != -1) {
					switch (i) {
						case 0:
							OBJ.trash('illusionball', this.i);
						break;
						default: break;
					}
					if (this.alarm[i] <= 0) this.alarm[i] = -1;
				}
			}
		}
	}
}

const BranthRequestAnimationFrame = window.requestAnimationFrame
	|| window.msRequestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| function(f) { return setTimeout(f, 1000 / 60) }

window.addEventListener('keyup', (e) => { Inpt.up(e); });
window.addEventListener('keydown', (e) => { Inpt.down(e); });

const World = {
	sceneType: {
		menu: 'menu',
		game: 'game',
		result: 'result'
	},
	scene: 'menu',
	menu: {
		item: ['Classic AI', 'Crazy AI', 'Classic PVP', 'Crazy PVP', 'AI vs AI', 'CRAZY'],
		itemGap: 14,
		itemSize: 90,
		itemIndex: 0,
		itemDescription: [
			'Play the classic pong against computer.',
			'Play against computer with crazy ability enabled.',
			'Play the classic pong with friends.',
			'Play with friends with crazy ability enabled.',
			'Watch computer play the classic pong.',
			'NEW! Watch computer goes crazy!'
		]
	},
	game: {
		type: 'classic',
		isPVP: false,
		isAIVAI: false,
		extraBallSpawnInterval: 30000
	},
	gameType: {
		classic: 'classic',
		crazy: 'crazy'
	},
	time: {
		amount: 180900,
		current: 180900
	},
	debug: false,
	score: [0, 0],
	ball: {
		r: 8,
		spd: 3,
		spdMax: 10,
		spdIncrement: 1,
		spdIncInterval: 5,
		resetTime: 2000,
		burnTime: 3000
	},
	paddle: {
		w: 12,
		h: 64,
		spd: 5,
		mid: {
			w: 6,
			h: 32
		},
		ability: ['FRZ', 'ISH', 'IBL', 'SCB'],
		abilityCost: 3,
		abilityColor: [C.blue, C.gray, C.red, C.yellow],
		freezeInterval: 2000,
		invertInterval: 5000,
		stickyInterval: 3000,
		aiTargetGapYInterval: 1000,
		useAbilityInterval: {
			min: 300,
			max: 1500
		}
	},
	snowball: {
		r: 4,
		spd: 12
	},
	illusionball: {
		life: 1000,
		amount: 3
	},
	UI: {
		board: {
			h: 32,
			mid: {
				h: 16
			}
		}
	},
	shake: {
		mag: 0.4,
		int: 400
	},
	alarm: [],
	resetGame: function() {
		this.score = [0, 0];
		this.time.current = this.time.amount;
	},
	changeScene: function(s) {
		this.scene = s;
		switch (this.scene) {
			case this.sceneType.menu:
				OBJ.clear('ball');
				OBJ.clear('paddle');
				OBJ.clear('particle');
				OBJ.clear('bparticle');
				if (!Audi.isPlaying('bgm')) {
					Audi.loop('bgm');
				}
				break;
			case this.sceneType.game:
				OBJ.clear('particle');
				OBJ.clear('bparticle');
				this.resetGame();
				let b = new Ball(Room.mid.x, Room.mid.y, this.ball.r);
				b.score = 3;
				b.reset();
				OBJ.add('ball', b);
				OBJ.add('paddle', new Paddle(Room.x + 24, Room.mid.y - this.paddle.mid.h, this.paddle.w, this.paddle.h));
				OBJ.add('paddle', new Paddle(Room.end.x - 24 - this.paddle.w, Room.mid.y - this.paddle.mid.h, this.paddle.w, this.paddle.h));
				b.reach.x = OBJ.take('paddle')[1].x;
				this.alarm[0] = this.game.extraBallSpawnInterval;
				Audi.stop('bgm');
				break;
			case this.sceneType.result:
				Audi.loop('bgm');
				break;
			default: break;
		}
	},
	update: function() {
		if (this.scene === this.sceneType.menu) {
			if (Inpt.keyDown(KeyCode.A) || Inpt.keyDown(KeyCode.Left)) {
				if (this.menu.itemIndex <= 0) {
					this.menu.itemIndex = this.menu.item.length - 1;
				}
				else {
					this.menu.itemIndex = Math.max(0, this.menu.itemIndex - 1);
				}
				Audi.play('select');
			}
			if (Inpt.keyDown(KeyCode.D) || Inpt.keyDown(KeyCode.Right)) {
				if (this.menu.itemIndex >= this.menu.item.length - 1) {
					this.menu.itemIndex = 0;
				}
				else {
					this.menu.itemIndex = Math.min(this.menu.item.length - 1, this.menu.itemIndex + 1);
				}
				Audi.play('select');
			}
			if (Inpt.keyDown(KeyCode.Space) || Inpt.keyDown(KeyCode.Enter)) {
				switch (this.menu.itemIndex) {
					case 1:
						this.game.type = this.gameType.crazy;
						this.game.isPVP = false;
						this.game.isAIVAI = false;
						break;
					case 2:
						this.game.type = this.gameType.classic;
						this.game.isPVP = true;
						this.game.isAIVAI = false;
						break;
					case 3:
						this.game.type = this.gameType.crazy;
						this.game.isPVP = true;
						this.game.isAIVAI = false;
						break;
					case 4:
						this.game.type = this.gameType.classic;
						this.game.isPVP = false;
						this.game.isAIVAI = true;
						break;
					case 5:
						this.game.type = this.gameType.crazy;
						this.game.isPVP = false;
						this.game.isAIVAI = true;
						break;
					default:
						this.game.type = this.gameType.classic;
						this.game.isPVP = false;
						this.game.isAIVAI = false;
						break;
				}
				this.changeScene(this.sceneType.game);
				Audi.play('confirm');
			}
		}
		if (this.scene === this.sceneType.game) {
			this.time.current = Math.max(0, this.time.current - Time.deltaTime);
			if (this.time.current <= 0) {
				this.changeScene(this.sceneType.result);
			}
			if (Inpt.keyDown(KeyCode.Escape)) {
				this.changeScene(this.sceneType.menu);
				Audi.play('confirm');
			}
		}
		if (this.scene === this.sceneType.result) {
			if (Inpt.keyDown(KeyCode.Escape)) {
				this.changeScene(this.sceneType.menu);
				Audi.play('confirm');
			}
		}
		this.debug = Inpt.keyHold(KeyCode.U);
		this.alarmUpdate();
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
								if (this.scene === this.sceneType.game && this.time.current > this.game.extraBallSpawnInterval) {
									let r = this.ball.r * 0.75;
									let sc = 1;
									if (OBJ.take('ball').length === 4) {
										r = this.ball.r * 2;
										sc = 5;
									}
									this.spawnExtraBall(r, sc);
									this.alarm[0] = this.game.extraBallSpawnInterval;
								}
							break;
							default: break;
						}
						if (this.alarm[i] <= 0) this.alarm[i] = -1;
					}
				}
			}
		}
	},
	spawnExtraBall: function(r, sc) {
		let b = new Ball(Room.mid.x, Room.mid.y, r);
		b.score = sc;
		b.reach.x = OBJ.take('paddle')[1].x;
		b.reset();
		OBJ.add('ball', b);
	}
}

const Time = new BranthTime();
const Room = new BranthScene(0, 0, 640, 360 - World.UI.board.h);
const View = new BranthScene(0, 0, 640, 360);
const Inpt = new BranthInput();
const Canv = new BranthCanvas(View.w, View.h, C.black);
const Draw = new BranthDraw(Canv.getContext('2d'));
const OBJ = new BranthObject(['bparticle', 'ball', 'paddle', 'snowball', 'illusionball', 'particle']);
const Emtr = new BranthEmitter('particle');
const Audi = new BranthAudio(['bgm', 'select', 'confirm', 'hit1', 'hit2', 'hit3', 'score1', 'score2', 'ability']);
Audi.s[Audi.getIndex('select')].volume = 0.2;

const UI = {
	update: function() {
		this.render();
	},
	render: function() {
		if (World.scene === World.sceneType.menu) {
			Draw.setColor(C.white);
			Draw.font('48px');
			Draw.setHAlign(Align.c);
			Draw.setVAlign(Align.t);
			Draw.setShadow(0, 2, 2, C.gray);
			Draw.text(View.mid.x, View.y + 32, 'Crazy Pong PVP');
			Draw.resetShadow();
			Draw.setVAlign(Align.m);
			for (let i = 0; i < World.menu.item.length; i++) {
				let itm = {
					x: View.mid.x
					 - ((World.menu.itemSize / 2 + World.menu.itemGap / 2) * World.menu.item.length)
					 + ((World.menu.itemSize + World.menu.itemGap) * i)
					 + World.menu.itemGap / 2,
					y: View.mid.y - World.menu.itemSize / 2,
					size: World.menu.itemSize,
					addY: function(n) {
						this.y += n;
					}
				}
				Draw.setColor(C.white);
				if (World.menu.itemIndex === i) {
					itm.addY(-3 + Math.sin(Time.time * 0.01) * 3);
					Draw.setShadow(0, 2, 10, C.red);
					Draw.rect(itm.x, itm.y, itm.size, itm.size);
					Draw.resetShadow();
					Draw.setColor(C.black);
					Draw.font('bold 13px');
					Draw.text(itm.x + itm.size / 2, itm.y + itm.size / 2, World.menu.item[i]);
					Draw.setColor(C.red);
					Draw.rect(itm.x + 4, itm.y + itm.size + World.menu.itemGap, itm.size - 8, 8);
					if (i === 5) {
						Draw.setColor(C.red);
						Draw.rect(itm.x, itm.y + 7, itm.size, 19);
						Draw.setColor(C.white);
						Draw.setHAlign(Align.c);
						Draw.setVAlign(Align.m);
						Draw.font('bold 10px');
						Draw.text(itm.x + itm.size / 2, itm.y + 17, 'NEW!');
					}
				}
				else {
					Draw.setAlpha(0.8);
					Draw.setShadow(0, 2, 5, C.white);
					Draw.rect(itm.x + 2, itm.y + 2, itm.size - 4, itm.size - 4);
					Draw.resetShadow();
					Draw.setColor(C.gray);
					Draw.font('bold 12px');
					Draw.text(itm.x + itm.size / 2, itm.y + itm.size / 2, World.menu.item[i]);
					if (i === 5) {
						Draw.setColor(C.red);
						Draw.rect(itm.x + 2, itm.y + 10, itm.size - 4, 16);
						Draw.setColor(C.white);
						Draw.setHAlign(Align.c);
						Draw.setVAlign(Align.m);
						Draw.font('bold 9px');
						Draw.text(itm.x + itm.size / 2, itm.y + 18, 'NEW!');
					}
					Draw.setAlpha(1);
				}
			}
			Draw.setColor(C.white);
			Draw.rect(View.x, View.end.y, View.w, -World.UI.board.h);
			Draw.setColor(C.black);
			Draw.font('bold 12px');
			Draw.text(View.mid.x, View.end.y - World.UI.board.mid.h, World.menu.itemDescription[World.menu.itemIndex]);
			Emtr.preset('largefire');
			Emtr.setArea(View.x, View.end.x, View.end.y, View.end.y);
			Emtr.setLayer('bparticle');
			Emtr.emit(1);
			Emtr.resetLayer();
		}
		if (World.scene === World.sceneType.game) {
			const p = OBJ.take('paddle');
			Draw.setColor(C.white);
			Draw.rect(View.x, View.end.y, View.w, -World.UI.board.h);
			Draw.setColor(C.black);
			Draw.font('bold 16px');
			Draw.setHAlign(Align.c);
			Draw.setVAlign(Align.m);
			Draw.text(View.mid.x, View.end.y - World.UI.board.mid.h, ':');
			Draw.setHAlign(Align.r);
			Draw.text(View.mid.x - 6, View.end.y - World.UI.board.mid.h, Time.toClockMinutes0(World.time.current));
			Draw.setHAlign(Align.l);
			Draw.text(View.mid.x + 6, View.end.y - World.UI.board.mid.h, Time.toClockSeconds0(World.time.current));
			Draw.font('24px');
			Draw.setHAlign(Align.r);
			Draw.text(View.mid.x - 48, View.end.y - World.UI.board.mid.h, World.score[0]);
			Draw.setHAlign(Align.l);
			Draw.text(View.mid.x + 48, View.end.y - World.UI.board.mid.h, World.score[1]);
			Draw.font('bold 16px');
			Draw.setHAlign(Align.c);
			if (World.game.type === World.gameType.crazy) {
				for (let i = 0; i < 2; i++) {
					const boxActive = p[i].active && p[i].canUseAbility;
					const sc = boxActive? Math.sin(Time.time * 0.02) : 0;
					const root = {
						x: View.x + (View.w - 48) * i,
					}
					const box = {
						active: boxActive,
						x: root.x + 2 - sc / 2,
						y: View.end.y - World.UI.board.h + 2 + sc / 2,
						w: 44 + sc,
						h: World.UI.board.h - 4 - sc,
						c: World.paddle.abilityColor[p[i].ability],
						mid: {
							x: View.x + 24,
							y: View.end.y - World.UI.board.mid.h
						},
						update: function() {
							this.mid.x = this.x + this.w / 2;
							this.mid.y = this.y + this.h / 2;
						}
					}
					box.update();
					Draw.setColor(box.c);
					Draw.rect(box.x, box.y, box.w, box.h);
					Draw.setColor(C.white);
					Draw.font('bold ' + (16 + sc / 4) + 'px');
					Draw.setShadow(0, 0, 5 + 3 * Math.max(0, sc), C.black);
					Draw.text(box.mid.x, box.mid.y, World.paddle.ability[p[i].ability]);
					Draw.resetShadow();
					Draw.setAlpha(0.5);
					Draw.setColor(C.black);
					const abilityCostScale = (Math.min(World.paddle.abilityCost, p[i].hitCount) / World.paddle.abilityCost);
					Draw.rect(box.x, box.y, box.w, box.h * (p[i].active? (1 - abilityCostScale) : 1));
					Draw.setAlpha(1);
					if (box.active) {
						Emtr.preset('fire');
						Emtr.setSize(5, 7);
						Emtr.setColor(box.c);
						Emtr.setArea(box.x, box.x + box.w, box.y, box.y + box.h);
						Emtr.emit(1);
					}
				}
			}
		}
		if (World.scene === World.sceneType.result) {
			Draw.setColor(C.white);
			Draw.rect(View.x, View.end.y, View.w, -World.UI.board.h);
			Draw.setAlpha(0.2);
			Draw.setColor(C.black);
			Draw.rect(View.x, View.y, View.w, View.h);
			Draw.setAlpha(1);
			Draw.setColor(C.white);
			Draw.setHAlign(Align.c);
			Draw.setVAlign(Align.b);
			Draw.font('48px');
			let gameOverText = World.score[0] > World.score[1]? 'COMPUTER WIN!' : (World.score[0] < World.score[1]? 'YOU WIN!' : "IT'S A TIE!");
			if (World.game.isPVP) {
				gameOverText = World.score[0] > World.score[1]? 'P2 WIN!' : (World.score[0] < World.score[1]? 'P1 WIN!' : "IT'S A TIE!");
			}
			if (World.game.isAIVAI) {
				gameOverText = World.score[0] > World.score[1]? 'LEFT WIN!' : (World.score[0] < World.score[1]? 'RIGHT WIN!' : "IT'S A TIE!");
			}
			Draw.text(View.mid.x, View.mid.y - 48, gameOverText);
			Draw.setVAlign(Align.m);
			Draw.text(View.mid.x - 96, View.mid.y, World.score[0]);
			Draw.text(View.mid.x + 96, View.mid.y, World.score[1]);
			Draw.font('36px');
			Draw.text(View.mid.x, View.mid.y, 'vs');
			Draw.setVAlign(Align.t);
			Draw.font('bold 12px');
			Draw.text(View.mid.x, View.mid.y + 72, 'Press <ESCAPE> to back to menu.');
		}
		if (World.debug) {
			if (World.scene === World.sceneType.game) {
				Draw.setColor(C.white);
				Draw.setHAlign(Align.c);
				Draw.setVAlign(Align.m);
				Draw.font('12px');
				Draw.text(View.mid.x, View.y + 16 * 1, 'Ball Amount: ' + OBJ.take('ball').length);
			}
		}
	}
}

const Game = {
	start: function() {
		World.changeScene(World.sceneType.menu);
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