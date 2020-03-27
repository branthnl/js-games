const DOTA = {};

DOTA.SCREEN_WIDTH = 960;
DOTA.SCREEN_HEIGHT = 540;

DOTA.DATA = {
	chars: [
		{
			name: "CM",
			imageIndex: 0
		},
		{
			name: "Coco",
			imageIndex: 1
		},
		{
			name: "ES",
			imageIndex: 2
		},
		{
			name: "Lion",
			imageIndex: 3
		},
		{
			name: "Naga",
			imageIndex: 4
		},
		{
			name: "Panda",
			imageIndex: 5
		},
		{
			name: "POM",
			imageIndex: 6
		},
		{
			name: "SG",
			imageIndex: 7
		},
		{
			name: "VS",
			imageIndex: 8
		},
		{
			name: "Zeus",
			imageIndex: 9
		}
	]
};

const C = Branth.C,
	OBJ = Branth.OBJ,
	Time = Branth.Time,
	Room = Branth.Room,
	Draw = Branth.Draw,
	Font = Branth.Font,
	Align = Branth.Align,
	Input = Branth.Input,
	Sound = Branth.Sound,
	Loader = Branth.Loader,
	Emitter = Branth.Emitter,
	KeyCode = Branth.KeyCode,
	Primitive = Branth.Primitive,
	Game = Branth.Room.add("Game");

Branth.onLoadStart = () => {
	Loader.loadImage(new Vector2(0, 0), "Background", "src/img/Background.png");
	Loader.loadStrip(new Vector2(0.5, 1), "Chars", "src/img/Chars_strip10.png", 10);
};

Branth.onLoadFinish = () => {
	Room.start("Game");
};

Game.start = () => {
};

Game.render = () => {
	Draw.image("Background", 0, 0);
};

Branth.start({
	parentID: "gameContainer"
});