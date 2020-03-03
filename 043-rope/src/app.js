class Rope extends BranthObject {
	constructor(n, x, y) {
		super(x, y);
		this.a = 200; // length of rope
		this.b = 0.3; // rope bending prop
		this.c = 1; // rope stiffness 0-1
		this.d = 0.01; // damping
		this.e = 0.05; // velocity threshold
		this.f = 2; // repeat time
		this.g = 0.1; // gravity
		this.h = -1;
		this.seg = [];
		const j = this.a / n;
		for (let i = 0; i < n; i++) {
			this.seg.push({
				p: new Vector2(this.x, this.y + i * j),
				v: Vector2.zero
			});
		}
	}
	getClosestSegment(p) {
		let q = 0, r = Math.pointdis(p, this.seg[0].p);
		for (let s = this.seg.length - 1; s > 0; s--) {
			const t = Math.pointdis(p, this.seg[s].p);
			if (t < r) {
				r = t;
				q = s;
			}
		}
		return this.seg[q];
	}
	update() {
		if (Input.mouseDown(0)) this.h = this.getClosestSegment(Input.mousePosition);
		if (Input.mouseHold(0)) this.h.v = Vector2.subtract(Input.mousePosition, this.h.p);
		let f = this.f;
		while (f-- > 0) {
			const g = this.seg.length;
			for (let h = g - 1; h > 0; h--) {
				const i = this.seg[h];
				const j = this.seg[h - 1];
				let m = Math.lendir((Math.pointdis(j.p, i.p) - this.a / g) * 0.5 * this.c, Math.pointdir(j.p, i.p));
				let n = Vector2.subtract(i.p, new Vector2(0, this.g / this.f));
				i.p.minus(m);
				i.v.plus(Vector2.subtract(i.p, n));
				n = Vector2.subtract(j.p, new Vector2(0, this.g / this.f));
				j.p.plus(m);
				j.v.plus(Vector2.subtract(j.p, n));
				i.v.minus(Vector2.multiply(i.v, this.d / this.f));
				j.v.minus(Vector2.multiply(j.v, this.d / this.f));
				n = this.e / this.f;
				if (Math.abs(i.v.x) < n && Math.abs(i.v.y) < n) i.v = Vector2.zero;
				if (Math.abs(j.v.x) < n && Math.abs(j.v.y) < n) j.v = Vector2.zero;
				i.p.plus(Vector2.divide(i.v, this.f));
				j.p.plus(Vector2.divide(j.v, this.f));
				m = Math.lendir((Math.pointdis(j.p, i.p) - this.a / g * 2) * 0.5 * this.b, Math.pointdir(j.p, i.p));
				n = Vector2.subtract(i.p, new Vector2(0, this.g / this.f));
				i.p.minus(m);
				i.v.plus(Vector2.subtract(i.p, n));
				n = Vector2.subtract(j.p, new Vector2(0, this.g / this.f));
				j.p.plus(m);
				j.v.plus(Vector2.subtract(j.p, n));
			}
		}
	}
	render() {
		Draw.setColor(C.black);
		for (let i = this.seg.length - 1; i >= 0; i--) {
			if (GLOBAL.debugMode !== 1) {
				Draw.circle(this.seg[i].p.x, this.seg[i].p.y, 3, true);
			}
			if (GLOBAL.debugMode > 0 && i > 0) {
				Draw.pointLine(this.seg[i].p, this.seg[i - 1].p);
			}
		}
	}
}

OBJ.add(Rope);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	OBJ.create(Rope, 20, Room.mid.w, Room.mid.h);
};

BRANTH.start();
Room.start('Game');