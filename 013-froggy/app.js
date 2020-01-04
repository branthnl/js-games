class Frog extends BranthObject {
	start() {
		//
	}
	update() {
		//
	}
	render() {
	}
}

OBJ.add(Frog);
const Menu = new BranthRoom('Menu', 640, 640);
const Game = new BranthRoom('Game', 240, 360);
Room.add(Menu);
Room.add(Game);

Menu.start = () => {
	OBJ.create(Frog, 45, 45);
}

Game.start = () => {
	console.log('game');
}

BRANTH.start();
Room.start('Menu');