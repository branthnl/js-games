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
const FRAME_RATE = 1000 / 60;

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
	alarmFunction = [this.alarm0, this.alarm1, this.alarm2, this.alarm3, this.alarm4, this.alarm5];
	alarmUpdate() {
		if (this.alarm) {
			for (const i in this.alarm) {
				if (this.alarm[i] !== null) {
					if (this.alarm[i] > 0) {
						this.alarm[i] = Math.max(0, this.alarm[i] - Time.deltaTime);
					}
					else if (this.alarm[i] != -1) {
						if (this.alarmFunction[i]) {
							this.alarmFunction[i]();
						}
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
		return this.list[this.id];
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
		OBJ.update();
		UI.update();
		RAF(BRANTH.update);
	}
};