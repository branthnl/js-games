const Menu = new BranthRoom('Menu', 360, 240);
const Game = new BranthRoom('Game');
Room.add(Menu);
Room.add(Game);

Game.renderUI = () => {
	Draw.setFont(Font.l);
	Draw.setColor(C.gold);
	Draw.setHVAlign(Align.r, Align.b);
	Draw.text(Room.w - 8, Room.h - 8, `(${~~Room.w}, ${~~Room.h})`);
};

BRANTH.start();
Room.start('Game');