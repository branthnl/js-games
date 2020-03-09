let database = null;
if (firebase) {
	database = firebase.database().ref('042');
}

Draw.add(new Vector2(0.5, 0.5), 'Gun', 'src/img/Gun.png');
Draw.add(new Vector2(0.5, 0.5), 'MachineGun', 'src/img/MachineGun.png');
Draw.add(new Vector2(0.5, 0.5), 'Beamer', 'src/img/Beamer.png');
Draw.add(new Vector2(0.5, 0.5), 'Smasher', 'src/img/OpenHand.png', 'src/img/ClosedHand.png');
Draw.addStrip(new Vector2(0.5, 0.5), 'Bullet', 'src/img/Bullet.png', 2);
Draw.addStrip(new Vector2(0.5, 0.5), 'Missile', 'src/img/Missile.png', 2);
Draw.addStrip(new Vector2(0.5, 0.5), 'RotateGun', 'src/img/RotateGun.png', 2);
Draw.addStrip(new Vector2(0.5, 0.5), 'MissileLauncher', 'src/img/MissileLauncher.png', 2);

Sound.add('Gun0', 'src/snd/Gun0.wav');
Sound.add('Gun1', 'src/snd/Gun0.wav');
Sound.add('Gun2', 'src/snd/Gun1.wav');
Sound.add('Gun3', 'src/snd/Gun1.wav');
Sound.add('Menu', 'src/snd/Menu.mp3');
Sound.add('Game', 'src/snd/Game.mp3');
Sound.add('Text', 'src/snd/Text.wav');
Sound.add('Blow0', 'src/snd/Blow.wav');
Sound.add('Blow1', 'src/snd/Blow.wav');
Sound.add('Jump0', 'src/snd/Jump.wav');
Sound.add('Jump1', 'src/snd/Jump.wav');
Sound.add('Pound', 'src/snd/Pound.wav');
Sound.add('Pound0', 'src/snd/Pound.wav');
Sound.add('Pound1', 'src/snd/Pound.wav');
Sound.add('Cursor', 'src/snd/Cursor.wav');
Sound.add('Cancel', 'src/snd/Cancel.wav');
Sound.add('Banana', 'src/snd/Banana.wav');
Sound.add('Switch0', 'src/snd/Switch.wav');
Sound.add('Switch1', 'src/snd/Switch.wav');
Sound.add('Smasher0', 'src/snd/Smasher.wav');
Sound.add('Smasher1', 'src/snd/Smasher.wav');
Sound.add('Decision', 'src/snd/Decision.wav');
Sound.add('GoingDown', 'src/snd/GetSmasher.wav');
Sound.add('Explosion', 'src/snd/Explosion.wav');
Sound.add('GetSmasher0', 'src/snd/GetSmasher.wav');
Sound.add('GetSmasher1', 'src/snd/GetSmasher.wav');
Sound.add('MissileLaunch0', 'src/snd/MissileLaunch.wav');
Sound.add('MissileLaunch1', 'src/snd/MissileLaunch.wav');

Sound.setVolume('Jump0', 0.35);
Sound.setVolume('Jump1', 0.35);

Sound.playGunSound = () => {
	// Sound.play(`Gun0`);
	for (let i = 0; i < 4; i++) {
		if (!Sound.isPlaying(`Gun${i}`)) {
			Sound.play(`Gun${i}`);
			break;
		}
	}
};

class Info extends BranthObject {
	constructor(text, color) {
		super(0, Room.h * 0.6);
		this.xto = 36;
		this.yto = this.y;
		this.text = text;
		this.color = color;
		this.alarm = 2000;
		this.visible = false;
		Draw.setFont(Font.m);
		this.textWidth = Draw.textWidth(this.text);
		for (const i of OBJ.take(Info)) {
			i.yto -= 16;
		}
	}
	update() {
		if (Manager.game.pause) return;
		this.x = Math.range(this.x, this.xto, 0.2);
		this.y = Math.range(this.y, this.yto, 0.2);
		if (this.alarm < 0) {
			this.xto = -this.textWidth;
			if (Math.abs(this.xto - this.x) < 1) {
				OBJ.destroy(this.id);
			}
		}
		else {
			this.alarm -= Time.deltaTime;
		}
	}
	static textExists(text) {
		const o = OBJ.take(Info);
		for (let i = o.length - 1; i >= 0; i--) {
			if (o[i].text === text) return true;
		}
		return false;
	}
	static pop(text, color = C.white) {
		return OBJ.create(Info, text, color);
	}
	static renderUI() {
		Draw.setFont(Font.m);
		Draw.setColor(C.black);
		Draw.setHVAlign(Align.l, Align.t);
		const o = OBJ.take(Info);
		for (let i = o.length - 1; i >= 0; i--) {
			Draw.text(o[i].x + 1, o[i].y + 1, o[i].text);
		}
		for (let i = o.length - 1; i >= 0; i--) {
			Draw.setColor(o[i].color);
			Draw.text(o[i].x, o[i].y, o[i].text);
		}
	}
}

class DamageMessage extends BranthObject {
	constructor(x, y, amount, unitText) {
		super(x, y);
		this.amount = amount;
		this.unitText = unitText;
		this.xscale = Math.range(0.5, 1);
		this.yscale = this.xscale;
		this.len = Math.range(10, 20);
		this.angle = Math.range(210, 330);
		this.visible = false;
	}
	update() {
		if (Manager.game.pause) return;
		const l = Vector2.add(new Vector2(this.xstart, this.ystart), Math.lendir(this.len, this.angle));
		this.x = Math.range(this.x, l.x, 0.1);
		this.y = Math.range(this.y, l.y, 0.1);
		if (((l.x - this.x) * (l.x - this.x) + (l.y - this.y) * (l.y - this.y)) < 0.01) {
			OBJ.destroy(this.id);
		}
	}
	static pop(x, y, amount, unitText = '') {
		return OBJ.create(DamageMessage, x, y, amount.toFixed(2), unitText);
	}
	static renderUI() {
		const o = OBJ.take(DamageMessage);
		Draw.setFont(Font.s);
		Draw.setColor(C.white);
		Draw.setHVAlign(Align.c, Align.b);
		for (let i = o.length - 1; i >= 0; i--) {
			const j = o[i];
			Draw.textTransformed(j.x, j.y, `${j.amount}${j.unitText}`, j.xscale, j.yscale, j.angle + 90);
		}
	}
}

OBJ.add(Info);
OBJ.add(DamageMessage);

class FloatingHand extends BranthGameObject {
	awake() {
		this.depth = -5;
		this.spriteName = 'Smasher';
		this.imageIndex = 1;
		this.hspeed = Math.choose(-2, 2);
		this.imageXScale = 0;
		this.imageYScale = this.imageXScale;
		Physics.add(this);
	}
	update() {
		this.imageXScale = Math.range(this.imageXScale, 0.9 + Math.sin(Time.time * 0.01) * 0.1, 0.2);
		this.imageYScale = this.imageXScale;
		this.y += Math.sin(Time.time * 0.02);
		if (Manager.game.pause) {
			this.freeze = true;
		}
		else {
			this.freeze = false;
			if (this.x < 48) {
				this.hspeed = 2;
			}
			if (this.x > Room.w - 48) {
				this.hspeed = -2;
			}
			if (this.hspeed !== 0) {
				for (const i of OBJ.take(Kong)) {
					if (Math.linedis(this.x, this.y, i.x, i.y - 12) < 48) {
						Manager.game.smasherAmount++;
						Sound.play('GetSmasher' + i.playerIndex);
						Emitter.preset('sparkle');
						Emitter.setArea(this.x, this.x, this.y, this.y);
						Emitter.setColor(C.tomato);
						Emitter.setOutline(true);
						Emitter.emit(Math.range(3, 5));
						Emitter.setOutline(false);
						Emitter.emit(Math.range(3, 5));
						Emitter.setColor(C.lemonChiffon);
						Emitter.emit(Math.range(3, 5));
						OBJ.destroy(this.id);
						break;
					}
				}
			}
		}
	}
	onDestroy() {
		Physics.remove(this.id);
	}
}

class Smasher extends BranthGameObject {
	constructor(carriedObject) {
		super(carriedObject.x, carriedObject.y);
		this.depth = -9;
		this.carriedObject = carriedObject;
		this.spriteName = 'Smasher';
		this.emergenceInterval = 200;
		this.wavingInterval = 400;
		this.imageIndex = 1;
		this.control = true;
		this.xto = Room.mid.w + Room.w * 0.1 * Math.sign(Room.mid.w - this.x) * Math.range(0.2, 1);
		this.yto = Manager.game.smasherYThreshold + 12;
		// Start emergence
		this.alarm[0] = this.emergenceInterval;
	}
	update() {
		if (this.freeze) return;
		if (this.alarm[0] > 0) {
			const t = this.alarm[0] / this.emergenceInterval; // (1 -> 0) as time goes
			this.imageXScale = 1 + 0.2 * t;
		}
		else this.imageXScale = Math.range(this.imageXScale, 0.9 + Math.sin(Time.time * 0.01) * 0.1, 0.2);
		this.imageYScale = this.imageXScale;
		const t = Time.time * 0.03;
		this.xto += Math.sin(t);
		this.yto += Math.cos(t);
		this.x = Math.range(this.x, this.xto, 0.2);
		this.y = Math.range(this.y, this.yto + Math.sin(Time.time * 0.005) * 10, 0.2);
		if (this.carriedObject) {
			if (this.control) {
				this.carriedObject.x = this.x;
				this.carriedObject.y = this.y + 12;
			}
		}
		if (Manager.game.pause) {
			this.freeze = true;
		}
		else {
			this.freeze = false;
		}
	}
	render() {
		const v = View.toView(this);
		switch (this.imageType) {
			case 0: Draw.sprite(this.spriteName, this.imageIndex, v.x, v.y, this.imageXScale, this.imageYScale, this.imageAngle, this.imageAlpha); break;
			case 1: Draw.strip(this.spriteName, this.imageIndex, v.x, v.y, this.imageXScale, this.imageYScale, this.imageAngle, this.imageAlpha); break;
		}
	}
	alarm0() {
		// Close hand
		this.imageIndex = 1;
		// Move up
		this.yto = Math.range(72, 82);
		// Start waving
		this.alarm[1] = this.wavingInterval;
	}
	alarm1() {
		this.xto = Room.mid.w;
		this.yto = Room.h * 1.5;
		this.carriedObject.xsto = 0.2;
		this.carriedObject.ysto = 1.8;
		this.alarm[2] = 50;
	}
	alarm2() {
		// SMASH
		this.carriedObject.hsp = (Room.mid.w - this.x) * Math.range(0.4, 0.6);
		this.carriedObject.vsp = (2 - Manager.game.floor / Manager.game.floorAmount) * 80; // 80 -> 160 as it goes down
		this.control = false;
		this.alarm[3] = 100;
	}
	alarm3() {
		this.carriedObject.xsto = 1;
		this.carriedObject.ysto = 1;
		this.carriedObject = null;
		OBJ.destroy(this.id);
	}
}

