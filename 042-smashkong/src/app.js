Draw.add(new Vector2(0.5, 0.5), 'Gun', 'src/img/Gun.png');
Draw.add(new Vector2(0.5, 0.5), 'MachineGun', 'src/img/MachineGun.png');
Draw.add(new Vector2(0.5, 0.5), 'Beamer', 'src/img/Beamer.png');
Draw.addStrip(new Vector2(0.5, 0.5), 'Bullet', 'src/img/Bullet.png', 2);
Draw.addStrip(new Vector2(0.5, 0.5), 'Missile', 'src/img/Missile.png', 2);
Draw.addStrip(new Vector2(0.5, 0.5), 'RotateGun', 'src/img/RotateGun.png', 2);
Draw.addStrip(new Vector2(0.5, 0.5), 'MissileLauncher', 'src/img/MissileLauncher.png', 2);

Sound.add('Menu', 'src/snd/Menu.mp3');
Sound.add('Game', 'src/snd/Game.mp3');
Sound.add('Text', 'src/snd/Text.wav');
Sound.add('Jump0', 'src/snd/Jump.wav');
Sound.add('Jump1', 'src/snd/Jump.wav');
Sound.add('Pound', 'src/snd/Pound.wav');
Sound.add('Pound0', 'src/snd/Pound.wav');
Sound.add('Pound1', 'src/snd/Pound.wav');
Sound.add('Cursor', 'src/snd/Cursor.wav');
Sound.add('Cancel', 'src/snd/Cancel.wav');
Sound.add('Decision', 'src/snd/Decision.wav');

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
	}
	get bound() {
		return {
			l: this.x - this.w * 0.5,
			r: this.x + this.w * 0.5,
			t: this.y - this.h,
			b: this.y
		}
	}
	takeDamage(amount) {
		this.hp -= amount;
		if (this.hp <= 0) {
			OBJ.destroy(this.id);
		}
	}
	update() {
		if (Manager.game.pause) return;
		const keyWR = Input.keyUp(this.keyCodeW);
		const keyWP = Input.keyDown(this.keyCodeW);
		const keyA = Input.keyHold(this.keyCodeA);
		const keyS = Input.keyHold(this.keyCodeS);
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
				this.alarm[0] = 666;
				Sound.play(`Jump${this.playerIndex}`);
			}
		}
		if (keyWR) this.jmpHold = false;
		const wallL = this.bound.l <= 32;
		const wallR = this.bound.r >= Room.w - 32;
		if (!this.onGround && (wallL || wallR)) {
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
				Sound.play(`Jump${this.playerIndex}`);
			}
			this.jmpHold = true;
			this.alarm[0] = 666;
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
			if (this.vsp > 0) this.y = Room.h - 32;
			if (this.vsp > 10) {
				View.shake(this.vsp * 0.07, this.vsp * 15);
				Manager.game.takeDamage(this.vsp);
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
	}
	render() {
		const v = View.toView(this);
		Draw.primitiveBegin();
		Draw.vertex(v.x - this.w * 0.5, v.y);
		Draw.vertex(v.x + this.w * 0.5, v.y);
		Draw.vertex(v.x + 10, v.y - this.h);
		Draw.vertex(v.x - 10, v.y - this.h);
		Draw.setColor(C.black);
		Draw.primitiveEnd();
		Draw.setColor(C.bisque);
		Draw.circle(v.x - 6, v.y - 18, 2);
		Draw.circle(v.x + 6, v.y - 18, 2);
		Draw.rect(v.x - 5, v.y - 5, 10, 3);
		if (GLOBAL.debugMode > 0) {
			Draw.setColor(C.magenta);
			Draw.rect(v.x - this.w * 0.5, v.y - this.h, this.w, this.h, true);
			Draw.setColor(C.red);
			Draw.circle(v.x, v.y, 2);
		}
	}
	renderUI() {
		const v = View.toView(this);
		const t = this.hp / 100;
		const t1 = Math.sin(Time.time * 0.005);
		const y = v.y - 40 + t1 * 2;
		Draw.setColor(`rgba(${(1 - t) * 255}, ${t * 255}, 0, 1)`);
		Draw.rect(v.x - 16, y, 32 * t, 4);
		Draw.setColor(C.black);
		Draw.rect(v.x - 16, y, 32, 4, true);
		Draw.setFont(Font.sm, Font.bold);
		Draw.setHVAlign(Align.c, Align.b);
		Draw.text(v.x + 1, y - 1, `P${this.playerIndex + 1}`);
		Draw.setColor(this.color);
		Draw.text(v.x, y - 2, `P${this.playerIndex + 1}`);
		Draw.resetFontStyle();
		Draw.primitiveBegin();
		Draw.vertex(v.x - 4, y + 6);
		Draw.vertex(v.x + 4, y + 6);
		Draw.vertex(v.x, y + 10);
		Draw.setColor(C.black);
		Draw.primitiveEnd();
	}
	alarm0() {
		this.jmpHold = false;
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

class Bullet extends BranthBehaviour {
	constructor(x, y, angle) {
		super(x, y);
		this.spd = 5;
		this.angle = angle;
		this.damage = 1;
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
				count++;
				break;
			}
		}
		if (this.x <= 32 || this.x >= Room.w - 32 || this.y <= 32 || this.y >= Room.h - 32) count++;
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
		this.damage = 3;
		this.spriteName = 'Missile';
		this.interval = Math.range(2000, 2500);
		this.alarm[1] = this.interval;
	}
	beforeUpdate() {
		if (Manager.game.pause) return;
		if (this.target) this.angle += Math.sin(Math.degtorad(Math.pointdir(this, Vector2.add(this.target, this.offset)) - this.angle)) * 5;
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
	}
	shoot() {
		OBJ.create(Bullet, this.shootPoint.x, this.shootPoint.y, this.angle);
	}
	update() {
		if (Manager.game.pause) return;
		this.shootPoint = Vector2.add(this, Math.lendir(16, this.angle));
		if (this.canShoot) {
			this.shoot();
			this.canShoot = false;
			this.shootBackForce = 5;
			this.alarm[0] = this.shootInterval;
		}
		this.shootBackForce *= 0.98;
		this.x = Math.range(this.x, this.xto, 0.2);
		this.y = Math.range(this.y, this.yto, 0.2);
		this.angle += Math.sin(Math.degtorad(this.angleTo - this.angle));
	}
	render() {
		const v = View.toView(Vector2.add(this, Math.lendir(this.shootBackForce, this.angle + 180)));
		Draw.image('Gun', v.x, v.y, 1, 1, this.angle);
	}
	alarm0() {
		this.canShoot = true;
	}
}

