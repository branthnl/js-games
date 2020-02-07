const Menu = new BranthRoom('Menu');
const Game = new BranthRoom('Game');
Room.add(Menu);
Room.add(Game);

Menu.update = () => {
	if (Input.keyDown(KeyCode.Enter)) {
		Room.start('Game');
	}
};

Menu.renderUI = () => {
	Draw.setFont(Font.l);
	Draw.setColor(C.gold);
	Draw.setHVAlign(Align.r, Align.b);
	Draw.text(Room.w - 8, Room.h - 8, `(${~~Room.w}, ${~~Room.h})`);
	Draw.setHVAlign(Align.c, Align.m);
	Draw.text(Room.mid.w, Room.mid.h, Room.name);
};

Game.update = () => {
	if (Input.keyDown(KeyCode.Enter)) {
		Room.start('Menu');
	}
};

Game.renderUI = () => {
	Draw.setFont(Font.l);
	Draw.setColor(C.gold);
	Draw.setHVAlign(Align.r, Align.b);
	Draw.text(Room.w - 8, Room.h - 8, `(${~~Room.w}, ${~~Room.h})`);
	Draw.setHVAlign(Align.c, Align.m);
	Draw.text(Room.mid.w, Room.mid.h, Room.name);
};

BRANTH.start();
Room.start('Menu');