class Kong extends BranthBehaviour {
	constructor(pid, x, y, color, keyCodes) {
		super(x, y);
		this.depth = -1;
		this.color = color;
		this.playerIndex = pid;
		this.keyCodeW = keyCodes.W;
		this.keyCodeA = keyCodes.A;
		this.keyCodeS = keyCodes.S;
		this.keyCodeD = keyCodes.D;
		this.hp = 100;
		this.w = 24;
		this.h = 24;
		this.hsp = 0;
		this.vsp = -5;
		this.mpd = 1.8;
		this.gndAcc = 0.3 * this.mpd;
		this.gndMax = 6 * this.mpd;
		this.airAcc = 0.2 * this.mpd;
		this.airFrc = 0.01;
		this.airMax = 5 * this.mpd;
		this.jmpSpd = -5 * this.mpd;
		this.jmpHold = false;
		this.jmpCount = 0;
		this.onGround = true;
		this.isUsingSmasher = false;
		this.xs = 1;
		this.ys = 1;
		this.xsto = 1;
		this.ysto = 1;
		this.showHpBar = false;
		this.hpBarAlpha = 0;
		this.xprevious = this.x;
		this.yprevious = this.y;
		this.showHpBarInterval = 2000;
		Info.pop(`P${this.playerIndex + 1} deployed`);
		Sound.play(`Switch${this.playerIndex}`);
	}
	get bound() {
		return {
			l: this.x - this.w * 0.5,
			r: this.x + this.w * 0.5,
			t: this.y - this.h,
			b: this.y
		}
	}
	useSmasher() {
		OBJ.create(Smasher, this);
		Sound.play(`Smasher${this.playerIndex}`);
		this.isUsingSmasher = true;
		this.alarm[1] = 750;
		if (Info.textExists(`P${2 - this.playerIndex} use smasher!`)) {
			Info.pop(`P${this.playerIndex + 1} use smasher too!`, this.color);
		}
		else Info.pop(`P${this.playerIndex + 1} use smasher!`, this.color);
	}
	takeDamage(amount) {
		if (this.isUsingSmasher) return;
		this.hp -= amount;
		this.showHpBar = true;
		this.alarm[2] = this.showHpBarInterval;
		if (this.hp <= 0) {
			OBJ.destroy(this.id);
		}
	}
	beforeUpdate() {
		this.xprevious = this.x;
		this.yprevious = this.y;
	}
	update() {
		if (Manager.game.pause) return;
		const keyWR = Input.keyUp(this.keyCodeW);
		const keyWP = Input.keyDown(this.keyCodeW);
		const keyA = Input.keyHold(this.keyCodeA);
		const keyS = Input.keyDown(this.keyCodeS);
		const keyD = Input.keyHold(this.keyCodeD);
		let acc = this.gndAcc;
		let spd = this.gndMax;
		let frc = Manager.game.friction;
		if (!this.onGround) {
			acc = this.airAcc;
			spd = this.airMax;
			frc = this.airFrc;
		}
		if (keyA) {
			this.hsp -= acc;
			if (this.hsp > 0.3) this.hsp -= frc;
		}
		if (keyD) {
			this.hsp += acc;
			if (this.hsp < -0.3) this.hsp += frc;
		}
		if (!(keyA ^ keyD)) {
			if (Math.abs(this.hsp) > 0.3) this.hsp -= Math.sign(this.hsp) * frc;
			else this.hsp = 0;
		}
		this.hsp = Math.clamp(this.hsp, -spd, spd);
		if (keyWP) {
			if (++this.jmpCount < 3) {
				this.vsp = this.jmpSpd;
				this.jmpHold = true;
				this.alarm[0] = 60;
				if (!Manager.game.goingDown) {
					Sound.play(`Jump${this.playerIndex}`);
					this.xs = 0.8;
					this.ys = 2 - this.xs;
				}
			}
		}
		if (keyWR) this.jmpHold = false;
		const wallL = this.bound.l <= 32;
		const wallR = this.bound.r >= Room.w - 32;
		if (!this.onGround && (wallL || wallR)) {
			this.jmpCount = 1;
			if (keyWP) {
				if (wallL) {
					if (keyA) {
						this.hsp = this.jmpSpd * -0.3;
						this.vsp = this.jmpSpd;
					}
					else {
						this.hsp = this.jmpSpd * -0.8;
						this.vsp = this.jmpSpd * 0.7;
					}
				}
				else if (wallR) {
					if (keyD) {
						this.hsp = this.jmpSpd * 0.3;
						this.vsp = this.jmpSpd;
					}
					else {
						this.hsp = this.jmpSpd * 0.8;
						this.vsp = this.jmpSpd * 0.7;
					}
				}
				if (!Manager.game.goingDown) Sound.play(`Jump${this.playerIndex}`);
			}
			this.jmpHold = true;
			this.alarm[0] = 60;
		}
		if ((wallL || wallR) && !this.onGround && this.vsp >= 0.5) this.vsp -= Manager.game.gravity * 0.5;
		if (Manager.game.goingDown) this.vsp = -Manager.game.gravity * 5;
		if (this.bound.l + this.hsp <= 32 || this.bound.r + this.hsp >= Room.w - 32) {
			if (this.hsp > 0) this.x = Room.w - 32 - this.w * 0.5;
			if (this.hsp < 0) this.x = 32 + this.w * 0.5;
			this.hsp = 0;
		}
		if (this.bound.t + this.vsp <= 32 || this.bound.b + this.vsp >= Room.h - 32) {
			if (this.vsp < 0) this.y = 32 + this.h;
			if (this.vsp > 0) {
				this.y = Room.h - 32;
				this.xs = 1 + Math.min(0.75, this.vsp * 0.02);
				this.ys = 2 - this.xs;
				this.xsto = 1;
				this.ysto = 1;
			}
			if (this.vsp > 10) {
				View.shake(Math.min(55, this.vsp) * 0.07, Math.min(55, this.vsp) * 15);
				const dmg = this.vsp < 50? this.vsp * (1 + Math.abs(Room.mid.w - this.x) / Room.mid.w) : this.vsp;
				Manager.game.takeDamage(dmg);
				// DamageMessage.pop(this.x, this.y, dmg, 'kg');
				Sound.play(`Pound${this.playerIndex}`);
			}
			this.vsp = 0;
		}
		this.x += this.hsp;
		this.y += this.vsp;
		if (this.bound.b >= Room.h - 32) {
			this.jmpCount = 0;
			this.onGround = true;
		}
		else {
			this.vsp += Manager.game.gravity * (this.jmpHold? 0.5 : 1);
			this.onGround = false;
		}
		if (keyS && !Manager.game.goingDown && !this.isUsingSmasher) {
			if (Manager.game.smasherAmount > 0) {
				if (this.y < Manager.game.smasherYThreshold) {
					this.useSmasher();
					Manager.game.smasherAmount--;
				}
				else {
					if (Manager.game.smasherYThreshold > 32) {
						const msg = `Jump higher P${this.playerIndex + 1}!`;
						if (!Info.textExists(msg)) {
							Info.pop(msg, this.color);
						}
						Sound.play(`Switch${this.playerIndex}`);
					}
				}
			}
		}
		this.xs = Math.range(this.xs, this.xsto, 0.2);
		this.ys = Math.range(this.ys, this.ysto, 0.2);
	}
	render() {
		if (this.isUsingSmasher) {
			const dif = {
				x: this.xprevious - this.x,
				y: this.yprevious - this.y
			};
			Emitter.setArea(this.x, this.x, this.y, this.y);
			if ((dif.x * dif.x + dif.y * dif.y) > 48 * 48) {
				Emitter.preset('strip');
				Emitter.setColor(C.white);
				Emitter.setShape(Shape.square);
				Emitter.setSize(12, 12);
				Emitter.setSizeInc(-0.5, -0.5);
				Emitter.setAlpha(0.6, 0.6);
				Emitter.setLife(500, 500);
				Emitter.emit(1);
			}
			// Emitter.preset('sparkle');
			// Emitter.setColor(C.white);
			// Emitter.setSize(3, 4);
			// Emitter.setSpeed(0.5, 0.6);
			// Emitter.setSpeedInc(-0.01, -0.01);
			// Math.pick([() => {
			// 	Emitter.setColor(C.tomato);
			// 	Emitter.setOutline(true);
			// },
			// () => {
			// 	Emitter.setColor(C.tomato);
			// 	Emitter.setOutline(false);
			// },
			// () => {
			// 	Emitter.setColor(C.lemonChiffon);
			// 	Emitter.setOutline(true);
			// }])();
			// Emitter.emit(1);
		}
		const v = View.toView(this);
		const scaled = {
			w: this.w * this.xs,
			h: this.h * this.ys
		};
		Draw.primitiveBegin();
		Draw.vertex(v.x - scaled.w * 0.5, v.y);
		Draw.vertex(v.x + scaled.w * 0.5, v.y);
		Draw.vertex(v.x + scaled.w * 0.5, v.y - scaled.h);
		Draw.vertex(v.x - scaled.w * 0.5, v.y - scaled.h);
		Draw.setColor(C.black);
		Draw.primitiveEnd();
		// Draw.setColor(C.bisque);
		// Draw.circle(v.x - 6, v.y - 18, 2);
		// Draw.circle(v.x + 6, v.y - 18, 2);
		// Draw.rect(v.x - 5, v.y - 5, 10, 3);
		if (GLOBAL.debugMode > 0) {
			Draw.setColor(C.magenta);
			Draw.rect(v.x - scaled.w * 0.5, v.y - scaled.h, scaled.w, scaled.h, true);
			Draw.setColor(C.red);
			Draw.circle(v.x, v.y, 2);
		}
	}
	renderUI() {
		if (this.isUsingSmasher) return;
		const v = View.toView(this);
		const t = this.hp / 100;
		const t1 = Math.sin(Time.time * 0.005);
		this.hpBarAlpha = Math.range(this.hpBarAlpha, this.showHpBar, 0.25);
		let y = v.y - 40 + t1 * 2 + 6 * (1 - this.hpBarAlpha);
		Draw.setAlpha(this.hpBarAlpha);
		Draw.setColor(`rgba(${(1 - t) * 255}, ${t * 255}, 0, 1)`);
		Draw.rect(v.x - 16, y, 32 * t, 4);
		Draw.setColor(C.black);
		Draw.rect(v.x - 16, y, 32, 4, true);
		Draw.setAlpha(1);
		Draw.setFont(Font.sm, Font.bold);
		Draw.setHVAlign(Align.c, Align.b);
		Draw.text(v.x + 1, y - 1, `P${this.playerIndex + 1}`);
		Draw.setColor(this.color);
		Draw.text(v.x, y - 2, `P${this.playerIndex + 1}`);
		Draw.resetFontStyle();
		Draw.primitiveBegin();
		y -= 6 * (1 - this.hpBarAlpha);
		Draw.vertex(v.x - 4, y + 6);
		Draw.vertex(v.x + 4, y + 6);
		Draw.vertex(v.x, y + 10);
		Draw.setColor(C.black);
		Draw.primitiveEnd();
	}
	alarm0() {
		this.jmpHold = false;
	}
	alarm1() {
		this.isUsingSmasher = false;
	}
	alarm2() {
		this.showHpBar = false;
	}
	onDestroy() {
		Emitter.preset('puff');
		Emitter.setSize(4, 8);
		Emitter.setAlpha(0.8, 0.8);
		Emitter.setArea(this.x, this.x, this.y, this.y);
		Emitter.setColor(C.tomato);
		Emitter.setOutline(true);
		Emitter.emit(Math.range(10, 12));
		Emitter.setOutline(false);
		Emitter.emit(Math.range(10, 12));
		Emitter.setColor(C.lemonChiffon);
		Emitter.emit(Math.range(10, 12));
		View.shake(2, 400);
		Sound.play(`Blow${this.playerIndex}`);
		Info.pop(`P${this.playerIndex + 1} died!`, C.red);
		if (Manager.game.credits > 0) {
			Info.pop(`${Manager.game.credits} credit${Manager.game.credits > 1? 's' : ''} left`);
		}
		else Info.pop('No credits left');
		if (OBJ.take(Kong).length < 2 && Manager.game.credits <= 0) {
			Manager.game.gameOver = true;
		}
	}
}

class Bullet extends BranthBehaviour {
	constructor(x, y, angle) {
		super(x, y);
		this.spd = 5;
		this.angle = angle;
		this.damage = 3;
		this.spriteName = 'Bullet';
		this.imageIndex = 0;
		this.imageScale = Math.range(0.8, 1);
		this.alarm[0] = 60;
	}
	update() {
		if (Manager.game.pause) return;
		const l = Math.lendir(this.spd, this.angle);
		this.x += l.x;
		this.y += l.y;
		let count = 0;
		const o = OBJ.take(Kong);
		const h = Vector2.add(this, Math.lendir(4, this.angle));
		for (let i = o.length - 1; i >= 0; i--) {
			const j = o[i];
			if (h.x > j.x - 12 && h.x < j.x + 12 && h.y > j.y - 24 && h.y < j.y) {
				j.takeDamage(this.damage);
				if (this.constructor.name === 'Missile') {
					if (this.target) {
						if (this.target.playerIndex !== j.playerIndex) {
							Info.pop(`P${j.playerIndex + 1} protect P${this.target.playerIndex + 1}!`, C.mediumSpringGreen);
						}
					}
				}
				count++;
				break;
			}
		}
		if (this.x <= 32 || this.x >= Room.w - 32 || this.y <= 32 || this.y >= Room.h - 32) count++;
		if (Manager.game.goingDown || Manager.game.gameOver) count++;
		if (count > 0) OBJ.destroy(this.id);
	}
	drawSelf() {
		Draw.strip(this.spriteName, this.imageIndex, this.x, this.y, this.imageScale, this.imageScale, this.angle);
	}
	render() {
		this.drawSelf();
	}
	alarm0() {
		if (++this.imageIndex > 1) this.imageIndex = 0;
		this.alarm[0] = 60;
	}
	onDestroy() {
		Emitter.preset('puff');
		Emitter.setSize(2, 3);
		Emitter.setAlpha(0.5, 0.5);
		Emitter.setColor(C.tomato);
		Emitter.setDirection(this.angle + 150, this.angle + 210);
		Emitter.setArea(this.x, this.x, this.y, this.y);
		Emitter.emit(Math.range(3, 5));
		Emitter.setColor(C.lemonChiffon);
		Emitter.emit(Math.range(3, 5));
	}
}