class RotateGun extends Gun {
}

class MachineGun extends Gun {
	awake() {
		this.shootInterval = 50;
	}
	render() {
		const v = View.toView(Vector2.add(this, Math.lendir(this.shootBackForce, this.angle + 180)));
		Draw.image('MachineGun', v.x, v.y, 1, 1, this.angle);
	}
}

class MissileLauncher extends Gun {
	awake() {
		this.shootInterval = 4000;
	}
	shoot() {
		OBJ.create(Missile, this.shootPoint.x, this.shootPoint.y, Math.range(this.angle - 30, this.angle + 30), Math.pick(OBJ.take(Kong)));
	}
	render() {
		const v = View.toView(Vector2.add(this, Math.lendir(this.shootBackForce, this.angle + 180)));
		Draw.strip('MissileLauncher', 0, v.x, v.y, 1, 1, this.angle);
		Draw.strip('MissileLauncher', 1, v.x, v.y, 1, 1, this.angle);
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
		if (!Manager.game.pause) {
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
		if (this.weaponsSpawnIndex.length > 0) this.alarm[0] = 1000;
	}
	alarm1() {
		this.step++;
		if (this.step % 2 === 0) {
			this.weaponsAngle[0] = 25;
			this.weaponsAngle[1] = 90;
			this.weaponsAngle[2] = 115;
			this.weaponsAngle[3] = 90;
			this.weaponsAngle[4] = 90;
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
			this.weaponsAngle[4] = 90;
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

OBJ.add(Kong);
OBJ.add(Bullet);
OBJ.add(Missile);
OBJ.add(Beam);
OBJ.add(Gun);
OBJ.add(RotateGun);
OBJ.add(MachineGun);
OBJ.add(MissileLauncher);
OBJ.add(Beamer);
OBJ.add(WeaponHandler);
OBJ.add(Title);
OBJ.add(Transition);

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
			{
				text: 'Banana Rush',
				color: C.gold,
				description: 'Compete against each other for banana!',
				onClick() {
					Room.start('PlayerSelect');
				}
			},
			{
				text: 'Leaderboard',
				color: C.lemonChiffon,
				description: 'See the best player at smashing!',
				onClick() {
					Room.start('Leaderboard');
				}
			},
			{
				text: 'Windowed',
				color: C.lightGreen,
				description: 'Set screen mode to fullscreen.',
				onClick() {
					let count = 0;
					if (this.text === 'Windowed') {
						if (CANVAS.requestFullscreen) {
							CANVAS.requestFullscreen();
						}
						else if (CANVAS.msRequestFullscreen) {
							CANVAS.msRequestFullscreen();
						}
						else if (CANVAS.mozRequestFullscreen) {
							CANVAS.mozRequestFullscreen();
						}
						else if (CANVAS.webkitRequestFullscreen) {
							CANVAS.webkitRequestFullscreen();
						}
						else count++;
						if (count === 0) {
							this.text = 'Fullscreen';
							this.description = 'Set screen mode to windowed.';
						}
					}
					else {
						if (document.exitFullscreen) {
							document.exitFullscreen();
						}
						else if (document.msExitFullscreen) {
							document.msExitFullscreen();
						}
						else if (document.mozCancelFullscreen) {
							document.mozCancelFullscreen();
						}
						else if (document.webkitExitFullscreen) {
							document.webkitExitFullscreen();
						}
						else count++;
						if (count === 0) {
							this.text = 'Windowed';
							this.description = 'Set screen mode to fullscreen.';
						}
					}
				}
			},
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
			return Input.keyDown(KeyCode.A) || Input.keyDown(KeyCode.Left);
		},
		get keyD() {
			return Input.keyDown(KeyCode.D) || Input.keyDown(KeyCode.Right);
		},
		get keyEnter() {
			return Input.keyDown(KeyCode.Enter) || Input.keyDown(KeyCode.Space);
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
		floor: 10,
		floorHP: 0,
		floorBaseHP: 50,
		floorAmount: 10,
		setup() {
			this.pause = false;
			this.gameOver = false;
			this.goingDown = false;
		},
		getFloorHP(floor) {
			return (this.floorAmount - floor + 1) * this.floorBaseHP;
		},
		takeDamage(amount) {
			this.floorHP -= amount;
			if (this.floorHP <= 0) {
				this.floorHP = this.getFloorHP(--this.floor);
			}
		},
		renderPause() {
			this.pauseAlpha = Math.range(this.pauseAlpha, this.pause * 0.5, 0.2);
			Sound.setVolume('Game', Math.range(Sound.getVolume('Game'), !this.pause, 0.1));
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
				Manager.menu.drawText(Room.mid.w, Room.mid.h, 'Press <Enter> to back to menu.');
			}
		},
		drawBackground() {
			Draw.setColor(C.black);
			Draw.rect(0, 0, Room.w, Room.h);
			Draw.setColor(C.lavender);
			Draw.rect(28, 28, Room.w - 56, Room.h - 56);
		},
		drawWallAround() {
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
		y: 0
	},
	renderTransition() {
		const t = OBJ.take(Transition)[0];
		if (t) t.render();
	}
};

const Menu = new BranthRoom('Menu');
const Game = new BranthRoom('Game');
const Credits = new BranthRoom('Credits');
const Leaderboard = new BranthRoom('Leaderboard');
const LevelSelect = new BranthRoom('LevelSelect');
const PlayerSelect = new BranthRoom('PlayerSelect');
const Level1 = new BranthRoom('Level1');
const Level2 = new BranthRoom('Level2');
const Level3 = new BranthRoom('Level3');
Room.add(Menu);
Room.add(Game);
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

Menu.update = () => {
	if (Manager.menu.keyA) {
		if (--Manager.menu.cursor < 0) Manager.menu.cursor = Manager.menu.items.length - 1;
		Sound.play('Cursor');
	}
	if (Manager.menu.keyD) {
		if (++Manager.menu.cursor > Manager.menu.items.length - 1) Manager.menu.cursor = 0;
		Sound.play('Cursor');
	}
	if (Manager.menu.keyEnter) {
		Manager.menu.items[Manager.menu.cursor].onClick();
		Sound.play('Decision');
	}
	Manager.menu.rotation += Math.sin(Math.degtorad(-Manager.menu.cursor * (360 / Manager.menu.items.length) - Manager.menu.rotation)) * 10;
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
	Manager.game.setup();
	Sound.stop('Menu');
	Sound.loop('Game');
	OBJ.create(Kong, 0, Room.w * 0.25, Room.mid.h, C.royalBlue, {
		W: KeyCode.Up,
		A: KeyCode.Left,
		S: KeyCode.Down,
		D: KeyCode.Right
	});
	OBJ.create(Kong, 1, Room.w * 0.75, Room.mid.h, C.crimson, {
		W: KeyCode.W,
		A: KeyCode.A,
		S: KeyCode.S,
		D: KeyCode.D
	});
	OBJ.create(WeaponHandler, [0, 8, 2, 6]);
	OBJ.create(Transition, C.white);
};

Game.update = () => {
	if (Manager.menu.keyEscape) {
		if (Manager.game.pause) {
			Manager.game.pause = false;
			Sound.play('Cancel');
		}
		else {
			Manager.game.pause = true;
			Sound.play('Cancel');
		}
	}
};

Game.render = () => {
	if (Manager.menu.keyEnter) {
		if (Manager.game.pause) {
			Room.start('Menu');
		}
	}
	Manager.game.drawBackground();
};

Game.renderUI = () => {
	Manager.game.drawWallAround();
	for (const i of OBJ.take(Kong)) {
		i.renderUI();
	}
	Manager.game.renderPause();
	Manager.renderTransition();
};

Credits.start = () => {
	Manager.credits.y = 320;
	OBJ.create(Transition, C.black, 100, 50);
};

Credits.update = () => {
	if (Manager.menu.keyEscape) {
		Room.start('Menu');
		Manager.menu.cursor = 4;
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
	Manager.menu.drawText(120, Manager.credits.y + 120, `Developer\n  Branth\n\nBGM\n  Twistboy - Good Times\n  NightRadio - Sound Fields (Track 1)\n\nWebsite\n  branthnl.itch.io\n  github.com/branthnl\n\nContact\n  branthnl1@gmail.com\n\nSource Code\n  github.com/branthnl/js-games/042-smashkong\n\n\n\nCreated for Untitled Game Jam #18 (Theme: Gravity)`);
	Draw.setFont(Font.s);
	Draw.setHVAlign(Align.l, Align.b);
	Draw.setAlpha(0.5);
	Manager.menu.drawText(16, Room.h - 16, 'Press <Backspace> to back.');
	Draw.setAlpha(1);
	Manager.renderTransition();
};

Leaderboard.start = () => {
	Manager.leaderboard.y = 320;
	OBJ.create(Transition, C.black, 100, 50);
};

Leaderboard.update = () => {
	Manager.leaderboard.t += Time.deltaTime;
	if (Manager.menu.keyEscape) {
		Room.start('Menu');
		Manager.menu.cursor = 2;
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
	for (let i = 0; i < 10; i++) {
		const x = Room.mid.w + Math.ceil(i * 0.5) * (i % 2 === 0? -1 : 1) * 75;
		const h = (10 - i) * podium.h;
		const y = Manager.leaderboard.y + Room.h - h;
		Draw.setColor(C.white);
		Draw.roundRect(x, y, 40, h + 32, 4);
		Draw.setColor(C.blue);
		Draw.rect(x + 8, y, 24, -24);
		Draw.setVAlign(Align.b);
		Manager.menu.drawText(x + 20, y - 30, `${'Branth'}\n${(11 - i) * 10000}`);
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
	Draw.setFont(Font.s);
	Draw.setHVAlign(Align.l, Align.b);
	Draw.setAlpha(0.5);
	Manager.menu.drawText(16, Room.h - 16, 'Press <Backspace> to back.');
	Draw.setAlpha(1);
	Manager.renderTransition();
};

LevelSelect.start = () => {
	OBJ.create(Transition, C.black, 100, 50);
};

LevelSelect.update = () => {
	if (Manager.menu.keyEscape) {
		Room.start('Menu');
		Manager.menu.cursor = 0;
		Manager.menu.rotation = -72;
	}
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

Level1.start = () => {};

BRANTH.start(960, 540, { HAlign: true, VAlign: true });
Room.start('Menu');