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
		this.waypoints = [
			new Vector2(300, 300),
			new Vector2(300, 64),
			new Vector2(64, 300),
			new Vector2(64, 64)
		];
		this.currentWaypointIndex = 0;
	}
	update() {
		if (this.isPlayer) {
			this.speed = 2 * (Input.keyHold(KeyCode.Up) - Input.keyHold(KeyCode.Down));
			this.angle += this.speed * (Input.keyHold(KeyCode.Right) - Input.keyHold(KeyCode.Left));
		}
		else {
			if (this.waypoints.length > 0) {
				if (Math.pointdis(this, this.waypoints[this.currentWaypointIndex]) < 32) {
					this.currentWaypointIndex++;
					if (this.currentWaypointIndex >= this.waypoints.length) {
						this.currentWaypointIndex = 0;
					}
				}
				this.angle += Math.sin(Math.degtorad(Math.pointdir(this, this.waypoints[this.currentWaypointIndex]) - this.angle)) * 5;
			}
		}
		const l = Math.lendir(this.speed, this.angle);
		this.x += l.x;
		this.y += l.y;
	}
	render() {
		const l = Vector2.add(this, Math.lendir(this.w * 0.25, this.angle));
		Draw.setColor(this.color);
		if (!this.isPlayer) {
			for (let i = 0; i < this.waypoints.length; i++) {
				const w = this.waypoints[i];
				Draw.circle(w.x, w.y, 3);
			}
		}
		Draw.roundRectRotated(this.x, this.y, this.w, this.h, this.r, this.angle);
		Draw.setColor(C.black);
		Draw.draw(true);
		Draw.roundRectRotated(l.x, l.y, this.weaponW, this.weaponH, this.weaponR, this.angle + this.weaponAngle);
	}
}

OBJ.add(Tank);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	OBJ.push(Tank, new Tank(64, 64, C.red));
	OBJ.push(Tank, new Tank(Room.mid.w, Room.mid.h, C.blue, true));
};

BRANTH.start();
Room.start('Game');