class Missile extends Bullet {
	constructor(x, y, angle, target) {
		super(x, y, angle);
		this.target = target;
		this.offset = new Vector2(Math.range(-10, 10), Math.range(-2, -22));
		this.damage = 8;
		this.spriteName = 'Missile';
		this.interval = Math.range(2000, 2500);
		this.alarm[1] = this.interval;
		if (this.y > 32) {
			Info.pop(`P${this.target.playerIndex + 1} targeted!`, C.red);
		}
	}
	beforeUpdate() {
		if (Manager.game.pause) {
			if (this.alarm[1] > 0) {
				this.alarm[1] += Time.deltaTime;
			}
			return;
		}
		if (this.target) this.angle += Math.sin(Math.degtorad(Math.pointdir(this, Vector2.add(this.target, this.offset)) - this.angle)) * 5;
		Emitter.preset('puff');
		Emitter.setArea(this.x - 2, this.x + 2, this.y - 2, this.y + 2);
		Emitter.setAlpha(0.5, 0.7);
		Emitter.setSpeed(0.005, 0.005);
		Emitter.setSpeedInc(0, 0);
		Emitter.setSize(2, 3);
		Emitter.setSizeInc(-0.04, -0.04);
		Emitter.setLife(1500, 1600);
		Emitter.emit(1);
	}
	render() {
		this.drawSelf();
		Draw.setColor(C.black);
		Draw.rect(this.x - 12, this.y - 12, 24 * Math.clamp(this.alarm[1] / this.interval, 0, 1), 2);
	}
	alarm1() {
		this.target = null;
	}
	onDestroy() {
		Emitter.preset('puff');
		Emitter.setSize(4, 7);
		Emitter.setAlpha(0.5, 0.5);
		Emitter.setColor(C.tomato);
		Emitter.setDirection(this.angle + 120, this.angle + 240);
		Emitter.setArea(this.x, this.x, this.y, this.y);
		Emitter.emit(Math.range(5, 7));
		Emitter.setColor(C.lemonChiffon);
		Emitter.emit(Math.range(5, 7));
	}
}

class Beam extends BranthBehaviour {
	constructor(x, y, angle) {
		super(x, y);
		this.angle = angle;
		this.interval = 2000;
		this.alarm[0] = this.interval;
	}
	update() {
	}
	render() {
		const t = Math.clamp(this.alarm[0] / this.interval, 0, 1);
		const t1 = Math.sin(Time.time * 0.05) * 0.25;
		Draw.setAlpha(Math.clamp(t / 0.2, 0, 1));
		Draw.setColor(C.orange);
		Draw.rectRotated(this.x, this.y + t1, Room.w, 32, this.angle, false, new Vector2(0, 0.5));
		Draw.setColor(C.moccasin);
		Draw.rectRotated(this.x, this.y - 16 + 22 * t + t1, Room.w, 4 + 6 * t, this.angle, false, new Vector2(0, 0));
		Draw.setAlpha(1);
	}
	alarm0() {
		OBJ.destroy(this.id);
	}
}

class Gun extends BranthBehaviour {
	constructor(wid, x, y, angle) {
		super(x, y);
		this.depth = -2;
		this.weaponIndex = wid;
		this.angle = angle;
		this.xto = this.x;
		this.yto = this.y;
		this.angleTo = this.angle;
		this.canShoot = true;
		this.shootPoint = Vector2.zero;
		this.shootInterval = 400;
		this.shootBackForce = 0;
		this.angleSpd = 1;
		let msg = '';
		switch (this.constructor.name) {
			case 'MachineGun': msg = `Machine gun`; break;
			case 'MissileLauncher': msg = `Missile launcher`; break;
			default: msg = `Gun`; break;
		}
		Info.pop(msg + ' appeared!', C.gold);
	}
	shoot() {
		Sound.playGunSound();
		OBJ.create(Bullet, this.shootPoint.x, this.shootPoint.y, this.angle);
	}
	update() {
		if (Manager.game.pause) return;
		this.shootPoint = Vector2.add(this, Math.lendir(16, this.angle));
		if (this.canShoot && OBJ.take(Kong).length > 0) {
			this.shoot();
			this.canShoot = false;
			this.shootBackForce = 5;
			this.alarm[0] = this.shootInterval;
		}
		this.shootBackForce *= 0.98;
		this.x = Math.range(this.x, this.xto, 0.2);
		this.y = Math.range(this.y, this.yto, 0.2);
		this.angle += Math.sin(Math.degtorad(this.angleTo - this.angle)) * this.angleSpd;
	}
	render() {
		const v = View.toView(Vector2.add(this, Math.lendir(this.shootBackForce, this.angle + 180)));
		Draw.image('Gun', v.x, v.y, 1, 1, this.angle);
	}
	alarm0() {
		this.canShoot = true;
	}
	onDestroy() {
		Emitter.preset('puff');
		Emitter.setSize(4, 8);
		Emitter.setAlpha(0.8, 0.8);
		Emitter.setArea(this.x, this.x, this.y, this.y);
		Emitter.setColor(C.tomato);
		Emitter.setOutline(true);
		Emitter.emit(Math.range(10, 12));
		Emitter.setOutline(false);
		Emitter.emit(Math.range(10, 12));
		Emitter.setColor(C.lemonChiffon);
		Emitter.emit(Math.range(10, 12));
		View.shake(2, 400);
	}
}

class RotateGun extends Gun {
}

class MachineGun extends Gun {
	awake() {
		this.angleSpd = 2.5;
		this.shootInterval = 200;
	}
	render() {
		const v = View.toView(Vector2.add(this, Math.lendir(this.shootBackForce, this.angle + 180)));
		Draw.image('MachineGun', v.x, v.y, 1, 1, this.angle);
	}
}

class MissileLauncher extends Gun {
	awake() {
		this.shootInterval = 1800;
	}
	shoot() {
		if (Sound.isPlaying('MissileLaunch0')) {
			Sound.play('MissileLaunch1');
		}
		else {
			Sound.play('MissileLaunch0');
		}
		OBJ.create(Missile, this.shootPoint.x, this.shootPoint.y, Math.range(this.angle - 30, this.angle + 30), Math.pick(OBJ.take(Kong)));
	}
	render() {
		const v = View.toView(Vector2.add(this, Math.lendir(this.shootBackForce, this.angle + 180)));
		const t = Math.sin(Time.time * 0.002);
		Draw.strip('MissileLauncher', 0, v.x, v.y, 1, 1, this.angle + t * 20 * Math.sign(Room.mid.w - this.x));
		Draw.strip('MissileLauncher', 1, v.x, v.y + t * 8, 1, 1, this.angle);
	}
}

class Beamer extends Gun {
	render() {
		const v = View.toView(Vector2.add(this, Math.lendir(this.shootBackForce, this.angle + 180)));
		Draw.image('Beamer', v.x, v.y, 1, 1, this.angle);
	}
}

class WeaponHandler extends BranthBehaviour {
	constructor(weaponsSpawnIndex) {
		super(0, 0);
		this.weaponsSpawnIndex = weaponsSpawnIndex;
		this.step = 0;
		this.alarm[0] = 10;
		this.alarm[1] = 10;
		this.weapons = [null, null, null, null, null, null, null, null, null];
		this.weaponsAngle = [90, 90, 90, 90, 90, 90, 90, 90, 90];
	}
	destroy() {
		for (let i = this.weapons.length; i >= 0; i--) {
			const j = this.weapons[i];
			if (j instanceof Gun) {
				OBJ.destroy(j.id);
			}
		}
		OBJ.destroy(this.id);
		Sound.play('Explosion');
	}
	update() {
		if (Manager.game.pause) return;
		for (let i = this.weapons.length; i >= 0; i--) {
			const j = this.weapons[i];
			if (j instanceof Gun) {
				j.yto = 40;
				j.angleTo = this.weaponsAngle[i];
			}
		}
	}
	alarm0() {
		if (!Manager.game.pause && OBJ.take(Kong).length > 0) {
			switch (this.weaponsSpawnIndex.shift()) {
				case 0: this.weapons[0] = OBJ.create(Gun, 0, Room.w * 0.1, -48, 90); break;
				case 1: this.weapons[1] = OBJ.create(Beamer, 1, Room.w * 0.22, -48, 90); break;
				case 2: this.weapons[2] = OBJ.create(Gun, 2, Room.w * 0.3, -48, 90); break;
				case 3: this.weapons[3] = OBJ.create(MissileLauncher, 3, Room.w * 0.4, -48, 90); break;
				case 4: this.weapons[4] = OBJ.create(MachineGun, 4, Room.w * 0.5, -48, 90); break;
				case 5: this.weapons[5] = OBJ.create(MissileLauncher, 5, Room.w * 0.6, -48, 90); break;
				case 6: this.weapons[6] = OBJ.create(Gun, 6, Room.w * 0.7, -48, 90); break;
				case 7: this.weapons[7] = OBJ.create(Beamer, 7, Room.w * 0.78, -48, 90); break;
				case 8: this.weapons[8] = OBJ.create(Gun, 8, Room.w * 0.9, -48, 90); break;
			}
			Sound.play('Decision');
		}
		if (this.weaponsSpawnIndex.length > 0) this.alarm[0] = 250;
	}
	alarm1() {
		this.step++;
		if (this.step % 2 === 0) {
			this.weaponsAngle[0] = 25;
			this.weaponsAngle[1] = 90;
			this.weaponsAngle[2] = 115;
			this.weaponsAngle[3] = 90;
			this.weaponsAngle[4] = 165;
			this.weaponsAngle[5] = 90;
			this.weaponsAngle[6] = 65;
			this.weaponsAngle[7] = 90;
			this.weaponsAngle[8] = 155;
		}
		else {
			this.weaponsAngle[0] = 105;
			this.weaponsAngle[1] = 90;
			this.weaponsAngle[2] = 65;
			this.weaponsAngle[3] = 90;
			this.weaponsAngle[4] = 15;
			this.weaponsAngle[5] = 90;
			this.weaponsAngle[6] = 115;
			this.weaponsAngle[7] = 90;
			this.weaponsAngle[8] = 75;
		}
		this.alarm[1] = 2000;
	}
}

class Title extends BranthBehaviour {
	constructor() {
		super(0, 0);
		this.scale = 20;
		this.counter = 0;
		this.alarm[0] = 400;
		this.visible = false;
		Sound.play('Pound');
	}
	render() {
		if (this.scale > 18) this.scale -= 0.16;
		else if (this.scale > 1) this.scale = Math.range(this.scale, 0, 0.5);
		else this.scale = Math.range(this.scale, 1, 0.2);
		const t = Math.sin(Time.time * 0.005);
		const txt = 'Smash for your life.'.slice(0, this.counter);
		for (let i = 1; i >= 0; i--) {
			Draw.setColor(i > 0? C.black : C.white);
			Draw.setFont(Font.sm, Font.italic);
			Draw.setHVAlign(Align.r, Align.b);
			Draw.textRotated(Room.mid.w + Draw.textWidth(txt) * 0.5 + i, 124 + i, txt, -4 * t);
			Draw.setFont(Font.xxl, Font.bold);
			Draw.setHVAlign(Align.c, Align.t);
			Draw.textTransformed(Room.mid.w + i, 48 + (6 - 4 * i) * t, 'SMASH KONG', this.scale, this.scale);
		}
	}
	alarm0() {
		this.counter++;
		Sound.play('Text');
		if (this.counter < 20) this.alarm[0] = 20;
	}
}

