const DATA = {
	TANK_STATE: {
		CHASE: 'Chase',
		ATTACK: 'Attack',
		PATROL: 'Patrol'
	}
};

class Projectile extends BranthBehaviour {
	constructor(x, y, speed, angle, fromPlayer = false) {
		super(x, y);
		this.speed = speed;
		this.angle = angle;
		this.fromPlayer = fromPlayer;
		this.alarm[0] = 300;
	}
	update() {
		const l = Math.lendir(this.speed, this.angle);
		this.x += l.x;
		this.y += l.y;
		let count = 0;
		const v = View.toView(this);
		if (v.x < 0 || v.x > Room.w || v.y < 0 || v.y > Room.h) count++;
		for (const t of OBJ.take(Tank)) {
			if (t) {
				if (Math.pointdis(this, t) < 16) {
					t.hit(this.fromPlayer);
					count++;
					break;
				}
			}
		}
		if (count > 0) this.alarm0();
	}
	render() {
		const v = View.toView(this);
		Draw.setColor(C.red);
		Draw.roundRectRotated(v.x, v.y, 6, 4, 1, this.angle);
	}
	alarm0() {
		Emitter.preset('puff');
		Emitter.setDepth(-2);
		Emitter.setToView(true);
		Emitter.setArea(this.x, this.x, this.y, this.y);
		Emitter.setSize(2, 3);
		Emitter.emit(5);
		OBJ.destroy(this.id);
	}
}

