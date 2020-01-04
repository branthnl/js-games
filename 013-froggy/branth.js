Number.prototype.mid = function() { return this.valueOf() * 0.5; }
Math.clamp = (a, b, c) => Math.min(c, Math.max(b, a));
Math.range = (min, max) => min + Math.random() * (max - min);
Math.degtorad = (d = 1) => d * Math.PI / 180;
Math.radtodeg = (d = 1) => d * 180 / Math.PI;
Math.lendirx = (l, d) => l * Math.cos(Math.degtorad(d));
Math.lendiry = (l, d) => l * Math.sin(Math.degtorad(d));
Math.lendir = (l, d) => ({ x: Math.lendirx(l, d), y: Math.lendiry(l, d) });
Math.randneg = (t = 0.5) => Math.range(0, 1) > t? -1 : 1;

const PARENT = document.body;
const CANVAS = document.createElement('canvas');
const CTX = CANVAS.getContext('2d');
const FRAME_RATE = 1000 / 60;
const DEFAULT_FONT = 'sans-serif';
const DEBUG_MODE = true;
if (!DEBUG_MODE) console.log = () => {};

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
	small: '16px',
	smallBold: 'bold 16px',
	smallItalic: 'italic 16px',
	medium: '24px',
	mediumBold: 'bold 24px',
	mediumItalic: 'italic 24px',
	large: '36px',
	largeBold: 'bold 36px',
	largeItalic: 'italic 36px'
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
		CTX.textBaseline = v || h;
	},
	setFont(font) {
		CTX.font = `${font} ${DEFAULT_FONT}`;
	},
	text(x, y, text) {
		CTX.fillText(text, x, y);
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
	roundrect(x, y, w, h, r, outline) {
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
		this.draw(outline);
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
		CTX.moveTo(x, y);
	},
	lineTo(x, y) {
		CTX.lineTo(x, y);
	},
	curveTo(cpx, cpy, x, y) {
		CTX.quadraticCurveTo(cpx, cpy, x, y);
	},
	bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
		CTX.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
	},
	fill() {
		CTX.fill();
	},
	stroke() {
		CTX.stroke();
	},
	clearRect(x, y, w, h) {
		CTX.clearRect(x, y, w, h);
	}
};

let ID = 0;
class BranthObject {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.id = ID++;
		this.active = true;
		this.visible = true;
		this.alarm = [-1, -1, -1, -1, -1, -1];
	}
	start() {}
	update() {}
	render() {}
	renderUI() {}
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
}

const OBJ = {
	list: [],
	classes: [],
	add(cls) {
		this.list.push([]);
		this.classes.push(cls);
	},
	create(cls, x, y) {
		if (this.classes.includes(cls)) {
			const i = new cls(x, y); this.list[this.classes.indexOf(cls)].push(i); i.start();
			return i;
		}
		console.log(`Class not found: ${cls.name}\n- Try add OBJ.add(${cls.name}); in your code.`);
	},
	update() {
		for (const o of this.list) {
			for (const i of o) {
				if (i.active) {
					i.update();
				}
				if (i.visible) {
					i.render();
				}
			}
		}
	}
};

const UI = {
	update() {
		for (const o of OBJ.list) {
			for (const i of o) {
				if (i.visible) {
					i.renderUI();
				}
			}
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
}

const Room = {
	_name: '',
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
	get w() {
		return this.current.w;
	},
	get h() {
		return this.current.h;
	},
	add(room) {
		this.list.push(room);
	},
	start(name) {
		if (this.names.includes(name)) {
			this._name = name;
			CANVAS.width = this.w;
			CANVAS.height = this.h;
			this.current.start();
		}
		else {
			console.log(`Room not found: ${name}`);
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
		PARENT.appendChild(CANVAS);
		this.update();
	},
	update: function(t) {
		Time.update(t);
		Draw.clearRect(0, 0, Room.w, Room.h);
		OBJ.update();
		UI.update();
		RAF(BRANTH.update);
	}
};