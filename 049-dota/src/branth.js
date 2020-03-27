class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class BranthBehaviour {
	start() {}
	update() {}
	render() {}
}

class BranthObject extends BranthBehaviour {
	constructor(x, y) {
		super();
		this.id = Branth.OBJ.ID++;
		this.depth = 0;
		this.visible = true;
		this.xstart = x;
		this.ystart = y;
		this.x = x;
		this.y = y;
	}
}

const Branth = {};

Branth.OBJ = {
	ID: 0,
	list: {},
	add(name) {
		this.list[name] = [];
	},
	get(name, id) {
		for (let i = this.list[name].length - 1; i >= 0; i--) {
			if (this.list[name][i].id === id) {
				return this.list[name][i];
			}
		}
		return null;
	},
	take(name) {
		return this.list[name];
	},
	push(name, i, doStart=true) {
		if (doStart) i.start();
		try {
			this.list[name].push(i);
		}
		catch {
			console.error(`Code: 1\nError: Failed to push an object\nCause: Name/key not found: ${name}\nSolution: Try add \`Branth.OBJ.add("${name}");\` in your code`);
		}
		return i;
	},
	clear(name) {
		this.list[name].length = 0;
	},
	destroy(name, id) {
		for (let i = this.list[name].length - 1; i >= 0; i--) {
			if (this.list[name][i].id === id) {
				return this.list[name].splice(i, 1)[0];
			}
		}
		return null;
	},
	clearAll() {
		const k = Object.keys(this.list);
		for (let i = k.length - 1; i >= 0; i--) {
			this.list[k[i]].length = 0;
		}
	},
	updateAll() {
		const k = Object.keys(this.list);
		for (let i = k.length - 1; i >= 0; i--) {
			for (let j = this.list[k[i]].length - 1; j >= 0; j--) {
				const instance = this.list[k[i]][j];
				if (instance instanceof BranthObject) {
					instance.update();
				}
			}
		}
	},
	renderAll() {
		const h = [];
		const k = Object.keys(this.list);
		for (let i = k.length - 1; i >= 0; i--) {
			for (let j = this.list[k[i]].length - 1; j >= 0; j--) {
				const instance = this.list[k[i]][j];
				if (instance instanceof BranthObject) {
					if (instance.visible) {
						h.push(instance);
					}
				}
			}
		}
		h.sort((a, b) => a.depth < b.depth? -1 : 1);
		for (let i = h.length - 1; i >= 0; i--) {
			h[i].render();
		}
	}
};

Math.hypot = (a, b) => Math.sqrt(a*a + b*b);
Math.clamp = (a, b, c) => Math.min(c, Math.max(b, a));
Math.range = (a, b=0, c=Math.random()) => a + c * (b - a);
Math.irange = (a, b=0) => ~~Math.range(a, b);
Math.pick = (a) => a[Math.irange(a.length)];
Math.choose = (...a) => a[Math.irange(a.length)];
Math.randpop = (a) => a.splice(Math.irange(a.length), 1)[0];
Math.randneg = (a=0.5) => Math.random() < a? 1 : -1;
Math.randbool = (a=0.5) => Math.random() < a;
Math.degtorad = Math.PI / 180;
Math.radtodeg = 180 / Math.PI;
Math.lendirx = (l, d) => l * Math.cos(d * Math.degtorad);
Math.lendiry = (l, d) => l * Math.sin(d * Math.degtorad);
Math.lendir = (l, d) => new Vector2(Math.lendirx(l, d), Math.lendiry(l, d));
Math.linedis = (x1, y1, x2, y2) => Math.hypot(x2-x1, y2-y1);
Math.linedir = (x1, y1, x2, y2) => { const d = 90 - Math.atan2(x2-x1, y2-y1) * Math.radtodeg; return d < 0? d + 360 : d; };
Math.pointdis = (p1, p2) => Math.linedis(p1.x, p1.y, p2.x, p2.y);
Math.pointdir = (p1, p2) => Math.linedir(p1.x, p1.y, p2.x, p2.y);

Branth.Canvas = document.createElement("canvas");
Branth.Ctx = Branth.Canvas.getContext("2d");

Branth.Global = {};