class Tank extends BranthBehaviour {
	constructor(x, y, color, isPlayer = false) {
		super(x, y);
		this.w = 32;
		this.h = 24;
		this.r = 4;
		this.speed = 1;
		this.angle = 0;
		this.color = color;
		this.isPlayer = isPlayer;
		this.weaponW = 25;
		this.weaponH = 7;
		this.weaponR = 2;
		this.weaponAngle = 0;
		this.HP = this.isPlayer? GLOBAL.level * 3 : 3;
		this.canShoot = true;
		this.shootInterval = this.isPlayer? 100 : 1000;
		this.projectileSpeed = this.isPlayer? 10 : 5;
		this.state = DATA.TANK_STATE.PATROL;
		this.chaseRange = 200;
		this.attackRange = 150;
		this.waypoints = [
			new Vector2(this.x + Math.range(200, 300), this.y + Math.range(150, 210)),
			new Vector2(this.x + Math.range(200, 300), this.y + Math.range(-50, 100)),
			new Vector2(this.x + Math.range(-50, 100), this.y + Math.range(150, 210)),
			new Vector2(this.x + Math.range(-50, 100), this.y + Math.range(-50, 100))
		];
		this.currentWaypointIndex = Math.irange(this.waypoints.length);
	}
	hit(fromPlayer) {
		if (this.isPlayer ^ fromPlayer) {
			this.HP--;
			if (this.HP <= 0) {
				Emitter.preset('puff');
				Emitter.setDepth(-2);
				Emitter.setToView(true);
				Emitter.setArea(this.x, this.x, this.y, this.y);
				Emitter.setColor(C.red);
				Emitter.emit(5);
				Emitter.setColor(C.orange);
				Emitter.emit(5);
				if (this.isPlayer) {
					View.target(0, 0);
					GLOBAL.gameOverText = 'OUT OF LIVES...';
					GLOBAL.gameOver = true;
				}
				else {
					GLOBAL.score++;
					if (OBJ.take(Tank).length <= 2) {
						View.target(0, 0);
						GLOBAL.gameOverText = `LEVEL ${GLOBAL.level} CLEARED!`;
						GLOBAL.gameOver = true;
					}
				}
				View.shake(5, 200);
				OBJ.destroy(this.id);
			}
		}
	}
	shoot() {
		if (this.canShoot) {
			let l = Vector2.add(this, Math.lendir(this.weaponW, this.angle + this.weaponAngle));
			OBJ.push(Projectile, new Projectile(l.x, l.y, this.projectileSpeed, this.angle + this.weaponAngle, this.isPlayer));
			this.alarm[0] = this.shootInterval;
			this.canShoot = false;
		}
	}
	update() {
		if (GLOBAL.gameOver) return;
		if (this.isPlayer) {
			View.follow(this, 0.2);
			const keyW = Input.keyHold(KeyCode.W) || Input.keyHold(KeyCode.Up);
			const keyA = Input.keyHold(KeyCode.A) || Input.keyHold(KeyCode.Left);
			const keyS = Input.keyHold(KeyCode.S) || Input.keyHold(KeyCode.Down);
			const keyD = Input.keyHold(KeyCode.D) || Input.keyHold(KeyCode.Right);
			this.speed = Math.range(this.speed, (2.5 + Input.keyHold(KeyCode.Shift)) * (keyW - keyS), 0.1);
			this.angle += this.speed * (keyD - keyA);
			if (Input.keyDown(KeyCode.X) || Input.mouseDown(0)) this.shoot();
			const v = View.toView(this);
			this.weaponAngle = Math.pointdir(v, Input.mousePosition) - this.angle;
		}
		else {
			const distanceToPlayer = Math.pointdis(this, OBJ.take(Tank)[0]);
			switch (this.state) {
				case DATA.TANK_STATE.CHASE:
					// Update
					this.speed = Math.range(this.speed, 1, 0.2);
					this.angleTo = Math.pointdir(this, OBJ.take(Tank)[0]);
					// Transition
					if (distanceToPlayer > this.chaseRange) this.state = DATA.TANK_STATE.PATROL;
					else if (distanceToPlayer < this.attackRange) this.state = DATA.TANK_STATE.ATTACK;
					break;
				case DATA.TANK_STATE.ATTACK:
					// Update
					this.speed *= 0.98;
					this.angleTo = Math.pointdir(this, OBJ.take(Tank)[0]);
					this.shoot();
					// Transition
					if (distanceToPlayer > this.attackRange) this.state = DATA.TANK_STATE.CHASE;
					break;
				case DATA.TANK_STATE.PATROL:
					// Update
					if (this.waypoints.length > 0) {
						if (Math.pointdis(this, this.waypoints[this.currentWaypointIndex]) < 32) {
							this.currentWaypointIndex++;
							if (this.currentWaypointIndex >= this.waypoints.length) {
								this.currentWaypointIndex = 0;
							}
						}
						this.angleTo = Math.pointdir(this, this.waypoints[this.currentWaypointIndex]);
					}
					// Transition
					if (distanceToPlayer < this.chaseRange) this.state = DATA.TANK_STATE.CHASE;
					break;
			}
			this.angle += Math.sin(Math.degtorad(this.angleTo - this.angle)) * 5;
		}
		const l = Math.lendir(this.speed, this.angle);
		const p = new Vector2(this.x, this.y);
		this.x += l.x;
		this.y += l.y;
		for (const t of OBJ.take(Tank)) {
			if (t.id !== this.id) {
				if (Math.pointdis(this, t) < Math.max(this.w, this.h)) {
					this.x = p.x;
					this.y = p.y;
					t.x += l.x;
					t.y += l.y;
					if (!this.isPlayer) {
						t.angleTo += 0.2;
					}
				}
			}
		}
	}
	render() {
		const v = View.toView(this);
		const b = !this.isPlayer && GLOBAL.debugMode;
		Draw.setColor(this.color);
		if (b) {
			for (let i = 0; i < this.waypoints.length; i++) {
				const w = View.toView(this.waypoints[i]);
				Draw.circle(w.x, w.y, 3);
			}
			Draw.pointLine(v, View.toView(this.state === DATA.TANK_STATE.PATROL? this.waypoints[this.currentWaypointIndex] : OBJ.take(Tank)[0]));
			Draw.circle(v.x, v.y, this.chaseRange, true);
			Draw.setAlpha(0.4);
			Draw.circle(v.x, v.y, this.attackRange);
			Draw.setAlpha(1);
		}
		Draw.roundRectRotated(v.x, v.y, this.w, this.h, this.r, this.angle);
		Draw.setColor(C.black);
		Draw.draw(true);
		let i = 0;
		while (i++ <= 1) {
			let l = Vector2.add(v, Math.lendir(this.h * 0.5, this.angle - 90 + 180 * i));
			Draw.setColor(C.black);
			Draw.roundRectRotated(l.x, l.y, this.w, this.h * 0.2, this.r, this.angle);
			l = Vector2.add(l, Math.lendir(this.w * 0.4, this.angle - 180));
			Draw.setColor(C.red);
			Draw.setAlpha(0.6 + 0.4 * (this.isPlayer && (Input.keyHold(KeyCode.S) || Input.keyHold(KeyCode.Down))));
			Draw.roundRectRotated(l.x, l.y, this.h * 0.15, this.h * 0.15, this.r, this.angle);
			Draw.setAlpha(1);
		}
		Draw.setColor(C.black);
		Draw.roundRectRotated(v.x, v.y, this.weaponW, this.weaponH, this.weaponR, this.angle + this.weaponAngle, false, new Vector2(0, 0.5));
		Draw.circle(v.x, v.y, 5);
		if (b) {
			const l = Vector2.add(v, Math.lendir(this.h * 0.5, this.angle - 90));
			Draw.setFont(Font.m);
			Draw.setHVAlign(Align.c, Align.b);
			Draw.textRotated(l.x, l.y, this.state, this.angle);
		}
	}
	renderUI() {
		const v = View.toView(this);
		if (!GLOBAL.gameOver) {
			Draw.setFont(Font.m);
			Draw.setColor(C.black);
			Draw.setHVAlign(Align.c, Align.m);
			Draw.text(v.x, v.y - 30, this.HP);
		}
		if (this.isPlayer) {
			let m = Input.mousePosition;
			if (!GLOBAL.gameOver) m = Vector2.add(v, Math.lendir(Math.min(220, Math.pointdis(v, m)), Math.pointdir(v, m)));
			Draw.setColor(C.white);
			Draw.plus(m.x, m.y, 16, true);
			Draw.circle(m.x, m.y, 12, true);
		}
	}
	alarm0() {
		this.canShoot = true;
	}
}

