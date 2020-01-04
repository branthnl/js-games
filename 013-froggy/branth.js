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

const Time = {
	time: 0,
	lastTime: 0,
	deltaTime: 0,
	fixedDeltaTime: FRAME_RATE,
	update(t) {
		this.lastTime = this.time || 0;
		this.time = t || 0;
		this.deltaTime = this.time - this.lastTime || this.fixedDeltaTime;
	}
};

const C = {
	AliceBlue: '#F0F8FF',
	AntiqueWhite: '#FAEBD7',
	Aqua: '#00FFFF',
	Aquamarine: '#7FFFD4',
	Azure: '#F0FFFF',
	Beige: '#F5F5DC',
	Bisque: '#FFE4C4',
	Black: '#000000',
	BlanchedAlmond: '#FFEBCD',
	Blue: '#0000FF',
	BlueViolet: '#8A2BE2',
	Brown: '#A52A2A',
	BurlyWood: '#DEB887',
	CadetBlue: '#5F9EA0',
	Chartreuse: '#7FFF00',
	Chocolate: '#D2691E',
	Coral: '#FF7F50',
	CornflowerBlue: '#6495ED',
	Cornsilk: '#FFF8DC',
	Crimson: '#DC143C',
	Cyan: '#00FFFF',
	DarkBlue: '#00008B',
	DarkCyan: '#008B8B',
	DarkGoldenRod: '#B8860B',
	DarkGray: '#A9A9A9',
	DarkGrey: '#A9A9A9',
	DarkGreen: '#006400',
	DarkKhaki: '#BDB76B',
	DarkMagenta: '#8B008B',
	DarkOliveGreen: '#556B2F',
	DarkOrange: '#FF8C00',
	DarkOrchid: '#9932CC',
	DarkRed: '#8B0000',
	DarkSalmon: '#E9967A',
	DarkSeaGreen: '#8FBC8F',
	DarkSlateBlue: '#483D8B',
	DarkSlateGray: '#2F4F4F',
	DarkSlateGrey: '#2F4F4F',
	DarkTurquoise: '#00CED1',
	DarkViolet: '#9400D3',
	DeepPink: '#FF1493',
	DeepSkyBlue: '#00BFFF',
	DimGray: '#696969',
	DimGrey: '#696969',
	DodgerBlue: '#1E90FF',
	FireBrick: '#B22222',
	FloralWhite: '#FFFAF0',
	ForestGreen: '#228B22',
	Fuchsia: '#FF00FF',
	Gainsboro: '#DCDCDC',
	GhostWhite: '#F8F8FF',
	Gold: '#FFD700',
	GoldenRod: '#DAA520',
	Gray: '#808080',
	Grey: '#808080',
	Green: '#008000',
	GreenYellow: '#ADFF2F',
	HoneyDew: '#F0FFF0',
	HotPink: '#FF69B4',
	IndianRed: '#CD5C5C',
	Indigo: '#4B0082',
	Ivory: '#FFFFF0',
	Khaki: '#F0E68C',
	Lavender: '#E6E6FA',
	LavenderBlush: '#FFF0F5',
	LawnGreen: '#7CFC00',
	LemonChiffon: '#FFFACD',
	LightBlue: '#ADD8E6',
	LightCoral: '#F08080',
	LightCyan: '#E0FFFF',
	LightGoldenRodYellow: '#FAFAD2',
	LightGray: '#D3D3D3',
	LightGrey: '#D3D3D3',
	LightGreen: '#90EE90',
	LightPink: '#FFB6C1',
	LightSalmon: '#FFA07A',
	LightSeaGreen: '#20B2AA',
	LightSkyBlue: '#87CEFA',
	LightSlateGray: '#778899',
	LightSlateGrey: '#778899',
	LightSteelBlue: '#B0C4DE',
	LightYellow: '#FFFFE0',
	Lime: '#00FF00',
	LimeGreen: '#32CD32',
	Linen: '#FAF0E6',
	Magenta: '#FF00FF',
	Maroon: '#800000',
	MediumAquaMarine: '#66CDAA',
	MediumBlue: '#0000CD',
	MediumOrchid: '#BA55D3',
	MediumPurple: '#9370DB',
	MediumSeaGreen: '#3CB371',
	MediumSlateBlue: '#7B68EE',
	MediumSpringGreen: '#00FA9A',
	MediumTurquoise: '#48D1CC',
	MediumVioletRed: '#C71585',
	MidnightBlue: '#191970',
	MintCream: '#F5FFFA',
	MistyRose: '#FFE4E1',
	Moccasin: '#FFE4B5',
	NavajoWhite: '#FFDEAD',
	Navy: '#000080',
	OldLace: '#FDF5E6',
	Olive: '#808000',
	OliveDrab: '#6B8E23',
	Orange: '#FFA500',
	OrangeRed: '#FF4500',
	Orchid: '#DA70D6',
	PaleGoldenRod: '#EEE8AA',
	PaleGreen: '#98FB98',
	PaleTurquoise: '#AFEEEE',
	PaleVioletRed: '#DB7093',
	PapayaWhip: '#FFEFD5',
	PeachPuff: '#FFDAB9',
	Peru: '#CD853F',
	Pink: '#FFC0CB',
	Plum: '#DDA0DD',
	PowderBlue: '#B0E0E6',
	Purple: '#800080',
	RebeccaPurple: '#663399',
	Red: '#FF0000',
	RosyBrown: '#BC8F8F',
	RoyalBlue: '#4169E1',
	SaddleBrown: '#8B4513',
	Salmon: '#FA8072',
	SandyBrown: '#F4A460',
	SeaGreen: '#2E8B57',
	SeaShell: '#FFF5EE',
	Sienna: '#A0522D',
	Silver: '#C0C0C0',
	SkyBlue: '#87CEEB',
	SlateBlue: '#6A5ACD',
	SlateGray: '#708090',
	SlateGrey: '#708090',
	Snow: '#FFFAFA',
	SpringGreen: '#00FF7F',
	SteelBlue: '#4682B4',
	Tan: '#D2B48C',
	Teal: '#008080',
	Thistle: '#D8BFD8',
	Tomato: '#FF6347',
	Turquoise: '#40E0D0',
	Violet: '#EE82EE',
	Wheat: '#F5DEB3',
	White: '#FFFFFF',
	WhiteSmoke: '#F5F5F5',
	Yellow: '#FFFF00',
	YellowGreen: '#9ACD32'
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
	fill: 'name: fill, closePath: true, outline: false',
	stroke: 'name: stroke, closePath: true, outline: true',
	lineList: 'name: lineList, closePath: false, outline: true',
	pointList: 'name: pointList, closePath: false, outline: true',
	triangleList: 'name: triangleList, closePath: false, outline: true',
	triangleListFill: 'name: triangleList, closePath: false, outline: false'
};

