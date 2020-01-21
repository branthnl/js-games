const Menu = new BranthRoom('Menu', 1280, 720);
const Game = new BranthRoom('Game', 1280, 720);
Room.add(Menu);
Room.add(Game);

BRANTH.start();
Room.start('Menu');