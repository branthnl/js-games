class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	equal(v) {
		return this.x === v.x && this.y === v.y;
	}
	static add(v1, v2) {
		return new Vector2(v1.x + v2.x, v1.y + v2.y);
	}
	static subtract(v1, v2) {
		return new Vector2(v1.x - v2.x, v1.y - v2.y);
	}
	static multiply(v1, v2) {
		return new Vector2(v1.x * v2.x, v1.y * v2.y);
	}
	static divide(v1, v2) {
		return new Vector2(v1.x / v2.x, v1.y / v2.y);
	}
	static dot(v1, v2) {
		return v1.x * v2.x + v1.y * v2.y;
	}
}

Math.clamp = (a, b, c) => Math.min(c, Math.max(b, a));
Math.range = (min, max, t) => min + (t || (t === 0? 0 : Math.random())) * (max - min);
Math.irange = (min, max) => Math.floor(Math.range(min, max));
Math.choose = (...args) => args[Math.irange(0, args.length)];
Math.randneg = (t = 0.5) => Math.random() > t? -1 : 1;
Math.randbool = () => Math.random() > 0.5;
Math.degtorad = (d) => d * Math.PI / 180;
Math.radtodeg = (d) => d * 180 / Math.PI;
Math.lendirx = (l, d) => l * Math.cos(Math.degtorad(d));
Math.lendiry = (l, d) => l * Math.sin(Math.degtorad(d));
Math.lendir = (l, d) => new Vector2(Math.lendirx(l, d), Math.lendiry(l, d));
Math.linedis = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
Math.linedir = (x1, y1, x2, y2) => 90 - Math.radtodeg(Math.atan2(x2 - x1, y2 - y1));
Math.pointdis = (p1, p2) => Math.linedis(p1.x, p1.y, p2.x, p2.y);
Math.pointdir = (p1, p2) => Math.linedir(p1.x, p1.y, p2.x, p2.y);

const CANVAS = document.createElement('canvas');
const CTX = CANVAS.getContext('2d');

const GLOBAL = {
	key: '_' + Math.random().toString(36).substr(2, 9),
	debugMode: false,
	interacted: false,
	save(key, value) {
		sessionStorage.setItem(key, value);
	},
	load(key) {
		return sessionStorage.getItem(key);
	},
	setup() {
		const k = this.load('globalkey');
		if (k) {
			if (k.length >= 9) this.key = k;
			return;
		}
		this.save('globalkey', this.key);
	}
};

const Time = {
	FPS: 60,
	time: 0,
	lastTime: 0,
	deltaTime: 0,
	fixedDeltaTime: 1000 / 60,
	_fpsCount: 0,
	get frameRate() {
		return this.fixedDeltaTime / this.deltaTime;
	},
	update(t) {
		this.lastTime = this.time || 0;
		this.time = t || 0;
		this.deltaTime = this.time - this.lastTime || this.fixedDeltaTime;
		if (this._fpsCount >= 60) {
			this.FPS = Math.floor(this.frameRate * 60);
			this._fpsCount -= 60;
		}
		else this._fpsCount += this.frameRate;
	},
	toSeconds(t) {
		return Math.ceil(t / 1000);
	},
	toMinutes(t) {
		return Math.ceil(t / 60000);
	},
	toClockSeconds(t) {
		return Math.abs(Math.floor(t / 1000) % 60);
	},
	toClockMinutes(t) {
		return Math.abs(Math.floor(t / 60000) % 60);
	},
	toClockSecondsWithLeadingZero(t) {
		let s = this.toClockSeconds(t);
		return `${(s < 10? '0' : '')}${s}`;
	},
	toClockMinutesWithLeadingZero(t) {
		let m = this.toClockMinutes(t);
		return `${(m < 10? '0' : '')}${m}`;
	},
	get s() {
		return this.toSeconds(this.time);
	},
	get m() {
		return this.toMinutes(this.time);
	},
	get ss() {
		return this.toClockSecondsWithLeadingZero(this.time);
	},
	get mm() {
		return this.toClockMinutesWithLeadingZero(this.time);
	}
};

