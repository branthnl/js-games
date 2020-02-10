Sound.add('Brake', 'src/snd/Brake.wav');
Sound.add('EngineStart', 'src/snd/EngineStart.ogg');

Draw.add(new Vector2(0, 0), 'BG', 'src/img/BG.png');
Draw.add(new Vector2(0, 0.5), 'Car', 'src/img/Car.png');

const World = {
	get w() {
		return Draw.getImage('BG').width;
	},
	get h() {
		return Draw.getImage('BG').height;
	},
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	}
};

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
		this.acc = 0.1;
		this.maxSpd = 13;
		this.angle = 0;
		this.angleSpd = 0;
		this.angleAcc = 0.2;
		this.driftSpd = 0;
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
	get scaledSpd() {
		return this.spd / this.maxSpd;
	}
	get scaledAcc() {
		return this.acc * (1 - 0.99 * this.scaledSpd);
	}
	get isDrifting() {
		return Math.abs(this.driftSpd) > 2;
	}
	get angleMaxSpd() {
		return this.angleAcc * 2 * (1 + 0.5 * (this.spd > 0 && this.keyS)) * (1 - 0.5 * this.scaledSpd) * (1 - 0.25 * this.isDrifting);
	}
	update() {
		if (this.keyW) {
			this.spd = Math.min(this.maxSpd, this.spd + this.scaledAcc);
		}
		if (this.keyS) {
			this.spd = Math.max(-this.maxSpd * 0.4, this.spd - this.acc);
		}
		if (!this.keyW && !this.keyS) {
			this.spd *= this.spd < 0 || !this.keyS? 0.985 : 0.999;
		}
		if (this.keyD) {
			this.angleSpd = Math.range(this.angleSpd, Math.min(this.angleMaxSpd, this.angleSpd + this.angleAcc), 0.2);
		}
		if (this.keyA) {
			this.angleSpd = Math.range(this.angleSpd, Math.max(-this.angleMaxSpd, this.angleSpd - this.angleAcc), 0.2);
		}
		if (!this.keyD && !this.keyA) {
			this.angleSpd *= 0.9;
		}
		this.angle += this.spd * this.angleSpd;
		this.driftSpd = Math.range(this.driftSpd, this.spd * (0.1 + (this.spd > 0 && this.keyS)) * (this.keyD - this.keyA), 0.05);
		const l = Vector2.add(
			Math.lendir(this.spd, this.angle),
			Math.lendir(this.driftSpd, this.angle - 90)
		);
		let p = Math.lendir(this.mid.w, this.angle);
		this.x = Math.clamp(this.x + l.x, -p.x, World.w - p.x);
		this.y = Math.clamp(this.y + l.y, -p.y, World.h - p.y);
		p = Vector2.add(p, this);
		View.follow(new Vector2(
			Math.clamp(p.x, Room.mid.w, World.w - Room.mid.w),
			Math.clamp(p.y, Room.mid.h, World.h - Room.mid.h)
		), 0.2);
		if (Input.keyDown(this.keySCode)) {
			if (this.spd > this.maxSpd * 0.3) {
				if (!Sound.isPlaying('Brake')) {
					Sound.setVolume('Brake', 0.2 + 0.3 * this.scaledSpd + 0.5 * Math.abs(this.angleSpd / this.angleMaxSpd));
					Sound.play('Brake');
				}
			}
		}
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
				if (this.isDrifting) {
					const s = View.toRoom(q);
					if (i > 0) {
						Emitter.preset('strip');
						Emitter.setArea(s.x, s.x, s.y, s.y);
						Emitter.setRotation(r, r);
						Emitter.emit(1);
					}
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

const Menu = new BranthRoom('Menu');
Room.add(Menu);

Menu.renderUI = () => {
	Draw.setFont(Font.m);
	Draw.setColor(C.white);
	Draw.setHVAlign(Align.c, Align.m);
	Draw.text(Room.mid.w, Room.mid.h, 'Press enter to start');
	if (Input.keyDown(KeyCode.Enter)) {
		Room.start('Game');
	}
};

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	const n = OBJ.create(Car, World.w * 0.15, World.h * 0.2);
	n.angle = 180;
	n.spd = 2;
	Sound.play('EngineStart');
};

Game.render = () => {
	const p = View.toView(Vector2.zero);
	Draw.image('BG', p.x, p.y);
	Draw.primitiveBegin();
	Draw.vertex(p.x + 1650, p.y + 1600);
	Draw.vertex(p.x + 1650, p.y + 2440);
	Draw.vertex(p.x + 960, p.y + 2440);
	Draw.vertex(p.x + 320, p.y + 2400);
	Draw.vertex(p.x + 320, p.y + 280);
	Draw.vertex(p.x + 960, p.y + 240);
	Draw.vertex(p.x + 1650, p.y + 240);
	Draw.vertex(p.x + 2350, p.y + 240);
	Draw.vertex(p.x + 3470, p.y + 280);
	Draw.vertex(p.x + 3470, p.y + 900);
	Draw.vertex(p.x + 3470, p.y + 1600);
	Draw.vertex(p.x + 3470, p.y + 2400);
	Draw.vertex(p.x + 2350, p.y + 2440);
	Draw.vertex(p.x + 2350, p.y + 1600);
	Draw.vertex(p.x + 2350, p.y + 900);
	Draw.setColor(C.red);
	Draw.setStrokeWeight(10);
	Draw.primitiveEnd(Primitive.line);
	Draw.setStrokeWeight(20);
	Draw.primitiveEnd(Primitive.pointList);
	Draw.resetStrokeWeight();
	Draw.setFont(Font.m);
	Draw.setColor(C.white);
	Draw.setHVAlign(Align.c, Align.m);
	for (let i = 0; i < Draw.vertices.length; i++) {
		const v = Draw.vertices[i];
		Draw.text(v.x, v.y, i);
	}
};

Game.renderUI = () => {
	if (GLOBAL.debugMode) {
		Draw.setColor(C.blue);
		Draw.circle(Room.mid.w, Room.mid.h, 3);
	}
};

GLOBAL.setProductionMode();
BRANTH.start(960, 640, { backgroundColor: C.gray });
Room.start('Menu');