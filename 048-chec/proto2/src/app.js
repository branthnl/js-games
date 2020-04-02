// TIC.Board.setup();
// TIC.Board.ascii();
// ->  "
//		    a  b  c  d
//		  +------------+
//		6 | R  B  P  N | 6 <-- Black
//		  +------------+
//		5 | .  .  .  . | 5
//		4 | .  .  .  . | 4
//		3 | .  .  .  . | 3
//		2 | .  .  .  . | 2
//		  +------------+
//		1 | R  N  P  B | 1 <-- White
//		  +------------+
//		    a  b  c  d
//	   "

const TIC = {};

TIC.PAWN = 'P';
TIC.ROOK = 'R';
TIC.KNIGHT = 'N';
TIC.BISHOP = 'B';
TIC.WHITE = 'w';
TIC.BLACK = 'b';
TIC.gray = "#c0c0c0";
TIC.white = "#ffffff";
TIC.black = "#404040";

TIC.Board = {
	squareSize: 75,
	board: [
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null]
	],
	getX(x) {
		return {
			a: 0,
			b: 1,
			c: 2,
			d: 3
		}[x];
	},
	getY(y) {
		return y - 1;
	},
	getXY(square) {
		return {
			x: this.getX(square[0]),
			y: this.getY(square[1])
		};
	},
	getSquare(x, y) {
		return `${['a', 'b', 'c', 'd'][x]}${y + 1}`;
	},
	put(piece, square) {
		const s = this.getXY(square);
		this.board[s.x][s.y] = piece;
	},
	clear() {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 6; j++) {
				this.board[i][j] = null;
			}
		}
	},
	ascii() {
		let y = 5;
		let result = "\n";
		for (let i = 11; i >= 0; i--) {
			if (i === 0 || i === 11) {
				result += "    a  b  c  d";
			}
			else if (i === 1 || i === 3 || i === 8 || i === 10) {
				result += "  +------------+";
			}
			else {
				result += `${y + 1} |`;
				for (let j = 0; j < 4; j++) {
					const k = this.board[j][y];
					if (k instanceof Piece) {
						result += ` ${k.type} `;
					}
					else {
						result += " . ";
					}
				}
				result += `| ${y + 1}`;
				y--;
			}
			result += "\n";
		}
		return result;
	},
	toBoard(x, y) {
		let xOffset = Room.mid.w - this.squareSize * 2;
		let yOffset = Room.mid.h + this.squareSize * 3;
		const i = (x - xOffset) / this.squareSize - 0.5;
		const j = (y - yOffset) / -this.squareSize - 0.5;
		return {
			x: i,
			y: j
		};
	},
	toScreen(i, j) {
		let xOffset = Room.mid.w - this.squareSize * 2;
		let yOffset = Room.mid.h + this.squareSize * 3;
		return {
			x: xOffset + this.squareSize * (i + 0.5),
			y: yOffset - this.squareSize * (j + 0.5)
		};
	},
	getImageIndex(piece) {
		return {
			"P": 0,
			"R": 1,
			"N": 2,
			"B": 3
		}[piece.type] + 4 * (piece.color === TIC.BLACK);
	},
	loop(callback) {
		let count = 0;
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 6; j++) {
				if (callback(i, j) > 0) {
					count++;
					break;
				}
			}
			if (count > 0) {
				break;
			}
		}
	},
	setup() {
		this.clear();
		this.put(new Piece(TIC.ROOK, TIC.WHITE), "a1");
		this.put(new Piece(TIC.KNIGHT, TIC.WHITE), "b1");
		this.put(new Piece(TIC.PAWN, TIC.WHITE), "c1");
		this.put(new Piece(TIC.BISHOP, TIC.WHITE), "d1");
		this.put(new Piece(TIC.ROOK, TIC.BLACK), "a6");
		this.put(new Piece(TIC.BISHOP, TIC.BLACK), "b6");
		this.put(new Piece(TIC.PAWN, TIC.BLACK), "c6");
		this.put(new Piece(TIC.KNIGHT, TIC.BLACK), "d6");
	},
	render() {
		this.loop((i, j) => {
			const k = this.board[i][j];
			if (k instanceof Piece) {
				const l = this.toScreen(i, j);
				Draw.strip("Pieces", this.getImageIndex(k), l.x, l.y);
			}
		});
	}
};

TIC.Loader = {
	loadAmount: 0,
	loadedCount: 0,
	loadProgress: 0,
	onLoadingComplete() {},
	add() {
		TIC.Loader.loadedCount++;
		TIC.Loader.loadProgress = TIC.Loader.loadedCount / TIC.Loader.loadAmount;
		if (TIC.Loader.loadedCount >= TIC.Loader.loadAmount) {
			setTimeout(TIC.Loader.onLoadingComplete, 200); // Just give a delay to make sure everything's ready
		}
	},
	loadImage(origin, name, src) {
		this.loadAmount++;
		Draw.add(origin, name, src);
		const i = Draw.getImage(name);
		i.onload = this.add;
	},
	loadStrip(origin, name, src, strip) {
		this.loadAmount++;
		const i = Draw.addStrip(origin, name, src, strip);
		i.onload = this.add;
	}
};

