const Type = {
	BISHOP: "B",
	KNIGHT: "K",
	PAWN: "P",
	ROOK: "R"
};

const Color = {
	BLACK: "B",
	WHITE: "W"
};

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.xstart = x;
		this.ystart = y;
	}
	reset() {
		this.x = this.xstart;
		this.y = this.ystart;
	}
	equal(p) {
		return this.x === p.x && this.y === p.y;
	}
	static copy(p) {
		return new Point(p.x, p.y);
	}
}

class Piece {
	constructor(type, color) {
		this.type = type;
		this.color = color;
	}
	static Create(code) {
		const type = code[0];
		const color = code[1];
		return new Piece(type, color);
	}
}

const Board = {
	boardArray: [
		[null, Piece.Create("BW"), null, null, null, Piece.Create("BB")],
		[Piece.Create("PW"), null, null, null, null, Piece.Create("PB")],
		[null, Piece.Create("KW"), null, null, null, null, Piece.Create("KB")],
		[null, null, Piece.Create("RW"), null, null, Piece.Create("RB")]
	],
	size: new Point(4, 6),
	ascii() {
		let result = "  | 0 1 2 3 |\n---------------";
		for (let y = this.size.y - 1; y >= 0; y--) {
			result += `\n${y} | `;
			for (let x = 0; x < this.size.x; x++) {
				if (this.boardArray[x][y]) {
					result += `${this.boardArray[x][y].type} `;
				}
				else {
					result += ". ";
				}
			}
			result += `| ${y}`;
		}
		result += "\n---------------\n  | 0 1 2 3 |";
		return result;
	},
	get(boardPosition) {
		return this.boardArray[boardPosition.x][boardPosition.y];
	},
	/**
	 * Returns move possibilites
	 * @param {Point} boardPosition
	 * @returns {Array} an array of boardPositions
	 */
	open(boardPosition) {
		const result = [];
		const n = this.get(boardPosition);
		if (n instanceof Piece) {
			if (!this.insidePlayBoard(boardPosition)) {
				return this.createPlayBoardPoints();
			}
			const step = Point.copy(boardPosition);
			const move = (movement, continuous=true) => {
				step.reset();
				if (continuous) {
					while (this.insidePlayBoard(step)) {
						if (!step.equal(boardPosition)) {
							result.push(Point.copy(step));
						}
						movement();
					}
				}
				else {
					movement();
					if (this.insidePlayBoard(step)) {
						result.push(Point.copy(step));
					}
				}
			};
			switch (n.type) {
				case Type.BISHOP: {
					/* SouthEast */ move(() => { ++step.x; --step.y; });
					/* NorthEast */ move(() => { ++step.x; ++step.y; });
					/* NorthWest */ move(() => { --step.x; ++step.y; });
					/* SouthWest */ move(() => { --step.x; --step.y; });
				}
				break;
				case Type.KNIGHT: {
					/* 2 North 1 East */ move(() => { ++step.x; step.y += 2; }, false);
					/* 2 North 1 West */ move(() => { --step.x; step.y += 2; }, false);
					/* 2 East 1 North */ move(() => { step.x += 2; ++step.y; }, false);
					/* 2 East 1 South */ move(() => { step.x += 2; --step.y; }, false);
					/* 2 South 1 East */ move(() => { ++step.x; step.y -= 2; }, false);
					/* 2 South 1 West */ move(() => { --step.x; step.y -= 2; }, false);
					/* 2 West 1 North */ move(() => { step.x -= 2; ++step.y; }, false);
					/* 2 West 1 South */ move(() => { step.x -= 2; --step.y; }, false);
				}
				break;
				case Type.PAWN: {
					switch (n.color) {
						case Color.BLACK: /* 1 North */ move(() => { ++step.y }, false); break;
						case Color.WHITE: /* 1 South */ move(() => { --step.y }, false); break;
					}
				}
				break;
				case Type.ROOK: {
					/* North */ move(() => { ++step.y; });
					/* East  */ move(() => { ++step.x; });
					/* South */ move(() => { --step.y; });
					/* West  */ move(() => { --step.x; });
				}
				break;
			}
		}
		return result;
	},
	createPlayBoardPoints() {
		const result = [];
		for (let i = 0; i < this.size.x; i++) {
			for (let j = 1; j < this.size.y - 1; j++) {
				result.push(new Point(i, j));
			}
		}
		return result;
	},
	insidePlayBoard(boardPosition) {
		return boardPosition.x >= 0 && boardPosition.x < this.size.x && boardPosition.y > 0 && boardPosition.y < this.size.y - 1;
	}
};

console.log(Board.ascii());