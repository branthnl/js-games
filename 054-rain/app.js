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
	/*canvas {
		width: 100%;
		height: 100%;
	}*/
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
		// const b = RN.Canvas.getBoundingClientRect();
		const b = {
			width: 640,
			height: 360
		};
		this.w = RN.Canvas.width = b.width;
		this.h = RN.Canvas.height = b.height;
		this.mid.w = this.w * 0.5;
		this.mid.h = this.h * 0.5;
	}
};

RN.C = {
	aliceBlue: "#f0f8ff",
	antiqueWhite: "#faebd7",
	aqua: "#00ffff",
	aquamarine: "#7fffd4",
	azure: "#f0ffff",
	beige: "#f5f5dc",
	bisque: "#ffe4c4",
	black: "#000000",
	blanchedAlmond: "#ffebcd",
	blue: "#0000ff",
	blueViolet: "#8a2be2",
	brown: "#a52a2a",
	burlyWood: "#deb887",
	cadetBlue: "#5f9ea0",
	chartreuse: "#7fff00",
	chocolate: "#d2691e",
	coral: "#ff7f50",
	cornflowerBlue: "#6495ed",
	cornsilk: "#fff8dc",
	crimson: "#dc143c",
	cyan: "#00ffff",
	darkBlue: "#00008b",
	darkCyan: "#008b8b",
	darkGoldenRod: "#b8860b",
	darkGray: "#a9a9a9",
	darkGrey: "#a9a9a9",
	darkGreen: "#006400",
	darkKhaki: "#bdb76b",
	darkMagenta: "#8b008b",
	darkOliveGreen: "#556b2f",
	darkOrange: "#ff8c00",
	darkOrchid: "#9932cc",
	darkRed: "#8b0000",
	darkSalmon: "#e9967a",
	darkSeaGreen: "#8fbc8f",
	darkSlateBlue: "#483d8b",
	darkSlateGray: "#2f4f4f",
	darkSlateGrey: "#2f4f4f",
	darkTurquoise: "#00ced1",
	darkViolet: "#9400d3",
	deepPink: "#ff1493",
	deepSkyBlue: "#00bfff",
	dimGray: "#696969",
	dimGrey: "#696969",
	dodgerBlue: "#1e90ff",
	fireBrick: "#b22222",
	floralWhite: "#fffaf0",
	forestGreen: "#228b22",
	fuchsia: "#ff00ff",
	gainsboro: "#dcdcdc",
	ghostWhite: "#f8f8ff",
	gold: "#ffd700",
	goldenRod: "#daa520",
	gray: "#808080",
	grey: "#808080",
	green: "#008000",
	greenYellow: "#adff2f",
	honeyDew: "#f0fff0",
	hotPink: "#ff69b4",
	indianRed: "#cd5c5c",
	indigo: "#4b0082",
	ivory: "#fffff0",
	khaki: "#f0e68c",
	lavender: "#e6e6fa",
	lavenderBlush: "#fff0f5",
	lawnGreen: "#7cfc00",
	lemonChiffon: "#fffacd",
	lightBlue: "#add8e6",
	lightCoral: "#f08080",
	lightCyan: "#e0ffff",
	lightGoldenRodYellow: "#fafad2",
	lightGray: "#d3d3d3",
	lightGrey: "#d3d3d3",
	lightGreen: "#90ee90",
	lightPink: "#ffb6c1",
	lightSalmon: "#ffa07a",
	lightSeaGreen: "#20b2aa",
	lightSkyBlue: "#87cefa",
	lightSlateGray: "#778899",
	lightSlateGrey: "#778899",
	lightSteelBlue: "#b0c4de",
	lightYellow: "#ffffe0",
	lime: "#00ff00",
	limeGreen: "#32cd32",
	linen: "#faf0e6",
	magenta: "#ff00ff",
	maroon: "#800000",
	mediumAquaMarine: "#66cdaa",
	mediumBlue: "#0000cd",
	mediumOrchid: "#ba55d3",
	mediumPurple: "#9370db",
	mediumSeaGreen: "#3cb371",
	mediumSlateBlue: "#7b68ee",
	mediumSpringGreen: "#00fa9a",
	mediumTurquoise: "#48d1cc",
	mediumVioletRed: "#c71585",
	midnightBlue: "#191970",
	mintCream: "#f5fffa",
	mistyRose: "#ffe4e1",
	moccasin: "#ffe4b5",
	navajoWhite: "#ffdead",
	navy: "#000080",
	oldLace: "#fdf5e6",
	olive: "#808000",
	oliveDrab: "#6b8e23",
	orange: "#ffa500",
	orangeRed: "#ff4500",
	orchid: "#da70d6",
	paleGoldenRod: "#eee8aa",
	paleGreen: "#98fb98",
	paleTurquoise: "#afeeee",
	paleVioletRed: "#db7093",
	papayaWhip: "#ffefd5",
	peachPuff: "#ffdab9",
	peru: "#cd853f",
	pink: "#ffc0cb",
	plum: "#dda0dd",
	powderBlue: "#b0e0e6",
	purple: "#800080",
	rebeccaPurple: "#663399",
	red: "#ff0000",
	rosyBrown: "#bc8f8f",
	royalBlue: "#4169e1",
	saddleBrown: "#8b4513",
	salmon: "#fa8072",
	sandyBrown: "#f4a460",
	seaGreen: "#2e8b57",
	seaShell: "#fff5ee",
	sienna: "#a0522d",
	silver: "#c0c0c0",
	skyBlue: "#87ceeb",
	slateBlue: "#6a5acd",
	slateGray: "#708090",
	slateGrey: "#708090",
	snow: "#fffafa",
	springGreen: "#00ff7f",
	steelBlue: "#4682b4",
	tan: "#d2b48c",
	teal: "#008080",
	thistle: "#d8bfd8",
	tomato: "#ff6347",
	turquoise: "#40e0d0",
	violet: "#ee82ee",
	wheat: "#f5deb3",
	white: "#ffffff",
	whiteSmoke: "#f5f5f5",
	yellow: "#ffff00",
	yellowGreen: "#9acd32"
};

