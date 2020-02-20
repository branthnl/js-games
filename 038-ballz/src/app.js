class Ball extends BranthObject {
	constructor(x, y, r) {
		super(x, y);
		this.r = r;
		this.vx = 0;
		this.vy = 0;
		this.ax = 0;
		this.ay = 0;
		this.a = 0;
		this.isOverlapping = false;
	}
	isOverlap(b) {
		return Math.pointdis(this, b) < this.r + b.r;
	}
	update() {
		for (const b of OBJ.take(Ball)) {
			if (b.id !== this.id) {
				if (this.isOverlap(b)) {
					// Distance between ball centers
					const d = Math.pointdis(this, b);
					const overlap = 0.5 * (d - this.r - b.r);
					// Displace current ball
					this.x -= overlap * (this.x - b.x) / d;
					this.y -= overlap * (this.y - b.y) / d;
					// Displace other ball
					b.x += overlap * (this.x - b.x) / d;
					b.y += overlap * (this.y - b.y) / d;
					// Misc
					this.isOverlapping = true;
					b.isOverlapping = true;
				}
			}
		}
		this.vx += this.ax * Time.scaledDeltaTime;
		this.vy += this.ay * Time.scaledDeltaTime;
		this.x += this.vx * Time.scaledDeltaTime;
		this.y += this.vy * Time.scaledDeltaTime;
	}
	render() {
		this.a = Math.range(this.a, this.isOverlapping, 0.2);
		Draw.setColor(C.blue);
		Draw.setAlpha(this.a);
		Draw.circle(this.x, this.y, this.r);
		Draw.setAlpha(1);
		Draw.setColor(C.white);
		Draw.circle(this.x, this.y, this.r, true);
		Draw.pointLine(this, Vector2.add(this, Math.lendir(this.r, 0)));
	}
}

OBJ.add(Ball);

const Game = new BranthRoom('Game');
Room.add(Game);

GLOBAL.balls = [];
GLOBAL.selectedBall = null;
GLOBAL.ballDefaultRadius = 20;
GLOBAL.addBall = (x, y, r) => {
	OBJ.push(Ball, new Ball(x, y, r));
};

Game.start = () => {
	GLOBAL.balls = [];
	// GLOBAL.addBall(Room.w * 0.25, Room.mid.h, GLOBAL.ballDefaultRadius);
	// GLOBAL.addBall(Room.w * 0.75, Room.mid.h, GLOBAL.ballDefaultRadius);
	for (let i = 0; i < 10; i++) {
		GLOBAL.addBall(
			GLOBAL.ballDefaultRadius + Math.range(Room.w - GLOBAL.ballDefaultRadius * 2),
			GLOBAL.ballDefaultRadius + Math.range(Room.h - GLOBAL.ballDefaultRadius * 2),
			GLOBAL.ballDefaultRadius * Math.range(0.8, 1)
		);
	}
};

Game.update = () => {
	const m = Input.mousePosition;
	if (GLOBAL.selectedBall instanceof Ball) {
		GLOBAL.selectedBall.x = m.x;
		GLOBAL.selectedBall.y = m.y;
		if (Input.mouseUp(0)) {
			GLOBAL.selectedBall = null;
		}
	}
	else if (Input.mouseDown(0)) {
		m.r = 1;
		for (const b of OBJ.take(Ball)) {
			if (b.isOverlap(m)) {
				GLOBAL.selectedBall = b;
				break;
			}
		}
	}
	for (const b of OBJ.take(Ball)) {
		b.isOverlapping = false;
	}
};

Game.renderUI = () => {
	Draw.setFont(Font.m);
	Draw.setColor(C.white);
	Draw.setHVAlign(Align.l, Align.t);
	Draw.text(8, 8, Time.FPS + '/60');
};

BRANTH.start(640, 360, { backgroundColor: C.black });
Room.start('Game');