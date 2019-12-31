const C = {
	red: 'red',
	blue: 'blue',
	gray: 'gray',
	green: 'green',
	black: 'black',
	white: 'white',
	yellow: 'yellow'
}

Math.clamp = function(a, b, c) {
	// Clamp a between b and c
	return Math.min(c, Math.max(b, a));
}

Math.range = function(min, max) {
	return Math.random() * (max - min) + min;
}

Math.degtorad = function(d) {
	return d * Math.PI / 180;
}

Math.radtodeg = function(d) {
	return d * 180 / Math.PI;
}

Math.lengthdir_x = function(l, d) {
	return -Math.sin(Math.degtorad(d)) * l;
}

Math.lengthdir_y = function(l, d) {
	return Math.cos(Math.degtorad(d)) * l;
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
}

function BranthRoom(w, h) {
	this.w = w;
	this.h = h;
	this.mid = {
		w: w / 2,
		h: h / 2
	}
}

function BranthDraw(ctx) {
	this.setAlpha = function(a) {
		ctx.globalAlpha = a;
	}
	this.setColor = function(c) {
		ctx.fillStyle = c;
	}
	this.circle = function(x, y, r) {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
	this.clear = function(room) {
		ctx.clearRect(0, 0, room.w, room.h);
	}
}

function BranthCanvas(w, h) {
	let c = document.createElement('canvas');
	c.width = w;
	c.height = h;
	c.style.backgroundColor = C.black;
	return c;
}

const Time = new BranthTime();
const Room = new BranthRoom(360, 640);
const canvas = new BranthCanvas(Room.w, Room.h);
const Draw = new BranthDraw(canvas.getContext('2d'));

let OBJ = {
	o: [[],[]],
	add: function(k, o) {
		let i = this.getIndexFromKey(k);
		this.o[i].push(o);
	},
	take: function(k) {
		return this.o[this.getIndexFromKey(k)];
	},
	trash: function(k, i) {
		delete this.o[this.getIndexFromKey(k)][i];
	},
	getIndexFromKey: function(k) {
		let i = 0;
		switch (k) {
			case 'ball':
			default: break;
		}
		return i;
	}
}

function drawAim(x, y, r, a) {
	Draw.setAlpha(a);
	Draw.setColor(C.white);
	Draw.circle(x, y, r);
	Draw.setAlpha(1);
}

function Ball(x, y, r, c) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.c = c;
	this.dx = 0;
	this.dy = 0;
	this.spd = 5;
	this.angle = 160;
	this.angleTo = 180;
	this.bound = {
		l: x - r,
		r: x + r,
		t: y - r,
		b: y + r
	}
	this.previous = {
		x: x,
		y: y
	}
	this.update = function() {
		this.angle += Math.sin(Math.degtorad(this.angleTo - this.angle)) * 10;
		this.previous.x = this.x;
		this.previous.y = this.y;
		this.x += this.dx;
		this.y += this.dy;
		this.bound.l = this.x - this.r;
		this.bound.r = this.x + this.r;
		this.bound.t = this.y - this.r;
		this.bound.b = this.y + this.r;

		// Collision check
		if (this.bound.l <= 0 || this.bound.r >= Room.w) {
			this.x = this.previous.x;
			this.dx = -this.dx;
		}

		// Aim system
		let calculatedBall = {
			x: this.x,
			y: this.y,
			r: 5,
			dx: Math.lengthdir_x(this.spd, this.angle),
			dy: Math.lengthdir_y(this.spd, this.angle),
			bound: {
				l: x - r,
				r: x + r,
				t: y - r,
				b: y + r
			},
			previous: {
				x: x,
				y: y
			}
		}
		let i = 0;
		let count = 100 - (Math.round(Time.time / 30) % 100);
		// console.log(count);
		while (i < 200) {
			calculatedBall.previous.x = calculatedBall.x;
			calculatedBall.previous.y = calculatedBall.y;
			calculatedBall.x += calculatedBall.dx;
			calculatedBall.y += calculatedBall.dy;
			calculatedBall.bound.l = calculatedBall.x - calculatedBall.r;
			calculatedBall.bound.r = calculatedBall.x + calculatedBall.r;
			calculatedBall.bound.t = calculatedBall.y - calculatedBall.r;
			calculatedBall.bound.b = calculatedBall.y + calculatedBall.r;

			// Collision check
			if (calculatedBall.bound.l <= 0 || calculatedBall.bound.r >= Room.w) {
				calculatedBall.x = calculatedBall.previous.x;
				calculatedBall.dx = -calculatedBall.dx;
			}
			if (count % 10 === 0) {
				drawAim(calculatedBall.x, calculatedBall.y, calculatedBall.r, 1 - i / 200);
			}
			count++;
			i++;
		}
	}
	this.render = function() {
		Draw.setColor(this.c);
		Draw.circle(this.x, this.y, this.r);
	}
}

const Game = {
	start: function() {
		let b = new Ball(Room.mid.w, Room.h - 32, 8, C.white);
		OBJ.add('ball', b);
		main();
	},
	update: function() {
		Draw.clear(Room);
		for (let i = 0; i < OBJ.o.length; i++) {
			for (let j = 0; j < OBJ.o[i].length; j++) {
				let o = OBJ.o[i][j] || null;
				if (o != null) {
					o.update();
					o.render();
				}
			}
		}
	}
}

function mouseMove(e) {
	const b = OBJ.take('ball')[0];
	const m = {
		x: e.clientX - canvas.offsetLeft - b.x,
		y: e.clientY - canvas.offsetTop - b.y
	}
	b.angleTo = -Math.radtodeg(Math.atan2(m.x, m.y));
}

function touchMove(e) {
	const b = OBJ.take('ball')[0];
	const m = {
		x: e.touches[e.touches.length - 1].clientX - canvas.offsetLeft - b.x,
		y: e.touches[e.touches.length - 1].clientY - canvas.offsetTop - b.y
	}
	b.angleTo = -Math.radtodeg(Math.atan2(m.x, m.y));
}

function main(t) {
	Time.update(t);
	Game.update();
	window.requestAnimationFrame(main);
}

window.onload = function() {
	document.body.appendChild(canvas);
	window.addEventListener('mousemove', mouseMove);
	window.addEventListener('touchmove', touchMove);
	Game.start();
}