Branth.Time = {
	time: 0,
	lastTime: 0,
	deltaTime: 0,
	update(t) {
		this.lastTime = this.time;
		this.time = t;
		this.deltaTime = this.time - this.lastTime;
	}
};

Branth.Room = {
	scale: 1,
	w: 0,
	h: 0,
	mid: {
		w: 0,
		h: 0
	},
	list: {},
	current: null,
	previous: null,
	add(name) {
		if (this.list[name] === undefined) {
			return this.list[name] = {
				name: name,
				start() {},
				render() {}
			};
		}
		else console.log(`Room already exists: ${name}`);
	},
	get(name) {
		return this.list[name];
	},
	start(name) {
		this.previous = this.current;
		this.current = this.list[name];
		this.current.start();
	},
	clear() {
		Branth.Ctx.clearRect(0, 0, this.w, this.h);
	},
	resize(options={}) {
		if (options.scale) this.scale = options.scale;
		const b = Branth.Canvas.getBoundingClientRect();
		this.w = options.w || b.width;
		this.h = options.h || b.height;
		this.mid.w = this.w * 0.5;
		this.mid.h = this.h * 0.5;
		Branth.Canvas.width = this.w * this.scale;
		Branth.Canvas.height = this.h * this.scale;
		Branth.Ctx.resetTransform();
		Branth.Ctx.scale(this.scale, this.scale);
	}
};

Branth.KeyCode = {
	Backspace: 8,
	Tab: 9,
	Enter: 13,
	Shift: 16,
	Ctrl: 17,
	Alt: 18,
	Pause: 19,
	Break: 19,
	CapsLock: 20,
	Escape: 27,
	PageUp: 33,
	Space: 32,
	PageDown: 34,
	End: 35,
	Home: 36,
	Left: 37,
	Up: 38,
	Right: 39,
	Down: 40,
	PrintScreen: 44,
	Insert: 45,
	Delete: 46,
	Digit0: 48,
	Digit1: 49,
	Digit2: 50,
	Digit3: 51,
	Digit4: 52,
	Digit5: 53,
	Digit6: 54,
	Digit7: 55,
	Digit8: 56,
	Digit9: 57,
	MozSemicolon: 59,
	MozEqual: 61,
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
	Z: 90,
	LeftWindowKey: 91,
	RightWindowKey: 92,
	SelectKey: 93,
	Numpad0: 96,
	Numpad1: 97,
	Numpad2: 98,
	Numpad3: 99,
	Numpad4: 100,
	Numpad5: 101,
	Numpad6: 102,
	Numpad7: 103,
	Numpad8: 104,
	Numpad9: 105,
	NumpadMultiply: 106,
	NumpadAdd: 107,
	NumpadSubtract: 109,
	NumpadDecimal: 110,
	NumpadDivide: 111,
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,
	Unknown: 135,
	NumLock: 144,
	ScrollLock: 145,
	MozMinus: 173,
	Semicolon: 186,
	Equal: 187,
	Comma: 188,
	Minus: 189,
	Period: 190,
	Slash: 191,
	Backquote: 191,
	LeftBracket: 219,
	Backslash: 220,
	RightBracket: 221,
	Quote: 222
};

Branth.MouseButton = {
	Left: 0,
	Middle: 1,
	Right: 2
};

Branth.InputKey = function(keyCode) {
	this.keyCode = keyCode;
	this.held = false;
	this.pressed = false;
	this.released = false;
};

Branth.InputKey.prototype.up = function() {
	this.held = false;
	this.released = true;
};

Branth.InputKey.prototype.down = function() {
	this.held = true;
	this.pressed = true;
};

Branth.InputKey.prototype.reset = function() {
	this.pressed = false;
	this.released = false;
};

