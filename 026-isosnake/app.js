const CANVAS = document.createElement('canvas');
const CTX = CANVAS.getContext('2d');
const CANVAS_SCALER = 2;
const SCALER = {
	get w() {
		return CANVAS.width / 960;
	},
	get h() {
		return CANVAS.height / 540;
	}
};
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
	Left: 37,
	Up: 38,
	Right: 39,
	Down: 40
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

const Input = {
	list: [[]],
	reset() {
		for (const i of this.list) {
			for (const j of i) {
				j.reset();
			}
		}
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
	}
};

for (const keyCode of Object.values(KeyCode)) {
	Input.list[0].push(new BranthKey(keyCode));
}

const C = {
	black: 'black',
	darkGreen: 'darkgreen',
	green: 'green',
	red: 'red',
	white: 'white'
};

const Font = {
	get s() {
		return `${10 * SCALER.w}px`;
	},
	get m() {
		return `${16 * SCALER.w}px`;
	},
	get l() {
		return `${24 * SCALER.w}px`;
	},
	get xl() {
		return `${36 * SCALER.w}px`;
	},
	get xxl() {
		return `${48 * SCALER.w}px`;
	},
	get size() {
		return +CTX.font.split(' ').filter(v => v.includes('px')).shift().replace('px', '');
	},
	get sb() {
		return `bold ${this.s}`;
	},
	get mb() {
		return `bold ${this.m}`;
	},
	get lb() {
		return `bold ${this.l}`;
	},
	get xlb() {
		return `bold ${this.xl}`;
	},
	get xxlb() {
		return `bold ${this.xxl}`;
	}
};

const Align = {
	l: 'left',
	r: 'right',
	c: 'center',
	t: 'top',
	m: 'middle',
	b: 'bottom'
};

const Draw = {
	setFont(f) {
		CTX.font = `${f} sans-serif`;
	},
	setAlpha(a) {
		CTX.globalAlpha = a;
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
		this.setHAlign(h);
		this.setVAlign(v);
	},
	text(x, y, text) {
		CTX.fillText(text, x, y);
	},
	draw(outline) {
		if (outline === true) {
			CTX.stroke();
		}
		else {
			CTX.fill();
		}
	},
	rect(x, y, w, h, outline) {
		CTX.beginPath();
		CTX.rect(x, y, w, h);
		this.draw(outline);
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
			i.start();
		}
	},
	create(cls, x, y) {
		const n = new cls(x, y);
		this.list[this.classes.indexOf(cls)].push(n);
		n.start();
		return n;
	},
	update() {
		for (const o of this.list) {
			for (const i of o) {
				if (i) {
					if (i.active) {
						i.earlyUpdate();
						i.update();
					}
				}
			}
		}
	},
	render() {
		for (const o of this.list) {
			for (const i of o) {
				if (i) {
					if (i.visible) {
						i.render();
					}
				}
			}
		}
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
	clearAll() {
		for (const i in this.list) {
			this.list[i] = [];
		}
	}
};

class BranthObject {
	constructor(x, y) {
		this.id = OBJ.ID++;
		this.active = true;
		this.visible = true;
		this.x = x;
		this.y = y;
	}
	start() {}
	earlyUpdate() {}
	update() {}
	render() {}
	renderUI() {}
}

const Room = {
	get w() {
		return CANVAS.width / CANVAS_SCALER;
	},
	get h() {
		return CANVAS.height / CANVAS_SCALER;
	},
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	}
};

const UI = {
	render() {
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
	start() {
		document.body.appendChild(CANVAS);
		window.onkeyup = (e) => Input.eventkeyup(e);
		window.onkeydown = (e) => {
			const keyCodes = [32, 37, 38, 39, 40];
			if (keyCodes.includes(e.keyCode)) {
				e.preventDefault();
			}
			Input.eventkeydown(e);
		}
		window.onresize = () => BRANTH.resize();
		BRANTH.resize();
		BRANTH.update();
	},
	update(t) {
		Time.update(t);
		OBJ.update();
		CTX.clearRect(0, 0, Room.w, Room.h);
		OBJ.render();
		UI.render();
		Input.reset();
		RAF(BRANTH.update);
	},
	resize() {
		CANVAS.width = CANVAS.getBoundingClientRect().width * CANVAS_SCALER;
		CANVAS.height = CANVAS.getBoundingClientRect().height * CANVAS_SCALER;
		CTX.resetTransform();
		CTX.scale(CANVAS_SCALER, CANVAS_SCALER);
	}
};

const Tile = {
	w: 20,
	get h() {
		return this.w * 0.5;
	},
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	}
};

const World = {
	get x() {
		return Room.mid.w;
	},
	get y() {
		return Room.mid.h - this.mid.h;
	},
	get w() {
		return Grid.c * Tile.w;
	},
	get h() {
		return Grid.r * Tile.h;
	},
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	}
};

class Point {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}
}

class Line {
	constructor(p1, p2) {
		this.p = [p1, p2];
	}
	intersect(line) {
		const p1 = this.p[0], p2 = this.p[1], p3 = line.p[0], p4 = line.p[1];
		const s1 = new Point(p2.x - p1.x, p2.y - p1.y);
		const s2 = new Point(p4.x - p3.x, p4.y - p3.y);
		const s = (-s1.y * (p1.x - p3.x) + s1.x * (p1.y - p3.y)) / (-s2.x * s1.y + s1.x * s2.y);
		const t = (s2.x * (p1.y - p3.y) - s2.y * (p1.x - p3.x)) / (-s2.x * s1.y + s1.x * s2.y);
		if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
			return new Point(p1.x + (t * s1.x), p1.y + (t * s1.y));
		}
		return null;
	}
}