class Draw {
	static setAlpha(a) {
		CTX.globalAlpha = a;
	}
	static setColor(color) {
		CTX.fillStyle = color;
		CTX.strokeStyle = color;
	}
	static setHAlign(align) {
		CTX.textAlign = align;
	}
	static setVAlign(align) {
		CTX.textBaseline = align;
	}
	static setHVAlign(h, v) {
		CTX.textAlign = h;
		CTX.textBaseline = v || h;
	}
	static setFont(font) {
		CTX.font = `${font} ${DEFAULT_FONT}`;
	}
	static text(x, y, text) {
		CTX.fillText(text, x, y);
	}
	static draw(outline, cap) {
		if (outline) {
			if (cap) CTX.lineCap = cap;
			CTX.stroke();
		}
		else {
			CTX.fill();
		}
	}
	static rect(x, y, w, h, outline) {
		CTX.beginPath();
		CTX.rect(x, y, w, h);
		this.draw(outline);
	}
	static circle(x, y, r, outline) {
		CTX.beginPath();
		CTX.arc(x, y, r, 0, 2 * Math.PI);
		CTX.closePath();
		this.draw(outline);
	}
	static ellipse(x, y, w, h, outline) {
		CTX.beginPath();
		CTX.moveTo(x, y + h * 0.5);
		CTX.quadraticCurveTo(x, y, x + w * 0.5, y);
		CTX.quadraticCurveTo(x + w, y, x + w, y + h * 0.5);
		CTX.quadraticCurveTo(x + w, y + h, x + w * 0.5, y + h);
		CTX.quadraticCurveTo(x, y + h, x, y + h * 0.5);
		CTX.closePath();
		this.draw(outline);
	}
	static roundrect(x, y, w, h, r, outline) {
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
	}
	static poly = {
		name: '',
		vertices: []
	}
	static polyBegin(poly) {
		this.poly.name = poly;
		this.poly.vertices = [];
	}
	static vertex(x, y) {
		this.poly.vertices.push({ x, y });
	}
	static polyEnd() {
		const get = (p, s) => p.filter(x => x.includes(s))[0][1];
		const split = (s) => s.replace(/\s/g, '').split(',').map(x => x.split(':'));
		const getName = (s) => get(split(s), 'name');
		const param = split(this.poly.name);
		const name = get(param, 'name');
		const outline = get(param, 'outline') === 'true';
		const closePath = get(param, 'closePath') === 'true';
		switch (name) {
			case getName(Poly.fill):
			case getName(Poly.stroke):
				let count = 0;
				CTX.beginPath();
				for (const v of this.poly.vertices) {
					if (count === 0) CTX.moveTo(v.x, v.y);
					else CTX.lineTo(v.x, v.y);
					count++;
				}
				if (closePath) CTX.closePath();
				this.draw(outline);
				break;
		}
	}
	static setCap(cap) {
		CTX.lineCap = cap;
	}
	static resetCap() {
		CTX.lineCap = Cap.butt;
	}
	static clearRect(x, y, w, h) {
		CTX.clearRect(x, y, w, h);
	}
}

