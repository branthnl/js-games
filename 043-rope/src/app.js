class Rope extends BranthObject {
	constructor(x, y) {
		super(x, y);
		this.n = 20; // Number of segments
		this.l = 200; // Length of rope
		this.sl = this.l / this.n; // Length of one segment
		this.k = 1; // Rope stiffness (0 -> 1)
		this.b = 0.3; // Rope bending prop
		this.d = 0.01; // Damping
		this.vt = 0.05; // Velocity threshold
		this.rtime = 2; // If the repeat time is bigger the simulation is better but uses more CPU
		this.bt = 0; // Bend type (0-nobendcalc, 1-bendcalclow, 2-bendcalchigh) more bend calculations -> more CPU
		this.sx = this.x; // startx, x of first segment
		this.sy = this.y; // starty, y of first segment
		this.g = 0.1; // Gravity
		this.segx = [];
		this.segy = [];
		this.segvx = [];
		this.segvy = [];
		this.segInit(); // Initializes all segments
		this.ddm = 0; // Debug draw mode - 0(circles) 1(lines) 2(both) 3(texture)
	}
	segInit() {
		for (let i = 0; i < this.n; i++) {
			this.segx.push(this.sx); // segment x
			this.segy.push(this.sy + i * this.sl); // segment y
			this.segvx.push(0); // segment x velocity
			this.segvy.push(0); // segment y velocity
		}
	}
	segStep() {
		for (let i = this.n - 1; i > 0; i--) {
			this.segMove1(i, i - 1);
			if (this.bt > 0 && i - 2 >= 0) this.segMove2(i, i - 2);
			if (this.bt > 1 && i - 3 >= 0) this.segMove3(i, i - 3);
		}
	}
	segMove1(i, j, s = 1) {
		const len = Math.linedis(this.segx[j], this.segy[j], this.segx[i], this.segy[i]);
		const dir = Math.linedir(this.segx[j], this.segy[j], this.segx[i], this.segy[i]);
		let xx = this.segx[i];
		let yy = this.segy[i];
		let l = Math.lendir(((len - this.sl * s) / 2) * (s === 1? this.k : this.b), dir);
		this.segx[i] -= l.x;
		this.segy[i] -= l.y;
		this.segvx[i] += this.segx[i] - xx;
		this.segvy[i] += this.segy[i] - yy + (s === 1? this.g / this.rtime : 0);
		xx = this.segx[j];
		yy = this.segy[j];
		l = Math.lendir(((len - this.sl * s) / 2) * (s === 1? this.k : this.b), dir);
		this.segx[j] += l.x;
		this.segy[j] += l.y;
		this.segvx[j] += this.segx[j] - xx;
		this.segvy[j] += this.segy[j] - yy + (s === 1? this.g / this.rtime : 0);
		if (s === 1) {
			this.segvx[i] -= this.segvx[i] * this.d / this.rtime;
			this.segvy[i] -= this.segvy[i] * this.d / this.rtime;
			this.segvx[j] -= this.segvx[j] * this.d / this.rtime;
			this.segvy[j] -= this.segvy[j] * this.d / this.rtime;
			const h = this.vt / this.rtime;
			if (Math.abs(this.segvx[i]) < h && Math.abs(this.segvy[i]) < h) {
				this.segvx[i] = 0;
				this.segvy[i] = 0;
			}
			if (Math.abs(this.segvx[j]) < h && Math.abs(this.segvy[j]) < h) {
				this.segvx[j] = 0;
				this.segvy[j] = 0;
			}
			this.segx[i] += this.segvx[i] / this.rtime / 2;
			this.segy[i] += this.segvy[i] / this.rtime / 2;
			this.segx[j] += this.segvx[j] / this.rtime / 2;
			this.segy[j] += this.segvy[j] / this.rtime / 2;
		}
	}
	segMove2(i, j) {
		this.segMove1(i, j, 2);
	}
	segMove3(i, j) {
		this.segMove1(i, j, 3);
	}
	getClosestSeg(x, y) {
		let g = 0;
		let h = Math.linedis(x, y, this.segx[g], this.segy[g]);
		for (let i = this.n - 1; i > 0; i--) {
			const j = Math.linedis(x, y, this.segx[i], this.segy[i]);
			if (j < h) {
				h = j;
				g = i;
			}
		}
		return g;
	}
	drawDebug(circles, lines, cover, lover) {
		Draw.setColor(C.black);
		if (circles === 1) {
			Draw.circle(this.segx[0], this.segy[0], 3, true);
		}
		if (this.segvx[0] === 0 && this.segvy[0] === 0) {
			if (cover === 1) {
				Draw.circle(this.segx[0], this.segy[0], 5, true);
			}
		}
		for (let i = this.n - 1; i > 0; i--) {
			if (lines === 1) Draw.line(this.segx[i], this.segy[i], this.segx[i - 1], this.segy[i - 1]);
			if (circles === 1) Draw.circle(this.segx[i], this.segy[i], 3, true);
			if (this.segvx[i] === 0 && this.segvy[i] === 0) {
				if (cover === 1) Draw.circle(this.segx[i], this.segy[i], 5, true);
				if (lover === 1) {
					Draw.setStrokeWeight(3);
					Draw.line(this.segx[i], this.segy[i], this.segx[i - 1], this.segy[i - 1]);
					Draw.resetStrokeWeight();
				}
			}
		}
	}
	draw() {
		Draw.setColor(C.black);
	}
	update() {
		let p = -1;
		const m = Input.mousePosition;
		if (Input.mouseDown(0)) {
			p = this.getClosestSeg(m.x, m.y);
		}
		if (Input.mouseHold(0)) {
			p = this.getClosestSeg(m.x, m.y);
			this.segvx[p] = m.x - this.segx[p];
			this.segvy[p] = m.y - this.segy[p];
		}
		for (let i = 0; i < this.rtime; i++) {
			this.segStep();
		}
		if (Input.keyDown(KeyCode.M)) {
			if (++this.ddm > 3) this.ddm = 0;
		}
	}
	render() {
		if (this.ddm === 0) this.drawDebug(1, 0, 1, 0);
		if (this.ddm === 1) this.drawDebug(0, 1, 0, 1);
		if (this.ddm === 2) this.drawDebug(1, 1, 1, 1);
		if (this.ddm === 3) this.draw();
	}
}

OBJ.add(Rope);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	OBJ.create(Rope, Room.mid.w, Room.mid.h);
};

BRANTH.start();
Room.start('Game');