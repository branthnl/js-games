class Rope extends BranthObject {
	constructor(n, x, y) {
		super(x, y);
		this.a = 100; // length of rope
		// this.b = 0.3; // rope bending prop
		this.c = 1; // rope stiffness 0-1
		this.d = 0.01; // damping
		this.e = 0.05; // velocity threshold
		this.f = 10; // repeat time
		this.g = 0.01; // gravity
		this.h = null;
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
		let q = 0, r = Vector2.distance(p, this.seg[0].p);
		for (let s = this.seg.length - 1; s > 0; s--) {
			const t = Vector2.distance(p, this.seg[s].p);
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
		const g = this.seg.length;
		while (f-- > 0) {
			for (let h = g - 1; h > 0; h--) {
				const i = this.seg[h];
				const j = this.seg[h - 1];
				let m = Math.lendir((Vector2.distance(j.p, i.p) - this.a / g) * 0.5 * this.c, Math.pointdir(j.p, i.p));
				let n = Vector2.subtract(i.p, new Vector2(0, this.g / this.f));
				i.p.subtract(m);
				i.v.add(Vector2.subtract(i.p, n));
				n = Vector2.subtract(j.p, new Vector2(0, this.g / this.f));
				j.p.add(m);
				j.v.add(Vector2.subtract(j.p, n));
				i.v.subtract(Vector2.multiply(i.v, this.d / this.f));
				j.v.subtract(Vector2.multiply(j.v, this.d / this.f));
				n = this.e / this.f;
				if (Math.abs(i.v.x) < n && Math.abs(i.v.y) < n) i.v = Vector2.zero;
				if (Math.abs(j.v.x) < n && Math.abs(j.v.y) < n) j.v = Vector2.zero;
				// i.p.add(Vector2.divide(i.v, this.f * 0.5));
				i.p.add(new Vector2(i.v.x / this.f * 0.5, i.v.y / this.f * 0.5));
				// j.p.add(Vector2.divide(j.v, this.f * 0.5));
				j.p.add(new Vector2(j.v.x / this.f * 0.5, j.v.y / this.f * 0.5));
			}
		}
	}
	render() {
		Draw.setColor(C.black);
		if (GLOBAL.debugMode > 2) {
			// Cloth simulation
			let w = 18;
			for (let i = this.seg.length - 1; i > 0; i--) {
				const j = this.seg[i].p;
				const k = this.seg[i - 1].p;
				const l = [
					Vector2.add(j, Math.lendir(w, 0)),
					Vector2.add(k, Math.lendir(w, 0)),
					Vector2.add(k, Math.lendir(w, 180)),
					Vector2.add(j, Math.lendir(w, 180))
				];
				Draw.primitiveBegin();
				Draw.vertex(l[0].x, l[0].y);
				Draw.vertex(l[1].x, l[1].y);
				Draw.vertex(l[2].x, l[2].y);
				Draw.vertex(l[3].x, l[3].y);
				Draw.primitiveEnd();
			}
		}
		else {
			for (let i = this.seg.length - 1; i >= 0; i--) {
				if (GLOBAL.debugMode !== 1) {
					Draw.circle(this.seg[i].p.x, this.seg[i].p.y, 3, true);
				}
				if (GLOBAL.debugMode > 0 && i > 0) {
					Draw.pointLine(this.seg[i].p, this.seg[i - 1].p);
				}
			}
		}
		Draw.setFont(Font.m);
		Draw.setHVAlign(Align.l, Align.t);
		Draw.text(8, 8, `${Time.FPS}\nDebug mode: ${GLOBAL.debugMode}\n - Press <U> to change debug mode.`);
	}
}

OBJ.add(Rope);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	OBJ.create(Rope, 50, Room.mid.w, Room.mid.h);
};

BRANTH.start(960, 540, { HAlign: true, VAlign: true });
Room.start('Game');