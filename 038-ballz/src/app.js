class Pop extends BranthBehaviour {
	constructor(x, y, r) {
		super(x, y);
		this.r = r;
		this.alarm[0] = 500;
	}
	render() {
		const t = Math.clamp(this.alarm[0] / 500, 0, 1);
		Draw.setColor(C.white);
		Draw.plus(this.x, this.y, this.r * t);
		Draw.circle(this.x, this.y, this.r * (1 - t), true);
	}
	alarm0() {
		OBJ.destroy(this.id);
	}
}

class Ball extends BranthObject {
	constructor(x, y, r) {
		super(x, y);
		this.r = r;
		this.mass = 1;
		this.v = new Vector2(0, 0);
		this.isOverlapping = false;
	}
	isOverlap(b) {
		return Math.pointdis(this, b) < this.r + b.r;
	}
	update() {
		this.x += this.v.x * 0.01;
		this.y += this.v.y * 0.01;
		if (Math.abs(this.v.x * this.v.x + this.v.y * this.v.y) < 0.01) {
			this.v.x = 0;
			this.v.y = 0;
		}
		else {
			this.v.x *= 0.98;
			this.v.y *= 0.98;
		}
		if (this.x < -this.r * 2) this.x = Room.w + this.r * 2;
		if (this.y < -this.r * 2) this.y = Room.h + this.r * 2;
		if (this.x > Room.w + this.r * 2) this.x = -this.r * 2;
		if (this.y > Room.h + this.r * 2) this.y = -this.r * 2;
		for (const b of OBJ.take(Ball)) {
			if (b.id !== this.id) {
				if (this.isOverlap(b)) {
					// Distance between ball centers
					const d = Math.pointdis(this, b);
					const overlap = 0.5 * (d - this.r - b.r) - 0.5;
					// Displace current ball
					this.x -= overlap * (this.x - b.x) / d;
					this.y -= overlap * (this.y - b.y) / d;
					// Displace other ball
					b.x += overlap * (this.x - b.x) / d;
					b.y += overlap * (this.y - b.y) / d;
					GLOBAL.collidingPairs.push(this, b);
					this.isOverlapping = true;
					b.isOverlapping = true;
				}
			}
		}
	}
	render() {
		Draw.setColor(C.white);
		Draw.circle(this.x, this.y, this.r, true);
		Draw.arc(this.x, this.y, this.r * 0.8, 210, 250, true);
	}
}

OBJ.add(Pop);
OBJ.add(Ball);

const Game = new BranthRoom('Game');
Room.add(Game);

GLOBAL.balls = [];
GLOBAL.selectedBall = null;
GLOBAL.collidingPairs = [];
GLOBAL.ballDefaultRadius = 7;
GLOBAL.addBall = (x, y, r) => {
	OBJ.push(Ball, new Ball(x, y, r));
};

Game.start = () => {
	GLOBAL.balls = [];
	for (let i = 0; i < 100; i++) {
		GLOBAL.addBall(
			GLOBAL.ballDefaultRadius * 5 + Math.range(Room.w - GLOBAL.ballDefaultRadius * 10),
			GLOBAL.ballDefaultRadius * 5 + Math.range(Room.h - GLOBAL.ballDefaultRadius * 10),
			GLOBAL.ballDefaultRadius * Math.range(0.4, 3 + 2 * Math.randbool(0.2))
		);
	}
};

Game.update = () => {
	const m = Input.mousePosition; m.r = 1;
	if (GLOBAL.selectedBall instanceof Ball) {
		if (Input.mouseHold(2)) {
			GLOBAL.selectedBall.x = m.x;
			GLOBAL.selectedBall.y = m.y;
		}
		if (Input.mouseUp(2)) {
			GLOBAL.selectedBall = null;
		}
		if (Input.mouseUp(0)) {
			// Apply velocity
			GLOBAL.selectedBall.v.x = 5 * (GLOBAL.selectedBall.x - m.x);
			GLOBAL.selectedBall.v.y = 5 * (GLOBAL.selectedBall.y - m.y);
			GLOBAL.selectedBall = null;
		}
	}
	else if (Input.mouseDown(2)) {
		for (const b of OBJ.take(Ball)) {
			if (b.isOverlap(m)) {
				GLOBAL.selectedBall = b;
				break;
			}
		}
	}
	else if (Input.mouseDown(0)) {
		for (const b of OBJ.take(Ball)) {
			if (b.isOverlap(m)) {
				GLOBAL.selectedBall = b;
				break;
			}
		}
	}
	else if (Input.keyDown(KeyCode.Space)) {
		for (const b of OBJ.take(Ball)) {
			if (b.isOverlap(m)) {
				OBJ.push(Pop, new Pop(b.x, b.y, b.r));
				OBJ.destroy(b.id);
			}
		}
	}
	for (let i = 0; i < GLOBAL.collidingPairs.length; i += 2) {
		const b1 = GLOBAL.collidingPairs[i];
		const b2 = GLOBAL.collidingPairs[i + 1];
		// Distance between balls
		const d = Math.pointdis(b1, b2);
		// Normal
		const n = new Vector2((b2.x - b1.x) / d, (b2.y - b1.y) / d);
		// Tangent
		const t = new Vector2(-n.y, n.x);
		// Dot product normal
		const dn1 = Vector2.dot(b1.v, n);
		const dn2 = Vector2.dot(b2.v, n);
		// Dot product tangent
		const dt1 = Vector2.dot(b1.v, t);
		const dt2 = Vector2.dot(b2.v, t);
		// Momentum
		const m1 = (dn1 * (b1.mass - b2.mass) + 2 * b2.mass * dn2) / (b1.mass + b2.mass);
		const m2 = (dn2 * (b2.mass - b1.mass) + 2 * b1.mass * dn1) / (b1.mass + b2.mass);
		// Update ball velocities
		b1.v = new Vector2(t.x * dt1 + n.x * m1, t.y * dt1 + n.y * m1);
		b2.v = new Vector2(t.x * dt2 + n.x * m2, t.y * dt2 + n.y * m2);
	}
	GLOBAL.collidingPairs = [];
	for (const b of OBJ.take(Ball)) {
		b.isOverlapping = false;
	}
};

Game.renderUI = () => {
	if (GLOBAL.selectedBall instanceof Ball) {
		if (Input.mouseHold(0)) {
			Draw.setColor(C.blue);
			Draw.pointLine(GLOBAL.selectedBall, Input.mousePosition);
		}
	}
	Draw.setColor(C.blue);
	Draw.setFont(Font.m);
	Draw.setColor(C.white);
	Draw.setHVAlign(Align.l, Align.t);
	Draw.text(8, 8, Time.FPS + '/60');
};

BRANTH.start(0, 0, { backgroundColor: C.black });
Room.start('Game');