class Transition extends BranthBehaviour {
	constructor(color = C.white, interval = 200, delay = 100) {
		super(0, 0);
		this.color = color;
		this.interval = interval;
		this.alarm[0] = this.interval + delay;
		this.visible = false;
	}
	render() {
		Draw.setAlpha(Math.clamp(this.alarm[0] / this.interval, 0, 1));
		Draw.setColor(this.color);
		Draw.rect(0, 0, Room.w, Room.h);
		Draw.setAlpha(1);
	}
	alarm0() {
		OBJ.destroy(this.id);
	}
}

class FestiveMaker extends BranthBehaviour {
	constructor() {
		super(0, 0);
		this.alarm[0] = 30;
		this.spot = [
			new Vector2(Math.range(32, Room.w - 32), Math.range(32, Room.h - 32)),
			new Vector2(Math.range(32, Room.w - 32), Math.range(32, Room.h - 32)),
			new Vector2(Math.range(32, Room.w - 32), Math.range(32, Room.h - 32)),
			new Vector2(Math.range(32, Room.w - 32), Math.range(32, Room.h - 32)),
			new Vector2(Math.range(32, Room.w - 32), Math.range(32, Room.h - 32)),
			new Vector2(Math.range(32, Room.w - 32), Math.range(32, Room.h - 32)),
			new Vector2(Math.range(32, Room.w - 32), Math.range(32, Room.h - 32)),
			new Vector2(Math.range(32, Room.w - 32), Math.range(32, Room.h - 32)),
			new Vector2(Math.range(32, Room.w - 32), Math.range(32, Room.h - 32)),
			new Vector2(Math.range(32, Room.w - 32), Math.range(32, Room.h - 32))
		];
	}
	puff() {
		switch (Math.choose(0, 1, 2)) {
			case 0:
				Emitter.setColor(C.tomato);
				Emitter.setOutline(true);
				Emitter.emit(1);
				break;
			case 1:
				Emitter.setColor(C.tomato);
				Emitter.setOutline(false);
				Emitter.emit(1);
				break;
			case 2:
				Emitter.setColor(C.lemonChiffon);
				Emitter.setOutline(false);
				Emitter.emit(1);
				break;
		}
	}
	update() {
		Emitter.preset('puff');
		Emitter.setSize(4, 8);
		Emitter.setAlpha(0.8, 0.8);
		for (const i of this.spot) {
			Emitter.setArea(i.x, i.x, i.y, i.y);
			this.puff();
		}
	}
	alarm0() {
		this.alarm[0] = Math.range(500, 2500);
		View.shake(2, 400);
		Sound.play('Explosion');
		for (const i of this.spot) {
			i.x = Math.range(32, Room.w - 32);
			i.y = Math.range(32, Room.h - 32);
		}
	}
}

OBJ.add(FloatingHand);
OBJ.add(Smasher);
OBJ.add(Bullet);
OBJ.add(Missile);
OBJ.add(Kong);
OBJ.add(Beam);
OBJ.add(Gun);
OBJ.add(RotateGun);
OBJ.add(MachineGun);
OBJ.add(MissileLauncher);
OBJ.add(Beamer);
OBJ.add(WeaponHandler);
OBJ.add(Title);
OBJ.add(Transition);
OBJ.add(FestiveMaker);

const Manager = {
	menu: {
		cursor: 0,
		rotation: 0,
		items: [{
				text: 'Start Mission',
				color: C.cornflowerBlue,
				description: 'Smash down buildings!',
				onClick() {
					Room.start('LevelSelect');
				}
			},
			// {
			// 	text: 'Banana Rush',
			// 	color: C.gold,
			// 	description: 'Compete against each other for banana!',
			// 	onClick() {
			// 		Room.start('Game');
			// 	}
			// },
			{
				text: 'Leaderboard',
				color: C.lemonChiffon,
				description: 'See the best player at smashing!',
				onClick() {
					Room.start('Leaderboard');
				}
			},
			// {
			// 	text: 'Windowed',
			// 	color: C.lightGreen,
			// 	description: 'Set screen mode to fullscreen.',
			// 	onClick() {
			// 		let count = 0;
			// 		if (this.text === 'Windowed') {
			// 			if (CANVAS.requestFullscreen) {
			// 				CANVAS.requestFullscreen();
			// 			}
			// 			else if (CANVAS.msRequestFullscreen) {
			// 				CANVAS.msRequestFullscreen();
			// 			}
			// 			else if (CANVAS.mozRequestFullscreen) {
			// 				CANVAS.mozRequestFullscreen();
			// 			}
			// 			else if (CANVAS.webkitRequestFullscreen) {
			// 				CANVAS.webkitRequestFullscreen();
			// 			}
			// 			else count++;
			// 			if (count === 0) {
			// 				this.text = 'Fullscreen';
			// 				this.description = 'Set screen mode to windowed.';
			// 			}
			// 		}
			// 		else {
			// 			if (document.fullscreen) {
			// 				if (document.exitFullscreen) {
			// 					document.exitFullscreen();
			// 				}
			// 				else if (document.msExitFullscreen) {
			// 					document.msExitFullscreen();
			// 				}
			// 				else if (document.mozCancelFullscreen) {
			// 					document.mozCancelFullscreen();
			// 				}
			// 				else if (document.webkitExitFullscreen) {
			// 					document.webkitExitFullscreen();
			// 				}
			// 				else count++;
			// 			}
			// 			if (count === 0) {
			// 				this.text = 'Windowed';
			// 				this.description = 'Set screen mode to fullscreen.';
			// 			}
			// 		}
			// 	}
			// },
			{
				text: 'Credits',
				color: C.tomato,
				description: 'See credits.',
				onClick() {
					Room.start('Credits');
				}
			}
		],
		get keyA() {
			return /*Input.keyDown(KeyCode.A) || */Input.keyDown(KeyCode.Left);
		},
		get keyD() {
			return /*Input.keyDown(KeyCode.D) || */Input.keyDown(KeyCode.Right);
		},
		get keyEnter() {
			return Input.keyDown(KeyCode.Enter);// || Input.keyDown(KeyCode.Space);
		},
		get keyEscape() {
			return Input.keyDown(KeyCode.Escape) || Input.keyDown(KeyCode.Backspace);
		},
		drawText(x, y, text) {
			for (let i = 1; i >= 0; i--) {
				Draw.setColor(i > 0? C.black : C.white);
				Draw.text(x + i, y + i, text);
			}
		}
	},
	game: {
		gravity: 0.65,
		friction: 0.5,
		pause: false,
		pauseAlpha: 0,
		gameOver: false,
		goingDown: false,
		buildingIsDestroyed: false,
		goingDownAlarm: 0,
		credits: 4,
		floor: 5,
		floorHP: 0,
		floorBaseHP: 50,
		floorAmount: 5,
		message: '',
		messageCounter: 0,
		messageCounterMax: 180,
		guideText: '',
		guideIndex: 0,
		guideShowTriangle: true,
		kebal: false,
		lastDamage: 0,
		smasherAmount: 0,
		smasherYThreshold: 0,
		smashPoint: 0,
		setup(floorAmount = 5) {
			this.pause = false;
			this.pauseAlpha = 0;
			this.gameOver = false;
			this.goingDown = false;
			this.buildingIsDestroyed = false;
			this.goingDownAlarm = 0;
			this.credits = 4;
			this.floorAmount = floorAmount;
			this.floor = this.floorAmount;
			this.floorHP = this.getFloorHP(this.floor);
			this.message = '';
			this.messageCounter = 0;
			this.messageCounterMax = 180;
			this.guideText = '';
			this.guideIndex = 0;
			this.guideShowTriangle = true;
			this.kebal = false;
			this.lastDamage = 0;
			this.smasherAmount = 0;
			this.smasherYThreshold = Room.h * 0.35;
			this.smashPoint = 0;
		},
		playerExists(index) {
			for (const i of OBJ.take(Kong)) {
				if (i.playerIndex === index) {
					return true;
				}
			}
			return false;
		},
		getFloorHP(floor) {
			return (this.floorAmount - floor + 1) * this.floorBaseHP;
		},
		takeDamage(amount) {
			this.lastDamage = amount;
			if (!this.gameOver && !this.kebal) {
				this.floorHP -= amount;
				this.smashPoint += amount;
			}
			if (this.floorHP <= 0) {
				if (this.floor <= 1) {
					if (!this.gameOver) {
						for (const i of OBJ.take(WeaponHandler)) {
							i.destroy();
						}
						OBJ.create(FestiveMaker);
						this.gameOver = true;
						this.buildingIsDestroyed = true;
					}
				}
				else {
					this.goingDown = true;
					this.goingDownAlarm = 3000;
					Sound.play('GoingDown');
					for (const i of OBJ.take(WeaponHandler)) {
						i.destroy();
					}
					if (this.floor === 2) {
						this.showMessage(`Going down to ground floor`);
					}
					else {
						this.showMessage(`Going down to floor ${this.floor - 1}`);
					}
				}
			}
		},
		onStartFloor() {},
		goingDownComplete() {
			this.floorHP = this.getFloorHP(--this.floor);
			this.onStartFloor();
		},
		renderInfo() {
			const v = View.getView(0, 0);
			Draw.setFont(Font.s, Font.bold);
			const txt = `Credits: ${this.credits}`;
			const smasherTxt = `Smasher: ${this.smasherAmount}`;
			const smashPointTxt = `Smash Points: ${this.smashPoint.toFixed(2)}kg`;
			Draw.setColor(C.gray);
			Draw.circle(v.x + Room.mid.w, v.y + 16, 10);
			Draw.roundRect(v.x + 32, v.y + Room.h - 26, Draw.textWidth(txt) + 8, 20, 5);
			Draw.roundRect(v.x + Room.w - 32, v.y + Room.h - 26, -Draw.textWidth(smasherTxt) - 8, 20, 5);
			Draw.roundRect(v.x + Room.mid.w - Draw.textWidth(smashPointTxt) * 0.5 - 4, v.y + Room.h - 26, Draw.textWidth(smashPointTxt) + 8, 20, 5);
			Draw.setHVAlign(Align.c, Align.m);
			if (!this.playerExists(0)) Draw.text(v.x + Room.w * 0.75, v.y + Room.h - 16, 'Press <Down> to deploy P1');
			if (!this.playerExists(1) && Room.name !== 'Level1') Draw.text(v.x + Room.w * 0.25, v.y + Room.h - 16, 'Press <S> to deploy P2');
			Draw.setColor(C.darkGray);
			Draw.text(v.x + Room.mid.w, v.y + 16, this.buildingIsDestroyed? '-' : this.floor);
			Draw.resetFontStyle();
			Draw.text(v.x + Room.mid.w, v.y + Room.h - 16, smashPointTxt);
			Draw.setHAlign(Align.l);
			Draw.text(v.x + 36, v.y + Room.h - 16, txt);
			Draw.setHAlign(Align.r);
			Draw.text(v.x + Room.w - 36, v.y + Room.h - 16, smasherTxt);
			Draw.setColor(C.gray);
			Draw.setHAlign(Align.l);
			Draw.text(v.x + 36, v.y + 16, `FPS: ${Time.FPS}`);
			if (!this.gameOver && !this.goingDown && !this.pause && !this.kebal) {
				const t = this.floorHP / this.getFloorHP(this.floor);
				Draw.setColor(`rgba(${(1 - t) * 255}, ${t * 255}, 0, 0.5)`);
				Draw.rect(Room.w * 0.1, 64, t * Room.w * 0.8, 24);
				Draw.setColor(C.black);
				Draw.rect(Room.w * 0.1, 64, Room.w * 0.8, 24, true);
			}
		},
		renderPause() {
			if (this.gameOver) {
				Draw.setFont(Font.xl);
				Draw.setColor(C.black);
				Draw.setHVAlign(Align.c, Align.b);
				Draw.text(Room.mid.w, Room.h * 0.4 - 48, this.buildingIsDestroyed? 'BUILDING DESTROYED' : 'OUT OF CREDITS');
				Draw.setFont(Font.m);
				Draw.setVAlign(Align.m);
				Draw.text(Room.mid.w, Room.h * 0.4, 'Press <Enter> to continue.');
			}
			this.pauseAlpha = Math.range(this.pauseAlpha, this.pause * 0.5, 0.2);
			Sound.setVolume('Game', Math.range(Sound.getVolume('Game'), !this.pause * 0.5, 0.1));
			Draw.setColor(C.black);
			Draw.setAlpha(this.pauseAlpha);
			Draw.rect(0, 0, Room.w, Room.h);
			Draw.setAlpha(1);
			if (this.pause) {
				Draw.setFont(Font.xl);
				Draw.setHVAlign(Align.c, Align.b);
				Manager.menu.drawText(Room.mid.w, Room.mid.h - 48, 'PAUSE');
				Draw.setFont(Font.m);
				Draw.setVAlign(Align.m);
				const txt = 'Press <Enter> to back to menu.';
				Manager.menu.drawText(Room.mid.w, Room.mid.h + Font.size, txt);
				Draw.setHAlign(Align.l);
				Manager.menu.drawText(Room.mid.w - Draw.textWidth(txt) * 0.5, Room.mid.h, 'Press <Backspace> to resume.');
			}
		},
		showMessage(text, cnt = 180) {
			this.message = text;
			this.messageCounter = cnt;
			this.messageCounterMax = cnt;
		},
		renderMessage() {
			if (this.pause || this.gameOver) return;
			Draw.setHVAlign(Align.c, Align.m);
			Draw.setFont(Font.l);
			Draw.setColor(C.black);
			const guideTxt = this.guideText;
			Draw.text(Room.mid.w, Room.mid.h, guideTxt);
			if (this.guideShowTriangle) {
				const t = (Math.sin(Time.time * 0.02) + 1) * 0.5;
				Draw.primitiveBegin();
				const y = Room.mid.h + Draw.textHeight(guideTxt) * 0.5 + t;
				Draw.vertex(Room.mid.w - 5, y + 5);
				Draw.vertex(Room.mid.w + 5, y + 5);
				Draw.vertex(Room.mid.w, y + 10);
				Draw.setColor(C.white);
				Draw.primitiveEnd();
				Draw.setColor(C.black);
				Draw.primitiveEnd(Primitive.stroke);
			}
			if (this.messageCounter > 0) {
				let a = 0;
				const t = this.messageCounter / this.messageCounterMax;
				if (t > 0.9) {
					a = Math.clamp((1 - t) / 0.1, 0, 1);
				}
				else if (t > 0.1) {
					a = 1;
				}
				else {
					a = Math.clamp(t / 0.1, 0, 1);
				}
				const b = 1 + 0.2 * (1 - a);
				Draw.setAlpha(a);
				Draw.setColor(C.black);
				Draw.rectTransformed(Room.mid.w, Room.mid.h, Room.w, 64, false, b, b);
				Draw.setFont(Font.xl);
				Draw.setColor(C.white);
				Draw.textTransformed(Room.mid.w, Room.mid.h, this.message, b, b);
				Draw.setAlpha(1);
				this.messageCounter--;
			}
		},
		drawBackground() {
			Draw.setColor(C.black);
			Draw.rect(0, 0, Room.w, Room.h);
			Draw.setColor(C.lavender);
			Draw.rect(28, 28, Room.w - 56, Room.h - 56);
		},
		drawWallAround() {
			Draw.setColor(C.black);
			Draw.rect(0, 0, Room.w, 16);
			Draw.rect(0, 0, 16, Room.h);
			Draw.rect(0, Room.h - 16, Room.w, 16);
			Draw.rect(Room.w - 16, 0, 16, Room.h);
			const v = View.getView(0, 0);
			Draw.setColor(C.darkGray);
			Draw.rect(v.x, v.y, Room.w, 32);
			Draw.rect(v.x, v.y, 32, Room.h);
			Draw.rect(v.x, v.y + Room.h - 32, Room.w, 32);
			Draw.rect(v.x + Room.w - 32, v.y, 32, Room.h);
			Draw.setColor(C.gray);
			Draw.circle(v.x + 16, v.y + 16, 4, true);
			Draw.circle(v.x + Room.w - 16, v.y + 16, 4, true);
			Draw.circle(v.x + 16, v.y + Room.h - 16, 4, true);
			Draw.circle(v.x + Room.w - 16, v.y + Room.h - 16, 4, true);
			Draw.setColor(C.black);
			Draw.rect(v.x + 1, v.y + 1, Room.w - 2, Room.h - 2, true);
			Draw.rect(v.x + 32, v.y + 32, Room.w - 64, Room.h - 64, true);
		}
	},
	credits: {
		y: 0
	},
	leaderboard: {
		y: 0,
		hs: [],
		updateHS() {
			if (firebase) {
				database.child('hs').once('value', snap => {
					Manager.leaderboard.hs = [];
					snap.forEach(i => {
						Manager.leaderboard.hs.push({
							name: i.val().name || '',
							score: i.val().score
						});
					});
					Manager.leaderboard.hs.sort((a, b) => a.score > b.score? -1 : 1);
				});
			}
		}
	},
	levelSelect: {
		x: 0,
		xto: 0,
		cursor: 0,
		rotation: 0,
		get boxSize() {
			return Room.w * 0.17;
		},
		items: [{
				text: 'Tutorial',
				color: C.skyBlue,
				image: 'Gun',
				description: 'Learn how it works!',
				onClick() {
					Room.start('TempLevel1');
				}
			}
			// {
			// 	text: 'Warming Up',
			// 	color: C.pink,
			// 	image: 'MachineGun',
			// 	description: `♫ Good Times — Twistboy`,
			// 	onClick() {
			// 		Room.start('TempLevel2');
			// 	}
			// },
			// {
			// 	text: `Let's Get Rich`,
			// 	color: C.moccasin,
			// 	image: 'MissileLauncher',
			// 	description: 'Collect as many bananas as possible!',
			// 	onClick() {
			// 		Room.start('TempLevel3');
			// 	}
			// }
		]
	},
	renderTransition() {
		const t = OBJ.take(Transition)[0];
		if (t) t.render();
	}
};