TIC.UI = {
	CreateRect(x, y, w, h) {
		return { x, y, w, h };
	},
	MouseHoverRect(rect) {
		const m = Input.mousePosition;
		return m.x > rect.x && m.x < rect.x + rect.w && m.y > rect.y && m.y < rect.y + rect.h;
	},
	DebugRect(rect) {
		if (GLOBAL.debugMode % 2 !== 0) {
			Draw.setColor(C.black);
			Draw.rect(rect.x, rect.y, rect.w, rect.h, true);
		}
	}
};

class Piece {
	constructor(type, color) {
		this.type = type;
		this.color = color;
	}
}

class Button extends BranthObject {
	constructor(imageName, x, y, onClick) {
		super(x, y);
		this.scale = 1;
		this.onClick = onClick;
		this.imageName = imageName;
		const i = Draw.getImage(this.imageName);
		this.w = i.width;
		this.h = i.height;
		this.rect = TIC.UI.CreateRect(this.x - this.w * 0.5, this.y - this.h * 0.5, this.w, this.h);
	}
	render() {
		if (TIC.UI.MouseHoverRect(this.rect)) {
			this.scale = Math.range(this.scale, 1.1, 0.2);
			if (Input.mouseDown(0)) {
				this.onClick();
			}
		}
		else {
			this.scale = Math.range(this.scale, 1, 0.2);
		}
		Draw.image(this.imageName, this.x, this.y, this.scale, this.scale);
		TIC.UI.DebugRect(this.rect);
	}
}

OBJ.add(Button);

const Boot = new BranthRoom("Boot");
const Menu = new BranthRoom("Menu");
const Game = new BranthRoom("Game");

Boot.start = () => {
	TIC.Loader.loadImage(new Vector2(0.5, 0.5), "Board", "src/img/Board.png");
	TIC.Loader.loadImage(new Vector2(0.5, 0.5), "PlayButton", "src/img/PlayButton.png");
	TIC.Loader.loadImage(new Vector2(0.5, 0.5), "RestartButton", "src/img/RestartButton.png");
	TIC.Loader.loadStrip(new Vector2(0.5, 0.5), "Pieces", "src/img/Pieces_strip8.png", 8);
	TIC.Loader.onLoadingComplete = () => {
		Room.start("Menu");
	};
};

Boot.render = () => {
	Draw.setFont(Font.l);
	Draw.setColor(TIC.black);
	Draw.setHVAlign(Align.c, Align.m);
	Draw.text(Room.mid.w, Room.mid.h, `${TIC.Loader.loadProgress * 100}%`);
};

Menu.start = () => {
	OBJ.create(Button, "PlayButton", Room.mid.w, Room.mid.h, () => {
		Room.start("Game");
	});
	OBJ.create(Transition, new Transition(C.black));
};

Menu.render = () => {
	Draw.image("Board", Room.mid.w, Room.mid.h);
};

Menu.renderUI = () => {
	Transition.Render();
};

Game.start = () => {
	TIC.Board.setup();
	OBJ.create(Transition, new Transition(C.black));
};

TIC.Input = {
	draggedPiece: null,
	startDrag(x, y, piece) {
		this.draggedPiece = piece;
		this.draggedPiece.startX = x;
		this.draggedPiece.startY = y;
	},
	endDrag() {
		this.draggedPiece = null;
	}
};

Game.render = () => {
	Draw.image("Board", Room.mid.w, Room.mid.h);
	TIC.Board.render();
	const k = TIC.Input.draggedPiece;
	let m = Input.mousePosition;
	m = TIC.Board.toBoard(m.x, m.y);
	m.x = ~~m.x;
	m.y = ~~m.y;
	if (k instanceof Piece) {
		if (Input.mouseUp(0)) {
			TIC.Board.put(new Piece(k.type, k.color), TIC.Board.getSquare(m.x, m.y));
			TIC.Input.endDrag();
		}
		m = TIC.Board.toScreen(m.x, m.y);
		Draw.strip("Pieces", TIC.Board.getImageIndex(k), m.x, m.y);
	}
	else {
		if (Input.mouseDown(0)) {
			TIC.Board.loop((i, j) => {
				const k = TIC.Board.board[i][j];
				if (k instanceof Piece) {
					TIC.Input.startDrag(i, j, k);
					TIC.Board.board[i][j] = null;
					return 1;
				}
				return 0;
			});
		}
	}
};

Game.renderUI = () => {
	Transition.Render();
};

Room.add(Boot);
Room.add(Menu);
Room.add(Game);

Room.start("Boot");
BRANTH.start(375, 600, { HAlign: true, VAlign: true, backgroundColor: TIC.gray });