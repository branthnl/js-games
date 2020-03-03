const Manager = {
	Game: {
		list: [],
		attach(i) {
			this.list.push(i);
		},
		notify() {
			for (const i of this.list) {
				i.notify();
			}
		}
	},
	visit(i) {
		i.hp -= 5;
	}
};

class Unit extends BranthObject {
	constructor(x, y) {
		super(x, y);
		Manager.Game.attach(this);
		this.hp = 100;
	}
	notify() {
		this.hp -= 4;
	}
	accept(visitor) {
		visitor.visit(this);
	}
	render() {
		Draw.text(this.x, this.y, this.hp);
	}
}

OBJ.add(Unit);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	OBJ.create(Unit, 32, 32);
	OBJ.create(Unit, 64, 64);
	OBJ.create(Unit, 200, 48);
};

Game.update = () => {
	if (Input.keyDown(KeyCode.Space)) {
		OBJ.take(Unit)[0].accept(Manager);
		OBJ.take(Unit)[1].accept(Manager);
	}
	if (Input.keyDown(KeyCode.Enter)) Manager.Game.notify();
};

BRANTH.start();
Room.start('Game');