const Menu = new BranthRoom('Menu');
const Game = new BranthRoom('Game');
const Result = new BranthRoom('Result');
const Credits = new BranthRoom('Credits');
const Leaderboard = new BranthRoom('Leaderboard');
const LevelSelect = new BranthRoom('LevelSelect');
const PlayerSelect = new BranthRoom('PlayerSelect');
const Level1 = new BranthRoom('Level1');
const Level2 = new BranthRoom('Level2');
const Level3 = new BranthRoom('Level3');
Room.add(Menu);
Room.add(Game);
Room.add(Result);
Room.add(Credits);
Room.add(Leaderboard);
Room.add(LevelSelect);
Room.add(PlayerSelect);
Room.add(Level1);
Room.add(Level2);
Room.add(Level3);

Menu.start = () => {
	Sound.stop('Game');
	if (!Sound.isPlaying('Menu')) Sound.loop('Menu');
	Manager.menu.cursor = 0;
	Manager.menu.rotation = -72;
	OBJ.create(Transition, C.white);
	OBJ.create(Title);
};

let touchX = 0;
let touchY = 0;
let touchPressed = false;
let swipeRight = false;
let swipeLeft = false;

const touchUpdate = () => {
	touchPressed = false;
	swipeRight = false;
	swipeLeft = false;
	if (Input.changedTouchCount > 0) {
		const tid = Input.changedTouches[0].id;
		if (Input.touchDown(tid)) {
			touchX = Input.changedTouches[0].x;
			touchY = Input.changedTouches[0].y;
		}
		if (Input.touchUp(tid)) {
			const xdif = Input.changedTouches[0].x - touchX;
			console.log(xdif);
			if (xdif > Room.w * 0.2) {
				swipeRight = true;
			}
			else if (xdif < -Room.w * 0.2) {
				swipeLeft = true;
			}
			else {
				touchPressed = true;
			}
		}
	}
};

Menu.update = () => {
	touchUpdate();
	if (Manager.menu.keyA || swipeRight) {
		if (--Manager.menu.cursor < 0) Manager.menu.cursor = Manager.menu.items.length - 1;
		Sound.play('Cursor');
	}
	if (Manager.menu.keyD || swipeLeft) {
		if (++Manager.menu.cursor > Manager.menu.items.length - 1) Manager.menu.cursor = 0;
		Sound.play('Cursor');
	}
	if (Manager.menu.keyEnter || touchPressed) {
		Manager.menu.items[Manager.menu.cursor].onClick();
		Sound.play('Decision');
	}
	Manager.menu.rotation += Math.sin(Math.degtorad(-Manager.menu.cursor * (360 / Manager.menu.items.length) - Manager.menu.rotation)) * 19;
	if (Room.name === 'Menu') {
		Emitter.preset('fire');
		Emitter.setColor(Math.choose(C.indigo, C.darkSlateBlue));
		Emitter.setArea(0, Room.w, Room.h, Room.h);
		Emitter.emit(1);
	}
};

Menu.renderUI = () => {
	const menu = {
		x: Room.mid.w,
		y: Room.mid.h,
		w: Room.w * 0.6,
		h: Room.h * 0.1,
		boxSize: Room.h * 0.15
	};
	const h = [];
	for (let i = Manager.menu.items.length - 1; i >= 0; i--) {
		const j = Manager.menu.rotation + i * 360 / Manager.menu.items.length;
		h.push({ i, x: menu.x + Math.lendiry(menu.w * 0.5, j), y: menu.y + Math.lendirx(menu.h * 0.5, j) });
	}
	h.sort((a, b) => a.y > b.y? -1 : 1);
	for (let i = h.length - 1; i >= 0; i--) {
		const j = h[i];
		const k = j.i === Manager.menu.cursor;
		const l = 0.25 + 0.75 * ((j.y - menu.y + Math.lendirx(menu.h * 0.5, 0)) / menu.h);
		Draw.setColor(Manager.menu.items[j.i].color);
		Draw.rectTransformed(j.x, j.y, menu.boxSize, menu.boxSize, false, l, l);
		Draw.setAlpha(0.5);
		Draw.rectTransformed(j.x, menu.y + menu.boxSize * 1.125 * l, 200, 20, false, l, l);
		Draw.setAlpha(1);
	}
	const t = 1 + Math.max(0, Math.sin(Time.time * 0.01) * 0.1);
	Draw.setFont(Font.l, Font.bold);
	Draw.setHVAlign(Align.c, Align.m);
	for (let i = 1; i >= 0; i--) {
		Draw.setColor(i > 0? C.black : C.white);
		Draw.textTransformed(menu.x + i, menu.y + menu.boxSize * 1.125 + i, Manager.menu.items[Manager.menu.cursor].text, t, t, Math.range(-1, 1));
	}
	Draw.setFont(Font.m);
	Draw.setVAlign(Align.b);
	Manager.menu.drawText(menu.x, Room.h - 48 + Math.sin(Time.time * 0.01) * 2, Manager.menu.items[Manager.menu.cursor].description);
	Draw.setFont(Font.s);
	Draw.setHAlign(Align.l);
	Draw.setAlpha(0.5);
	Manager.menu.drawText(16, Room.h - 16, 'Press <Enter> to confirm.\nPress <Left> or <Right> to select.');
	Draw.setAlpha(1);
	OBJ.take(Title)[0].render();
	Manager.renderTransition();
};

Game.start = () => {
	Manager.game.setup(20);
	Manager.game.credits = 99;
	Sound.stop('Menu');
	Sound.loop('Game');
	OBJ.create(Kong, 0, Room.w * 0.75, Room.mid.h, C.royalBlue, {
		W: KeyCode.Up,
		A: KeyCode.Left,
		S: KeyCode.Down,
		D: KeyCode.Right
	});
	OBJ.create(Kong, 1, Room.w * 0.25, Room.mid.h, C.crimson, {
		W: KeyCode.W,
		A: KeyCode.A,
		S: KeyCode.S,
		D: KeyCode.D
	});
	OBJ.create(WeaponHandler, [0, 8, 2, 6]);
	Manager.game.showMessage(`Welcome to floor ${Manager.game.floor}`);
	OBJ.create(Transition, C.white);
};

