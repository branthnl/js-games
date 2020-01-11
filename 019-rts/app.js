Draw.add('isoDemo', 'iso_demo.png', 8, 8, 40, 40);

class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

const WorldSprite = [];
const WorldSize = new Vector2(14, 13);
const TileSize = new Vector2(40, 20);
const Origin = new Vector2(7, 6);

const Menu = new BranthRoom('Menu', 640, 640);
const Game = new BranthRoom('Game', 640, 640);
Room.add(Menu);
Room.add(Game);

Menu.update = () => {
	if (Input.keyDown(KeyCode.Enter)) {
		Room.start('Game');
	}
}

const ToScreen = (x, y) => new Vector2(
	(Origin.x * TileSize.x) + (x - y) * (TileSize.x * 0.5),
	(Origin.y * TileSize.y) + (x + y) * (TileSize.y * 0.5)
);

Game.start = () => {
	for (let y = 0; y < WorldSize.y; y++) {
		for (let x = 0; x < WorldSize.x; x++) {
			WorldSprite.push(Math.irange(4, 8));
		}
	}
}

Game.render = () => {
	for (let y = 0; y < WorldSize.y; y++) {
		for (let x = 0; x < WorldSize.x; x++) {
			const World = ToScreen(x, y);
			Draw.sprite('isoDemo', WorldSprite[y * WorldSize.x + x], World.x, World.y, Draw.origin(TileSize.x * 0.5, TileSize.y));
		}
	}
	Draw.setColor(C.black);
	Draw.circle(Origin.x * TileSize.x, Origin.y * TileSize.y, 4);
	const m = Input.screenToWorldPoint(Input.mousePosition);
	const Mouse = new Vector2(m.x, m.y);
	const Cell = new Vector2(Math.floor((Mouse.x + TileSize.x * 0.5) / TileSize.x), Math.floor(Mouse.y / TileSize.y));
	const Offset = new Vector2(Mouse.x % TileSize.x, Mouse.y % TileSize.y);
	const Selected = new Vector2(
		(Cell.y - Origin.y) + (Cell.x - Origin.x),
		(Cell.y - Origin.y) - (Cell.x - Origin.x)
	);
	if (Input.keyHold(KeyCode.Up)) {
		Selected.y--;
	}
	if (Input.keyHold(KeyCode.Left)) {
		Selected.x--;
	}
	if (Input.keyHold(KeyCode.Down)) {
		Selected.y++;
	}
	if (Input.keyHold(KeyCode.Right)) {
		Selected.x++;
	}
	const SelectedWorld = ToScreen(Selected.x, Selected.y);
	Draw.sprite('isoDemo', 0, SelectedWorld.x, SelectedWorld.y, Draw.origin(TileSize.x * 0.5, TileSize.y));
	Draw.setColor(C.red);
	Draw.rect(Cell.x * TileSize.x - TileSize.x * 0.5, Cell.y * TileSize.y, TileSize.x, TileSize.y, true);
	Draw.setColor(C.black);
	Draw.setHVAlign(Align.l, Align.t);
	Draw.setFont(Font.s);
	Draw.text(4, 4, `Mouse: ${Math.floor(Mouse.x)}, ${Math.floor(Mouse.y)}`);
	Draw.text(4, 4 + Font.size, `Cell: ${Cell.x}, ${Cell.y}`);
	Draw.text(4, 4 + Font.size * 2, `Selected: ${Selected.x}, ${Selected.y}`);
}

BRANTH.start();
Room.start('Game');