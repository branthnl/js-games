const RN = {};

RN.Css = document.createElement("style");
RN.Css.innerHTML = `
	* {
		margin: 0;
		padding: 0;
	}
	body {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}
	canvas {
		width: 100%;
		height: 100%;
	}
`;

RN.Canvas = document.createElement("canvas");
RN.Ctx = RN.Canvas.getContext("2d");

RN.Time = {
	time: 0,
	lastTime: 0,
	deltaTime: 0,
	update(t) {
		this.lastTime = this.time;
		this.time = t;
		this.deltaTime = this.time - this.lastTime;
	}
};

RN.Room = {
	w: 300,
	h: 150,
	mid: {
		w: 150,
		h: 75
	},
	resize() {
		const b = RN.Canvas.getBoundingClientRect();
		this.w = RN.Canvas.width = b.width;
		this.h = RN.Canvas.height = b.height;
		this.mid.w = this.w * 0.5;
		this.mid.h = this.h * 0.5;
	}
};

RN.Align = {
	l: "left",
	r: "right",
	c: "center",
	t: "top",
	b: "bottom",
	m: "middle"
};

RN.Draw = {
	ctx: RN.Ctx,
	setFont(font) {
		this.ctx.font = font;
	},
	setColor(c) {
		this.ctx.fillStyle = c;
		this.ctx.strokeStyle = c;
	},
	setHVAlign(h, v) {
		this.ctx.textAlign = h;
		this.ctx.textBaseline = v;
	},
	text(x, y, text) {
		this.ctx.fillText(text, x, y);
	},
	draw(outline=false) {
		if (outline) this.ctx.stroke();
		else this.ctx.fill();
	},
	rect(x, y, w, h, outline=false) {
		this.ctx.beginPath();
		this.ctx.rect(x, y, w, h);
		this.draw(outline);
	},
	clear() {
		this.ctx.clearRect(0, 0, RN.Room.w, RN.Room.h);
	}
};

RN.KeyCode = {
	Space: 32,
	Left: 37,
	Up: 38,
	Right: 39,
	Down: 40,
	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 90
};

RN.Input = {
	preventedKeys: [
		RN.KeyCode.Up,
		RN.KeyCode.Left,
		RN.KeyCode.Down,
		RN.KeyCode.Right,
		RN.KeyCode.Space
	],
	Key: [],
	setup() {
		for (const k of Object.values(RN.KeyCode)) {
			this.Key[k] = {
				held: false,
				pressed: false,
				released: false,
				up() {
					this.held = false;
					this.released = true;
				},
				down() {
					this.held = true;
					this.pressed = true;
				},
				reset() {
					this.pressed = false;
					this.released = false;
				}
			};
		}
	},
	reset() {
		for (const k of Object.keys(this.Key)) {
			this.Key[k].reset();
		}
	},
	keyUp(keyCode) {
		return this.Key[keyCode].released;
	},
	keyDown(keyCode) {
		return this.Key[keyCode].pressed;
	},
	keyHold(keyCode) {
		return this.Key[keyCode].held;
	},
	eventKeyUp(e) {
		try {
			this.Key[e.keyCode].up();
		}
		catch {}
	},
	eventKeyDown(e) {
		if (this.preventedKeys.includes(e.keyCode)) e.preventDefault();
		const i = this.Key[e.keyCode];
		try {
			if (!i.held) i.down();
		}
		catch {}
	},
};

RN.OBJ = {
	id: 0,
	list: {},
	add(key) {
		this.list[key] = [];
	},
	push(key, i) {
		this.list[key].push(i);
	},
	take(key) {
		return this.list[key];
	},
	update() {
		for (const o of Object.values(this.list)) {
			for (let i = o.length - 1; i >= 0; --i) {
				o[i].update();
			}
		}
	},
	render() {
		for (const o of Object.values(this.list)) {
			for (let i = o.length - 1; i >= 0; --i) {
				o[i].render();
			}
		}
	}
};

class GameObject {
	constructor(x, y) {
		this.id = RN.OBJ.id++;
		this.x = x;
		this.y = y;
	}
	update() {}
	render() {}
}

class Player extends GameObject {
	constructor(x, y, color, moveSpeed, keyCodeLeft, keyCodeRight) {
		super(x, y);
		this.w = 32;
		this.h = 32;
		this.coin = 0;
		this.color = color;
		this.moveSpeed = moveSpeed;
		this.keyCodeLeft = keyCodeLeft;
		this.keyCodeRight = keyCodeRight;
		this.xprevious = this.x;
	}
	update() {
		// Player movement
		this.xprevious = this.x;
		if (RN.Input.keyHold(this.keyCodeLeft)) {
			this.x -= this.moveSpeed;
		}
		if (RN.Input.keyHold(this.keyCodeRight)) {
			this.x += this.moveSpeed;
		}

		// Clamp position
		if (this.x <= 0 || this.x >= RN.Room.w) {
			this.x = this.xprevious;
		}
	}
	render() {
		RN.Draw.setColor(this.color);
		RN.Draw.rect(this.x - this.w * 0.5, this.y - this.h, this.w, this.h);
	}
}

class FallingObject extends GameObject {
	constructor(x, y, speed) {
		super(x, y);
		this.speed = speed;
	}
	update() {
		const o = RN.OBJ.take("Player");
		for (let i = o.length - 1; i >= 0; --i) {
		}
	}
	collisionWithPlayer(player) {}
}

class Coin extends FallingObject {
	constructor(x, y, speed) {
		super(x, y, speed);
	}
}

class Stone extends FallingObject {
	constructor(x, y, speed) {
		super(x, y, speed);
	}
}

RN.Game = {
	start() {
		RN.Input.setup();
		window.onresize = () => RN.Room.resize();
		window.onkeyup = (e) => RN.Input.eventKeyUp(e);
		window.onkeydown = (e) => RN.Input.eventKeyDown(e);

		document.head.appendChild(RN.Css);
		document.body.appendChild(RN.Canvas);

		RN.Room.resize();

		RN.OBJ.add("Player");
		RN.OBJ.push("Player", new Player(RN.Room.w * 0.2, RN.Room.h * 0.8, "yellow", 5, RN.KeyCode.A, RN.KeyCode.D));
		RN.OBJ.push("Player", new Player(RN.Room.w * 0.4, RN.Room.h * 0.8, "green" , 5, RN.KeyCode.F, RN.KeyCode.H));
		RN.OBJ.push("Player", new Player(RN.Room.w * 0.6, RN.Room.h * 0.8, "blue"  , 5, RN.KeyCode.J, RN.KeyCode.L));
		RN.OBJ.push("Player", new Player(RN.Room.w * 0.8, RN.Room.h * 0.8, "red"   , 5, RN.KeyCode.Left, RN.KeyCode.Right));

		window.requestAnimationFrame(RN.Game.render);
	},
	render(t) {
		RN.Time.update(t);

		// Logic
		RN.OBJ.update();

		// Render
		RN.Draw.clear();
		RN.OBJ.render();
		RN.Draw.setColor("red");
		RN.Draw.setHVAlign(RN.Align.r, RN.Align.b);
		RN.Draw.text(RN.Room.w - 10, RN.Room.h - 10, `(${~~RN.Room.w}, ${~~RN.Room.h})`);

		// Reset
		RN.Input.reset();
		window.requestAnimationFrame(RN.Game.render);
	}
};

RN.Game.start();