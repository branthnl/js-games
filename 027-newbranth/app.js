class Car extends BranthBehaviour {
	awake() {
		this.w = 24;
		this.h = 32;
		this.spd = 2;
		this.acc = 0.2;
		this.angle = 0;
		this.angleSpd = 0;
		this.angleAcc = 0.1;
		this.driftSpd = 0;
		this.alarm[0] = 500;
		Sound.play('EngineStart');
	}
	update() {
		const keyUp = Input.keyHold(KeyCode.Up);
		const keyLeft = Input.keyHold(KeyCode.Left);
		const keyDown = Input.keyHold(KeyCode.Down);
		const keyRight = Input.keyHold(KeyCode.Right);
		if (keyUp) {
			this.spd = Math.min(this.acc * 40, this.spd + this.acc);
		}
		if (keyDown) {
			this.spd = Math.max(-this.acc * 20, this.spd - this.acc);
		}
		if (!keyUp && !keyDown) {
			this.spd *= 0.98;
		}
		if (keyLeft) {
			this.angleSpd = Math.max(-this.angleAcc * 5, this.angleSpd - this.angleAcc);
		}
		if (keyRight) {
			this.angleSpd = Math.min(this.angleAcc * 5, this.angleSpd + this.angleAcc);
		}
		if (!keyLeft && !keyRight) {
			this.angleSpd *= 0.9;
		}
		this.angle += this.angleSpd * this.spd;
		this.driftSpd = Math.range(this.driftSpd, this.spd * 0.5 * (keyLeft - keyRight), 0.05);
		const l = Vector2.add(
			Math.lendir(this.spd, this.angle),
			Math.lendir(this.driftSpd, this.angle + 90)
		);
		this.x += l.x;
		this.y += l.y;
	}
	renderUI() {
		// const p = new Vector2(this.x, this.y);
		// Draw.setColor(C.red);
		// Draw.pointLine(p, Vector2.add(p, Math.lendir(this.driftSpd * 10, this.angle + 90)));
	}
	render() {
		for (let i = 0; i <= 1; i++) {
			for (let j = -1; j <= 1; j += 2) {
				const p = Vector2.add(
					new Vector2(this.x, this.y),
					Vector2.add(
						Math.lendir(this.h * (0.2 + 0.6 * i), this.angle),
						Math.lendir(this.w * 0.5, this.angle + 90 * j)
					)
				);
				const r = this.angle + i * this.angleSpd * 40;
				Draw.setColor(C.black);
				Draw.roundRectRotated(
					p.x, p.y,
					this.h * 0.3, this.h * 0.15,
					this.h * 0.075, r
				);
				if (i > 0 && Math.abs(this.spd) > this.acc) {
					Emitter.preset('strip');
					Emitter.setArea(p.x, p.x, p.y, p.y);
					Emitter.setRotation(r, r);
					Emitter.emit(1);
				}
			}
		}
		const p = Math.lendir(this.h * 0.5, this.angle);
		for (const b of [false, true]) {
			Draw.setColor(b? C.black : C.lemonChiffon);
			Draw.roundRectRotated(this.x + p.x, this.y + p.y, this.h, this.w, this.w * 0.25, this.angle, b);
		}
		for (let i = -1; i <= 1; i += 2) {
			const p = Vector2.add(
				Math.lendir(this.h * 0.15, this.angle),
				Math.lendir(this.w * 0.25, this.angle + 90 * i)
			);
			Draw.setAlpha(Input.keyHold(KeyCode.Down)? 1 : 0.5);
			Draw.setColor(C.red);
			Draw.roundRectRotated(
				this.x + p.x, this.y + p.y,
				this.h * 0.2, this.h * 0.2,
				this.h * 0.1, this.angle
			);
			Draw.setAlpha(1);
		}
		// Draw.circle(this.x, this.y, 5);
	}
	alarm0() {
		if (!Sound.isPlaying('EngineLoop')) {
			// Sound.loop('EngineLoop');
		}
	}
}

OBJ.add(Car);

Sound.add('Hit', 'Hit.ogg');
Sound.add('BGM', 'Backbeat.mp3');
Sound.add('EngineLoop', 'EngineLoop.wav');
Sound.add('EngineStart', 'EngineStart.ogg');
Sound.setVolume('Hit', 0.05);
Sound.setVolume('BGM', 0.1);
Sound.setVolume('EngineLoop', 0.2);
Sound.setVolume('EngineStart', 0.2);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	OBJ.create(Car, Room.mid.w, Room.mid.h);
};

BRANTH.start(0, 0, { backgroundColor: C.gray });
Room.start('Game');