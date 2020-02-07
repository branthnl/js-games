const Menu = new BranthRoom('Menu');
const Game = new BranthRoom('Game');
Room.add(Menu);
Room.add(Game);

let [X, Y] = [0, 0];

Menu.start = () => [X, Y] = [0, 0];

Menu.update = () => {
	if (Input.keyDown(KeyCode.Enter)) {
		Room.start('Game');
	}
};

Menu.renderUI = () => {
	if (Input.keyHold(KeyCode.Up)) {
		Y--;
	}
	if (Input.keyHold(KeyCode.Left)) {
		X--;
	}
	if (Input.keyHold(KeyCode.Down)) {
		Y++;
	}
	if (Input.keyHold(KeyCode.Right)) {
		X++;
	}
	Draw.setFont(Font.l);
	Draw.setColor(C.gold);
	Draw.setHVAlign(Align.c, Align.m);
	Draw.text(Room.mid.w + X, Room.mid.h + Y, Room.name);
	Draw.textTransformed(Room.mid.w, Room.h * 0.25, 'Text Transformed', 1 + Math.sin(Time.time * 0.005) * 0.2, 2, Time.time * 0.1);
	Draw.setHVAlign(Align.r, Align.b);
	Draw.text(Room.w - 8, Room.h - 8, `(${~~Room.w}, ${~~Room.h})`);
	let x = Room.w - 8, y = Room.h - 8 - Font.size;
	Draw.setFont(Font.xxl);
	Draw.text(x, y, 'XXL');
	y -= Font.size;
	Draw.setFont(Font.xl);
	Draw.text(x, y, 'XL');
	y -= Font.size;
	Draw.setFont(Font.l);
	Draw.text(x, y, 'L');
	y -= Font.size;
	Draw.setFont(Font.m);
	Draw.text(x, y, 'M');
	y -= Font.size;
	Draw.setFont(Font.s);
	Draw.text(x, y, 'S');
	Draw.pointLine(
		new Vector2(7, 7),
		new Vector2(71, 37)
	);
	const kp = !Input.keyHold(KeyCode.Space);
	Draw.rect(32, 32, 7, 18, true);
	Draw.rectTransformed(128, 128, 28, 14, kp, 1, Math.sin(Time.time * 0.01) * 2, Math.sin(Time.time * 0.005) * 24);
	Draw.circle(37, 68, 6);
	Draw.roundRect(64, 48, 24, 18, 5);
	Draw.roundRect(Room.mid.w + 39, Room.mid.h + 14, -78, -28, 14, kp);
	Draw.roundRectTransformed(Room.mid.w + 39, Room.mid.h + 72, 78, 28, 14, kp, 1, Math.sin(Time.time * 0.01) * 2, Math.sin(Time.time * 0.005) * 24);
};

Game.start = () => Menu.start();

Game.update = () => {
	if (Input.keyDown(KeyCode.Enter)) {
		Room.start('Menu');
	}
};

Game.renderUI = () => Menu.renderUI();

BRANTH.start();
Room.start('Menu');