const Sound = {
	list: [],
	names: [],
	supportedExt: ['ogg', 'mp3', 'wav'],
	add(name, ...paths) {
		const sources = [];
		for (const p of paths) {
			const ext = p.split('.').pop();
			if (this.supportedExt.includes(ext)) {
				const type = ext === 'mp3'? 'mpeg' : ext;
				sources.push(`<source src="${p}" type="audio/${type}">`);
			}
			else {
				if (GLOBAL.debugMode) console.log(`Sound file extension not supported: .${ext}`);
			}
		}
		if (sources.length > 0) {
			const a = new Audio();
			a.innerHTML = sources.join('');
			this.list.push(a);
			this.names.push(name);
		}
	},
	get(name) {
		const s = this.list[this.names.indexOf(name)];
		if (!s && GLOBAL.debugMode) {
			console.log(`Sound not found: ${name}`);
			return;
		}
		return s;
	},
	play(name) {
		const s = this.get(name);
		if (GLOBAL.interacted) {
			if (s) {
				s.currentTime = 0;
				s.play();
			}
		}
		else if (GLOBAL.debugMode) console.log(`Failed to play sound because the user didn't interact with the document first.`);
	},
	loop(name) {
		const s = this.get(name);
		if (GLOBAL.interacted) {
			if (s) {
				s.loop = true;
				s.currentTime = 0;
				s.play();
			}
		}
		else if (GLOBAL.debugMode) console.log(`Failed to loop sound because the user didn't interact with the document first.`);
	},
	stop(name) {
		const s = this.get(name);
		if (s) {
			s.pause();
			s.currentTime = 0;
			s.loop = false;
		}
	},
	isPlaying(name) {
		const s = this.get(name);
		if (s) {
			return s.currentTime > 0 && !s.paused;
		}
		return false;
	},
	setVolume(name, n) {
		const s = this.get(name);
		if (s) {
			s.volume = Math.clamp(n, 0, 1);
		}
	},
	getVolume(name) {
		const s = this.get(name);
		if (s) {
			return s.volume;
		}
		return 0;
	},
	update() {
		for (const s of this.list) {
			if (s.loop) {
				if (s.currentTime + Time.deltaTime * 0.005 >= s.duration) {
					s.currentTime = 0;
				}
			}
		}
	}
};

