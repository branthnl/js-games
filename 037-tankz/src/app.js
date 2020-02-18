const DATA = {
	TANK_STATE: {
		CHASE: 'Chase',
		PATROL: 'Patrol'
	}
};

class Tank extends BranthObject {
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
		this.state = DATA.TANK_STATE.PATROL;
		this.waypoints = [
			new Vector2(this.x + 200, this.y + 200),
			new Vector2(this.x + 200, this.y),
			new Vector2(this.x, this.y + 200),
			new Vector2(this.x, this.y)
		];
		this.currentWaypointIndex = Math.irange(this.waypoints.length);
		this.chaseRange = 150;
	}
	update() {
		if (this.isPlayer) {
			this.speed = 2 * (Input.keyHold(KeyCode.Up) - Input.keyHold(KeyCode.Down));
			this.angle += this.speed * (Input.keyHold(KeyCode.Right) - Input.keyHold(KeyCode.Left));
		}
		else {
			const distanceToPlayer = Math.pointdis(this, OBJ.take(Tank)[0]);
			switch (this.state) {
				case DATA.TANK_STATE.CHASE:
					// Update
					this.angleTo = Math.pointdir(this, OBJ.take(Tank)[0]);
					// Transition
					if (distanceToPlayer > this.chaseRange) this.state = DATA.TANK_STATE.PATROL;
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
		let l = Vector2.add(this, Math.lendir(this.w * 0.25, this.angle));
		Draw.setColor(this.color);
		if (b) {
			for (let i = 0; i < this.waypoints.length; i++) {
				const w = this.waypoints[i];
				Draw.circle(w.x, w.y, 3);
			}
			Draw.pointLine(this, this.waypoints[this.currentWaypointIndex]);
			Draw.circle(this.x, this.y, this.chaseRange, true);
		}
		Draw.roundRectRotated(this.x, this.y, this.w, this.h, this.r, this.angle);
		Draw.setColor(C.black);
		Draw.draw(true);
		Draw.roundRectRotated(l.x, l.y, this.weaponW, this.weaponH, this.weaponR, this.angle + this.weaponAngle);
		if (b) {
			l = Vector2.add(this, Math.lendir(this.h * 0.5, this.angle - 90));
			Draw.setFont(Font.m);
			Draw.setHVAlign(Align.c, Align.b);
			Draw.textRotated(l.x, l.y, this.state, this.angle);
		}
	}
}

OBJ.add(Tank);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	const n = OBJ.push(Tank, new Tank(Room.mid.w, Room.mid.h, C.blue, true));
	n.depth = -1;
	OBJ.push(Tank, new Tank(64, 64, C.red));
	OBJ.push(Tank, new Tank(700, 500, C.magenta));
	OBJ.push(Tank, new Tank(120, 350, C.springGreen));
};

BRANTH.start();
Room.start('Game');