Game.update = () => {
	if (Manager.menu.keyEscape && !Manager.game.gameOver) {
		if (Manager.game.pause) {
			Manager.game.pause = false;
			Sound.play('Cancel');
		}
		else {
			Manager.game.pause = true;
			Sound.play('Cancel');
		}
	}
	if (Manager.game.goingDown && !Manager.game.pause) {
		if (Manager.game.goingDownAlarm < 0) {
			Manager.game.goingDownComplete();
			Manager.game.goingDown = false;
		}
		else Manager.game.goingDownAlarm -= Time.deltaTime;
	}
	if (!Manager.game.pause && Manager.game.credits > 0) {
		if (Input.keyDown(KeyCode.Down)) {
			let count = 0;
			if (Manager.game.playerExists(0)) count++;
			if (count === 0) {
				OBJ.create(Kong, 0, Room.w * 0.75, Room.mid.h, C.royalBlue, {
					W: KeyCode.Up,
					A: KeyCode.Left,
					S: KeyCode.Down,
					D: KeyCode.Right
				});
				Manager.game.credits--;
			}
		}
		else if (Room.name !== 'Level1' && Input.keyDown(KeyCode.S)) {
			let count = 0;
			if (Manager.game.playerExists(1)) count++;
			if (count === 0) {
				OBJ.create(Kong, 1, Room.w * 0.25, Room.mid.h, C.crimson, {
					W: KeyCode.W,
					A: KeyCode.A,
					S: KeyCode.S,
					D: KeyCode.D
				});
				Manager.game.credits--;
			}
		}
	}
};

Game.render = () => {
	if (Manager.menu.keyEnter) {
		if (Manager.game.gameOver) {
			Room.start('Result');
		}
		else if (Manager.game.pause) {
			Room.start('Menu');
			if (Room.previous.name === 'Game') {
				Manager.menu.cursor = 1;
				Manager.menu.rotation = -144;
			}
		}
	}
	Manager.game.drawBackground();
};

Game.renderUI = () => {
	Manager.game.drawWallAround();
	Manager.game.renderInfo();
	for (const i of OBJ.take(Kong)) {
		i.renderUI();
	}
	Manager.game.renderMessage();
	Manager.game.renderPause();
	Manager.renderTransition();
};

Credits.start = () => {
	Manager.credits.y = 320;
	OBJ.create(Transition, C.black, 100, 50);
};

Credits.update = () => {
	touchUpdate();
	if (Manager.menu.keyEscape || touchPressed) {
		Room.start('Menu');
		Manager.menu.cursor = 2;
		Manager.menu.rotation = 0;
	}
	if (Room.name === 'Credits') {
		Emitter.preset('fire');
		Emitter.setArea(0, Room.w, Room.h, Room.h);
		Emitter.emit(1);
	}
	Manager.credits.y = Math.range(Manager.credits.y, 0, 0.2);
};

Credits.renderUI = () => {
	const t = Math.sin(Time.time * 0.005);
	Draw.setFont(Font.xxl);
	Draw.setHVAlign(Align.c, Align.t);
	Manager.menu.drawText(Room.mid.w, 48 + t * 5, 'CREDITS');
	Draw.setFont(Font.m);
	Draw.setHAlign(Align.l);
	Manager.menu.drawText(120, Manager.credits.y + 120, `Developed by Branth\n\n♫ Twistboy - Good Times\n♫ NightRadio - Sound Fields (Track 1)\n\nCreated for Untitled Game Jam #18 (Theme: Gravity)`);
	Draw.setFont(Font.s);
	Draw.setHVAlign(Align.l, Align.b);
	Draw.setAlpha(0.5);
	Manager.menu.drawText(16, Room.h - 16, 'Press <Backspace> to back.');
	Draw.setAlpha(1);
	Manager.renderTransition();
};

Leaderboard.start = () => {
	Manager.leaderboard.updateHS();
	Manager.leaderboard.y = 320;
	OBJ.create(Transition, C.black, 100, 50);
};

Leaderboard.update = () => {
	touchUpdate();
	Manager.leaderboard.t += Time.deltaTime;
	if (Manager.menu.keyEscape || touchPressed) {
		Room.start('Menu');
		Manager.menu.cursor = 1;
		Manager.menu.rotation = -216;
	}
	if (Room.name === 'Leaderboard') {
		Emitter.preset('fire');
		Emitter.setColor(Math.choose(C.lemonChiffon, C.yellow));
		Emitter.setArea(0, Room.w, Room.h, Room.h);
		Emitter.emit(1);
	}
	Manager.leaderboard.y = Math.range(Manager.leaderboard.y, 0, 0.2);
};

Leaderboard.renderUI = () => {
	const t = Math.sin(Time.time * 0.005);
	const podium = {
		h: Room.h * 0.062
	};
	Draw.setFont(Font.xxl);
	Draw.setHVAlign(Align.c, Align.t);
	Manager.menu.drawText(Room.mid.w, 48 + t * 5, 'LEADERBOARD');
	Draw.setFont(Font.m);
	if (firebase) {
		for (let i = 0; i < 10; i++) {
			const x = Room.mid.w + Math.ceil(i * 0.5) * (i % 2 === 0? -1 : 1) * 75;
			const h = (10 - i) * podium.h;
			const y = Manager.leaderboard.y + Room.h - h;
			Draw.setColor(C.white);
			Draw.roundRect(x, y, 40, h + 32, 4);
			Draw.setColor(C.black);
			Draw.rect(x + 8, y, 24, -24);
			Draw.setVAlign(Align.b);
			if (Manager.leaderboard.hs.length > i) {
				const j = Manager.leaderboard.hs[i];
				let k = j.name;
				while (Draw.textWidth(k) > 95) {
					k = k.slice(0, k.length - 1);
				}
				Manager.menu.drawText(x + 20, y - 30, `${k}${k.length < j.name.length? '...' : ''}\n${j.score.toFixed(2)}kg`);
			}
		}
		Draw.setFont(Font.l, Font.bold);
		for (let i = 0; i < 10; i++) {
			const x = Room.mid.w + Math.ceil(i * 0.5) * (i % 2 === 0? -1 : 1) * 75;
			const h = (10 - i) * podium.h;
			const y = Manager.leaderboard.y + Room.h - h;
			Draw.setColor(C.black);
			Draw.setVAlign(Align.t);
			Draw.text(x + 20, y + 6, i + 1);
		}
		Draw.resetFontStyle();
	}
	else {
		Draw.setVAlign(Align.m);
		Draw.text(Room.mid.w, Room.mid.h, 'Failed to connect to database.');
	}
	Draw.setFont(Font.s);
	Draw.setHVAlign(Align.l, Align.b);
	Draw.setAlpha(0.5);
	Manager.menu.drawText(16, Room.h - 16, 'Press <Backspace> to back.');
	Draw.setAlpha(1);
	Manager.renderTransition();
};

LevelSelect.start = () => {
	Manager.levelSelect.x = Manager.levelSelect.xto = Room.mid.w - Manager.levelSelect.cursor * Manager.levelSelect.boxSize;
	Manager.levelSelect.x += Manager.levelSelect.boxSize * 0.07;
	OBJ.create(Transition, C.black, 100, 50);
};

LevelSelect.update = () => {
	touchUpdate();
	if (Manager.menu.keyA || swipeRight) {
		if (Manager.levelSelect.cursor > 0) {
			Manager.levelSelect.cursor--;
			Sound.play('Cursor');
		}
		else {
			Manager.levelSelect.xto += Manager.levelSelect.boxSize * 0.07;
			Sound.play('Cancel');
		}
	}
	if (Manager.menu.keyD || swipeLeft) {
		if (Manager.levelSelect.cursor < Manager.levelSelect.items.length - 1) {
			Manager.levelSelect.cursor++;
			Sound.play('Cursor');
		}
		else {
			Manager.levelSelect.xto -= Manager.levelSelect.boxSize * 0.07;
			Sound.play('Cancel');
		}
	}
	if (Manager.menu.keyEscape || touchPressed) {
		Room.start('Menu');
		Manager.menu.cursor = 0;
		Manager.menu.rotation = -72;
	}
	else if (Manager.menu.keyEnter) {
		Manager.levelSelect.items[Manager.levelSelect.cursor].onClick();
		Sound.play('Decision');
	}
	Manager.levelSelect.xto = Math.range(Manager.levelSelect.xto, Room.mid.w - Manager.levelSelect.cursor * Manager.levelSelect.boxSize, 0.3);
	Manager.levelSelect.x = Math.range(Manager.levelSelect.x, Manager.levelSelect.xto, 0.3);
	if (Room.name === 'LevelSelect') {
		Emitter.preset('fire');
		Emitter.setColor(Math.choose(C.indigo, C.darkSlateBlue));
		Emitter.setArea(0, Room.w, Room.h, Room.h);
		Emitter.emit(1);
	}
};

LevelSelect.renderUI = () => {
	const t = Math.sin(Time.time * 0.005);
	Draw.setFont(Font.xxl);
	Draw.setHVAlign(Align.c, Align.t);
	Manager.menu.drawText(Room.mid.w, 48 + t * 5, 'SELECT MISSION');
	for (let i = Manager.levelSelect.items.length - 1; i >= 0; i--) {
		const x = Manager.levelSelect.x + i * Manager.levelSelect.boxSize;
		const j = 0.5 + 0.5 * (1 - Math.abs(Room.mid.w - x) / Room.mid.w);
		Draw.setColor(Manager.levelSelect.items[i].color);
		Draw.roundRectTransformed(x, Room.mid.h - 20, Manager.levelSelect.boxSize, Manager.levelSelect.boxSize, Manager.levelSelect.boxSize * 0.1, false, j, j);
	}
	const h = Manager.levelSelect.items[Manager.levelSelect.cursor];
	Draw.setFont(Font.l);
	let y = Room.mid.h + Manager.levelSelect.boxSize * 0.5 + 4;
	Manager.menu.drawText(Room.mid.w, y, h.text);
	y += Font.size * 1.5;
	Draw.setFont(Font.m);
	Manager.menu.drawText(Room.mid.w, y, `/`);
	Draw.setHAlign(Align.r);
	Manager.menu.drawText(Room.mid.w - 10, y, Manager.levelSelect.cursor + 1);
	Draw.setHAlign(Align.l);
	Manager.menu.drawText(Room.mid.w + 10, y, Manager.levelSelect.items.length);
	Draw.setHVAlign(Align.c, Align.b);
	Manager.menu.drawText(Room.mid.w, Room.h - 48, h.description);
	Draw.setFont(Font.s);
	Draw.setHVAlign(Align.l, Align.b);
	Draw.setAlpha(0.5);
	Manager.menu.drawText(16, Room.h - 16, 'Press <Enter> to confirm.\nPress <Backspace> to back.\nPress <Left> or <Right> to select.');
	Draw.setAlpha(1);
	Manager.renderTransition();
};

PlayerSelect.start = () => {
	OBJ.create(Transition, C.black, 100, 50);
};

PlayerSelect.update = () => {
	if (Manager.menu.keyEscape) {
		Room.start('Menu');
		Manager.menu.cursor = 1;
		Manager.menu.rotation = -144;
	}
	if (Manager.menu.keyEnter) {
		Room.start('Game');
		Sound.play('Decision');
	}
	if (Room.name === 'PlayerSelect') {
		Emitter.preset('fire');
		Emitter.setColor(Math.choose(C.lemonChiffon, C.yellow));
		Emitter.setArea(0, Room.w, Room.h, Room.h);
		Emitter.emit(1);
	}
};

PlayerSelect.renderUI = () => {
	Draw.setFont(Font.s);
	Draw.setHVAlign(Align.l, Align.b);
	Draw.setAlpha(0.5);
	Manager.menu.drawText(16, Room.h - 16, 'Press <S> to insert P2.\nPress <Down> to insert P1.\nPress <Backspace> to back.\nPress <Enter> to start game.');
	Draw.setAlpha(1);
	Manager.renderTransition();
};

Level1.start = () => {
	Manager.game.setup(5);
	Sound.stop('Menu');
	Sound.loop('Game');
	const n = OBJ.create(Kong, 0, Room.w * 0.5, Room.h - 32, C.royalBlue, {
		W: KeyCode.Up,
		A: KeyCode.Left,
		S: KeyCode.Down,
		D: KeyCode.Right
	});
	Manager.game.credits--;
	n.vsp = 0;
	Manager.game.guideText = 'Press <Left> or <Right> to move.';
	Manager.game.guideIndex = 0;
	Sound.play('Cursor');
	OBJ.create(Transition, C.white);
};

