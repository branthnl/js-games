Math.dif = (a, b) => b - a;
Math.dis = (a, b) => Math.abs(b - a);
Math.clamp = (a, b, c) => Math.min(c, Math.max(b, a));
Math.range = (min, max, t) => min + (t || (t === 0? 0 : Math.random())) * (max - min);
Math.irange = (min, max) => Math.floor(Math.range(min, max));
Math.degtorad = (d = 1) => d * Math.PI / 180;
Math.radtodeg = (d = 1) => d * 180 / Math.PI;
Math.lendirx = (l, d) => l * Math.cos(Math.degtorad(d));
Math.lendiry = (l, d) => l * Math.sin(Math.degtorad(d));
Math.lendir = (l, d) => ({ x: Math.lendirx(l, d), y: Math.lendiry(l, d) });
Math.pointdis = (x1, y1, x2, y2) => {
	if (x2 === undefined) {
		x2 = y1.x;
		y2 = y1.y;
		y1 = x1.y;
		x1 = x1.x;
	}
	return Math.hypot((x2 - x1), (y2 - y1));
}
Math.pointdir = (x1, y1, x2, y2) => 90 - Math.radtodeg(Math.atan2((x2 - x1), (y2 - y1)));
Math.randneg = (t = 0.5) => Math.range(0, 1) > t? -1 : 1;
Math.lerp = (from, to, t) => Math.range(from, to, t);
Math.choose = (...args) => args[Math.irange(0, args.length)];

class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

const PARENT = document.body;
const CANVAS = document.createElement('canvas');
const CTX = CANVAS.getContext('2d');
const AUDIO_PARENT = CANVAS;
const IMAGE_PARENT = CANVAS;
const INPUT_KEY_PARENT = window;
const INPUT_KEY_PREVENT_DEFAULT = true;
const INPUT_MOUSE_PARENT = window;
const INPUT_TOUCH_PARENT = window;
const INPUT_TOUCH_PREVENT_DEFAULT = false;
const DEFAULT_FONT = 'Fresca, sans-serif';
const FRAME_RATE = 1000 / 60;
const OBJ_DEPTH_RENDER = true;
const DEBUG_MODE = true;
if (!DEBUG_MODE) console.log = () => {};

CANVAS.style.backgroundImage = `radial-gradient(white 33%, gainsboro, lightGray)`;

const CanvasScaler = {
	get w() {
		const b = CANVAS.getBoundingClientRect();
		return CANVAS.width / b.width;
	},
	get h() {
		const b = CANVAS.getBoundingClientRect();
		return CANVAS.height / b.height;
	},
	get auto() {
		const b = CANVAS.getBoundingClientRect();
		if (CANVAS.width > CANVAS.height) {
			return CANVAS.width / b.width;
		}
		else {
			return CANVAS.height / b.height;
		}
	}
};

const Time = {
	time: 0,
	lastTime: 0,
	deltaTime: 0,
	fixedDeltaTime: FRAME_RATE,
	get scaledDeltaTime() {
		return this.deltaTime / this.fixedDeltaTime;
	},
	update(t) {
		this.lastTime = this.time || 0;
		this.time = t || 0;
		this.deltaTime = this.time - this.lastTime || this.fixedDeltaTime;
		if (this.deltaTime > 1000) {
			console.log(`Big delta time: ${this.deltaTime} / ${this.fixedDeltaTime}`);
		}
	},
	toSeconds(t) {
		return Math.ceil((t || this.time) / 1000);
	},
	toMinutes(t) {
		return Math.ceil((t || this.time) / 60000);
	},
	toClockSeconds(t) {
		return Math.floor(t / 1000) % 60;
	},
	toClockMinutes(t) {
		return Math.floor(t / 60000) % 60;
	},
	toClockSeconds0(t) {
		let s = Math.abs(this.toClockSeconds(t));
		return `${(s < 10? '0' : '')}${s}`;
	},
	toClockMinutes0(t) {
		let m = Math.abs(this.toClockMinutes(t));
		return `${(m < 10? '0' : '')}${m}`;
	}
};

