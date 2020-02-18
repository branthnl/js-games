class Tank extends BranthObject {
	constructor(x, y, color, isPlayer = false) {
		super(x, y);
		this.w = 32;
		this.h = 24;
		this.r = 4;
		this.speed = 2;
		this.angle = 0;
		this.color = color;
		this.isPlayer = isPlayer;
		this.weaponW = 25;
		this.weaponH = 7;
		this.weaponR = 2;
		this.weaponAngle = 0;
	}
	update() {
		if (this.isPlayer) {
			this.speed = 2 * (Input.keyHold(KeyCode.Up) - Input.keyHold(KeyCode.Down));
			this.angle += this.speed * (Input.keyHold(KeyCode.Right) - Input.keyHold(KeyCode.Left));
		}
		const l = Math.lendir(this.speed, this.angle);
		this.x += l.x;
		this.y += l.y;
	}
	render() {
		const l = Vector2.add(this, Math.lendir(this.w * 0.25, this.angle));
		Draw.setColor(this.color);
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