const KeyCode = {
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
	NumLock: 144,
	ScrollLock: 145,
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

const Mouse = {
	Left: 0,
	Middle: 1,
	Right: 2
};

class BranthKey {
	constructor(keyCode) {
		this.keyCode = keyCode;
		this.hold = false;
		this.pressed = false;
		this.released = false;
	}
	up() {
		this.hold = false;
		this.released = true;
	}
	down() {
		this.hold = true;
		this.pressed = true;
	}
	reset() {
		this.pressed = false;
		this.released = false;
	}
}

class BranthMouse extends BranthKey {
	get button() {
		return this.keyCode;
	}
}

const Input = {
	metaKeys: [
		KeyCode.Alt,
		KeyCode.Ctrl,
		KeyCode.LeftWindowKey,
		KeyCode.RightWindowKey
	],
	preventedKeys: [
		KeyCode.Up,
		KeyCode.Left,
		KeyCode.Down,
		KeyCode.Right,
		KeyCode.Space
	],
	list: [[], []],
	mouseMove: false,
	mousePosition: new Vector2(0, 0),
	setup() {
		this.list = [[], []];
		for (const k of Object.values(KeyCode)) {
			this.list[0].push(new BranthKey(k));
		}
		for (const b of Object.values(Mouse)) {
			this.list[1].push(new BranthMouse(b));
		}
	},
	reset() {
		for (const i of this.list) {
			for (const j of i) {
				j.reset();
			}
		}
		this.mouseMove = false;
	},
	getKey(keyCode) {
		for (const k of this.list[0]) {
			if (k.keyCode === keyCode) {
				return k;
			}
		}
		if (GLOBAL.debugMode) console.log(`No key found with key code: ${keyCode}`);
		return new BranthKey(-1);
	},
	keyUp(keyCode) {
		return this.getKey(keyCode).released;
	},
	keyDown(keyCode) {
		return this.getKey(keyCode).pressed;
	},
	keyHold(keyCode) {
		return this.getKey(keyCode).hold;
	},
	getMouse(button) {
		return this.list[1][button];
	},
	mouseUp(button) {
		return this.list[1][button].released;
	},
	mouseDown(button) {
		return this.list[1][button].pressed;
	},
	mouseHold(button) {
		return this.list[1][button].hold;
	},
	eventKeyUp(e) {
		for (const k of this.list[0]) {
			if (k.keyCode === e.which || k.keyCode === e.keyCode) {
				k.up();
			}
		}
	},
	eventKeyDown(e) {
		if (!GLOBAL.interacted) {
			if (!this.metaKeys.includes(e.keyCode)) {
				GLOBAL.interacted = true;
			}
		}
		if (this.preventedKeys.includes(e.keyCode)) {
			e.preventDefault();
		}
		for (const k of this.list[0]) {
			if (k.keyCode === e.which || k.keyCode === e.keyCode) {
				if (!k.hold) k.down();
			}
		}
	},
	updateMousePosition(e) {
		const b = CANVAS.getBoundingClientRect();
		this.mousePosition.x = e.clientX - b.x;
		this.mousePosition.y = e.clientY - b.y;
		this.mouseMove = true;
	},
	eventMouseUp(e) {
		this.updateMousePosition(e);
		this.list[1][e.button].up();
	},
	eventMouseMove(e) {
		this.updateMousePosition(e);
	},
	eventMouseDown(e) {
		GLOBAL.interacted = true;
		const m = this.list[1][e.button];
		if (!m.hold) {
			this.updateMousePosition(e);
			m.down();
		}
	}
};

const C = {
	aliceBlue: '#f0f8ff',
	antiqueWhite: '#faebd7',
	aqua: '#00ffff',
	aquamarine: '#7fffd4',
	azure: '#f0ffff',
	beige: '#f5f5dc',
	bisque: '#ffe4c4',
	black: '#000000',
	blanchedAlmond: '#ffebcd',
	blue: '#0000ff',
	blueViolet: '#8a2be2',
	brown: '#a52a2a',
	burlyWood: '#deb887',
	cadetBlue: '#5f9ea0',
	chartreuse: '#7fff00',
	chocolate: '#d2691e',
	coral: '#ff7f50',
	cornflowerBlue: '#6495ed',
	cornsilk: '#fff8dc',
	crimson: '#dc143c',
	cyan: '#00ffff',
	darkBlue: '#00008b',
	darkCyan: '#008b8b',
	darkGoldenRod: '#b8860b',
	darkGray: '#a9a9a9',
	darkGrey: '#a9a9a9',
	darkGreen: '#006400',
	darkKhaki: '#bdb76b',
	darkMagenta: '#8b008b',
	darkOliveGreen: '#556b2f',
	darkOrange: '#ff8c00',
	darkOrchid: '#9932cc',
	darkRed: '#8b0000',
	darkSalmon: '#e9967a',
	darkSeaGreen: '#8fbc8f',
	darkSlateBlue: '#483d8b',
	darkSlateGray: '#2f4f4f',
	darkSlateGrey: '#2f4f4f',
	darkTurquoise: '#00ced1',
	darkViolet: '#9400d3',
	deepPink: '#ff1493',
	deepSkyBlue: '#00bfff',
	dimGray: '#696969',
	dimGrey: '#696969',
	dodgerBlue: '#1e90ff',
	fireBrick: '#b22222',
	floralWhite: '#fffaf0',
	forestGreen: '#228b22',
	fuchsia: '#ff00ff',
	gainsboro: '#dcdcdc',
	ghostWhite: '#f8f8ff',
	gold: '#ffd700',
	goldenRod: '#daa520',
	gray: '#808080',
	grey: '#808080',
	green: '#008000',
	greenYellow: '#adff2f',
	honeyDew: '#f0fff0',
	hotPink: '#ff69b4',
	indianRed: '#cd5c5c',
	indigo: '#4b0082',
	ivory: '#fffff0',
	khaki: '#f0e68c',
	lavender: '#e6e6fa',
	lavenderBlush: '#fff0f5',
	lawnGreen: '#7cfc00',
	lemonChiffon: '#fffacd',
	lightBlue: '#add8e6',
	lightCoral: '#f08080',
	lightCyan: '#e0ffff',
	lightGoldenRodYellow: '#fafad2',
	lightGray: '#d3d3d3',
	lightGrey: '#d3d3d3',
	lightGreen: '#90ee90',
	lightPink: '#ffb6c1',
	lightSalmon: '#ffa07a',
	lightSeaGreen: '#20b2aa',
	lightSkyBlue: '#87cefa',
	lightSlateGray: '#778899',
	lightSlateGrey: '#778899',
	lightSteelBlue: '#b0c4de',
	lightYellow: '#ffffe0',
	lime: '#00ff00',
	limeGreen: '#32cd32',
	linen: '#faf0e6',
	magenta: '#ff00ff',
	maroon: '#800000',
	mediumAquaMarine: '#66cdaa',
	mediumBlue: '#0000cd',
	mediumOrchid: '#ba55d3',
	mediumPurple: '#9370db',
	mediumSeaGreen: '#3cb371',
	mediumSlateBlue: '#7b68ee',
	mediumSpringGreen: '#00fa9a',
	mediumTurquoise: '#48d1cc',
	mediumVioletRed: '#c71585',
	midnightBlue: '#191970',
	mintCream: '#f5fffa',
	mistyRose: '#ffe4e1',
	moccasin: '#ffe4b5',
	navajoWhite: '#ffdead',
	navy: '#000080',
	oldLace: '#fdf5e6',
	olive: '#808000',
	oliveDrab: '#6b8e23',
	orange: '#ffa500',
	orangeRed: '#ff4500',
	orchid: '#da70d6',
	paleGoldenRod: '#eee8aa',
	paleGreen: '#98fb98',
	paleTurquoise: '#afeeee',
	paleVioletRed: '#db7093',
	papayaWhip: '#ffefd5',
	peachPuff: '#ffdab9',
	peru: '#cd853f',
	pink: '#ffc0cb',
	plum: '#dda0dd',
	powderBlue: '#b0e0e6',
	purple: '#800080',
	rebeccaPurple: '#663399',
	red: '#ff0000',
	rosyBrown: '#bc8f8f',
	royalBlue: '#4169e1',
	saddleBrown: '#8b4513',
	salmon: '#fa8072',
	sandyBrown: '#f4a460',
	seaGreen: '#2e8b57',
	seaShell: '#fff5ee',
	sienna: '#a0522d',
	silver: '#c0c0c0',
	skyBlue: '#87ceeb',
	slateBlue: '#6a5acd',
	slateGray: '#708090',
	slateGrey: '#708090',
	snow: '#fffafa',
	springGreen: '#00ff7f',
	steelBlue: '#4682b4',
	tan: '#d2b48c',
	teal: '#008080',
	thistle: '#d8bfd8',
	tomato: '#ff6347',
	turquoise: '#40e0d0',
	violet: '#ee82ee',
	wheat: '#f5deb3',
	white: '#ffffff',
	whiteSmoke: '#f5f5f5',
	yellow: '#ffff00',
	yellowGreen: '#9acd32',
	random() {
		const c = Object.values(this); c.pop();
		return c[Math.floor(Math.random() * c.length)];
	}
};

const Font = {
	normal: '',
	bold: 'bold',
	italic: 'italic',
	bolditalic: 'bold italic',
	size: 10,
	style: '',
	get font() {
		return `${this.style} ${this.size}px`;
	},
	get s() {
		this.size = 10;
		return this.font;
	},
	get m() {
		this.size = 16;
		return this.font;
	},
	get l() {
		this.size = 24;
		return this.font;
	},
	get xl() {
		this.size = 36;
		return this.font;
	},
	get xxl() {
		this.size = 48;
		return this.font;
	}
};

const Align = {
	l: 'left',
	r: 'right',
	c: 'center',
	t: 'top',
	b: 'bottom',
	m: 'middle'
};

const Cap = {
	butt: 'butt',
	round: 'round'
};

const Line = {
	miter: 'miter',
	round: 'round',
	bevel: 'bevel'
};

const Primitive = {
	fill: { name: 'Fill', quantity: 0, closePath: true, outline: false },
	line: { name: 'Line', quantity: 0, closePath: false, outline: true },
	stroke: { name: 'Stroke', quantity: 0, closePath: true, outline: true },
	lineList: { name: 'Line List', quantity: 2, closePath: false, outline: true },
	pointList: { name: 'Point List', quantity: 1, closePath: false, outline: true },
	triangleList: { name: 'Triangle List', quantity: 3, closePath: true, outline: true },
	triangleListFill: { name: 'Triangle List Fill', quantity: 3, closePath: false, outline: false }
};

const Draw = {
	fontFamily: '',
	fontDefault: ['Arvo', 'Fresca', 'Sniglet'],
	primitiveType: '',
	vertices: [],
	setFont(s, style = Font.normal) {
		CTX.font = `${style? `${style} ` : ''}${s} ${this.fontFamily? `${this.fontFamily}, `: ''}${this.fontDefault.join(',')}, serif`;
	},
	setFontStyle(s) {
		Font.style = s;
	},
	resetFontStyle() {
		Font.style = Font.normal;
	},
	setFontFamily(s) {
		this.fontFamily = s;
	},
	resetFontFamily() {
		this.fontFamily = '';
	},
	setAlpha(n) {
		CTX.globalAlpha = n;
	},
	setColor(c) {
		CTX.fillStyle = c;
		CTX.strokeStyle = c;
	},
	setShadow(x, y, b = 0, c = C.black) {
		CTX.shadowBlur = b;
		CTX.shadowColor = c;
		CTX.shadowOffsetX = x;
		CTX.shadowOffsetY = y;
	},
	resetShadow() {
		this.setShadow(0, 0);
	},
	setHAlign(a) {
		CTX.textAlign = a;
	},
	setVAlign(a) {
		CTX.textBaseline = a;
	},
	setHVAlign(h, v) {
		CTX.textAlign = h;
		CTX.textBaseline = v;
	},
	text(x, y, text) {
		CTX.fillText(text, x, y);
	},
	textWidth(text) {
		return CTX.measureText(text).width;
	},
	textHeight(text) {
		return Font.size;
	},
	draw(outline = false) {
		if (outline) CTX.stroke();
		else CTX.fill();
	},
	setLineCap(cap) {
		CTX.lineCap = cap;
	},
	resetLineCap() {
		CTX.lineCap = Cap.butt;
	},
	setLineJoin(line) {
		CTX.lineJoin = line;
	},
	resetLineJoin() {
		CTX.lineJoin = Line.miter;
	},
	setStrokeWeight(n) {
		CTX.lineWidth = n;
	},
	resetStrokeWeight() {
		CTX.lineWidth = 1;
	},
	line(x1, y1, x2, y2) {
		CTX.beginPath();
		CTX.moveTo(x1, y1);
		CTX.lineTo(x2, y2);
		CTX.stroke();
	},
	plus(x, y, r) {
		CTX.beginPath();
		CTX.moveTo(x, y - r);
		CTX.lineTo(x, y + r);
		CTX.moveTo(x - r, y);
		CTX.lineTo(x + r, y);
		CTX.stroke();
	},
	rect(x, y, w, h, outline = false) {
		CTX.beginPath();
		CTX.rect(x, y, w, h);
		this.draw(outline);
	},
	circle(x, y, r, outline = false) {
		CTX.beginPath();
		CTX.arc(x, y, Math.abs(r), 0, 2 * Math.PI);
		this.draw(outline);
	},
	roundRect(x, y, w, h, r, outline = false) {
		if (w < 0) { x += w; w = -w; }
		if (h < 0) { y += h; h = -h; }
		r = Math.clamp(r, 0, Math.min(w * 0.5, h * 0.5)) || 0;
		CTX.beginPath();
		CTX.moveTo(x, y + r);
		CTX.quadraticCurveTo(x, y, x + r, y);
		CTX.lineTo(x + w - r, y);
		CTX.quadraticCurveTo(x + w, y, x + w, y + r);
		CTX.lineTo(x + w, y + h - r);
		CTX.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
		CTX.lineTo(x + r, y + h);
		CTX.quadraticCurveTo(x, y + h, x, y + h - r);
		CTX.closePath();
		this.draw(outline);
	},
	pointLine(p1, p2) {
		this.line(p1.x, p1.y, p2.x, p2.y);
	},
	pointRect(p1, p2, p3, p4, outline = false) {
		CTX.beginPath();
		CTX.moveTo(p1.x, p1.y);
		CTX.lineTo(p2.x, p2.y);
		CTX.lineTo(p3.x, p3.y);
		CTX.lineTo(p4.x, p4.y);
		CTX.closePath();
		this.draw(outline);
	},
	primitiveBegin() {
		this.vertices = [];
	},
	vertex(x, y) {
		this.vertices.push(new Vector2(x, y));
	},
	primitiveEnd(primitiveType) {
		this.primitiveType = primitiveType || Primitive.fill;
		const [q, c, o] = [this.primitiveType.quantity, this.primitiveType.closePath, this.primitiveType.outline];
		if (q === 1) this.setLineCap(Cap.round);
		CTX.beginPath();
		for (let i = 0; i < this.vertices.length; i++) {
			const v = this.vertices[i];
			if (q === 1) {
				this.draw(o);
				CTX.beginPath();
				CTX.moveTo(v.x, v.y);
				CTX.lineTo(v.x, v.y);
			}
			else if (i === 0 || (q > 1 && i % q === 0)) {
				if (c) CTX.closePath();
				this.draw(o);
				CTX.beginPath();
				CTX.moveTo(v.x, v.y);
			}
			else CTX.lineTo(v.x, v.y);
		}
		if (c) CTX.closePath();
		this.draw(o);
		this.resetLineCap();
	},
	ellipseRotated(x, y, w, h, angle, outline = false) {
		CTX.beginPath();
		CTX.ellipse(x, y, Math.abs(w), Math.abs(h), angle, 0, 2 * Math.PI);
		CTX.closePath();
		this.draw(outline);
	},
	ellipse(x, y, w, h, outline = false) {
		this.ellipseRotated(x, y, w, h, 0, outline);
	},
	starExtRotated(x, y, pts, inner, outer, angle, outline = false) {
		CTX.beginPath();
		for (let i = 0; i <= 2 * pts; i++) {
			const [r, a] = [(i % 2 === 0)? inner : outer, Math.PI * i / pts - Math.degtorad(angle)];
			const p = new Vector2(x + r * Math.sin(a), y + r * Math.cos(a));
			if (i === 0) CTX.moveTo(p.x, p.y);
			else CTX.lineTo(p.x, p.y);
		}
		CTX.closePath();
		this.draw(outline);
	},
	starRotated(x, y, r, angle, outline = false) {
		this.starExtRotated(x, y, 5, r * 0.5, r, angle, outline);
	},
	starExt(x, y, pts, inner, outer, outline = false) {
		this.starExtRotated(x, y, pts, inner, outer, 0, outline);
	},
	star(x, y, r, outline = false) {
		this.starRotated(x, y, r, 0, outline);
	},
	transform(x, y, xscale, yscale, angle, e) {
		CTX.save();
		CTX.translate(x, y);
		CTX.rotate(Math.degtorad(angle));
		CTX.scale(xscale, yscale);
		e();
		CTX.restore();
	},
	textTransformed(x, y, text, xscale, yscale, angle) {
		this.transform(x, y, xscale, yscale, angle, () => this.text(0, 0, text));
	},
	rectTransformed(x, y, w, h, outline, xscale, yscale, angle, origin = new Vector2(0.5, 0.5)) {
		this.transform(x, y, xscale, yscale, angle, () => this.rect(-w * origin.x, -h * origin.y, w, h, outline));
	},
	starTransformed(x, y, r, outline, xscale, yscale, angle) {
		this.transform(x, y, xscale, yscale, angle, () => this.star(0, 0, r, outline));
	},
	starExtTransformed(x, y, pts, inner, outer, outline, xscale, yscale, angle) {
		this.transform(x, y, xscale, yscale, angle, () => this.starExt(0, 0, pts, inner, outer, outline));
	},
	roundRectTransformed(x, y, w, h, r, outline, xscale, yscale, angle, origin = new Vector2(0.5, 0.5)) {
		this.transform(x, y, xscale, yscale, angle, () => this.roundRect(-w * origin.x, -h * origin.y, w, h, r, outline));
	},
	textRotated(x, y, text, angle) {
		this.textTransformed(x, y, text, 1, 1, angle);
	},
	rectRotated(x, y, w, h, angle, outline = false, origin = new Vector2(0.5, 0.5)) {
		this.rectTransformed(x, y, w, h, outline, 1, 1, angle, origin);
	},
	roundRectRotated(x, y, w, h, r, angle, outline = false, origin = new Vector2(0.5, 0.5)) {
		this.roundRectTransformed(x, y, w, h, r, outline, 1, 1, angle, origin);
	}
};

class Rect {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	draw(outline = false) {
		Draw.rect(this.x, this.y, this.w, this.h, outline);
	}
}

class Circle {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
	}
	draw(outline = false) {
		Draw.circle(this.x, this.y, this.r, outline);
	}
}

