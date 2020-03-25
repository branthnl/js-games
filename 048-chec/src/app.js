// TTC.Board.setup();
// TTC.Board.ascii();
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

const TTC = {};

TTC.PAWN = 'P';
TTC.ROOK = 'R';
TTC.KNIGHT = 'N';
TTC.BISHOP = 'B';
TTC.WHITE = 'w';
TTC.BLACK = 'b';
TTC.gray = "#c0c0c0";
TTC.white = "#ffffff";
TTC.black = "#404040";

TTC.Board = {
	board: [
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null]
	],
	getX(c) {
		return {
			a: 0,
			b: 1,
			c: 2,
			d: 3
		}[c];
	},
	getY(c) {
		return c - 1;
	},
	getXY(square) {
		return {
			x: this.getX(square[0]),
			y: this.getY(square[1])
		};
	},
	put(piece, square) {
		const s = this.getXY(square);
		this.board[s.x][s.y] = piece;
	},
	move(move) {
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
	setup() {
		this.clear();
		this.put(new Piece(TTC.ROOK, TTC.WHITE), "a1");
		this.put(new Piece(TTC.KNIGHT, TTC.WHITE), "b1");
		this.put(new Piece(TTC.PAWN, TTC.WHITE), "c1");
		this.put(new Piece(TTC.BISHOP, TTC.WHITE), "d1");
		this.put(new Piece(TTC.ROOK, TTC.BLACK), "a6");
		this.put(new Piece(TTC.BISHOP, TTC.BLACK), "b6");
		this.put(new Piece(TTC.PAWN, TTC.BLACK), "c6");
		this.put(new Piece(TTC.KNIGHT, TTC.BLACK), "d6");
	}
};

TTC.Loader = {
	loadAmount: 0,
	loadedCount: 0,
	loadProgress: 0,
	onLoadingComplete() {},
	add() {
		TTC.Loader.loadedCount++;
		TTC.Loader.loadProgress = TTC.Loader.loadedCount / TTC.Loader.loadAmount;
		if (TTC.Loader.loadedCount >= TTC.Loader.loadAmount) {
			setTimeout(TTC.Loader.onLoadingComplete, 200); // Just give a delay to make sure everything's ready
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

TTC.UI = {
	CreateRect(x, y, w, h) {
		return { x, y, w, h };
	},
	MouseHoverRect(rect) {
		const m = Input.mousePosition;
		return m.x > rect.x && m.x < rect.x + rect.w && m.y > rect.y && m.y < rect.y + rect.h;
	},
	DebugRect(rect) {
		Draw.setColor(C.black);
		Draw.rect(rect.x, rect.y, rect.w, rect.h, true);
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
		this.rect = TTC.UI.CreateRect(this.x - this.w * 0.5, this.y - this.h * 0.5, this.w, this.h);
	}
	render() {
		if (TTC.UI.MouseHoverRect(this.rect)) {
			this.scale = Math.range(this.scale, 1.1, 0.2);
			if (Input.mouseDown(0)) {
				this.onClick();
			}
		}
		else {
			this.scale = Math.range(this.scale, 1, 0.2);
		}
		Draw.image(this.imageName, this.x, this.y, this.scale, this.scale);
		TTC.UI.DebugRect(this.rect);
	}
}

OBJ.add(Button);

const Boot = new BranthRoom("Boot");
const Menu = new BranthRoom("Menu");
const Game = new BranthRoom("Game");

Boot.start = () => {
	TTC.Loader.loadImage(new Vector2(0.5, 0.5), "Board", "src/img/Board.png");
	TTC.Loader.loadImage(new Vector2(0.5, 0.5), "PlayButton", "src/img/PlayButton.png");
	TTC.Loader.loadImage(new Vector2(0.5, 0.5), "RestartButton", "src/img/RestartButton.png");
	TTC.Loader.loadStrip(new Vector2(0.5, 0.5), "Pieces", "src/img/Pieces_strip8.png", 8);
	TTC.Loader.onLoadingComplete = () => {
		Room.start("Menu");
	};
};

Boot.render = () => {
	Draw.setFont(Font.l);
	Draw.setColor(TTC.black);
	Draw.setHVAlign(Align.c, Align.m);
	Draw.text(Room.mid.w, Room.mid.h, `${TTC.Loader.loadProgress * 100}%`);
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
	OBJ.create(Transition, new Transition(C.black));
};

Game.render = () => {
	Draw.image("Board", Room.mid.w, Room.mid.h);
};

Game.renderUI = () => {
	Transition.Render();
};

Room.add(Boot);
Room.add(Menu);
Room.add(Game);

Room.start("Boot");
BRANTH.start(375, 600, { HAlign: true, VAlign: true, backgroundColor: TTC.gray });