RN.Font = {
	H1: 48,
	H2: 36,
	H3: 24,
	H4: 16,
	H5: 14,
	H6: 10,
	Regular: "",
	Bold: "bold ",
	Italic: "italic ",
	BoldItalic: "bold italic ",
	FamilyDefault: "Montserrat, sans-serif",
	generate(size, style=RN.Font.Regular, family=RN.Font.FamilyDefault) {
		return `${style} ${size}px ${family}`;
	}
};

RN.Font.xxl = RN.Font.generate(RN.Font.H1);
RN.Font.xl  = RN.Font.generate(RN.Font.H2);
RN.Font.l   = RN.Font.generate(RN.Font.H3);
RN.Font.m   = RN.Font.generate(RN.Font.H4);
RN.Font.sm  = RN.Font.generate(RN.Font.H5);
RN.Font.s   = RN.Font.generate(RN.Font.H6);

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
	circle(x, y, r, outline=false) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, 2 * Math.PI);
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
	destroy(id) {
		for (const k of Object.keys(this.list)) {
			const o = this.list[k];
			for (let i = o.length - 1; i >= 0; --i) {
				if (o[i].id === id) {
					this.list[k].splice(i, 1);
					return;
				}
			}
		}
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
	constructor(x, y, name, color, moveSpeed, keyCodeLeft, keyCodeRight) {
		super(x, y);
		this.w = 32;
		this.h = 32;
		this.coin = 0;
		this.name = name;
		this.color = color;
		this.moveSpeed = moveSpeed;
		this.keyCodeLeft = keyCodeLeft;
		this.keyCodeRight = keyCodeRight;
		this.xprevious = this.x;
	}
	addCoin(value) {
		this.coin += value;
	}
	halfCoin() {
		this.coin *= 0.5;
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
		RN.Draw.setFont(RN.Font.m);
		RN.Draw.setColor(RN.C.black);
		RN.Draw.setHVAlign(RN.Align.c, RN.Align.b);
		RN.Draw.text(this.x, this.y - this.h - 10, this.coin);
		RN.Draw.setColor(this.color);
		RN.Draw.rect(this.x - this.w * 0.5, this.y - this.h, this.w, this.h);
	}
}

class FallingObject extends GameObject {
	constructor(x, y, size) {
		super(x, y);
		this.size = size;
	}
	update() {
		this.y += this.size * 0.5;
		if (this.y >= RN.Room.h) {
			RN.OBJ.destroy(this.id);
		}
		else {
			const o = RN.OBJ.take("Player");
			for (let i = o.length - 1; i >= 0; --i) {
				const p = o[i];
				const d = Math.hypot(p.x - this.x, p.y - p.h * 0.5 - this.y);
				if (d < this.size * 2) {
					this.collisionWithPlayer(p);
					break;
				}
			}
		}
	}
	collisionWithPlayer(player) {}
}

