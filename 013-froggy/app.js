Number.prototype.mid = function() { return this.valueOf() * 0.5; }
Math.clamp = (a, b, c) => Math.min(c, Math.max(b, a));
Math.range = (min, max) => min + Math.random() * (max - min);
Math.degtorad = (d = 1) => d * Math.PI / 180;
Math.radtodeg = (d = 1) => d * 180 / Math.PI;
Math.lendirx = (l, d) => l * Math.cos(Math.degtorad(d));
Math.lendiry = (l, d) => l * Math.sin(Math.degtorad(d));
Math.lendir = (l, d) => ({ x: Math.lendirx(l, d), y: Math.lendiry(l, d) });
Math.randneg = (t = 0.5) => Math.range(0, 1) > t? -1 : 1;

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

class BranthRoom {
	constructor(name, w, h) {
		this.name = name;
		this.w = w;
		this.h = h;
	}
}

const Room = {
	r: [],
	keys: [],
	add(room) {
		this.r.push(room);
		this.keys.push(room.name);
	}
};

class BranthObject {
	static ID = 0;
	static getID() { return BranthObject.ID++; }
	id = BranthObject.getID();
	depth = 0;
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

class Frog extends BranthObject {
	depth = 0;
}

class Lotus extends BranthObject {
	depth = 1;
}

const OBJ = {
	o: [],
	keys: [],
	getIndex(k) { return this.keys.indexOf(k) },
	add(instance) {
		const k = instance.constructor;
		if (!this.keys.includes(k)) {
			this.o.push([]);
			this.keys.push(k);
		}
		const i = this.getIndex(k);
		this.o[i].push(instance);
	},
	update() {
		for (object of this.o) {
			for (instance of object) {
				object.update();
			}
		}
	}
};

const UI = {
	update() {
		for (object of OBJ.o) {
			for (instance of object) {
				object.renderUI();
			}
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
		this.update();
	},
	update: function(t) {
		Time.update(t);
		OBJ.update();
		UI.update();
		RAF(BRANTH.update);
	}
};

window.onload = () => {
	BRANTH.start();
}