GLOBAL.score = 0;
GLOBAL.level = 1;
GLOBAL.gameOver = false;
GLOBAL.gameOverText = 'GAME OVER';

OBJ.add(Tank);
OBJ.add(Projectile);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	GLOBAL.gameOver = false;
	const n = OBJ.push(Tank, new Tank(Room.mid.w, Room.mid.h, C.blue, true)); n.depth = -1;
	let i = GLOBAL.level * 5;
	while (i-- > 0) {
		OBJ.push(Tank, new Tank(Room.w * Math.choose(Math.range(0.4), Math.range(0.6, 0.8)), Math.range(Room.h * 0.8), C.random()));
	}
};

Game.update = () => {
	if (GLOBAL.gameOver) {
		if (Input.keyDown(KeyCode.R)) {
			Room.restart();
		}
		if (Input.keyDown(KeyCode.N)) {
			GLOBAL.level++;
			Room.restart();
		}
	}
};

Game.render = () => {
	const v = View.toView(new Vector2(Room.mid.w, Room.mid.h));
	Draw.setColor(C.darkSlateBlue);
	Draw.circle(v.x, v.y, 800);
	Draw.setColor(C.green);
	Draw.circle(v.x, v.y, 600);
	Draw.setColor(C.white);
	Draw.plus(v.x, v.y, 800);
};

Game.renderUI = () => {
	if (GLOBAL.gameOver) {
		Draw.setColor(C.black);
		Draw.rect(0, 0, Room.w, Room.h);
		Draw.setColor(C.white);
		Draw.setFont(Font.xxl);
		Draw.setHVAlign(Align.c, Align.b);
		let p = View.toView(new Vector2(Room.mid.w, Room.mid.h));
		Draw.text(p.x, p.y - Font.size, GLOBAL.gameOverText);
		p.x -= Draw.textWidth(GLOBAL.gameOverText) * 0.5;
		Draw.setFont(Font.l);
		Draw.setHVAlign(Align.l, Align.t);
		Draw.text(p.x, p.y, `Total Tank Destroyed: ${GLOBAL.score}\n\nPress R to restart.\n\nPress N to go to the next level.`);
	}
	else {
		Draw.setFont(Font.m);
		Draw.setColor(C.black);
		Draw.setHVAlign(Align.c, Align.b);
		let y = Room.h - 8;
		Draw.text(Room.mid.w, y, 'WASD/Arrow keys to move. X/Left Click to shoot. Shift to boost movement speed.');
		y -= Font.size;
		Draw.setFont(Font.xxl);
		Draw.text(Room.mid.w, y, GLOBAL.score);
	}
};

GLOBAL.setProductionMode();
BRANTH.start(0, 0, { backgroundColor: C.darkOrchid });
Room.start('Game');