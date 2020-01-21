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
		const v = Object.values(C); v.pop();
		return v[Math.floor(Math.random() * v.length)];
	}
};

const CANVAS = document.createElement('canvas');
const COLOR = document.createElement('div');
const COLOR_P = document.createElement('p');
const COLOR_DIV = document.createElement('div');
COLOR.classList.add('color');
COLOR.appendChild(COLOR_P);
COLOR.appendChild(COLOR_DIV);
const STROKE_WEIGHT = document.createElement('div');
const STROKE_WEIGHT_P = document.createElement('p');
const STROKE_WEIGHT_DIV = document.createElement('div');
STROKE_WEIGHT.classList.add('strokeweight');
STROKE_WEIGHT.appendChild(STROKE_WEIGHT_P);
STROKE_WEIGHT.appendChild(STROKE_WEIGHT_DIV);
const CTX = CANVAS.getContext('2d');

const Draw = {
	color: C.black,
	strokeWeight: 1,
	isDrawing: false,
	begin(m) {
		this.draw(m);
		this.isDrawing = true;
	},
	draw(m, c, w) {
		CTX.lineTo(m.x, m.y);
		CTX.strokeStyle = c || this.color;
		CTX.lineWidth = w || this.strokeWeight;
		CTX.lineCap = 'round';
		CTX.stroke();
		CTX.beginPath();
		CTX.moveTo(m.x, m.y);
	},
	end() {
		CTX.beginPath();
		this.isDrawing = false;
	},
	resize() {
		CANVAS.width = CANVAS.getBoundingClientRect().width * 2;
		CANVAS.height = CANVAS.getBoundingClientRect().height * 2;
		CTX.scale(2, 2);
	},
	setColor(c) {
		this.color = c;
		const k = Object.keys(C)[Object.values(C).indexOf(this.color)].split('');
		COLOR_P.innerHTML = k.shift().toUpperCase() + k.join('') + ' (C)';
		COLOR_DIV.style.backgroundColor = this.color;
	},
	setStrokeWeight(n) {
		this.strokeWeight = n;
		STROKE_WEIGHT_P.innerHTML = this.strokeWeight + 'px (S)';
		STROKE_WEIGHT_DIV.style.width = `${this.strokeWeight / 16}rem`;
		STROKE_WEIGHT_DIV.style.height = `${this.strokeWeight / 16}rem`;
	}
};

const getMousePosition = (e) => {
	return {
		x: e.clientX - CANVAS.getBoundingClientRect().left,
		y: e.clientY - CANVAS.getBoundingClientRect().top
	};
};

firebase.initializeApp({
	apiKey: "AIzaSyBISjR1svah1SFZBKCWsEZi688ppeUm53o",
	authDomain: "wedraw-6cbc6.firebaseapp.com",
	databaseURL: "https://wedraw-6cbc6.firebaseio.com",
	projectId: "wedraw-6cbc6",
	storageBucket: "wedraw-6cbc6.appspot.com",
	messagingSenderId: "611202296224",
	appId: "1:611202296224:web:88db56995580bb99ed5cc5",
	measurementId: "G-WFT0CV56VP"
});

const db = firebase.database().ref();
const dbUser = db.child('wd-user');

const USER = {
	key: '_' + Math.random().toString(36).substr(2, 9),
	x: 0,
	y: 0,
	c: Draw.color,
	w: Draw.strokeWeight,
	isDrawing: Draw.isDrawing
};

const sKey = sessionStorage.getItem('userkey');
if (sKey) {
	if (sKey.length >= 9) {
		USER.key = sessionStorage.getItem('userkey');
	}
}
else {
	sessionStorage.setItem('userkey', USER.key);
}

dbUser.child(USER.key).set(USER);

window.onload = () => {
	document.body.appendChild(CANVAS);
	document.body.appendChild(COLOR);
	document.body.appendChild(STROKE_WEIGHT);
	window.onmousedown = (e) => {
		const m = getMousePosition(e);
		Draw.begin(m);
		dbUser.child(`${USER.key}/isDrawing`).set(Draw.isDrawing);
	};
	window.onmousemove = (e) => {
		if (Draw.isDrawing) {
			const m = getMousePosition(e);
			Draw.draw(m);
			dbUser.child(`${USER.key}/x`).set(m.x);
			dbUser.child(`${USER.key}/y`).set(m.y);
		}
	};
	window.onmouseup = () => {
		Draw.end();
		dbUser.child(`${USER.key}/isDrawing`).set(Draw.isDrawing);
	};
	window.onresize = () => Draw.resize();
	Draw.resize();
	window.onkeyup = (e) => {
		if (e.which == 67 || e.keyCode == 67) {
			Draw.setColor(C.random());
			dbUser.child(`${USER.key}/c`).set(Draw.color);
		}
		if (e.which == 83 || e.keyCode == 83) {
			Draw.setStrokeWeight(Draw.strokeWeight * 2);
			if (Draw.strokeWeight > 16) {
				Draw.setStrokeWeight(1);
			}
			dbUser.child(`${USER.key}/w`).set(Draw.strokeWeight);
		}
	};
	Draw.setColor(C.random());
	Draw.setStrokeWeight(4);
	USER.c = Draw.color;
	USER.w = Draw.strokeWeight;
	dbUser.child(USER.key).set(USER);
	dbUser.on('value', snap => {
		snap.forEach(c => {
			const v = c.val();
			if (c.key !== USER.key) {
				if (v.isDrawing) {
					Draw.draw({
						x: v.x,
						y: v.y
					}, v.c, v.w);
				}
			}
		});
	});
};