const Grid = {
	g: [],
	c: 20,
	r: 20,
	get(c, r) {
		const g = new Point(
			c * Tile.mid.w - r * Tile.mid.w,
			r * Tile.mid.h + c * Tile.mid.h
		);
		return new Point(World.x + g.x, World.y + g.y);
	},
	tilePath(x, y) {
		if (x instanceof Point) {
			y = x.y;
			x = x.x;
		}
		CTX.beginPath();
		CTX.moveTo(x, y - Tile.mid.h);
		CTX.lineTo(x + Tile.mid.w, y);
		CTX.lineTo(x, y + Tile.mid.h);
		CTX.lineTo(x - Tile.mid.w, y);
		CTX.closePath();
	}
};

for (let c = 0; c < Grid.c; c++) {
	Grid.g.push([]);
	for (let r = 0; r < Grid.r; r++) {
		Grid.g[c].push(0);
	}
}

class BranthGrid extends BranthObject {
	constructor(c, r) {
		super(0, 0);
		this.c = c;
		this.r = r;
	}
	meet(c, r) {
		if (r === undefined) {
			r = c.r;
			c = c.c;
		}
		return c === this.c && r === this.r;
	}
	earlyUpdate() {
		const b = Grid.get(this.c, this.r);
		this.x = b.x;
		this.y = b.y;
	}
}

class Food extends BranthGrid {
	start() {
		this.respawn();
	}
	respawn() {
		this.c = Math.floor(Math.random() * Grid.c);
		this.r = Math.floor(Math.random() * Grid.r);
	}
}

class Snake extends BranthGrid {
	start() {
		this.dc = 0;
		this.dr = 0;
		this.idle = true;
		this.tails = [];
		this.tailCount = 3;
		this.isPressed = false;
		this.moveInterval = 100;
		this.alarm = this.moveInterval;
	}
	update() {
		const keyUp = Input.keyDown(KeyCode.Up);
		const keyLeft = Input.keyDown(KeyCode.Left);
		const keyDown = Input.keyDown(KeyCode.Down);
		const keyRight = Input.keyDown(KeyCode.Right);
		if (this.idle || !this.isPressed) {
			if (keyUp && this.dr === 0) {
				this.dc = 0;
				this.dr = -1;
				this.isPressed = true;
			}
			else if (keyLeft && this.dc === 0) {
				this.dc = -1;
				this.dr = 0;
				this.isPressed = true;
			}
			else if (keyDown && this.dr === 0) {
				this.dc = 0;
				this.dr = 1;
				this.isPressed = true;
			}
			else if (keyRight && this.dc === 0) {
				this.dc = 1;
				this.dr = 0;
				this.isPressed = true;
			}
		}
		if (this.alarm <= 0 && this.alarm !== -1) {
			if (!this.idle) {
				this.c += this.dc;
				this.r += this.dr;
				if (this.c < 0) this.c = Grid.c - 1;
				if (this.r < 0) this.r = Grid.r - 1;
				if (this.c > Grid.c - 1) this.c = 0;
				if (this.r > Grid.r - 1) this.r = 0;
				for (let i = 0; i < this.tails.length; i++) {
					const t = this.tails[i];
					if (this.meet(t)) {
						this.dc = 0;
						this.dr = 0;
						this.tailCount = 3;
						this.idle = true;
					}
				}
				this.tails.push({
					c: this.c,
					r: this.r
				});
				if (!(this.dc === 0 && this.dr === 0)) {
					while (this.tails.length > this.tailCount) {
						this.tails.shift();
					}
				}
				const a = OBJ.take(Food)[0];
				if (a.meet(this.c, this.r)) {
					this.tailCount++;
					a.respawn();
				}
			}
			else {
				this.idle = false;
			}
			this.isPressed = false;
			this.alarm = this.moveInterval;
		}
		else {
			this.alarm -= Time.deltaTime;
		}
	}
	render() {
		const tailsSorted = this.tails.slice();
		tailsSorted.push(OBJ.take(Food)[0]);
		tailsSorted.sort((a, b) => a.r < b.r || (a.r === b.r && a.c < b.c)? -1 : 1);
		for (let i = 0; i < tailsSorted.length; i++) {
			const t = tailsSorted[i];
			const b = Grid.get(t.c, t.r);
			for (let j = 0; j < Tile.mid.h; j++) {
				Grid.tilePath(b.x, b.y - j);
				if (t instanceof Food) {
					Draw.setColor(j === Tile.mid.h - 1? 'indianred' : 'firebrick');
				}
				else {
					Draw.setColor(j === Tile.mid.h - 1? (this.meet(t)? 'springgreen' : 'limegreen') : 'mediumseagreen');
				}
				Draw.draw();
			}
		}
	}
}

class Manager extends BranthObject {
	start() {
		const n = new Snake(18, 18);
		OBJ.push(Snake, n);
		OBJ.create(Food);
	}
	render() {
		Draw.setColor(C.black);
		for (let c = 0; c < Grid.c; c++) {
			for (let r = 0; r < Grid.r; r++) {
				const b = Grid.get(c, r);
				Grid.tilePath(b);
				Draw.draw(true);
			}
		}
	}
}

OBJ.add(Manager);
OBJ.add(Food);
OBJ.add(Snake);
BRANTH.start();
OBJ.create(Manager);