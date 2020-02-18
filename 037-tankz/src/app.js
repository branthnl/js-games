const DATA = {
	TANK_STATE: {
		CHASE: 'Chase',
		ATTACK: 'Attack',
		PATROL: 'Patrol'
	}
};

class Projectile extends BranthBehaviour {
	constructor(x, y, speed, angle) {
		super(x, y);
		this.speed = speed;
		this.angle = angle;
		this.alarm[0] = 300;
	}
	update() {
		const l = Math.lendir(this.speed, this.angle);
		this.x += l.x;
		this.y += l.y;
		if (this.x < 0 || this.x > Room.w || this.y < 0 || this.y > Room.h) this.alarm0();
	}
	render() {
		Draw.setColor(C.red);
		Draw.roundRectRotated(this.x, this.y, 6, 4, 1, this.angle);
	}
	alarm0() {
		Emitter.preset('puff');
		Emitter.setArea(this.x, this.x, this.y, this.y);
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
		this.canShoot = true;
		this.shootInterval = 1000;
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
	shoot() {
		if (this.canShoot) {
			let l = Vector2.add(this, Math.lendir(this.weaponW, this.angle + this.weaponAngle));
			OBJ.push(Projectile, new Projectile(l.x, l.y, this.projectileSpeed, this.angle + this.weaponAngle));
			this.alarm[0] = this.shootInterval;
			this.canShoot = false;
		}
	}
	update() {
		if (this.isPlayer) {
			this.speed = 2 * (Input.keyHold(KeyCode.W) - Input.keyHold(KeyCode.S));
			this.angle += this.speed * (Input.keyHold(KeyCode.D) - Input.keyHold(KeyCode.A));
			if (Input.keyDown(KeyCode.Space) || Input.mouseDown(0)) this.shoot();
			this.weaponAngle = Math.pointdir(this, Input.mousePosition) - this.angle;
		}
		else {
			const distanceToPlayer = Math.pointdis(this, OBJ.take(Tank)[0]);
			switch (this.state) {
				case DATA.TANK_STATE.CHASE:
					// Update
					this.angleTo = Math.pointdir(this, OBJ.take(Tank)[0]);
					// Transition
					if (distanceToPlayer > this.chaseRange) this.state = DATA.TANK_STATE.PATROL;
					else if (distanceToPlayer < this.attackRange) this.state = DATA.TANK_STATE.ATTACK;
					break;
				case DATA.TANK_STATE.ATTACK:
					// Update
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
		this.x += l.x;
		this.y += l.y;
	}
	render() {
		const b = !this.isPlayer && GLOBAL.debugMode;
		Draw.setColor(this.color);
		if (b) {
			for (let i = 0; i < this.waypoints.length; i++) {
				const w = this.waypoints[i];
				Draw.circle(w.x, w.y, 3);
			}
			Draw.pointLine(this, this.state === DATA.TANK_STATE.PATROL? this.waypoints[this.currentWaypointIndex] : OBJ.take(Tank)[0]);
			Draw.circle(this.x, this.y, this.chaseRange, true);
			Draw.setAlpha(0.4);
			Draw.circle(this.x, this.y, this.attackRange);
			Draw.setAlpha(1);
		}
		Draw.roundRectRotated(this.x, this.y, this.w, this.h, this.r, this.angle);
		Draw.setColor(C.black);
		Draw.draw(true);
		Draw.roundRectRotated(this.x, this.y, this.weaponW, this.weaponH, this.weaponR, this.angle + this.weaponAngle, false, new Vector2(0, 0.5));
		Draw.circle(this.x, this.y, 5);
		if (b) {
			const l = Vector2.add(this, Math.lendir(this.h * 0.5, this.angle - 90));
			Draw.setFont(Font.m);
			Draw.setHVAlign(Align.c, Align.b);
			Draw.textRotated(l.x, l.y, this.state, this.angle);
		}
	}
	renderUI() {
		if (this.isPlayer) {
			const m = Input.mousePosition;
			Draw.setColor(C.white);
			Draw.plus(m.x, m.y, 16, true);
			Draw.circle(m.x, m.y, 12, true);
		}
	}
	alarm0() {
		this.canShoot = true;
	}
}

OBJ.add(Tank);
OBJ.add(Projectile);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	const n = OBJ.push(Tank, new Tank(Room.mid.w, Room.mid.h, C.blue, true));
	n.depth = -1;
	OBJ.push(Tank, new Tank(64, 64, C.red));
	OBJ.push(Tank, new Tank(Room.w * 0.75, Room.mid.h, C.magenta));
	OBJ.push(Tank, new Tank(Room.w * 0.2, Room.mid.h, C.springGreen));
};

BRANTH.start();
Room.start('Game');