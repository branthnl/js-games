const DATA = {
	Unit: {
		data: [
			name: 'Barbarian',
			hitPoint: 24,
			attackRange: 0,
			attackStrength: 3, 
		]
	}
};

class Unit extends BranthObject {
	constructor(playerIndex, dataIndex, x, y) {
		super(x, y);
		this.playerIndex = playerIndex;
		this.dataIndex = dataIndex;
	}
}

const Game = new BranthRoom('Game');
Room.add(Game);

Game.update = () => {
	const m = Input.mousePosition;
	if (Input.mouseDown(0)) {
		OBJ.create(Unit, m.x, m.y);
	}
};

BRANTH.start();
Room.start('Game');