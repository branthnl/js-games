Draw.add('Cars', 'Cars.png', 3, 3, 291, 220);

const Game = new BranthRoom('Game', 1280, 720);
Room.add(Game);

class Unit extends BranthGameObject {
	constructor(x, y, row, column, attack, defend, healthPoint, attackRange, movementSpeed) {
		super(x, y);
		this.row = row;
		this.column = column;
		this.attack = attack;
		this.defend = defend;
		this.healthPoint = healthPoint;
		this.attackRange = attackRange;
		this.movementSpeed = movementSpeed;
		this.target = new Vector(0, 0);
		this.spriteName = 'Cars';
	}
	moveToTarget() {
		this.x = Math.lerp(this.x, this.target.x, this.movementSpeed / 32);
		this.y = Math.lerp(this.y, this.target.y, this.movementSpeed / 32);
	}
	update() {
		this.moveToTarget();
	}
}

OBJ.add(Unit);

Game.start = () => {
	const n = new Unit(0, 0, 0, 0, 10, 10, 100, 5, 8);
	OBJ.push(Unit, n);
};

Game.update = () => {
	if (Input.mouseDown(0)) {
		const m = Input.screenToWorldPoint(Input.mousePosition);
		OBJ.take(Unit)[0].target = new Vector(m.x, m.y);
	}
};

BRANTH.start();
Room.start('Game');