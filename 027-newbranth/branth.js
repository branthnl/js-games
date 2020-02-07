class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

Math.clamp = (a, b, c) => Math.min(c, Math.max(b, a));
Math.range = (min, max, t) => min + (t || (t === 0? 0 : Math.random())) * (max - min);
Math.irange = (min, max) => Math.floor(Math.range(min, max));
Math.choose = (...args) => args[Math.irange(0, args.length)];
Math.randneg = (t = 0.5) => Math.random() > t? -1 : 1;
Math.degtorad = (d) => d * Math.PI / 180;
Math.radtodeg = (d) => d * 180 / Math.PI;
Math.lendirx = (l, d) => l * Math.cos(Math.degtorad(d));
Math.lendiry = (l, d) => l * Math.sin(Math.degtorad(d));
Math.lendir = (l, d) => new Vector2(Math.lendirx(l, d), Math.lendiry(l, d));
Math.linedis = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
Math.linedir = (x1, y1, x2, y2) => 90 - Math.radtodeg(Math.atan2(x2 - x1, y2 - y1));
Math.pointdis = (p1, p2) => Math.linedis(p1.x, p1.y, p2.x, p2.y);
Math.pointdir = (p1, p2) => Math.linedir(p1.x, p1.y, p2.x, p2.y);

const HEAD = {
	append(e) {
		document.head.appendChild(e);
	},
	remove(e) {
		if (document.head.contains(e)) {
			document.head.removeChild(e);
		}
	}
};

const BODY = {
	append(e) {
		document.body.appendChild(e);
	}
};

const CANVAS = document.createElement('canvas');
const CTX = CANVAS.getContext('2d');

const FONT_LINK = document.createElement('link');
FONT_LINK.href = 'https://fonts.googleapis.com/css?family=Arvo&display=swap';
FONT_LINK.rel = 'stylesheet';

const FULL_DISPLAY_STYLE = document.createElement('style');
FULL_DISPLAY_STYLE.innerHTML = `
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

CANVAS.style.backgroundImage = 'radial-gradient(darkorchid 33%, darkslateblue)';

const Time = {
	time: 0,
	lastTime: 0,
	deltaTime: 0,
	fixedDeltaTime: 1000 / 60,
	update(t) {
		this.lastTime = this.time || 0;
		this.time = t || 0;
		this.deltaTime = this.time - this.lastTime || this.fixedDeltaTime;
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
			if (k.keyCode == e.which || k.keyCode == e.keyCode) {
				k.up();
			}
		}
	},
	eventKeyDown(e) {
		if (this.preventedKeys.includes(e.keyCode)) {
			e.preventDefault();
		}
		for (const k of this.list[0]) {
			if (k.keyCode == e.which || k.keyCode == e.keyCode) {
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
	yellowGreen: '#9acd32'
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

const Draw = {
	fontFamily: '',
	fontDefault: 'Arvo, serif',
	setFont(s, style) {
		CTX.font = `${style? `${style} ` : ''}${s} ${this.fontFamily? `${this.fontFamily}, `: ''}${this.fontDefault}`;
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
	draw(outline) {
		if (outline) CTX.stroke();
		else CTX.fill();
	},
	line(x1, y1, x2, y2) {
		CTX.beginPath();
		CTX.moveTo(x1, y1);
		CTX.lineTo(x2, y2);
		CTX.stroke();
	},
	rect(x, y, w, h, outline) {
		CTX.beginPath();
		CTX.rect(x, y, w, h);
		this.draw(outline);
	},
	circle(x, y, r, outline) {
		CTX.beginPath();
		CTX.arc(x, y, r, 0, 2 * Math.PI);
		this.draw(outline);
	},
	roundRect(x, y, w, h, r, outline) {
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
	pointRect(p1, p2, p3, p4, outline) {
		CTX.beginPath();
		CTX.moveTo(p1.x, p1.y);
		CTX.lineTo(p2.x, p2.y);
		CTX.lineTo(p3.x, p3.y);
		CTX.lineTo(p4.x, p4.y);
		CTX.closePath();
		this.draw(outline);
	}
};

class BranthRoom {
	constructor(name) {
		this.name = name;
		this.w = 0;
		this.h = 0;
	}
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	}
	start() {}
	update() {}
	render() {}
	renderUI() {}
}

const Room = {
	list: [],
	names: [],
	id: 0,
	scale: 2,
	prevId: 0,
	get current() {
		return this.list[this.id];
	},
	get previous() {
		return this.list[this.prevId];
	},
	get name() {
		return this.names[this.id];
	},
	get w() {
		return this.current.w;
	},
	get h() {
		return this.current.h;
	},
	get mid() {
		return this.current.mid;
	},
	add(room) {
		this.list.push(room);
		this.names.push(room.name);
	},
	start(name) {
		this.prevId = this.id;
		this.id = this.names.indexOf(name);
		this.resize();
		Input.reset();
		this.current.start();
	},
	update() {
		this.current.update();
	},
	render() {
		this.current.render();
	},
	resize() {
		const b = CANVAS.getBoundingClientRect();
		CANVAS.width = b.width * this.scale;
		CANVAS.height = b.height * this.scale;
		CTX.resetTransform();
		CTX.scale(this.scale, this.scale);
		this.current.w = b.width;
		this.current.h = b.height;
	}
};

const UI = {
	render() {
		Room.current.renderUI();
	}
};

const RAF = window.requestAnimationFrame
	|| window.msRequestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| function(f) { return setTimeout(f, Time.fixedDeltaTime) }
const BRANTH = {
	start() {
		window.onkeyup = (e) => Input.eventKeyUp(e);
		window.onkeydown = (e) => Input.eventKeyDown(e);
		window.onmouseup = (e) => Input.eventMouseUp(e);
		window.onmousedown = (e) => Input.eventMouseDown(e);
		window.onmousemove = (e) => Input.eventMouseMove(e);
		// window.ontouchend = (e) => Input.eventTouchEnd(e);
		// window.ontouchmove = (e) => Input.eventTouchMove(e);
		// window.ontouchstart = (e) => Input.eventTouchStart(e);
		window.onresize = () => Room.resize();
		HEAD.append(FULL_DISPLAY_STYLE);
		HEAD.append(FONT_LINK);
		BODY.append(CANVAS);
		Input.setup();
		this.update();
	},
	update(t) {
		Time.update(t);
		Room.update();
		// OBJ.update();
		CTX.clearRect(0, 0, Room.w, Room.h);
		Room.render();
		// OBJ.render();
		UI.render();
		Input.reset();
		RAF(BRANTH.update)
	}
};