const OBJ = {
	ID: 0,
	list: [],
	classes: [],
	add(cls) {
		this.list.push([]);
		this.classes.push(cls);
	},
	get(id) {
		for (const o of this.list) {
			for (const i of o) {
				if (i) {
					if (i.id === id) {
						return i;
					}
				}
			}
		}
	},
	take(cls) {
		return this.list[this.classes.indexOf(cls)];
	},
	push(cls, i, dontStart) {
		if (this.classes.includes(cls)) {
			this.list[this.classes.indexOf(cls)].push(i);
			if (!dontStart) {
				i.awake();
				if (i.active) {
					i.start();
					i.lateStart();
				}
			}
			return i;
		}
		if (GLOBAL.debugMode) console.log(`Class not found: ${cls.name}`);
	},
	create(cls, x = 0, y = 0) {
		if (this.classes.includes(cls)) {
			const i = new cls(x, y);
			this.list[this.classes.indexOf(cls)].push(i);
			i.awake();
			if (i.active) {
				i.start();
				i.lateStart();
			}
			return i;
		}
		if (GLOBAL.debugMode) console.log(`Class not found: ${cls.name}`);
	},
	destroy(id) {
		for (const o of this.list) {
			for (const i in o) {
				if (o[i].id === id) {
					o.splice(i, 1);
				}
			}
		}
	},
	clear(cls) {
		this.list[this.classes.indexOf(cls)] = [];
	},
	clearAll(cls) {
		for (const i in this.list) {
			this.list[i] = [];
		}
		this.ID = 0;
	},
	nearest(cls, x, y) {
		let n = null;
		let dis = Infinity;
		for (const i of this.take(cls)) {
			const d = Math.pointdis(new Vector2(x, y), i);
			if (d < dis) {
				n = i;
				dis = d;
			}
		}
		return n;
	},
	update() {
		for (const o of this.list) {
			for (const i of o) {
				if (i) {
					if (i.active) {
						i.earlyUpdate();
						i.update();
						i.lateUpdate();
					}
				}
			}
		}
	},
	render() {
		const so = [];
		for (const o of this.list) {
			for (const i of o) {
				if (i) {
					if (i.visible) {
						so.push(i);
					}
				}
			}
		}
		so.sort((a, b) => (a.depth > b.depth)? -1 : 1);
		for (const i of so) {
			i.render();
		}
	}
};

