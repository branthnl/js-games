Draw.add(new Vector2(0, 0.5), 'Car', 'Car.png');

class Building extends BranthObject {
	constructor(x, y, w, h) {
		super(x, y);
		this.w = w;
		this.h = h;
	}
	render() {
		const p = View.toView(this);
		Draw.setColor(C.black);
		Draw.rect(p.x, p.y, this.w, this.h);
	}
}

class Car extends BranthObject {
	awake() {
		this.keyWCode = KeyCode.Up;
		this.keyACode = KeyCode.Left;
		this.keySCode = KeyCode.Down;
		this.keyDCode = KeyCode.Right;
		this.spriteName = 'Car';
		this.spd = 0;
		this.acc = 0.5;
		this.maxSpd = 15;
		this.angle = 0;
		this.angleSpd = 0;
		this.angleAcc = 0.01;
		this.angleMaxSpd = 0.2;
	}
	get w() {
		return Draw.getImage(this.spriteName).width;
	}
	get h() {
		return Draw.getImage(this.spriteName).height;
	}
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	}
	get keyW() {
		return Input.keyHold(this.keyWCode);
	}
	get keyA() {
		return Input.keyHold(this.keyACode);
	}
	get keyS() {
		return Input.keyHold(this.keySCode);
	}
	get keyD() {
		return Input.keyHold(this.keyDCode);
	}
	get scaledAcc() {
		return this.acc * (1 - 0.99 * (Math.abs(this.spd) / this.maxSpd));
	}
	get isDrifting() {
		return false;
	}
	update() {
		if (this.keyW) {
			this.spd = Math.min(this.maxSpd, this.spd + this.scaledAcc);
		}
		if (this.keyS) {
			this.spd = Math.max(-this.maxSpd * 0.5, this.spd - this.scaledAcc);
		}
		if (!this.keyW && !this.keyS) {
			this.spd *= 0.98;
		}
		if (this.keyD) {
			this.angleSpd = Math.min(this.angleMaxSpd, this.angleSpd + this.angleAcc);
		}
		if (this.keyA) {
			this.angleSpd = Math.max(-this.angleMaxSpd, this.angleSpd - this.angleAcc);
		}
		if (!this.keyD && !this.keyA) {
			this.angleSpd *= 0.9;
		}
		this.angle += this.spd * this.angleSpd;
		const l = Math.lendir(this.spd, this.angle);
		this.x += l.x;
		this.y += l.y;
		View.follow(Vector2.add(this, Math.lendir(this.mid.w, this.angle)));
	}
	render() {
		let p = View.toView(this);
		if (GLOBAL.debugMode) {
			Draw.setColor(C.red);
			Draw.circle(p.x, p.y, 5);
		}
		for (let i = -1; i <= 1; i += 2) {
			for (let j = -1; j <= 1; j += 2) {
				const q = Vector2.add(
					Vector2.add(p, Math.lendir(this.w * (0.5 + 0.25 * i), this.angle)),
					Math.lendir(this.mid.h, this.angle + 90 * j)
				);
				Draw.setColor(C.black);
				const [r, w] = [this.angle + (i > 0) * this.angleSpd * 60, this.w * 0.2];
				Draw.roundRectRotated(q.x, q.y, w, w * 0.5, w, r);
				if (i > 0 && this.isDrifting) {
					const s = View.toRoom(q);
					Emitter.preset('strip');
					Emitter.setArea(s.x, s.x, s.y, s.y);
					Emitter.setRotation(r, r);
					Emitter.emit(1);
				}
			}
		}
		Draw.image(this.spriteName, p.x, p.y, 1, 1, this.angle);
		Draw.setColor(C.red);
		Draw.setAlpha(0.5 + 0.5 * this.keyS);
		for (let i = -1; i <= 1; i += 2) {
			const q = Vector2.add(
				Vector2.add(p, Math.lendir(this.w * 0.1, this.angle)),
				Math.lendir(this.h * 0.25, this.angle + 90 * i)
			);
			const h = this.h * 0.2;
			Draw.roundRectRotated(q.x, q.y, h * 0.5, h, h, this.angle - 15 * i);
		}
		Draw.setAlpha(1);
	}
}

OBJ.add(Building);
OBJ.add(Car);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	OBJ.push(Building, new Building(100, 100, 25, 25));
	OBJ.push(Building, new Building(120, 150, 64, 90));
	OBJ.push(Building, new Building(200, 400, 90, 128));
	OBJ.push(Building, new Building(400, 80, 70, 70));
	OBJ.create(Car, 32, 32);
};

Game.renderUI = () => {
	if (GLOBAL.debugMode) {
		Draw.setColor(C.blue);
		Draw.circle(Room.mid.w, Room.mid.h, 3);
	}
};

GLOBAL.setProductionMode();
BRANTH.start(960, 640, { backgroundColor: C.gray });
Room.start('Game');