class Coin extends FallingObject {
	constructor(x, y, size) {
		super(x, y, size);
	}
	render() {
		RN.Draw.setColor(RN.C.gold);
		RN.Draw.circle(this.x, this.y, this.size);
	}
	collisionWithPlayer(player) {
		player.addCoin(this.size);
		RN.OBJ.destroy(this.id);
	}
}

class Stone extends FallingObject {
	constructor(x, y, size) {
		super(x, y, size);
	}
	render() {
		RN.Draw.setColor(RN.C.gray);
		RN.Draw.circle(this.x, this.y, this.size);
	}
	collisionWithPlayer(player) {
		player.halfCoin();
		RN.OBJ.destroy(this.id);
	}
}

RN.Game = {
	timer: 6000,
	spawnTimer: 0,
	spawnInterval: 20,
	spawn() {
		if (Math.random() > 0.5) {
			RN.OBJ.push("FallingObject", new Coin(Math.random() * RN.Room.w, -50, 10 + Math.ceil(Math.random() * 10)));
		}
		else {
			RN.OBJ.push("FallingObject", new Stone(Math.random() * RN.Room.w, -50, 10 + Math.ceil(Math.random() * 10)));
		}
	},
	start() {
		RN.Input.setup();
		window.onresize = () => RN.Room.resize();
		window.onkeyup = (e) => RN.Input.eventKeyUp(e);
		window.onkeydown = (e) => RN.Input.eventKeyDown(e);

		document.head.appendChild(RN.Css);
		document.body.appendChild(RN.Canvas);

		RN.Room.resize();

		RN.OBJ.add("Player");
		RN.OBJ.add("FallingObject");

		RN.OBJ.push("Player", new Player(RN.Room.w * 0.2, RN.Room.h * 0.8, "Yellow", RN.C.yellow, 5, RN.KeyCode.A, RN.KeyCode.D));
		RN.OBJ.push("Player", new Player(RN.Room.w * 0.4, RN.Room.h * 0.8, "Green" , RN.C.green , 5, RN.KeyCode.F, RN.KeyCode.H));
		RN.OBJ.push("Player", new Player(RN.Room.w * 0.6, RN.Room.h * 0.8, "Blue"  , RN.C.blue  , 5, RN.KeyCode.J, RN.KeyCode.L));
		RN.OBJ.push("Player", new Player(RN.Room.w * 0.8, RN.Room.h * 0.8, "Red"   , RN.C.red   , 5, RN.KeyCode.Left, RN.KeyCode.Right));

		window.requestAnimationFrame(RN.Game.render);
	},
	render(t) {
		RN.Time.update(t);

		// Logic
		RN.Game.timer -= RN.Time.deltaTime;
		if (RN.Game.timer <= 0) {
			const o = RN.OBJ.take("Player");
			let winnerIndex = 0;
			for (let i = o.length - 1; i > 0; --i) {
				if (o[i].coin > o[winnerIndex].coin) {
					winnerIndex = i;
				}
			}
			RN.Draw.setFont(RN.Font.xxl);
			RN.Draw.setColor(RN.C.black);
			RN.Draw.setHVAlign(RN.Align.c, RN.Align.m);
			RN.Draw.text(RN.Room.mid.w, RN.Room.mid.h, `${o[winnerIndex].name} won!`);
			return;
		}
		if (RN.Game.spawnTimer++ % RN.Game.spawnInterval === 0) {
			RN.Game.spawn();
		}
		RN.OBJ.update();

		// Render
		RN.Draw.clear();

		// -> Background
		RN.Draw.setColor(RN.C.skyBlue);
		RN.Draw.rect(0, 0, RN.Room.w, RN.Room.h);
		RN.Draw.setColor(RN.C.burlyWood);
		RN.Draw.rect(0, RN.Room.h * 0.8, RN.Room.w, RN.Room.h * 0.2);

		// -> Object
		RN.OBJ.render();

		// -> UI
		RN.Draw.setFont(RN.Font.l);
		RN.Draw.setColor(RN.C.black);
		RN.Draw.setHVAlign(RN.Align.c, RN.Align.t);
		RN.Draw.text(RN.Room.mid.w, 10, `${Math.floor(RN.Game.timer / 1000)}s`);

		// Debug
		// RN.Draw.setFont(RN.Font.s);
		// RN.Draw.setColor(RN.C.red);
		// RN.Draw.setHVAlign(RN.Align.r, RN.Align.b);
		// RN.Draw.text(RN.Room.w - 10, RN.Room.h - 10, `(${~~RN.Room.w}, ${~~RN.Room.h})`);

		// Reset
		RN.Input.reset();
		window.requestAnimationFrame(RN.Game.render);
	}
};

RN.Game.start();