class BranthObject {
	constructor(x, y) {
		this.id = OBJ.ID++;
		this.depth = 0;
		this.active = true;
		this.visible = true;
		this.xstart = x;
		this.ystart = y;
		this.x = x;
		this.y = y;
	}
	awake() {}
	start() {}
	lateStart() {}
	earlyUpdate() {}
	update() {}
	lateUpdate() {}
	render() {}
	renderUI() {}
}

class BranthBehaviour extends BranthObject {
	constructor(x, y) {
		super(x, y);
		this.alarm = [-1, -1, -1, -1, -1, -1];
	}
	alarm0() {}
	alarm1() {}
	alarm2() {}
	alarm3() {}
	alarm4() {}
	alarm5() {}
	alarmUpdate() {
		if (this.alarm) {
			for (let i = 0; i < this.alarm.length; i++) {
				if (this.alarm[i] !== null) {
					if (this.alarm[i] > 0) {
						this.alarm[i] = Math.max(0, this.alarm[i] - Time.deltaTime);
					}
					else if (this.alarm[i] !== -1) {
						switch (i) {
							case 0: this.alarm0(); break;
							case 1: this.alarm1(); break;
							case 2: this.alarm2(); break;
							case 3: this.alarm3(); break;
							case 4: this.alarm4(); break;
							case 5: this.alarm5(); break;
						}
						if (this.alarm[i] <= 0) this.alarm[i] = -1;
					}
				}
			}
		}
	}
	lateUpdate() {
		this.alarmUpdate();
	}
}

