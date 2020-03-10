const Grid = [];
const GridSize = 400;

let tileWidth = 80;
let tileHeight = 40;
let tileScale = 1;

const setTileScale = (val) => {
	tileScale = val;
	tileWidth = 80 * tileScale;
	tileHeight = 40 * tileScale;
	renderDistance = 20 / tileScale;
};

let columnStart = 0;
let rowStart = 0;
let columnEnd = 0;
let rowEnd = 0;

let renderDistance = 20;

class Manager extends BranthObject {
	render() {
		renderGrid();
	}
}

class Building extends BranthObject {
	constructor(type, c, r, imageIndex=0) {
		super(0, 0);
		this.type = type;
		this.c = c;
		this.r = r;
		this.imageIndex = imageIndex;
		this.updatePosition();
		this.drawX = this.x;
		this.drawY = this.y;
	}
	updatePosition() {
		const b = convertWorldToScreen(this.c, this.r);
		this.x = b.x;
		this.y = b.y;
		this.depth = -this.y;
		this.drawX = Math.range(this.drawX, this.x, 0.2);
		this.drawY = Math.range(this.drawY, this.y, 0.2);
	}
	update() {
		this.updatePosition();
		this.visible = this.x > -100 && this.x < Room.w + 100 && this.y > -100 && this.y < Room.h + 100;
	}
	render() {
		Draw.sprite(this.type, this.imageIndex, this.drawX, this.drawY, tileScale, tileScale);
	}
}

OBJ.add(Building);

class Tile {
	constructor(tileIndex=0, passability=[true, true, true, true], isExplored=false) {
		this.tileIndex = tileIndex;
		this.passability = passability;
		this.isExplored = isExplored;
	}
}

const convertWorldToScreen = (x, y) => {
	return new Vector2(
		Room.mid.w + ((x - y - columnStart + rowStart) * tileWidth * 0.5),
		((x + y - columnStart - rowStart) * tileHeight * 0.5)
	);
};

const convertGridToScreen = (x, y) => {
	return new Vector2(
		(x - y) * tileWidth * 0.5,
		(x + y) * tileHeight * 0.5
	);
};

const convertScreenToWorld = (x, y) => {
	return new Vector2(
		~~((x - Room.mid.w) / tileWidth + y / tileHeight) + columnStart,
		~~(y / tileHeight - (x - Room.mid.w) / tileWidth) + rowStart
	);
};

const convertScreenToGrid = (x, y) => {
	return new Vector2(
		~~(x / tileWidth + y / tileHeight),
		~~(y / tileHeight - x / tileWidth)
	);
};

const setupGrid = () => {
	Grid.length = 0;
	for (let i = 0; i < GridSize; i++) {
		Grid[i] = [];
		for (let j = 0; j < GridSize; j++) {
			Grid[i][j] = new Tile(0);//Math.choose(0, 1));
		}
	}
};

let cGap = 0;
let rGap = 0;
let cTemp = 0;
let rTemp = 0;
let moveTouchID = 0;

setTileScale(0.5);

const moveWorld = () => {
	let mousePressed = Input.mouseDown(0);
	let mouseHold = Input.mouseHold(0);
	let m = Input.mousePosition;
	m = convertScreenToGrid(m.x, m.y);
	if (Input.changedTouchCount > 0) {
		moveTouchID = Input.changedTouches[0].id;
		m = convertScreenToGrid(Input.changedTouches[0].x, Input.changedTouches[0].y);
		if (Input.touchDown(moveTouchID)) {
			mousePressed = true;
		}
		if (Input.touchHold(moveTouchID)) {
			mouseHold = true;
		}
	}
	if (mousePressed) {
		cTemp = columnStart;
		rTemp = rowStart;
		cGap = m.x;
		rGap = m.y;
	}
	else if (mouseHold) {
		columnStart = Math.clamp(cTemp + cGap - m.x, 0, GridSize - 1);
		rowStart = Math.clamp(rTemp + rGap - m.y, 0, GridSize - 1);
	}
};

const renderGrid = () => {
	columnEnd = Math.min(columnStart + renderDistance - 1, GridSize - 1);
	rowEnd = Math.min(rowStart + renderDistance - 1, GridSize - 1);
	for (let i = Math.clamp(columnStart, 0, GridSize - 1); i <= columnEnd; i += 4) {
		for (let j = Math.clamp(rowStart, 0, GridSize - 1); j <= rowEnd; j += 4) {
			const b = convertWorldToScreen(i, j);
			Draw.sprite('Tile', Grid[i][j].tileIndex, b.x, b.y, tileScale * 4, tileScale * 4);
		}
	}
};

Draw.add(Vector2.center, 'Tile', 'src/img/Grass.png', 'src/img/Water.png');
Draw.add(Vector2.center, 'Wall', 'src/img/Fortwall1.png', 'src/img/Fortwall2.png', 'src/img/Fortwall3.png', 'src/img/Fortwall4.png', 'src/img/Fortwall5.png');
Draw.add(new Vector2(0.5, 0.9), 'Tree',
	'src/img/Tree001.png',
	'src/img/Tree002.png',
	'src/img/Tree003.png',
	'src/img/Tree004.png',
	'src/img/Tree005.png',
	'src/img/Tree006.png',
	'src/img/Tree007.png',
	'src/img/Tree008.png',
	'src/img/Rock001.png',
	'src/img/Rock002.png',
	'src/img/Rock003.png',
	'src/img/Rock004.png',
	'src/img/Rock005.png',
	'src/img/Rock006.png'
);

OBJ.add(Manager);

const Game = new BranthRoom('Game');
Room.add(Game);

const ua = navigator.userAgent.toLowerCase();
console.log(ua);

Game.start = () => {
	setupGrid();
	OBJ.create(Manager);
	// Create all objects required in full grid (40000)
	for (let i = GridSize; i >= 0; i -= 4) {
		for (let j = GridSize; j >= 0; j -= 4) {
			OBJ.create(Building, 'Tree', i, j, Math.irange(14));
		}
	}
};

Game.update = () => {
	moveWorld();
};

Game.renderUI = () => {
	Draw.setFont(Font.m, Font.bold);
	Draw.setColor(C.white);
	Draw.setHVAlign(Align.l, Align.t);
	Draw.text(32, 32, Time.FPS);
	let m = Input.mousePosition;
	if (Input.changedTouchCount > 0) {
		m = convertScreenToWorld(Input.changedTouches[0].x, Input.changedTouches[0].y);
		Draw.text(32, 64, `${m.x}, ${m.y}`);
		m = convertWorldToScreen(m.x, m.y);
	}
	else {
		if (Input.keyHold(KeyCode.Ctrl)) {
			m = convertScreenToWorld(m.x, m.y);
			Draw.text(32, 64, `${m.x}, ${m.y}`);
			m = convertWorldToScreen(m.x, m.y);
		}
		else {
			m = convertScreenToGrid(m.x, m.y);
			Draw.text(32, 64, `${m.x}, ${m.y}`);
			m = convertGridToScreen(m.x, m.y);
		}
	}
	Draw.pointRect(
		new Vector2(m.x, m.y - tileHeight * 0.5),
		new Vector2(m.x + tileWidth * 0.5, m.y),
		new Vector2(m.x, m.y + tileHeight * 0.5),
		new Vector2(m.x - tileWidth * 0.5, m.y),
		true
	);
};

Room.start('Game');
BRANTH.start();