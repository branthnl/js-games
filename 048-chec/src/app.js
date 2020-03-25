// Chec.setup();
// Chec.ascii();
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

class Piece {
	constructor(type, color) {
		this.type = type;
		this.color = color;
	}
}

const Chec = {
	PAWN: 'P',
	ROOK: 'R',
	KNIGHT: 'N',
	BISHOP: 'B',
	WHITE: 'w',
	BLACK: 'b',
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
		this.put(new Piece(this.ROOK, this.WHITE), "a1");
		this.put(new Piece(this.KNIGHT, this.WHITE), "b1");
		this.put(new Piece(this.PAWN, this.WHITE), "c1");
		this.put(new Piece(this.BISHOP, this.WHITE), "d1");
		this.put(new Piece(this.ROOK, this.BLACK), "a6");
		this.put(new Piece(this.BISHOP, this.BLACK), "b6");
		this.put(new Piece(this.PAWN, this.BLACK), "c6");
		this.put(new Piece(this.KNIGHT, this.BLACK), "d6");
	}
};

const Boot = new BranthRoom("Boot");
const Menu = new BranthRoom("Menu");
const Game = new BranthRoom("Game");

Boot.start = () => {
};

Room.add(Boot);
Room.add(Menu);
Room.add(Game);

Room.start("Boot");
BRANTH.start();