class BranthRoom {
	constructor(name) {
		this.name = name;
	}
	start() {}
	update() {}
	render() {}
	renderUI() {}
}

const Room = {
	scale: 2,
	w: 300,
	h: 150,
	id: 0,
	pd: 0,
	list: [],
	names: [],
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	},
	get name() {
		return this.names[this.id];
	},
	get current() {
		return this.list[this.id];
	},
	get previous() {
		return this.list[this.pd];
	},
	add(room) {
		this.list.push(room);
		this.names.push(room.name);
	},
	start(name) {
		this.pd = this.id;
		this.id = this.names.indexOf(name);
		OBJ.clearAll();
		Input.reset();
		this.resize();
		this.current.start();
	},
	update() {
		this.current.update();
	},
	render() {
		this.current.render();
	},
	resize() {
		const [b, s] = [CANVAS.getBoundingClientRect(), this.scale];
		this.w = b.width;
		this.h = b.height;
		CANVAS.width = this.w * s;
		CANVAS.height = this.h * s;
		CTX.resetTransform();
		CTX.scale(s, s);
	}
};

const View = {
	_x: 0,
	_y: 0,
	xshake: 0,
	yshake: 0,
	int: 0,
	mag: 0,
	alarm: -1,
	get x() {
		return this._x + this.xshake;
	},
	get y() {
		return this._y + this.yshake;
	},
	set x(val) {
		this._x = val;
	},
	set y(val) {
		this._y = val;
	},
	target(x, y) {
		this._x = x;
		this._y = y;
	},
	follow(i) {
		this.target(i.x - Room.mid.w, i.y - Room.mid.h);
	},
	shake(mag, int) {
		this.mag = mag;
		this.int = int;
		this.alarm = this.int;
	},
	convert(v) {
		return Vector2.subtract(v, new Vector2(-this._x, -this._y));
	},
	update() {
		if (this.alarm > 0) {
			const mag = this.mag * this.alarm / this.int;
			this.xshake = mag * (Math.random() > 0.5? -1 : 1);
			this.yshake = mag * (Math.random() > 0.5? -1 : 1);
			this.alarm -= Time.deltaTime;
			if (this.alarm <= 0) {
				this.xshake = 0;
				this.yshake = 0;
			}
		}
	}
};