Branth.Input = {
	Key: {},
	Mouse: [],
	Touch: [],
	preventedKeys: [
		Branth.KeyCode.Up,
		Branth.KeyCode.Left,
		Branth.KeyCode.Down,
		Branth.KeyCode.Right,
		Branth.KeyCode.Space
	],
	doubleInterval: 12,
	mousePosition: new Vector2(0, 0),
	touches: [],
	setup() {
		for (let i = 0; i < 256; i++) {
			this.Key[i] = new Branth.InputKey(i);
		}
		for (let i = 0; i < 3; i++) {
			this.Mouse[i] = new Branth.InputKey(i);
			this.Mouse[i].doubleStep = 0;
			this.Mouse[i].doublePressed = false;
		}
		for (let i = 0; i < 10; i++) {
			this.Touch[i] = new Branth.InputKey(i);
			this.Touch[i].position = new Vector2(0, 0);
			this.Touch[i].setPosition = function(x, y) {
				this.position.x = x;
				this.position.y = y;
			}
		}
	},
	update() {
		for (let i = 0; i < 3; i++) {
			const j = this.Mouse[i];
			j.doublePressed = false;
			if (j.doubleStep > 0) {
				if (j.pressed) {
					j.doublePressed = true;
					j.doubleStep = 0;
				}
				else j.doubleStep--;
			}
			else if (j.pressed) j.doubleStep = this.doubleInterval;
		}
	},
	reset() {
		for (let i = 0; i < 256; i++) {
			this.Key[i].reset();
		}
		for (let i = 0; i < 3; i++) {
			this.Mouse[i].reset();
		}
		for (let i = 0; i < 10; i++) {
			this.Touch[i].reset();
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
	mouseUp(button) {
		return this.Mouse[button].released;
	},
	mouseDown(button) {
		return this.Mouse[button].pressed;
	},
	mouseHold(button) {
		return this.Mouse[button].held;
	},
	mouseDouble(button) {
		return this.Mouse[button].doublePressed;
	},
	touchUp(id) {
		return this.Touch[id].released;
	},
	touchDown(id) {
		return this.Touch[id].pressed;
	},
	touchHold(id) {
		return this.Touch[id].held;
	},
	eventKeyUp(e) {
		this.Key[e.keyCode].up();
	},
	eventKeyDown(e) {
		if (this.preventedKeys.includes(e.keyCode)) e.preventDefault();
		const i = this.Key[e.keyCode];
		if (!i.held) i.down();
	},
	updateMousePosition(e) {
		const b = Branth.Canvas.getBoundingClientRect();
		this.mousePosition.x = e.clientX - b.x;
		this.mousePosition.y = e.clientY - b.y;
	},
	eventMouseUp(e) {
		this.Mouse[e.button].up();
		this.updateMousePosition(e);
	},
	eventMouseDown(e) {
		const i = this.Mouse[e.button];
		if (!i.held) {
			i.down();
			this.updateMousePosition(e);
		}
	},
	eventMouseMove(e) {
		this.updateMousePosition(e);
	},
	convertTouch(e) {
		const b = Branth.Canvas.getBoundingClientRect();
		return {
			id: e.identifier,
			x: e.clientX - b.x,
			y: e.clientY - b.y
		};
	},
	updateTouches(e) {
		this.touches.length = 0;
		for (const i of e.changedTouches) {
			this.touches.push(this.convertTouch(i));
		}
	},
	eventTouchEnd(e) {
		for (const i of e.changedTouches) {
			const j = this.convertTouch(i);
			this.Touch[j.id].up();
			this.Touch[j.id].setPosition(j.x, j.y);
		}
		this.updateTouches(e);
	},
	eventTouchMove(e) {
		for (const i of e.changedTouches) {
			const j = this.convertTouch(i);
			this.Touch[j.id].setPosition(j.x, j.y);
		}
		this.updateTouches(e);
	},
	eventTouchStart(e) {
		for (const i of e.changedTouches) {
			const j = this.convertTouch(i);
			if (!this.Touch[j.id].held) {
				this.Touch[j.id].down();
				this.Touch[j.id].setPosition(j.x, j.y);
			}
		}
		this.updateTouches(e);
	}
};

Branth.Sound = {
	update() {}
};

Branth.C = {
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
	yellowGreen: "#9acd32",
	random() {
		const i = Object.values(this);
		i.pop();
		return Math.pick(i);
	}
};

Branth.Font = {
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
	FamilyDefault: "Maven Pro, sans-serif",
	generate(size, style=Branth.Font.Regular, family=Branth.Font.FamilyDefault) {
		return { size, style, family };
	}
};

Branth.Font.xxl = Branth.Font.generate(Branth.Font.H1);
Branth.Font.xl = Branth.Font.generate(Branth.Font.H2);
Branth.Font.l = Branth.Font.generate(Branth.Font.H3);
Branth.Font.m = Branth.Font.generate(Branth.Font.H4);
Branth.Font.sm = Branth.Font.generate(Branth.Font.H5);
Branth.Font.s = Branth.Font.generate(Branth.Font.H6);

Branth.Align = {
	l: "left",
	r: "right",
	c: "center",
	t: "top",
	b: "bottom",
	m: "middle"
};

Branth.LineCap = {
	Butt: "butt",
	Round: "round"
};

Branth.LineJoin = {
	Miter: "miter",
	Round: "round",
	Bevel: "bevel"
};

Branth.Primitive = {
	Fill: { name: "Fill", quantity: 0, closePath: true, outline: false },
	Line: { name: "Line", quantity: 0, closePath: false, outline: true },
	Stroke: { name: "Stroke", quantity: 0, closePath: true, outline: true },
	LineList: { name: "Line List", quantity: 2, closePath: false, outline: true },
	PointList: { name: "Point List", quantity: 1, closePath: false, outline: true },
	TriangleList: { name: "Triangle List", quantity: 3, closePath: true, outline: true },
	TriangleListFill: { name: "Triangle List Fill", quantity: 3, closePath: false, outline: false }
};

Branth.Draw = {
	ctx: Branth.Ctx,
	textHeight: 10,
	images: {},
	sprites: {},
	strips: {},
	setCtx(ctx) {
		this.ctx = ctx;
	},
	resetCtx() {
		this.ctx = Branth.Ctx;
	},
	setFill(c) {
		this.ctx.fillStyle = c;
	},
	setColor(c) {
		this.ctx.fillStyle = c;
		this.ctx.strokeStyle = c;
	},
	setStroke(c) {
		this.ctx.strokeStyle = c;
	},
	setFont(font) {
		this.ctx.font = `${font.style}${font.size}px ${font.family}, serif`;
		this.textHeight = font.size;
	},
	setHAlign(align) {
		this.ctx.textAlign = align;
	},
	setVAlign(align) {
		this.ctx.textBaseline = align;
	},
	setHVAlign(halign, valign) {
		this.ctx.textAlign = halign;
		this.ctx.textBaseline = valign;
	},
	splitText(text) {
		return ("" + text).split("\n");
	},
	text(x, y, text) {
		let baseline = 0;
		const t = this.splitText(text);
		switch (this.ctx.textBaseline) {
			case Branth.Align.b: baseline = -this.textHeight * (t.length - 1); break;
			case Branth.Align.m: baseline = -this.textHeight * (t.length - 1) * 0.5; break;
		}
		for (let i = t.length - 1; i >= 0; i--) {
			this.ctx.fillText(t[i], x, y + baseline + this.textHeight * i);
		}
	},
	getTextWidth(text) {
		return Math.max(...this.splitText(text).map(x => this.ctx.measureText(x).width));
	},
	getTextHeight(text) {
		return this.textHeight * this.splitText(text).length;
	},
	textRegular(x, y, text, outline=false) {
		if (outline) this.ctx.strokeText(text, x, y);
		else this.ctx.fillText(text, x, y);
	},
	getTextWidthRegular(text) {
		return this.ctx.measureText(text).width;
	},
	addImage(origin, name, img) {
		img.origin = origin;
		this.images[name] = img;
	},
	addSprite(origin, name, imgArray) {
		this.sprites[name] = [];
		for (const i of imgArray) {
			i.origin = origin;
			this.sprites[name].push(i);
		}
	},
	addStrip(origin, name, img, strip) {
		img.strip = strip;
		img.origin = origin;
		this.strips[name] = img;
	},
	image(name, x, y) {
		this.ctx.drawImage(this.images[name], x, y);
	},
	sprite(name, index, x, y) {
		this.ctx.drawImage(this.sprites[name][index], x, y);
	},
	strip(name, index, x, y) {
		const img = this.strips[name];
		const s = {
			w: img.width / img.strip,
			h: img.height
		};
		this.ctx.drawImage(img, (index % img.strip) * s.w, 0, s.w, s.h, x, y, s.w, s.h);
	},
	draw(outline=false) {
		if (outline) this.ctx.stroke();
		else this.ctx.fill();
	},
	rect(x, y, w, h, outline=false) {
		this.ctx.beginPath();
		this.ctx.rect(x, y, w, h);
		this.draw(outline);
	}
};

Branth.Emitter = {};

Branth.start = (options={}) => {
	Branth.Input.setup();
	window.onkeyup = (e) => Branth.Input.eventKeyUp(e);
	window.onkeydown = (e) => Branth.Input.eventKeyDown(e);
	window.onmouseup = (e) => Branth.Input.eventMouseUp(e);
	window.onmousedown = (e) => Branth.Input.eventMouseDown(e);
	window.onmousemove = (e) => Branth.Input.eventMouseMove(e);
	window.ontouchend = (e) => Branth.Input.eventTouchEnd(e);
	window.ontouchmove = (e) => Branth.Input.eventTouchMove(e);
	window.ontouchstart = (e) => Branth.Input.eventTouchStart(e);
	window.oncontextmenu = (e) => e.preventDefault();
	Branth.Canvas.oncontextmenu = (e) => e.preventDefault();
	if (options.autoResize) window.onresize = () => Branth.Room.resize();
	const canvasID = options.canvasID? options.canvasID : "branthMainCanvas";
	const style = document.createElement("style");
	style.innerHTML = `
		${options.removeAllGap? `* {
			margin: 0;
			padding: 0;
		}` : ""}
		${options.styleParent? `${options.parentID? `#${options.parentID}` : "body"} {
			width: ${options.w? `${options.w}px` : "100vw"};
			height: ${options.h? `${options.h}px` : "100vh"};
			overflow: hidden;
			${options.align !== undefined? `position: absolute;
			top: ${options.align * 100}%;
			left: ${options.align * 100}%;
			transform: translate(-${options.align * 100}%, -${options.align * 100}%);` : ""}
			${options.borderRadius? `border-radius: ${options.borderRadius}px;` : ""}
		}` : ""}
		#${canvasID} {
			width: 100%;
			height: 100%;
		}
	`;
	Branth.Canvas.id = canvasID;
	Branth.Draw.setHVAlign(Branth.Align.l, Branth.Align.t);
	if (options.color) Branth.Canvas.style.backgroundColor = options.color;
	else Branth.Canvas.style.backgroundImage = "radial-gradient(darkorchid 33%, darkslateblue)";
	if (options.parentID) document.querySelector(`#${options.parentID}`).appendChild(Branth.Canvas);
	else document.body.appendChild(Branth.Canvas);
	document.head.appendChild(style);
	style.onload = () => {
		Branth.Room.resize();
		Branth.Room.start("Load");
		Branth.render(0);
	};
};

Branth.render = (t) => {
	Branth.Time.update(t);
	Branth.Input.update();
	Branth.Sound.update();
	Branth.Room.clear();
	Branth.Room.current.render();
	Branth.Input.reset();
	window.requestAnimationFrame(Branth.render);
};

Branth.onLoadStart = () => {};
Branth.onLoadRender = () => {};
Branth.onLoadFinish = () => {};

Branth.Loader = {
	loaded: false,
	loadAmount: 0,
	loadedCount: 0,
	get loadProgress() {
		return Branth.Loader.loadedCount / Math.max(1, Branth.Loader.loadAmount);
	},
	loadImage(origin, name, src) {
		const img = new Image();
		img.src = src;
		Branth.Draw.addImage(origin, name, img);
		Branth.Loader.loadAmount++;
		img.onload = () => { Branth.Loader.loadedCount++; };
	},
	loadSprite(origin, name, srcArray) {
		const imgArray = [];
		for (const src of srcArray) {
			const img = new Image();
			img.src = src;
			imgArray.push(img);
			Branth.Loader.loadAmount++;
			img.onload = () => { Branth.Loader.loadedCount++; };
		}
		Branth.Draw.addSprite(origin, name, imgArray);
	},
	loadStrip(origin, name, src, strip) {}
};

Branth.Load = Branth.Room.add("Load");
Branth.Load.start = () => { Branth.onLoadStart(); };
Branth.Load.render = () => {
	if (!Branth.Loader.loaded) {
		if (Branth.Loader.loadedCount === Branth.Loader.loadAmount) {
			Branth.onLoadFinish();
			Branth.Loader.loaded = true;
		}
	}
	if (Branth.Room.current.name === "Load") {
		Branth.onLoadRender();
	}
};
delete Branth.Load;