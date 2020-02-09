class Car extends BranthGameObject {
	awake() {
		this.w = 24 * 0.5;
		this.h = 32 * 0.5;
		this.spd = 0;
		this.acc = 0.1;
		this.maxSpd = this.acc * 80;
		this.angle = 0;
		this.angleSpd = 0;
		this.angleAcc = 0.2;
		this.driftSpd = 0;
		this.alarm[0] = 500;
		this.speedometerAngle = 0;
		Sound.play('EngineStart');
	}
	get keyDown() {
		return Input.keyHold(KeyCode.Down);
	}
	get angleMaxSpd() {
		return this.angleAcc * 2 * (1 + (this.spd > 0 && this.keyDown) * 0.5) * (1 - this.isDrifting * 0);
	}
	get isDrifting() {
		return Math.abs(this.driftSpd) > 1;
	}
	update() {
		const keyUp = Input.keyHold(KeyCode.Up);
		const keyLeft = Input.keyHold(KeyCode.Left);
		const keyRight = Input.keyHold(KeyCode.Right);
		if (Input.keyDown(KeyCode.Down)) {
			if (this.spd > this.maxSpd * 0.5 && !Sound.isPlaying('Brake')) {
				Sound.play('Brake');
			}
		}
		if (keyUp) {
			this.spd = Math.min(this.maxSpd, this.spd + this.acc * (1 - (this.spd / this.maxSpd)));
		}
		if (this.keyDown) {
			this.spd = Math.max(-this.maxSpd * 0.4, this.spd - this.acc);
		}
		if (!keyUp && !this.keyDown) {
			this.spd *= this.spd < 0 || !this.keyDown? 0.985 : 0.999;
		}
		if (keyLeft) {
			this.angleSpd = Math.range(this.angleSpd, Math.max(-this.angleMaxSpd, this.angleSpd - this.angleAcc), 0.2);
		}
		if (keyRight) {
			this.angleSpd = Math.range(this.angleSpd, Math.min(this.angleMaxSpd, this.angleSpd + this.angleAcc), 0.2);
		}
		if (!keyLeft && !keyRight) {
			this.angleSpd *= 0.9;
		}
		this.angle += this.angleSpd * this.spd;
		this.driftSpd = Math.range(this.driftSpd, this.spd * (0.1 + (this.spd > 0 && this.keyDown)) * (keyLeft - keyRight), 0.05);
		const l = Vector2.add(
			Math.lendir(this.spd, this.angle),
			Math.lendir(this.driftSpd, this.angle + 90)
		);
		const p = Math.lendir(this.h * 0.5, this.angle);
		this.x = Math.clamp(this.x + l.x, -p.x, Room.w - p.x);
		this.y = Math.clamp(this.y + l.y, -p.y, Room.h - p.y);
	}
	render() {
		for (let i = 0; i <= 1; i++) {
			for (let j = -1; j <= 1; j += 2) {
				const d = Vector2.add(
					Math.lendir(this.h * (0.2 + 0.6 * i), this.angle),
					Math.lendir(this.w * 0.5, this.angle + 90 * j)
				);
				let p = Vector2.add(new Vector2(this.vx, this.vy), d);
				const r = this.angle + i * this.angleSpd * 30;
				Draw.setColor(C.black);
				Draw.roundRectRotated(
					p.x, p.y,
					this.h * 0.3, this.h * 0.15,
					this.h * 0.075, r
				);
				if (i > 0 && Math.abs(this.spd) > this.maxSpd * 0.25 && this.isDrifting) {
					p = Vector2.add(new Vector2(this.x, this.y), d);
					Emitter.preset('strip');
					Emitter.setArea(p.x, p.x, p.y, p.y);
					Emitter.setRotation(r, r);
					Emitter.emit(1);
				}
			}
		}
		const p = Math.lendir(this.h * 0.5, this.angle);
		Draw.setColor(C.lemonChiffon);
		Draw.roundRectRotated(this.vx + p.x, this.vy + p.y, this.h, this.w, this.w * 0.25, this.angle);
		Draw.setColor(C.black);
		Draw.draw(true);
		for (let i = -1; i <= 1; i += 2) {
			const p = Vector2.add(
				Math.lendir(this.h * 0.15, this.angle),
				Math.lendir(this.w * 0.25, this.angle + 90 * i)
			);
			Draw.setAlpha(this.keyDown? 1 : 0.5);
			Draw.setColor(C.red);
			Draw.roundRectRotated(
				this.vx + p.x, this.vy + p.y,
				this.h * 0.2, this.h * 0.2,
				this.h * 0.1, this.angle
			);
			Draw.setAlpha(1);
		}
	}
	alarm0() {
		if (!Sound.isPlaying('EngineLoop')) {
			Sound.loop('EngineLoop');
		}
	}
}

OBJ.add(Car);

Sound.add('Hit', 'Hit.ogg');
Sound.add('BGM', 'Backbeat.mp3');
Sound.add('Brake', 'Brake.wav');
Sound.add('EngineLoop', 'EngineLoop.wav');
Sound.add('EngineStart', 'EngineStart.ogg');
Sound.setVolume('Hit', 0.05);
Sound.setVolume('BGM', 0.1);
Sound.setVolume('Brake', 0.1);
Sound.setVolume('EngineLoop', 0.2);
Sound.setVolume('EngineStart', 0.2);
Sound.setLoopRange('EngineLoop', 0.1, 0.8);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	Sound.loop('BGM');
	OBJ.create(Car, 64, 64);
};

Game.update = () => {
	if (Input.mouseHold(0)) {
		const m = Input.mousePosition;
		Emitter.setDepth(-1);
		Emitter.preset(Math.randbool()? 'puff' : 'bubble');
		Emitter.setArea(m.x, m.x, m.y, m.y);
		Emitter.emit(1);
		Emitter.setDepth(0);
	}
};

Game.render = () => {
	Draw.setColor(C.gray);
	Draw.rect(0, 0, Room.w, Room.h);
	Draw.setColor(C.dimGray);
	Draw.setStrokeWeight(50);
	Draw.plus(Room.mid.w, Room.mid.h, Room.h * 0.4);
	Draw.circle(Room.mid.w, Room.mid.h, Room.h * 0.4, true);
	Draw.resetStrokeWeight();
};

GLOBAL.interacted = true;
BRANTH.start(0, 0, { backgroundColor: C.black });
Room.start('Game');