class BranthGameObject extends BranthBehaviour {
	get vx() {
		return this.x - View.x;
	}
	get vy() {
		return this.y - View.y;
	}
}

const Shape = {
	rect: 'Rect',
	star: 'Star',
	circle: 'Circle',
	square: 'Square'
};

class BranthParticle extends BranthGameObject {
	constructor(x, y, spd, spdinc, size, sizeinc, d, dinc, r, rinc, a, c, life, shape, grav, outline) {
		super(x, y);
		this.spd = spd;
		this.spdinc = spdinc;
		this.size = size;
		this.sizeinc = sizeinc;
		this.d = d;
		this.dinc = dinc;
		this.r = r;
		this.rinc = rinc;
		this.a = a;
		this.c = c;
		this.life = life;
		this.shape = shape;
		this.grav = grav;
		this.outline = outline;
		this.g = grav;
		this.pts = Math.choose(4, 5);
	}
	update() {
		this.a = Math.max(0, this.a - Time.deltaTime / this.life);
		if (this.a <= 0) {
			OBJ.destroy(this.id);
		}
		this.x += Math.lendirx(this.spd, this.d);
		this.y += Math.lendiry(this.spd, this.d) + Math.lendiry(this.g, 90);
		this.size = Math.max(this.size + this.sizeinc, 0);
		this.spd += this.spdinc;
		this.g += this.grav;
		this.d += this.dinc;
		this.r += this.rinc;
	}
	render() {
		Draw.setAlpha(this.a);
		Draw.setColor(this.c);
		switch (this.shape) {
			case Shape.rect: Draw.rectRotated(this.vx, this.vy, this.size * 2, this.size, this.r, this.outline); break;
			case Shape.star: Draw.starExtRotated(this.vx, this.vy, this.pts, this.size * 0.5, this.size, this.r, this.outline); break;
			case Shape.circle: Draw.circle(this.vx, this.vy, this.size, this.outline); break;
			case Shape.square: Draw.rectRotated(this.vx, this.vy, this.size * 2, this.size * 2, this.r, this.outline); break;
		}
		Draw.setAlpha(1);
	}
}

OBJ.add(BranthParticle);

