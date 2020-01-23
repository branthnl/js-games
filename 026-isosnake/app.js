const CANVAS = document.createElement('canvas');
const CTX = CANVAS.getContext('2d');
const CANVAS_SCALER = 2;
const SCALER = {
	w() {
		return CANVAS.width / 720;
	},
	h() {
		return CANVAS.height / 1280;
	}
};
CANVAS.style.backgroundImage = 'radial-gradient(white 33%, gainsboro, lightgray)';

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
		window.onkeydown = (e) => Input.eventkeydown(e);
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
	w: 40,
	get h() {
		return this.w * 0.5;
	},
	mid() {
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
		return Room.h * 0.1;
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
	c: 40,
	r: 40,
	get(c, r) {
		const g = new Point(
			this.r * Tile.mid.w - this.c * Tile.mid.w,
			this.c * Tile.mid.h + this.r * Tile.mid.h
		);
		return new Point(World.x + g.x, World.y + g.y);
	},
	grid(x, y, round) {
		return 0;
		const r = (n) => round? Math.floor(n) : n;
		x -= World.x;
		y -= World.y;
		// const g = {
		// 	sc: r(m.x / Tile.w),
		// 	sr: r(m.y / Tile.h),
		// 	oc: 0,
		// 	or: 0,
		// 	get c() {
		// 		return this.sc + this.sr + this.oc;
		// 	},
		// 	get r() {
		// 		return this.sr - this.sc + this.or;
		// 	}
		// };
		// const b = {
		// 	get x() {
		// 		return w.x + g.x;
		// 	},
		// 	get y() {
		// 		return w.y + g.y;
		// 	}
		// };
		// const cp = [
		// 	new Point(b.x)
		// ];
		// // Cell points
		// const cp = [
		// 	new Point(b.x + t.w * 0.5, b.y),
		// 	new Point(b.x + t.w, b.y + t.h * 0.5),
		// 	new Point(b.x + t.w * 0.5, b.y + t.h),
		// 	new Point(b.x, b.y + t.h * 0.5)
		// ];
		// // Mouse line
		// const ml = new Line(
		// 	new Point(b.x + t.w * 0.5, b.y + t.h * 0.5),
		// 	new Point(w.x + m.x, w.y + m.y)
		// );
		// // Intersect top right?
		// if (ml.intersect(new Line(cp[0], cp[1]))) {
		// 	c.oc--;
		// }
		// // Intersect bottom right?
		// else if (ml.intersect(new Line(cp[1], cp[2]))) {
		// 	c.or++;
		// }
		// // Intersect bottom left?
		// else if (ml.intersect(new Line(cp[2], cp[3]))) {
		// 	c.oc++;
		// }
		// // Intersect top left?
		// else if (ml.intersect(new Line(cp[3], cp[0]))) {
		// 	c.or--;
		// }
		return {
			c: g.c,
			r: g.r
		};
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
	earlyUpdate() {
		const b = Grid.get(this.c, this.r);
		this.x = b.x;
		this.y = b.y;
	}
}

class Manager extends BranthObject {
	render() {
		for (let c = 0; c < Grid.c; c++) {
			for (let r = 0; r < Grid.r; r++) {
				const b = Grid.get(c, r);
				Draw.setColor(C.black);
				Grid.tilePath(b);
				Draw.draw(true);
			}
		}
		Draw.setHVAlign(Align.r, Align.b);
		Draw.text(Room.w - 8, Room.h - 8, `(${Math.floor(Room.w)}, ${Math.floor(Room.h)})`);
	}
}

OBJ.add(Manager);
BRANTH.start();
OBJ.create(Manager);