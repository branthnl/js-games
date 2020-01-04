class Frog extends BranthObject {
	depth = 0;
}

class Lotus extends BranthObject {
	depth = 1;
}

const Menu = new BranthRoom('Menu', 640, 640);
const Game = new BranthRoom('Game', 240, 360);
Room.add(Menu);
Room.add(Game);

const frog1 = new Frog();

OBJ.add(frog1);

Menu.start = () => {
}

Game.start = () => {
	console.log('game');
}

BRANTH.start();
Room.start('Menu');