const Emitter = {
	depth: 0,
	x: {
		min: 0,
		max: 100
	},
	y: {
		min: 0,
		max: 100
	},
	spd: {
		min: 1,
		max: 2
	},
	spdinc: {
		min: 0,
		max: 0
	},
	size: {
		min: 2,
		max: 8
	},
	sizeinc: {
		min: 0,
		max: 0
	},
	d: {
		min: 0,
		max: 360
	},
	dinc: {
		min: 5,
		max: 10
	},
	r: {
		min: 0,
		max: 360
	},
	rinc: {
		min: 5,
		max: 10
	},
	a: {
		min: 1,
		max: 1
	},
	c: C.white,
	life: {
		min: 3000,
		max: 4000
	},
	shape: Shape.rect,
	grav: {
		min: 0.01,
		max: 0.01
	},
	outline: false,
	setDepth(depth) {
		this.depth = depth;
	},
	setArea(xmin, xmax, ymin, ymax) {
		this.x.min = xmin;
		this.x.max = xmax;
		this.y.min = ymin;
		this.y.max = ymax;
	},
	setSpeed(min, max) {
		this.spd.min = min;
		this.spd.max = max;
	},
	setSpeedInc(min, max) {
		this.spdinc.min = min;
		this.spdinc.max = max;
	},
	setSize(min, max) {
		this.size.min = min;
		this.size.max = max;
	},
	setSizeInc(min, max) {
		this.sizeinc.min = min;
		this.sizeinc.max = max;
	},
	setDirection(min, max) {
		this.d.min = min;
		this.d.max = max;
	},
	setDirectionInc(min, max) {
		this.dinc.min = min;
		this.dinc.max = max;
	},
	setRotation(min, max) {
		this.r.min = min;
		this.r.max = max;
	},
	setRotationInc(min, max) {
		this.rinc.min = min;
		this.rinc.max = max;
	},
	setAlpha(min, max) {
		this.a.min = min;
		this.a.max = max;
	},
	setColor(c) {
		this.c = c;
	},
	setLife(min, max) {
		this.life.min = min;
		this.life.max = max;
	},
	setShape(s) {
		this.shape = s;
	},
	setGravity(min, max) {
		this.grav.min = min;
		this.grav.max = max;
	},
	setOutline(outline) {
		this.outline = outline;
	},
	preset(s) {
		switch (s) {
			case 'sparkle':
				this.setSpeed(2, 5);
				this.setSpeedInc(-0.1, -0.1);
				this.setSize(5, 10);
				this.setSizeInc(-0.1, -0.1);
				this.setDirection(0, 360);
				this.setDirectionInc(0, 0);
				this.setRotation(0, 360);
				this.setRotationInc(-5, 5);
				this.setAlpha(1, 1);
				this.setColor(C.white);
				this.setLife(1000, 2000);
				this.setShape(Shape.star);
				this.setGravity(0, 0);
				this.setOutline(Math.randbool());
				break;
			case 'puff':
				this.setSpeed(3, 5);
				this.setSpeedInc(-0.1, -0.1);
				this.setSize(5, 10);
				this.setSizeInc(-0.2, -0.2);
				this.setDirection(0, 360);
				this.setDirectionInc(0, 0);
				this.setRotation(0, 0);
				this.setRotationInc(0, 0);
				this.setAlpha(1, 1);
				this.setColor(C.white);
				this.setLife(500, 800);
				this.setShape(Shape.circle);
				this.setGravity(0, 0);
				this.setOutline(false);
				break;
			case 'bubble':
				this.preset('puff');
				this.setOutline(true);
				break;
			case 'box':
				this.setSpeed(0, 0);
				this.setSpeedInc(0, 0);
				this.setSize(2, 4);
				this.setSizeInc(0, 0);
				this.setDirection(0, 0);
				this.setDirectionInc(0, 0);
				this.setRotation(0, 0);
				this.setRotationInc(0, 0);
				this.setAlpha(1, 1);
				this.setColor(C.white);
				this.setLife(300, 500);
				this.setShape(Shape.square);
				this.setGravity(0, 0);
				this.setOutline(true);
				break;
			case 'strip':
				this.setSpeed(0, 0);
				this.setSpeedInc(0, 0);
				this.setSize(4, 4);
				this.setSizeInc(0, 0);
				this.setDirection(0, 0);
				this.setDirectionInc(0, 0);
				this.setRotation(0, 0);
				this.setRotationInc(0, 0);
				this.setAlpha(0.15, 0.15);
				this.setColor(C.black);
				this.setLife(12000, 12000);
				this.setShape(Shape.rect);
				this.setGravity(0, 0);
				this.setOutline(false);
				break;
		}
	},
	emit(n) {
		for (let i = 0; i < n; i++) {
			const n = new BranthParticle(
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
				Math.range(this.grav.min, this.grav.max),
				this.outline
			);
			n.depth = this.depth;
			OBJ.push(BranthParticle, n);
		}
	}
};

const UI = {
	render() {
		Room.current.renderUI();
		for (const o of OBJ.list) {
			for (const i of o) {
				if (i) {
					if (i.visible) {
						i.renderUI();
					}
				}
			}
		}
	}
};

const RAF = window.requestAnimationFrame
	|| window.msRequestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| function(f) { return setTimeout(f, Time.fixedDeltaTime) }
const BRANTH = {
	start(w = 0, h = 0, options = {}) {
		GLOBAL.setup();
		Input.setup();
		window.onkeyup = (e) => Input.eventKeyUp(e);
		window.onkeydown = (e) => Input.eventKeyDown(e);
		window.onmouseup = (e) => Input.eventMouseUp(e);
		window.onmousedown = (e) => Input.eventMouseDown(e);
		window.onmousemove = (e) => Input.eventMouseMove(e);
		window.onresize = () => Room.resize();
		window.oncontextmenu = (e) => e.preventDefault();
		CANVAS.oncontextmenu = (e) => e.preventDefault();
		if (options.backgroundColor) CANVAS.style.backgroundColor = options.backgroundColor;
		else CANVAS.style.backgroundImage = 'radial-gradient(darkorchid 33%, darkslateblue)';
		const style = document.createElement('style');
		style.innerHTML = `
			* {
				margin: 0;
				padding: 0;
			}
			body {
				width: ${w? `${w}px` : '100vw'};
				height: ${h? `${h}px` : '100vh'};
				overflow: hidden;
				position: absolute;
				top: ${options.VAlign? '50%' : '0'};
				left: ${options.HAlign? '50%' : '0'};
				transform: translate(${options.HAlign? '-50%' : '0'}, ${options.VAlign? '-50%' : '0'});
			}
			canvas {
				width: 100%;
				height: 100%;
			}
		`;
		for (const f of Draw.fontDefault) {
			const l = document.createElement('link');
			[l.href, l.rel] = [`https://fonts.googleapis.com/css?family=${f}&display=swap`, 'stylesheet'];
			document.head.appendChild(l);
		}
		document.head.appendChild(style);
		document.body.appendChild(CANVAS);
		this.update();
	},
	update(t) {
		Time.update(t);
		Sound.update();
		Room.update();
		View.update();
		OBJ.update();
		if (Input.keyDown(KeyCode.U)) GLOBAL.debugMode = !GLOBAL.debugMode;
		CTX.clearRect(0, 0, Room.w, Room.h);
		Room.render();
		OBJ.render();
		UI.render();
		Input.reset();
		RAF(BRANTH.update);
	}
};