class BranthAudio {
	constructor(paths) {
		const a = document.createElement('audio');
		for (const p of paths) {
			const ext = p.split('.').pop();
			const type = ext === 'ogg'? 'ogg' : (ext === 'mp3'? 'mpeg' : (ext === 'wav'? 'wav' : null));
			if (type === null) {
				console.log(`Audio file extension not supported: .${ext}`);
				return;
			}
			const s = document.createElement('source');
			s.src = p;
			s.type = `audio/${type}`;
			a.appendChild(s);
		}
		return a;
	}
}

const Audio = {
	list: [],
	names: [],
	add(name, ...paths) {
		for (const p of paths) {
			const ext = p.split('.').pop();
			if (ext !== 'ogg' && ext != 'mp3' && ext != 'wav') {
				console.log(`Audio file extension not supported: .${ext}`);
				return;
			}
		}
		const audio = new BranthAudio(paths);
		AUDIO_PARENT.appendChild(audio);
		this.list.push(audio);
		this.names.push(name);
	},
	play(name) {
		const a = this.list[this.names.indexOf(name)];
		if (a) {
			a.currentTime = 0;
			a.play();
		}
	},
	loop(name) {
		const a = this.list[this.names.indexOf(name)];
		if (a) {
			a.loop = true;
			a.currentTime = 0;
			a.play();
		}
	},
	stop(name) {
		const a = this.list[this.names.indexOf(name)];
		if (a) {
			a.pause();
			a.currentTime = 0;
			a.loop = false;
		}
	},
	isPlaying(name) {
		const a = this.list[this.names.indexOf(name)];
		if (a) {
			return a.currentTime > 0 && !s.paused;
		}
		return false;
	},
	setVolume(name, n) {
		const a = this.list[this.names.indexOf(name)];
		if (a) {
			a.volume = Math.clamp(n, 0, 1);
			if (n < 0 || n > 1) {
				console.log(`Audio volume clamped to: ${a.volume}`);
			}
		}
	},
	getVolume(name) {
		const a = this.list[this.names.indexOf(name)];
		if (a) {
			return a.volume;
		}
		console.log(`Audio not found: ${name}`);
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

const Mouse = {
	Left: 0,
	Middle: 1,
	Right: 2
};

class BranthMouse extends BranthKey {
	get button() {
		return this.keyCode;
	}
}

class BranthTouch extends BranthKey {
	constructor(id) {
		super(id);
		this.position = {
			x: 0,
			y: 0
		}
	}
	get id() {
		return this.keyCode;
	}
}

const Input = {
	list: [[], [], []],
	mouseMove: false,
	add(keyCode) {
		this.list[0].push(new BranthKey(keyCode));
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
	eventkeyup(e) {
		for (const k of this.list[0]) {
			if (k.keyCode == e.which || k.keyCode == e.keyCode) {
				k.up();
			}
		}
	},
	eventkeydown(e) {
		for (const k of this.list[0]) {
			if (k.keyCode == e.which || k.keyCode == e.keyCode) {
				if (!k.hold) k.down();
			}
		}
	},
	screenToWorldPoint(p) {
		return {
			x: p.x * CanvasScaler.w,
			y: p.y * CanvasScaler.h
		}
	},
	mousePosition: {
		x: 0,
		y: 0
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
	updateMousePosition(e) {
		const b = CANVAS.getBoundingClientRect();
		this.mousePosition.x = e.clientX - b.x;
		this.mousePosition.y = e.clientY - b.y;
		this.mouseMove = true;
	},
	eventmouseup(e) {
		this.updateMousePosition(e);
		this.list[1][e.button].up();
	},
	eventmousemove(e) {
		this.updateMousePosition(e);
	},
	eventmousedown(e) {
		const m = this.list[1][e.button];
		if (!m.hold) {
			this.updateMousePosition(e);
			m.down();
		}
	},
	touches: [],
	changedTouches: [],
	get touchCount() {
		return this.touches.length;
	},
	get changedTouchCount() {
		return this.changedTouches.length;
	},
	getTouch(id) {
		return this.list[2][id];
	},
	touchUp(id) {
		return this.list[2][id].released;
	},
	touchDown(id) {
		return this.list[2][id].pressed;
	},
	touchHold(id) {
		return this.list[2][id].hold;
	},
	updateTouches(e) {
		this.touches = [];
		this.changedTouches = [];
		for (let i = 0; i < e.touches.length; i++) {
			const b = CANVAS.getBoundingClientRect();
			const t = {
				id: e.touches[i].identifier,
				x: e.touches[i].clientX - b.x,
				y: e.touches[i].clientY - b.y
			}
			this.touches.push(t);
		}
		for (let i = 0; i < e.changedTouches.length; i++) {
			const b = CANVAS.getBoundingClientRect();
			const t = {
				id: e.changedTouches[i].identifier,
				x: e.changedTouches[i].clientX - b.x,
				y: e.changedTouches[i].clientY - b.y
			}
			this.changedTouches.push(t);
		}
	},
	eventtouchend(e) {
		for (let i = 0; i < e.changedTouches.length; i++) {
			const b = CANVAS.getBoundingClientRect();
			const t = {
				id: e.changedTouches[i].identifier,
				x: e.changedTouches[i].clientX - b.x,
				y: e.changedTouches[i].clientY - b.y
			}
			this.list[2][t.id].position = { x: t.x, y: t.y };
			this.list[2][t.id].up();
		}
		this.updateTouches(e);
	},
	eventtouchmove(e) {
		for (let i = 0; i < e.changedTouches.length; i++) {
			const b = CANVAS.getBoundingClientRect();
			const t = {
				id: e.changedTouches[i].identifier,
				x: e.changedTouches[i].clientX - b.x,
				y: e.changedTouches[i].clientY - b.y
			}
			this.list[2][t.id].position = { x: t.x, y: t.y };
		}
		this.updateTouches(e);
	},
	eventtouchstart(e) {
		for (let i = 0; i < e.changedTouches.length; i++) {
			const b = CANVAS.getBoundingClientRect();
			const t = {
				id: e.changedTouches[i].identifier,
				x: e.changedTouches[i].clientX - b.x,
				y: e.changedTouches[i].clientY - b.y
			}
			if(!this.list[2][t.id].hold) {
				this.list[2][t.id].position = { x: t.x, y: t.y };
				this.list[2][t.id].down();
			}
		}
		this.updateTouches(e);
	}
};

for (const keyCode of Object.values(KeyCode)) {
	Input.add(keyCode);
}

Input.list[1] = [
	new BranthMouse(Mouse.Left),
	new BranthMouse(Mouse.Middle),
	new BranthMouse(Mouse.Right)
];

Input.list[2] = [
	new BranthTouch(0),
	new BranthTouch(1),
	new BranthTouch(2),
	new BranthTouch(3),
	new BranthTouch(4),
	new BranthTouch(5),
	new BranthTouch(6),
	new BranthTouch(7),
	new BranthTouch(8),
	new BranthTouch(9)
];

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
	yellowGreen: '#9acd32'
};

const Font = {
	get s() {
		return `${16}px`;
	},
	get m() {
		return `${24}px`;
	},
	get l() {
		return `${36}px`;
	},
	get xl() {
		return `${52}px`;
	},
	get xxl() {
		return `${80}px`;
	},
	get sb() {
		return `bold ${16}px`;
	},
	get mb() {
		return `bold ${24}px`;
	},
	get lb() {
		return `bold ${36}px`;
	},
	get xlb() {
		return `bold ${52}px`;
	},
	get xxlb() {
		return `bold ${80}px`;
	},
	get size() {
		return +CTX.font.split(' ').filter(x => x.includes('px'))[0].split('px').shift();
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

const Poly = {
	fill: 'name: fill, quantity: 0, closePath: true, outline: false',
	stroke: 'name: stroke, quantity: 0, closePath: true, outline: true',
	lineList: 'name: lineList, quantity: 2, closePath: false, outline: true',
	pointList: 'name: pointList, quantity: 1, closePath: false, outline: true',
	triangleList: 'name: triangleList, quantity: 3, closePath: true, outline: true',
	triangleListFill: 'name: triangleList, quantity: 3, closePath: false, outline: false'
};

class BranthImage {
	constructor(path) {
		const img = document.createElement('img');
		img.src = path;
		img.style.display = 'none';
		return img;
	}
}

const Draw = {
	list: [[], []],
	names: [[], []],
	hasName(name) {
		for (const n of this.names) {
			if (n.includes(name)) {
				return true;
			}
		}
		return false;
	},
	add(name, ...args) {
		if (args.length === 1) {
			this.addImage(name, args[0]);
		}
		else {
			this.addSprite(name, args);
		}
	},
	addImage(name, path) {
		const img = new BranthImage(path);
		IMAGE_PARENT.appendChild(img);
		this.list[0].push(img);
		this.names[0].push(name);
	},
	addSprite(name, args) {
		const img = new BranthImage(args[0]);
		IMAGE_PARENT.appendChild(img);
		const s = {
			img: img,
			amount: args[1],
			column: args[2],
			w: args[3],
			h: args[4],
			hCellOffset: args[5] || 0,
			vCellOffset: args[6] || 0,
			hPixelOffset: args[7] || 0,
			vPixelOffset: args[8] || 0,
			hGap: args[9] || 0,
			vGap: args[10] || 0
		}
		this.list[1].push(s);
		this.names[1].push(name);
	},
	getImage(name) {
		return this.list[0][this.names[0].indexOf(name)];
	},
	getSprite(name) {
		return this.list[1][this.names[1].indexOf(name)];
	},
	origin(x, y) {
		return new Vector(x, y);
	},
	image(name, x, y, center) {
		const img = this.list[0][this.names[0].indexOf(name)];
		if (img) {
			let dx = x - (center? img.width * 0.5 : 0);
			let dy = y - (center? img.height * 0.5 : 0);
			if (center instanceof Vector) {
				dx = x - center.x;
				dy = y - center.y;
			}
			CTX.drawImage(img, dx, dy);
		}
		else throw new Error(`Image not found: ${name}`);
	},
	sprite(name, i, x, y, center) {
		const s = this.list[1][this.names[1].indexOf(name)];
		if (s) {
			const sx = s.hPixelOffset + s.hCellOffset * s.w + (s.w + s.hGap) * (Math.floor(i) % s.column);
			const sy = s.vPixelOffset + s.vCellOffset * s.h + (s.h + s.vGap) * Math.floor(i / s.amount);
			const sWidth = s.w;
			const sHeight = s.h;
			let dx = x - (center? s.w * 0.5 : 0);
			let dy = y - (center? s.h * 0.5 : 0);
			if (center instanceof Vector) {
				dx = x - center.x;
				dy = y - center.y;
			}
			const dWidth = s.w;
			const dHeight = s.h;
			CTX.drawImage(s.img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
		}
		else throw new Error(`Sprite not found: ${name}`);
	},
	imageTransformed(name, x, y, r, center) {
		CTX.save();
		CTX.translate(x, y);
		CTX.rotate(Math.degtorad(r));
		this.image(name, 0, 0, center);
		CTX.restore();
	},
	spriteTransformed(name, i, x, y, r, center) {
		CTX.save();
		CTX.translate(x, y);
		CTX.rotate(Math.degtorad(r));
		this.sprite(name, i, 0, 0, center);
		CTX.restore();
	},
	setAlpha(a) {
		CTX.globalAlpha = a;
	},
	setColor(color) {
		CTX.fillStyle = color;
		CTX.strokeStyle = color;
	},
	setHAlign(align) {
		CTX.textAlign = align;
	},
	setVAlign(align) {
		CTX.textBaseline = align;
	},
	setHVAlign(h, v) {
		CTX.textAlign = h;
		CTX.textBaseline = v || h;
	},
	setFont(font) {
		CTX.font = `${font} ${DEFAULT_FONT}`;
	},
	setShadow(x, y, b, c) {
		CTX.shadowBlur = b || 0;
		CTX.shadowColor = c || C.black;
		CTX.shadowOffsetX = x;
		CTX.shadowOffsetY = y;
	},
	resetShadow() {
		this.setShadow(0, 0, 0, C.black);
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
	draw(outline, cap) {
		if (outline) {
			if (cap) CTX.lineCap = cap;
			CTX.stroke();
			this.resetCap();
		}
		else {
			CTX.fill();
		}
	},
	line(x1, y1, x2, y2, cap) {
		CTX.beginPath();
		CTX.moveTo(x1, y1);
		CTX.lineTo(x2, y2);
		this.draw(true, cap);
	},
	rect(x, y, w, h, outline) {
		CTX.beginPath();
		CTX.rect(x, y, w, h);
		this.draw(outline);
	},
	circle(x, y, r, outline) {
		CTX.beginPath();
		CTX.arc(x, y, r, 0, 2 * Math.PI);
		CTX.closePath();
		this.draw(outline);
	},
	ellipse(x, y, w, h, outline) {
		CTX.beginPath();
		CTX.moveTo(x, y + h * 0.5);
		CTX.quadraticCurveTo(x, y, x + w * 0.5, y);
		CTX.quadraticCurveTo(x + w, y, x + w, y + h * 0.5);
		CTX.quadraticCurveTo(x + w, y + h, x + w * 0.5, y + h);
		CTX.quadraticCurveTo(x, y + h, x, y + h * 0.5);
		CTX.closePath();
		this.draw(outline);
	},
	roundRect(x, y, w, h, r, outline) {
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
	roundrect(x, y, w, h, r, outline) {
		this.roundRect(x, y, w, h, r, outline);
	},
	polyType: '',
	vertices: [],
	polyBegin(polyType = Poly.fill) {
		this.polyType = polyType;
		this.vertices = [];
	},
	vertex(x, y) {
		this.vertices.push({ x, y });
	},
	polyEnd(polyType) {
		if (polyType) this.polyType = polyType;
		const get = (p, s) => p.filter(x => x.includes(s))[0][1];
		const split = (s) => s.replace(/\s/g, '').split(',').map(x => x.split(':'));
		const getName = (s) => get(split(s), 'name');
		const param = split(this.polyType);
		const name = get(param, 'name');
		const outline = get(param, 'outline') === 'true';
		const quantity = +get(param, 'quantity');
		const closePath = get(param, 'closePath') === 'true';
		let count = 0;
		CTX.beginPath();
		for (const v of this.vertices) {
			if (quantity === 1) {
				this.draw(outline, Cap.round);
				CTX.beginPath();
				CTX.moveTo(v.x, v.y);
				CTX.lineTo(v.x, v.y);
			}
			else if (count === 0 || (quantity > 1 && count % quantity === 0)) {
				if (closePath) CTX.closePath();
				this.draw(outline);
				CTX.beginPath();
				CTX.moveTo(v.x, v.y);
			}
			else CTX.lineTo(v.x, v.y);
			count++;
		}
		if (closePath) CTX.closePath();
		if (quantity === 1) {
			this.draw(outline, Cap.round);
		}
		else this.draw(outline);
	},
	rectTransformed(x, y, w, h, d, outline) {
		const r = Math.hypot(w * 0.5, h * 0.5);
		const p = [
			Math.lendir(r, d + 225),
			Math.lendir(r, d + 315),
			Math.lendir(r, d + 45),
			Math.lendir(r, d + 135)
		];
		this.polyBegin(outline? Poly.stroke : Poly.fill);
		this.vertex(x + p[0].x, y + p[0].y);
		this.vertex(x + p[1].x, y + p[1].y);
		this.vertex(x + p[2].x, y + p[2].y);
		this.vertex(x + p[3].x, y + p[3].y);
		this.polyEnd();
	},
	starTransformed(x, y, r, d, outline) {
		const lp = [
			Math.lendir(r, d + 270),
			Math.lendir(r, d + 342),
			Math.lendir(r, d + 54),
			Math.lendir(r, d + 126),
			Math.lendir(r, d + 198)
		];
		const sr = r * 0.5;
		const sp = [
			Math.lendir(sr, d + 306),
			Math.lendir(sr, d + 18),
			Math.lendir(sr, d + 90),
			Math.lendir(sr, d + 162),
			Math.lendir(sr, d + 234)
		];
		this.polyBegin(outline? Poly.stroke : Poly.fill);
		this.vertex(x + lp[0].x, y + lp[0].y);
		this.vertex(x + sp[0].x, y + sp[0].y);
		this.vertex(x + lp[1].x, y + lp[1].y);
		this.vertex(x + sp[1].x, y + sp[1].y);
		this.vertex(x + lp[2].x, y + lp[2].y);
		this.vertex(x + sp[2].x, y + sp[2].y);
		this.vertex(x + lp[3].x, y + lp[3].y);
		this.vertex(x + sp[3].x, y + sp[3].y);
		this.vertex(x + lp[4].x, y + lp[4].y);
		this.vertex(x + sp[4].x, y + sp[4].y);
		this.polyEnd();
	},
	star(x, y, r, outline) {
		this.starTransformed(x, y, r, 0, outline);
	},
	setCap(cap) {
		CTX.lineCap = cap;
	},
	resetCap() {
		CTX.lineCap = Cap.butt;
	},
	setLineWidth(n) {
		CTX.lineWidth = n;
	},
	resetLineWidth() {
		CTX.lineWidth = 1;
	},
	beginPath() {
		CTX.beginPath();
	},
	closePath() {
		CTX.closePath();
	},
	moveTo(x, y) {
		if (y) {
			CTX.moveTo(x, y);
		}
		else {
			CTX.moveTo(x.x, x.y);
		}
	},
	lineTo(x, y) {
		if (y) {
			CTX.lineTo(x, y);
		}
		else {
			CTX.lineTo(x.x, x.y);
		}
	},
	curveTo(cpx, cpy, x, y) {
		CTX.quadraticCurveTo(cpx, cpy, x, y);
	},
	bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
		if (cp2y) {
			CTX.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
		}
		else {
			CTX.bezierCurveTo(cp1x.x, cp1x.y, cp1y.x, cp1y.y, cp2x.x, cp2x.y);
		}
	},
	fill() {
		CTX.fill();
	},
	stroke() {
		CTX.stroke();
	},
	save() {
		CTX.save();
	},
	scale(x, y) {
		CTX.scale(x, y || x);
	},
	rotate(d) {
		CTX.rotate(Math.degtorad(d));
	},
	translate(x, y) {
		CTX.translate(x, y);
	},
	restore() {
		CTX.restore();
	},
	clearRect(x, y, w, h) {
		CTX.clearRect(x, y, w, h);
	}
};

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
	push(cls, i) {
		if (this.classes.includes(cls)) {
			this.list[this.classes.indexOf(cls)].push(i);
		}
		else console.log(`Class not found: ${cls.name}\n- Try add OBJ.add(${cls.name}); in your code.`);
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
		console.log(`Class not found: ${cls.name}\n- Try add OBJ.add(${cls.name}); in your code.`);
	},
	destroy(id) {
		for (const o of this.list) {
			for (const i in o) {
				if (o[i].id === id) {
					delete o[i];
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
	},
	distance(a, b) {
		return Math.hypot(b.x - a.x, b.y - a.y);
	},
	nearest(cls, x, y) {
		let n = -1;
		let nv = Infinity;
		for (const i of this.list[this.classes.indexOf(cls)]) {
			const v = this.distance({x, y}, i);
			if (v < nv) {
				n = i;
				nv = v;
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
		if (OBJ_DEPTH_RENDER) {
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
		else {
			for (const o of this.list) {
				for (const i of o) {
					if (i) {
						if (i.visible) {
							i.render();
						}
					}
				}
			}
		}
	}
};

class BranthObject {
	constructor(x, y) {
		this.id = OBJ.ID++;
		this.depth = 0;
		this.active = true;
		this.visible = true;
		this.x = x;
		this.y = y;
		this.xs = x;
		this.ys = y;
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
					else if (this.alarm[i] != -1) {
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

const Mask = {
	rect: 'rect',
	circle: 'circle'
};

class BranthMask {
	constructor(...args) {
		this.name = args[0];
		this.x = args[1];
		this.y = args[2];
		this.xs = this.x;
		this.ys = this.y;
		this.w = 0;
		this.h = 0;
		this.r = 0;
		if (this.name === Mask.rect) {
			this.w = args[3];
			this.h = args[4];
		}
		else if (this.name === Mask.circle) {
			this.r = args[3];
		}
	}
	hover(x, y) {
		let p = { x, y };
		if (y === undefined) {
			p = {
				x: x.x,
				y: x.y
			};
		}
		if (this.name === Mask.rect) {
			return p.x >= this.x && p.x <= this.x + this.w && p.y >= this.y && p.y <= this.y + this.h;
		}
		else if (this.name === Mask.circle) {
			return Math.pointdis(p.x, p.y, this.x, this.y) <= this.r;
		}
		return false;
	}
}

class BranthGameObject extends BranthBehaviour {
	constructor(x, y) {
		super(x, y);
		this.xp = x;
		this.yp = y;
		this.spriteName = '';
		this.spriteIndex = 0;
		this.spriteAngle = 0;
		this.spriteCenter = true;
		this.mask = [];
		this.drawMask = false;
		this.drawMaskAlpha = 1;
		this.drawMaskColor = C.magenta;
	}
	addMask(...args) {
		if (args[0] === Mask.rect) {
			const n = new BranthMask(args[0], args[1], args[2], args[3], args[4]);
			this.mask.push(n);
		}
		else if (args[0] === Mask.circle) {
			const n = new BranthMask(args[0], args[1], args[2], args[3]);
			this.mask.push(n);
		}
	}
	hover(x, y) {
		if (y === undefined) {
			for (const m of this.mask) {
				if (m.hover(x)) {
					return true;
				}
			}
		}
		else {
			for (const m of this.mask) {
				if (m.hover(x, y)) {
					return true;
				}
			}
		}
		return false;
	}
	maskUpdate() {
		for (const i in this.mask) {
			const m = this.mask[i];
			m.x = this.x + m.xs;
			m.y = this.y + m.ys;
		}
	}
	earlyUpdate() {
		this.xp = this.x;
		this.yp = this.y;
	}
	lateUpdate() {
		this.maskUpdate();
		this.alarmUpdate();
	}
	drawSelf() {
		if (Draw.hasName(this.spriteName)) {
			if (Draw.getSprite(this.spriteName)) {
				Draw.spriteTransformed(this.spriteName, this.spriteIndex % Draw.getSprite(this.spriteName).amount, this.x, this.y, this.spriteAngle, this.spriteCenter);
			}
			else {
				Draw.imageTransformed(this.spriteName, this.x, this.y, this.spriteAngle, this.spriteCenter);
			}
		}
	}
	drawMasks() {
		Draw.setAlpha(this.drawMaskAlpha);
		Draw.setColor(this.drawMaskColor);
		for (const m of this.mask) {
			if (m.name === Mask.rect) {
				Draw.rect(m.x, m.y, m.w, m.h);
			}
			else if (m.name === Mask.circle) {
				Draw.circle(m.x, m.y, m.r);
			}
		}
		Draw.setAlpha(1);
	}
	render() {
		this.drawSelf();
		if (this.drawMask) {
			this.drawMasks();
		}
	}
}

const Shape = {
	rect: 'rect',
	star: 'star',
	circle: 'circle'
};

class BranthParticle extends BranthObject {
	constructor(x, y, spd, spdinc, size, sizeinc, d, dinc, r, rinc, a, c, life, shape, grav) {
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
		this.g = grav;
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
	c: C.yellow,
	life: {
		min: 3000,
		max: 4000
	},
	shape: Shape.rect,
	grav: {
		min: 0.01,
		max: 0.01
	},
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
	preset(s) {
		switch (s) {
			case 'sparkle':
				this.setSpeed(2, 5);
				this.setSpeedInc(-0.1, -0.1);
				this.setSize(5, 10);
				this.setSizeInc(-0.1, -0.1);
				this.setDirection(0, 360);
				this.setDirectionInc(0, 0);
				this.setRotation(0, 0);
				this.setRotationInc(0, 0);
				this.setAlpha(1, 1);
				this.setColor(C.blueViolet);
				this.setLife(1000, 2000);
				this.setShape(Shape.star);
				this.setGravity(0, 0);
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
				Math.range(this.grav.min, this.grav.max)
			);
			n.depth = this.depth;
			OBJ.push(BranthParticle, n);
		}
	}
};

class BranthRoom {
	constructor(name, w, h) {
		this.name = name;
		this.w = w;
		this.h = h;
	}
	start() {}
	update() {}
	render() {}
	renderUI() {}
}

const Room = {
	_name: '',
	_prevName: '',
	list: [],
	get names() {
		return this.list.map(x => x.name);
	},
	get id() {
		return this.names.indexOf(this._name);
	},
	get name() {
		return this._name;
	},
	get current() {
		return this.list[this.id] || new BranthRoom(this._name, CANVAS.width, CANVAS.height);
	},
	get previous() {
		return this.list[this.names.indexOf(this._prevName)] || this.current;
	},
	get w() {
		return this.current.w;
	},
	get h() {
		return this.current.h;
	},
	get mid() {
		return {
			w: this.current.w * 0.5,
			h: this.current.h * 0.5
		}
	},
	add(room) {
		this.list.push(room);
	},
	start(name) {
		if (this.names.includes(name)) {
			this._prevName = this._name;
			this._name = name;
			CANVAS.width = this.w;
			CANVAS.height = this.h;
			OBJ.clearAll();
			Input.reset();
			this.current.start();
		}
		else {
			console.log(`Room not found: ${name}`);
		}
	},
	update() {
		this.current.update();
	},
	render() {
		this.current.render();
	}
};

const View = {
	x: 0,
	y: 0
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
	|| function(f) { return setTimeout(f, FRAME_RATE) }
const BRANTH = {
	start: function() {
		INPUT_KEY_PARENT.addEventListener('keyup', (e) => Input.eventkeyup(e));
		INPUT_KEY_PARENT.addEventListener('keydown', (e) => {
			if (INPUT_KEY_PREVENT_DEFAULT) {
				const keyCodes = [32, 37, 38, 39, 40];
				if (keyCodes.includes(e.keyCode)) {
					e.preventDefault();
				}
			}
			Input.eventkeydown(e);
		});
		INPUT_MOUSE_PARENT.addEventListener('mouseup', (e) => Input.eventmouseup(e));
		INPUT_MOUSE_PARENT.addEventListener('mousemove', (e) => Input.eventmousemove(e));
		INPUT_MOUSE_PARENT.addEventListener('mousedown', (e) => Input.eventmousedown(e));
		INPUT_TOUCH_PARENT.addEventListener('touchend', (e) => {
			if (INPUT_TOUCH_PREVENT_DEFAULT) e.preventDefault();
			Input.eventtouchend(e);
		});
		INPUT_TOUCH_PARENT.addEventListener('touchmove', (e) => {
			if (INPUT_TOUCH_PREVENT_DEFAULT) e.preventDefault();
			Input.eventtouchmove(e);
		});
		INPUT_TOUCH_PARENT.addEventListener('touchstart', (e) => {
			if (INPUT_TOUCH_PREVENT_DEFAULT) e.preventDefault();
			Input.eventtouchstart(e);
		});
		PARENT.appendChild(CANVAS);
		this.update();
	},
	update: function(t) {
		Time.update(t);
		Room.update();
		OBJ.update();
		Draw.clearRect(0, 0, Room.w, Room.h);
		Room.render();
		OBJ.render();
		UI.render();
		Input.reset();
		RAF(BRANTH.update);
	}
};