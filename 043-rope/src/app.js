Draw.add(Vector2.zero, 'Banner', 'src/img/Banner.png');

class Rope extends BranthObject {
	constructor(n, x, y) {
		super(x, y);
		this.a = 100; // length of rope
		// this.b = 0.3; // rope bending prop
		this.c = 1; // rope stiffness 0-1
		this.d = 0.01; // damping
		this.e = 0.05; // velocity threshold
		this.f = 20; // repeat time
		this.g = 0.1; // gravity
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
		if (Input.keyHold(KeyCode.Space)) this.seg[0].v = Vector2.subtract(Vector2.add(Vector2.multiply(Input.mousePosition, Vector2.right), new Vector2(0, Room.h * 0.25)), this.seg[0].p);
		else if (Input.mouseHold(0)) this.h.v = Vector2.subtract(Input.mousePosition, this.h.p);
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
		if (GLOBAL.debugMode > 2) {
			// Cloth simulation
			let w = this.seg.length - 0.5;
			for (let i = 1; i < w; i++) {
				const j = this.seg[i].p;
				const k = this.seg[i - 1].p;
				const l = [
					Vector2.add(j, Math.lendir(w - i, 0)),
					Vector2.add(k, Math.lendir(w - i + 1.5 * (i > 1), 0)),
					Vector2.add(k, Math.lendir(w - i + 1.5 * (i > 1), 180)),
					Vector2.add(j, Math.lendir(w - i, 180))
				];
				if (i === 1) {
					if (Input.keyHold(KeyCode.Space)) {
						Draw.setColor(C.white);
						if (Input.mouseHold(0)) {
							const m = Input.mousePosition;
							Draw.line(l[1].x + 3, l[1].y, m.x, m.y);
							Draw.line(l[2].x - 3, l[2].y, m.x, m.y);
						}
						Draw.line(l[1].x + 5, l[1].y, l[2].x - 5, l[2].y);
						Draw.circle(l[1].x + 5, l[1].y, 1.5);
						Draw.circle(l[2].x - 5, l[2].y, 1.5);
					}
				}
				const m = Math.sign(l[0].y - l[1].y);
				Draw.setColor(`rgba(${i}, ${50 - i}, 50, 1)`);
				Draw.primitiveBegin();
				Draw.vertex(l[0].x, l[0].y + m);
				Draw.vertex(l[1].x, l[1].y - m);
				Draw.vertex(l[2].x, l[2].y - m);
				Draw.vertex(l[3].x, l[3].y + m);
				Draw.primitiveEnd();
			}
		}
		else {
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
		Draw.setFont(Font.s);
		Draw.setHVAlign(Align.l, Align.t);
		Draw.text(8, 8, `${Time.FPS}\nDebug mode: ${GLOBAL.debugMode}\n - Press <U> to change debug mode.`);
		Draw.setAlpha(0.5 + 0.5 * Input.keyHold(KeyCode.Space));
		Draw.text(8, 8 + Font.size * 3, ` - Hold <Space> to pin the first segment.`);
		Draw.setAlpha(1);
	}
}

OBJ.add(Rope);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	Room.scale = 4;
	Room.resize();
	OBJ.create(Rope, 50, Room.mid.w, Room.mid.h);
};

BRANTH.start();
Room.start('Game');