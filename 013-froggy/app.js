class Frog extends BranthObject {
	start() {
		//
	}
	update() {
		//
	}
	render() {
		Draw.setColor(C.White);
		Draw.ellipse(this.x, this.y, 50, 27);
		Draw.polyBegin(Poly.fill);
		Draw.vertex(400, 400);
		Draw.vertex(420, 420);
		Draw.vertex(400, 440);
		Draw.vertex(380, 420);
		Draw.polyEnd();
		Draw.polyBegin(Poly.stroke);
		Draw.vertex(300, 300);
		Draw.vertex(320, 320);
		Draw.vertex(300, 340);
		Draw.vertex(280, 320);
		Draw.polyEnd();
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