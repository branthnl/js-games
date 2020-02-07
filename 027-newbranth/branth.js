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
			document.removeChild(e);
		}
	}
};

const BODY = {
	append(e) {
		document.body.appendChild(e);
	}
};

const DEFAULT_FONT = 'Arvo, serif';
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
	bold: 'bold',
	italic: 'italic',
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

const Draw = {
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
		CTX.textBaseline = v;
	},
	setFont(font) {
		CTX.font = `${font} ${DEFAULT_FONT}`;
	},
	text(x, y, text) {
		CTX.fillText(text, x, y);
	},
	textWidth(text) {
		return CTX.measureText(text).width;
	},
	textHeight(text) {
		return Font.size;
	}
};

class BranthRoom {
	constructor(name, w, h) {
		this.name = name;
		this.w = w;
		this.h = h;
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
	fullDisplay: true,
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
		HEAD.remove(FULL_DISPLAY_STYLE);
		this.fullDisplay = false;
		this.prevId = this.id;
		this.id = this.names.indexOf(name);
		if (this.w && this.h) {
			CANVAS.style.width = `${this.w}px`;
			CANVAS.style.height = `${this.h}px`;
			CANVAS.width = this.w * this.scale;
			CANVAS.height = this.h * this.scale;
			CTX.resetTransform();
			CTX.scale(this.scale, this.scale);
		}
		else {
			this.fullDisplay = true;
			HEAD.append(FULL_DISPLAY_STYLE);
			this.resize();
		}
		this.current.start();
	},
	update() {
		this.current.update();
	},
	render() {
		this.current.render();
	},
	resize() {
		if (this.fullDisplay) {
			const b = CANVAS.getBoundingClientRect();
			CANVAS.width = b.width * this.scale;
			CANVAS.height = b.height * this.scale;
			CTX.resetTransform();
			CTX.scale(this.scale, this.scale);
			this.current.w = b.width;
			this.current.h = b.height;
		}
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
		// window.onkeyup = (e) => Input.eventKeyUp(e);
		// window.onkeydown = (e) => {
		// 	if (Input.preventDefaultKeyCodes.includes(e.keyCode)) {
		// 		e.preventDefault();
		// 	}
		// 	Input.eventKeyDown(e);
		// };
		// window.onmouseup = (e) => Input.eventMouseUp(e);
		// window.onmousedown = (e) => Input.eventMouseDown(e);
		// window.onmousemove = (e) => Input.eventMouseMove(e);
		// window.ontouchend = (e) => Input.eventTouchEnd(e);
		// window.ontouchmove = (e) => Input.eventTouchMove(e);
		// window.ontouchstart = (e) => Input.eventTouchStart(e);
		window.onresize = () => Room.resize();
		HEAD.append(FONT_LINK);
		BODY.append(CANVAS);
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
		// Input.reset();
		RAF(BRANTH.update)
	}
};