Level1.update = () => {
	Game.update();
	if (Manager.game.pause) return;
	const updt = {
		'0'() {
			if (Input.keyDown(KeyCode.Left) || Input.keyDown(KeyCode.Right)) {
				Manager.game.guideText = 'Press <Up> to jump and double jump.';
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'1'() {
			if (Input.keyDown(KeyCode.Up)) {
				Manager.game.guideText = 'Keep jumping as high as possible and\nthen let it fall into the floor.';
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'2'() {
			if (Manager.game.floor < 5) {
				Manager.game.guideText = 'You have just destroyed 1 floor! Keep jump and\nfall until this floor is destroyed!';
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'3'() {
			if (Manager.game.floor < 4) {
				Manager.game.guideText = 'You can jump to the wall to be able to jump higher.';
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'4'() {
			if (Manager.game.floor < 3) {
				Manager.game.guideText = 'Caution! This floor is armed by weapons.\nAvoid their bullets to stay alive!';
				Manager.game.guideIndex++;
				Sound.play('Cursor');
				OBJ.create(WeaponHandler, [0, 8, 2, 6]);
			}
		},
		'5'() {
			if (Manager.game.floor < 2) {
				Manager.game.guideText = 'Yes! You have destroyed the armed floor.\nAll the next floors should be easy.';
				Manager.game.guideIndex++;
				Sound.play('Cursor');
				OBJ.create(WeaponHandler, [8, 6, 2, 0]);
			}
		},
		'6'() {
			if (Manager.game.gameOver) {
				Manager.game.guideText = '';
			}
		}
	}[Manager.game.guideIndex];
	updt();
};

Level1.render = () => {
	Game.render();
};

Level2.start = () => {
	Manager.game.setup(10);
	Sound.stop('Menu');
	Sound.loop('Game');
	Manager.game.guideText = 'Press <Down> to start P1.';
	Manager.game.guideIndex = 0;
	Sound.play('Cursor');
	OBJ.create(WeaponHandler, [0, 8, 2, 6]);
	OBJ.create(Transition, C.white);
	Manager.game.onStartFloor = () => {
		switch (Manager.game.floor) {
			case 9: OBJ.create(WeaponHandler, [4, 6, 2, 8, 0]); break;
			case 8: OBJ.create(WeaponHandler, [3, 5, 4, 2, 6, 0, 8]); break;
			case 7: OBJ.create(WeaponHandler, [4, 3, 5, 0, 8, 6, 2]); break;
			case 6: OBJ.create(WeaponHandler, [2, 6, 0, 8, 4, 5, 3]); break;
			case 5: OBJ.create(WeaponHandler, [3, 6, 0, 8, 4, 5, 2]); break;
			case 4: OBJ.create(WeaponHandler, [2, 6, 0, 8, 4, 5, 3]); break;
			case 3: OBJ.create(WeaponHandler, [3, 6, 0, 8, 4, 5, 2]); break;
			case 2: OBJ.create(WeaponHandler, [2, 6, 0, 8, 4, 5, 3]); break;
			case 1: OBJ.create(WeaponHandler, [3, 6, 0, 8, 4, 5, 2]); break;
		}
	};
};

Level2.update = () => {
	Game.update();
	if (Manager.game.pause) return;
	const updt = {
		'0'() {
			if (Input.keyDown(KeyCode.Down)) {
				Manager.game.guideText = 'Press <S> to start P2.';
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'1'() {
			if (OBJ.take(Kong).length > 1) {
				Manager.game.guideText = 'Destroy this floor together!';
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'2'() {
			if (Manager.game.floor < 10) {
				Manager.game.guideText = 'Watch out for machine gun!\nIt shoots rapidly.';
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'3'() {
			if (Manager.game.floor < 9) {
				Manager.game.guideText = 'Watch out for missile!\nIts projectile looking at you.';
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'4'() {
			if (Manager.game.goingDown) {
				Manager.game.guideText = '';
			}
		}
	}[Manager.game.guideIndex];
	updt();
};

Level2.render = () => {
	Game.render();
};

Level3.start = () => {
	Manager.game.setup(10);
	Sound.stop('Menu');
	Sound.loop('Game');
	Manager.game.guideText = 'Collect banana that drop after smashing.';
	Manager.game.guideIndex = 0;
	Sound.play('Cursor');
	OBJ.create(WeaponHandler, [0, 8, 2, 6]);
	OBJ.create(Transition, C.white);
	Manager.game.onStartFloor = () => {
		switch (Manager.game.floor) {
			case 9: OBJ.create(WeaponHandler, [4, 6, 2, 8, 0]); break;
			case 8: OBJ.create(WeaponHandler, [3, 5, 4, 2, 6, 0, 8]); break;
			case 7: OBJ.create(WeaponHandler, [4, 3, 5, 0, 8, 6, 2]); break;
			case 6: OBJ.create(WeaponHandler, [2, 6, 0, 8, 4, 5, 3]); break;
			case 5: OBJ.create(WeaponHandler, [3, 6, 0, 8, 4, 5, 2]); break;
			case 4: OBJ.create(WeaponHandler, [2, 6, 0, 8, 4, 5, 3]); break;
			case 3: OBJ.create(WeaponHandler, [3, 6, 0, 8, 4, 5, 2]); break;
			case 2: OBJ.create(WeaponHandler, [2, 6, 0, 8, 4, 5, 3]); break;
			case 1: OBJ.create(WeaponHandler, [3, 6, 0, 8, 4, 5, 2]); break;
		}
	};
};

Level3.update = () => {
	Game.update();
	if (Manager.game.pause) return;
	const updt = {
		'0'() {
			if (Manager.game.floor < 9) {
				Manager.game.guideText = '';
				Sound.play('Cursor');
			}
		}
	}[Manager.game.guideIndex];
	updt();
};

Level3.render = () => {
	Game.render();
};

Level1.renderUI = Game.renderUI;
Level2.renderUI = Game.renderUI;
Level3.renderUI = Game.renderUI;

const TempLevel1 = new BranthRoom('TempLevel1');
const TempLevel2 = new BranthRoom('TempLevel2');
const TempLevel3 = new BranthRoom('TempLevel3');
Room.add(TempLevel1);
Room.add(TempLevel2);
Room.add(TempLevel3);

Draw.add(new Vector2(0.5, 0.5), 'Block', 'src/img/Block.png');
Draw.add(new Vector2(0.5, 0.5), 'BGObj', 'src/img/Mono0.png', 'src/img/Mono1.png');

class BackgroundObject extends BranthGameObject {
	awake() {
		this.depth = 2;
		this.hspeed = -2;
		this.vspeed = -2;
		this.spriteName = 'BGObj';
		Physics.add(this);
	}
	randomizeValue() {
		this.y = Math.range(0, Room.h);
		this.imageIndex = Math.irange(2);
		this.imageXScale = Math.range(0.8, 1.1);
		this.imageYScale = this.imageXScale;
		this.imageAngle = Math.range(360);
	}
	update() {
		if (this.x < -64) {
			this.x += Room.w + 128;
			if (this.spriteName !== 'Block') this.randomizeValue();
		}
		if (this.x > Room.w + 64) {
			this.x -= Room.w + 128;
			if (this.spriteName !== 'Block') this.randomizeValue();
		}
		if (this.y < -64) {
			this.y += Room.h + 128;
		}
		if (this.y > Room.h + 64) {
			this.y -= Room.h + 128;
		}
		if (Manager.game.pause) {
			this.freeze = true;
		}
		else {
			this.freeze = false;
		}
	}
	onDestroy() {
		Physics.remove(this.id);
	}
}

OBJ.add(BackgroundObject);

let tutorialBasicTimer = 0;
let tutorialFloatingHand = null;
let tutorialNotKebalTimer = 0;
let smasherSpawnTimer = 0;

TempLevel1.start = () => {
	// Setup game
	tutorialBasicTimer = 0;
	tutorialFloatingHand = null;
	tutorialNotKebalTimer = 0;
	smasherSpawnTimer = 0;
	Manager.game.setup(10);
	Sound.stop('Menu');
	// Sound.loop('Game');
	Manager.game.kebal = true;
	Manager.game.guideText = `Press <Enter> to continue.`;
	Manager.game.guideShowTriangle = true;
	Manager.game.guideIndex = 0;
	Sound.play('Cursor');
	OBJ.create(Transition, C.white);
	Manager.game.onStartFloor = () => {
		switch (Manager.game.floor) {
			case 8: OBJ.create(WeaponHandler, Math.choose([2], [6])); break;
			case 7: OBJ.create(WeaponHandler, [2, 6]); break;
			case 6: OBJ.create(WeaponHandler, [4, 6, 2]); break;
			case 5: OBJ.create(WeaponHandler, [6, 2, 4, 8, 0]); break;
			case 4: OBJ.create(WeaponHandler, [2, 6, 5, 3]); break;
			case 3: OBJ.create(WeaponHandler, [0, 2, 3, 5, 6, 8]); break;
			case 2: OBJ.create(WeaponHandler, [0, 8, 2, 6, 3, 5, 4]); break;
			case 1: OBJ.create(WeaponHandler, [0, 2, 3, 4, 5, 6, 8]); break;
		}
		if (Manager.game.floor >= 1 && Manager.game.floor <= 8) {
			Manager.game.showMessage(`Destroy this floor!`, 60);
		}
	};
	// Setup background
	for (let i = 0; i < Room.w / 32; i++) {
		for (let j = 0; j < Room.h / 32; j++) {
			const n = OBJ.create(BackgroundObject, i * 64, j * 64);
			n.spriteName = 'Block';
		}
	}
	for (let i = 0; i < Room.w / 64; i++) {
		const n = OBJ.create(BackgroundObject, i * 64, Math.range(0, Room.h));
		n.randomizeValue();
	}
};

TempLevel1.update = () => {
	if (Manager.menu.keyEscape && !Manager.game.gameOver) {
		if (Manager.game.pause) {
			Manager.game.pause = false;
			Sound.play('Cancel');
		}
		else {
			Manager.game.pause = true;
			Sound.play('Cancel');
		}
	}
	if (Manager.game.goingDown && !Manager.game.pause) {
		if (Manager.game.goingDownAlarm < 0) {
			Manager.game.goingDownComplete();
			Manager.game.goingDown = false;
		}
		else Manager.game.goingDownAlarm -= Time.deltaTime;
	}
	if (!Manager.game.pause && Manager.game.credits > 0) {
		let count = 0;
		if (Input.keyDown(KeyCode.Down)) {
			if (Manager.game.playerExists(0)) count++;
			if (count === 0) {
				const n = OBJ.create(Kong, 0, Room.w * 0.75, Room.mid.h, C.royalBlue, {
					W: KeyCode.Up,
					A: KeyCode.Left,
					S: KeyCode.Down,
					D: KeyCode.Right
				});
				// To cancel attempt of using smasher
				n.isUsingSmasher = true;
				n.alarm[1] = 10;
				Manager.game.credits--;
			}
		}
		else if (Input.keyDown(KeyCode.S)) {
			if (Manager.game.playerExists(1)) count++;
			if (count === 0) {
				const n = OBJ.create(Kong, 1, Room.w * 0.25, Room.mid.h, C.crimson, {
					W: KeyCode.W,
					A: KeyCode.A,
					S: KeyCode.S,
					D: KeyCode.D
				});
				// To cancel attempt of using smasher
				n.isUsingSmasher = true;
				n.alarm[1] = 10;
				Manager.game.credits--;
			}
		}
	}
	if (Manager.game.pause) return;
	if (Manager.game.guideIndex <= 13) {
		if (Manager.game.guideIndex === 13) {
			if (Manager.game.kebal) {
				// Only increment timer when the basics haven't been done
				tutorialBasicTimer += Time.deltaTime;
			}
		}
		else tutorialBasicTimer += Time.deltaTime;
	}
	const guideUpdate = {
		'0'() {
			if (Input.keyDown(KeyCode.Enter)) {
				if (Manager.game.playerExists(0)) {
					Manager.game.guideText = `Nice! Looks like you've already deployed a King Kong.`;
				}
				else {
					Manager.game.guideText = `Press <Down> to deploy a King Kong.`;
					Manager.game.guideShowTriangle = false;
				}
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'1'() {
			if (Manager.game.playerExists(0)) {
				Manager.game.guideShowTriangle = true;
			}
			if (Input.keyDown(KeyCode.Enter) && Manager.game.guideShowTriangle) {
				Manager.game.guideText = `Press <Left> or <Right> to move.`;
				Manager.game.guideShowTriangle = false;
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'2'() {
			if (Input.keyHold(KeyCode.Left) || Input.keyHold(KeyCode.Right)) {
				Manager.game.guideShowTriangle = true;
			}
			if (Input.keyDown(KeyCode.Enter) && Manager.game.guideShowTriangle) {
				Manager.game.guideText = `Press <Up> to jump and double jump.`;
				Manager.game.guideShowTriangle = false;
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'3'() {
			if (Input.keyDown(KeyCode.Up)) {
				Manager.game.guideShowTriangle = true;
			}
			if (Input.keyDown(KeyCode.Enter) && Manager.game.guideShowTriangle) {
				Manager.game.guideText = `You can jump to the wall to get higher.`;
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'4'() {
			if (Input.keyDown(KeyCode.Enter)) {
				Manager.game.guideText = `See that floating hand above? We call it "Smasher".`;
				tutorialFloatingHand = OBJ.create(FloatingHand, Room.mid.w, Manager.game.smasherYThreshold);
				tutorialFloatingHand.hspeed = 0;
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'5'() {
			if (Input.keyDown(KeyCode.Enter)) {
				Manager.game.guideText = `Get that "Smasher"!`;
				Manager.game.guideShowTriangle = false;
				// To prohibit player to use smasher before instructed
				Manager.game.smasherYThreshold = -1000;
				tutorialFloatingHand.hspeed = Math.choose(-2, 2);
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'6'() {
			if (Manager.game.smasherAmount > 0) {
				tutorialFloatingHand = null;
				Manager.game.guideShowTriangle = true;
			}
			if (Input.keyDown(KeyCode.Enter) && Manager.game.guideShowTriangle) {
				Manager.game.guideText = `Cool! Now jump above that line and press <Down> to use "Smasher"!`;
				Manager.game.guideShowTriangle = false;
				// Reset smasher y threshold
				Manager.game.smasherYThreshold = Room.h * 0.35;
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'7'() {
			if (Manager.game.smasherAmount === 0) {
				if (!Manager.game.guideShowTriangle) {
					Manager.game.kebal = false;
					Manager.game.lastDamage = 0;
					Manager.game.guideShowTriangle = true;
				}
				if (!Manager.game.kebal) {
					// Larger than or equal than 80 means it came from smasher
					if (Manager.game.lastDamage >= 80) {
						Manager.game.kebal = true;
					}
				}
			}
			if (Manager.game.guideShowTriangle && Manager.game.kebal) {
				Manager.game.guideText = `Good! You just smashed the 10th floor and damaged the building!`;
				Manager.game.guideIndex++;
				Manager.game.guideShowTriangle = false;
				Sound.play('Cursor');
			}
		},
		'8'() {
			if (!Manager.game.goingDown) {
				Manager.game.guideShowTriangle = true;
			}
			if (Input.keyDown(KeyCode.Enter) && Manager.game.guideShowTriangle) {
				Manager.game.guideText = `That's your goal, to smash the building until it's destroyed.`;
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'9'() {
			if (Input.keyDown(KeyCode.Enter)) {
				Manager.game.guideText = `You can call it whatever, we just call it smash.`;
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'10'() {
			if (Input.keyDown(KeyCode.Enter)) {
				Manager.game.guideText = `"Smasher" doesn't spawn frequently.`;
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'11'() {
			if (Input.keyDown(KeyCode.Enter)) {
				Manager.game.guideText = `To smash the floor on your own, just use GRAVITY.`;
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'12'() {
			if (Input.keyDown(KeyCode.Enter)) {
				Manager.game.guideText = `Jump high enough and let the King Kong fall.`;
				Manager.game.guideShowTriangle = false;
				Manager.game.lastDamage = 0;
				Manager.game.kebal = false;
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'13'() {
			if (!Manager.game.kebal) {
				if (tutorialNotKebalTimer === 0) {
					if (Manager.game.lastDamage > 0) {
						tutorialNotKebalTimer = 1000;
					}
				}
				else if (tutorialNotKebalTimer > 0) {
					tutorialNotKebalTimer -= Time.deltaTime;
				}
				else {
					Manager.game.kebal = true;
					Manager.game.guideShowTriangle = true;
				}
			}
			else {
				if (Manager.game.guideShowTriangle) {
					if (Input.keyDown(KeyCode.Enter)) {
						const time = (tutorialBasicTimer * 0.001).toFixed(1);
						let motivationText = Math.choose('Wow!', 'Great!', 'Awesome!', 'Amazing!');
						if (time < 25) motivationText = Math.choose('Woohoo!', 'What a natural!', 'No way!', 'Oh wow!', 'Impressive!');
						Manager.game.guideText = `${motivationText}!! You got the basics in ${time} seconds.`;
						Manager.game.guideIndex++;
						Sound.play('Cursor');
					}
				}
			}
		},
		'14'() {
			const addTxt = `Smash in the center of the floor give more damage.`;
			if (Input.keyDown(KeyCode.Enter)) {
				if (Manager.game.guideText !== addTxt) {
					Manager.game.guideText = addTxt;
				}
				else {
					Manager.game.guideText = `Caution in the next floor, there will be weapons.`;
					Manager.game.guideIndex++;
				}
				Sound.play('Cursor');
			}
		},
		'15'() {
			if (Input.keyDown(KeyCode.Enter)) {
				Manager.game.guideText = `You have to avoid their projectiles if you still want to be alive.`;
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'16'() {
			if (Input.keyDown(KeyCode.Enter)) {
				Manager.game.guideText = `If you die, you can still continue if you have enough credits.`;
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'17'() {
			if (Input.keyDown(KeyCode.Enter)) {
				Manager.game.guideText = `If you want to restart, press <Backspace> to pause.`;
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'18'() {
			if (Input.keyDown(KeyCode.Enter)) {
				Manager.game.guideText = `You're ready to go.`;
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'19'() {
			if (Input.keyDown(KeyCode.Enter)) {
				Manager.game.guideText = `Let me put some music.`;
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'20'() {
			if (Input.keyDown(KeyCode.Enter)) {
				Manager.game.guideText = `Playing ♫ Twistboy — Good Times`;
				Sound.loop('Game');
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'21'() {
			if (Input.keyDown(KeyCode.Enter)) {
				Manager.game.guideText = `Good luck!`;
				Manager.game.guideIndex++;
				Sound.play('Cursor');
			}
		},
		'22'() {
			if (Input.keyDown(KeyCode.Enter)) {
				Manager.game.guideText = ``;
				Manager.game.guideShowTriangle = false;
				Manager.game.guideIndex++;
				Manager.game.kebal = false;
				Sound.play('Cursor');
				Manager.game.showMessage(`Destroy this floor!`);
			}
		},
		'23'() {
			// Last index
		}
	}[Manager.game.guideIndex];
	guideUpdate();
	for (const i of OBJ.take(BackgroundObject)) {
		i.vspeed = Math.range(i.vspeed, Manager.game.goingDown? -6 : -2, 0.1);
	}
	if (Manager.game.guideIndex >= 23 && !Manager.game.goingDown) {
		if (smasherSpawnTimer < 0) {
			if (OBJ.take(FloatingHand).length === 0 && Manager.game.smasherAmount < 10) {
				// Chance to spawn a smasher
				let chance = (1 - Manager.game.floor / Manager.game.floorAmount) * 0.5; // (0 -> 0.5) as it goes down
				if (Math.randbool(chance)) {
					OBJ.create(FloatingHand, Room.mid.w + Math.range(-64, 64), Manager.game.smasherYThreshold);
				}
				smasherSpawnTimer = Math.range(3000, 5000);
			}
		}
		else smasherSpawnTimer -= Time.deltaTime;
	}
};

TempLevel1.render = () => {
	if (Input.keyDown(KeyCode.Enter)) {
		if (Manager.game.gameOver) {
			if (firebase) {
				// Check if player reach a place
				let lowestPointToPass = 0;
				if (Manager.leaderboard.hs.length > 9) {
					lowestPointToPass =  Manager.leaderboard.hs[9];
				}
				if (Manager.game.smashPoint > lowestPointToPass) {
					const name = prompt(`You reach a place with ${Manager.game.smashPoint.toFixed(2)}kg smash points!\nPlease provide your name (10 characters for better display.)`);
					database.child('hs').push({
						name: name,
						score: Manager.game.smashPoint
					});
					alert(`See you in the leaderboard!`);
				}
				else {
					alert(`You're ${(lowestPointToPass - Manager.game.smashPoint).toFixed(2)}kg away to reach a place!\nKeep up the good work!`);
				}
			}
			Room.start('Menu');
		}
		else if (Manager.game.pause) {
			Room.start('Menu');
		}
	}
	Manager.game.drawBackground();
};

TempLevel1.renderUI = () => {
	if (!Manager.game.pause) {
		let player0Targeted = false;
		let player1Targeted = false;
		for (const i of OBJ.take(Missile)) {
			if (i.target) {
				if (i.target.playerIndex === 0 && !player0Targeted && Manager.game.playerExists(0)) {
					player0Targeted = true;
					if (~~(Time.time * 0.01) % 2 === 0) {
						// We know that player 0 is exists, so it must in between those two
						let p = OBJ.take(Kong)[0];
						if (p.playerIndex !== 0) {
							p = OBJ.take(Kong)[1];
						}
						Draw.setColor(`rgba(0, 0, 0, 0.1)`);
						Draw.circle(p.x, p.y - 12, 32);
						Sound.playOnce(`Cursor`);
					}
				}
				else if (i.target.playerIndex === 1 && !player1Targeted && Manager.game.playerExists(1)) {
					player1Targeted = true;
					if (~~(Time.time * 0.01) % 2 === 0) {
						// We know that player 1 is exists, so it must in between those two
						let p = OBJ.take(Kong)[0];
						if (p.playerIndex !== 1) {
							p = OBJ.take(Kong)[1];
						}
						Draw.setColor(`rgba(0, 0, 0, 0.1)`);
						Draw.circle(p.x, p.y - 12, 32);
						Sound.playOnce(`Cursor`);
					}
				}
			}
		}
	}
	if (Manager.game.guideIndex === 7) {
		Draw.setStrokeWeight(3);
		Draw.line(32, Manager.game.smasherYThreshold, Room.w - 32, Manager.game.smasherYThreshold);
		Draw.resetStrokeWeight();
	}
	DamageMessage.renderUI();
	Info.renderUI();
	Manager.game.drawWallAround();
	Manager.game.renderInfo();
	for (const i of OBJ.take(Kong)) {
		i.renderUI();
	}
	Manager.game.renderMessage();
	Manager.game.renderPause();
	Manager.renderTransition();
};

const Boot = new BranthRoom('Boot');
let progress = 0;

Boot.renderUI = () => {
	Draw.setFont(Font.xxl);
	Draw.setVAlign(Align.m);
	const y = Room.mid.h + Math.sin(progress) * 2;
	for (let i = 2; i >= 0; i -= 2) {
		Draw.setColor(i > 0? C.black : C.white);
		Draw.setHAlign(Align.l);
		Draw.text(Room.mid.w - Draw.textWidth('Loading 100%') * 0.5 + i, y + i, 'Loading');
		Draw.setHAlign(Align.c);
		Draw.text(Room.mid.w - Draw.textWidth('Loading 100%') * 0.5 + Draw.textWidth('Loading ') + Draw.textWidth(`${~~progress}%`) * 0.5 + i, y + i, `${~~progress}%`);
	}
	if (progress > 27 && progress < 30) {
		progress += 0.05; // fake loading
	}
	else if (progress > 92 && progress < 93) {
		progress += 0.05; // fake loading
	}
	else progress += Time.scaledDeltaTime; // Estimated time to load image and sound files
	if (~~progress % 10 === 0) {
		Sound.play('Cursor');
	}
	if (progress >= 100) {
		Room.start('Menu');
	}
};

Room.add(Boot);

Manager.leaderboard.updateHS();
// GLOBAL.setProductionMode(true);
// BRANTH.start();
BRANTH.start(960, 540, { HAlign: true, VAlign: true });
Room.start('Boot');