class BranthObject {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	static ID = 0;
	id = BranthObject.ID++;
	active = true;
	visible = true;
	update() {}
	render() {}
	renderUI() {}
	alarm = [];
	alarmFunction = [
		this.alarm0,
		this.alarm1,
		this.alarm2,
		this.alarm3,
		this.alarm4,
		this.alarm5
	];
	alarmUpdate() {
		if (this.alarm) {
			for (const i in this.alarm) {
				if (this.alarm[i] !== null) {
					if (this.alarm[i] > 0) {
						this.alarm[i] = Math.max(0, this.alarm[i] - Time.deltaTime);
					}
					else if (this.alarm[i] != -1) {
						if (this.alarmFunction[i]) this.alarmFunction[i]();
						if (this.alarm[i] <= 0) this.alarm[i] = -1;
					}
				}
			}
		}
	}
}

class OBJ {
	static list = [];
	static classes = [];
	static add(cls) {
		this.list.push([]);
		this.classes.push(cls);
	}
	static create(cls, x, y) {
		if (this.classes.includes(cls)) {
			const i = new cls(x, y);
			this.list[this.classes.indexOf(cls)].push(i);
			return i;
		}
		else {
			console.log(`Class not found: ${cls}`);
			return null;
		}
	}
	static update() {
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
}

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
}

class BranthRoom {
	constructor(name, w, h) {
		this.name = name;
		this.w = w;
		this.h = h;
	}
	start() {}
}

class Room {
	_name = '';
	static list = [];
	static get names() {
		return this.list.map(x => x.name);
	}
	static get id() {
		return this.names.indexOf(this._name);
	}
	static get name() {
		return this._name;
	}
	static get current() {
		return this.list[this.id] || new BranthRoom(this._name, CANVAS.width, CANVAS.height);
	}
	static get w() {
		return this.current.w;
	}
	static get h() {
		return this.current.h;
	}
	static add(room) {
		this.list.push(room);
	}
	static start(name) {
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
}

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