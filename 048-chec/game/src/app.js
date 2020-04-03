const Type = {
	PAWN: "P",
	ROOK: "R",
	KNIGHT: "K",
	BISHOP: "B"
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
	set(p) {
		this.x = p.x;
		this.y = p.y;
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
	getImageIndex() {
		return Object.values(Type).indexOf(this.type) + 4 * (this.color === Color.BLACK);
	}
	getCode() {
		return `${this.type}${this.color}`;
	}
	static Create(code) {
		const type = code[0];
		const color = code[1];
		return new Piece(type, color);
	}
}

const Board = {
	boardArray: [],
	size: new Point(4, 6),
	setup() {
		this.boardArray.length = 0;
		this.boardArray = [
			[Piece.Create("BW"), null, null, null, null, Piece.Create("BB")],
			[Piece.Create("PW"), null, null, null, null, Piece.Create("PB")],
			[Piece.Create("KW"), null, null, null, null, Piece.Create("KB")],
			[Piece.Create("RW"), null, null, null, null, Piece.Create("RB")]
		];
	},
	ascii() {
		let result = "  | 0 1 2 3 |\n---------------";
		for (let y = this.size.y - 1; y >= 0; y--) {
			result += `\n${y} | `;
			for (let x = 0; x < this.size.x; x++) {
				const p = this.boardArray[x][y];
				if (p instanceof Piece) {
					result += `${p.type} `;
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
	getGameAsciiHorizontally() {
		let result = "";
		for (let y = this.size.y - 2; y > 0; --y) {
			if (y < this.size.y - 2) result += "\n";
			for (let x = 0; x < this.size.x; ++x) {
				const p = this.boardArray[x][y];
				result += p instanceof Piece? p.color : ".";
			}
		}
		return result;
	},
	getGameAsciiVertically() {
		let result = "";
		for (let x = 0; x < this.size.x; ++x) {
			if (x > 0) result += "\n";
			for (let y = this.size.y - 2; y > 0; --y) {
				const p = this.boardArray[x][y];
				result += p instanceof Piece? p.color : ".";
			}
		}
		return result;
	},
	get2DiagonalGameAscii() {
		let result = "";
		let i = 0;
		const y = [1, 2, 3, 4, 4, 3, 2, 1];
		while (i < y.length) {
			for (let x = 0; x < this.size.x; ++x) {
				const p = this.boardArray[x][y[i++]];
				result += p instanceof Piece? p.color : ".";
			}
			if (i < y.length - 1) result += "\n";
		}
		return result;
	},
	get(boardPosition) {
		return this.boardArray[boardPosition.x][boardPosition.y];
	},
	set(boardPosition, value) {
		this.boardArray[boardPosition.x][boardPosition.y] = value;
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
				return this.getEmptyPlayBoardPoints();
			}
			const step = Point.copy(boardPosition);
			const prevStep = Point.copy(step);
			const check = () => {
				if (this.insidePlayBoard(step)) {
					const prevBb = this.get(prevStep);
					if (prevBb instanceof Piece) {
						if (prevBb.color !== n.color) {
							return false;
						}
					}
					const bb = this.get(step);
					if (bb instanceof Piece) {
						// If board position not empty
						if (bb.color !== n.color) {
							if (n.type === Type.PAWN) {
								if (step.x === boardPosition.x) {
									return false;
								}
							}
							return true;
						}
						return false;
					}
					if (n.type === Type.PAWN) {
						if (step.x !== boardPosition.x) {
							return false;
						}
					}
					return true;
				}
				return false;
			};
			const move = (movement, continuous=true) => {
				step.reset();
				if (continuous) {
					prevStep.set(step);
					movement();
					while (check()) {
						result.push(Point.copy(step));
						prevStep.set(step);
						movement();
					}
				}
				else {
					prevStep.set(step);
					movement();
					if (check()) {
						result.push(Point.copy(step));
					}
				}
			};
			switch (n.type) {
				case Type.PAWN: {
					switch (n.color) {
						case Color.BLACK:
							/* 1 South */ move(() => { --step.y }, false);
							/* 1 SouthEast */ move(() => { ++step.x; --step.y; }, false);
							/* 1 SouthWest */ move(() => { --step.x; --step.y; }, false);
							break;
						case Color.WHITE:
							/* 1 North */ move(() => { ++step.y }, false);
							/* 1 NorthEast */ move(() => { ++step.x; ++step.y; }, false);
							/* 1 NorthWest */ move(() => { --step.x; ++step.y; }, false);
							break;
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
				case Type.BISHOP: {
					/* SouthEast */ move(() => { ++step.x; --step.y; });
					/* NorthEast */ move(() => { ++step.x; ++step.y; });
					/* NorthWest */ move(() => { --step.x; ++step.y; });
					/* SouthWest */ move(() => { --step.x; --step.y; });
				}
				break;
			}
		}
		return result;
	},
	getEmptyPlayBoardPoints() {
		const result = [];
		for (let i = 0; i < this.size.x; i++) {
			for (let j = 1; j < this.size.y - 1; j++) {
				const k = this.boardArray[i][j];
				if (!(k instanceof Piece)) {
					result.push(new Point(i, j));
				}
			}
		}
		return result;
	},
	getEmptyOutBoardPoints() {
		const result = [[], []];
		let i = 0;
		for (let y = this.size.y - 1; y >= 0; y -= this.size.y - 1) {
			for (let x = 0; x < this.size.x; x++) {
				const k = this.boardArray[x][y];
				if (!(k instanceof Piece)) {
					result[i].push(new Point(x, y));
				}
			}
			i++;
		}
		return result;
	},
	insidePlayBoard(boardPosition) {
		return boardPosition.x >= 0 && boardPosition.x < this.size.x && boardPosition.y > 0 && boardPosition.y < this.size.y - 1;
	}
};

const Time = {
	time: 0,
	lastTime: 0,
	deltaTime: 0,
	update(t) {
		this.lastTime = this.time;
		this.time = t;
		this.deltaTime = this.time - this.lastTime;
	}
};

const Font = {
	s: "10px Maven Pro, sans-serif",
	m: "16px Maven Pro, sans-serif",
	l: "24px Maven Pro, sans-serif",
	xl: "36px Maven Pro, sans-serif",
	xxl: "48px Maven Pro, sans-serif"
};

const Align = {
	l: "left",
	r: "right",
	c: "center",
	t: "top",
	b: "bottom",
	m: "middle"
};

const Room = {
	size: new Point(376, 600),
	board: {
		offset: new Point(0, 0)
	}
};

class BoardTiles {
	constructor(x, y, w, h, boardPosition) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.boardPosition = boardPosition;
	}
	isHovered(m=Input.mousePosition) {
		return m.x > this.x && m.x < this.x + this.w && m.y > this.y && m.y < this.y + this.h;
	}
	draw() {
		Draw.rect(this.x, this.y, this.w, this.h);
	}
}

const Tile = {
	size: 75,
	boardTiles: [],
	isHighlighted(boardPosition) {
		for (let i = Game.highlightedBoardPositions.length - 1; i >= 0; i--) {
			if (Game.highlightedBoardPositions[i].equal(boardPosition)) {
				return true;
			}
		}
		return false;
	}
};

const Canvas = document.createElement("canvas");

const C = {
	black: "black",
	grey: "grey",
	white: "white"
};

const Draw = {
	list: {},
	ctx: Canvas.getContext("2d"),
	addBitmap(key, width, height, drawingFunction) {
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		this.setCtx(canvas.getContext("2d"));
		drawingFunction();
		this.resetCtx();
		this.list[key] = canvas;
	},
	addImage(key, url) {
		const img = new Image();
		img.src = url;
		this.list[key] = img;
	},
	setCtx(ctx) {
		this.ctx = ctx;
	},
	resetCtx() {
		this.ctx = Canvas.getContext("2d");
	},
	setColor(c) {
		this.ctx.fillStyle = c;
		this.ctx.strokeStyle = c;
	},
	draw(outline=false) {
		if (outline) this.ctx.stroke();
		else this.ctx.fill();
	},
	rect(x, y, w, h, outline=false) {
		this.ctx.beginPath();
		this.ctx.rect(x, y, w, h);
		this.draw(outline);
	},
	circle(x, y, r, outline=false) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, 2 * Math.PI);
		this.draw(outline);
	},
	image(img, x, y) {
		this.ctx.drawImage(img, x, y);
	},
	/**
	 * Split image by stripAmount and draw the imageIndex-th image
	 */
	imageStrip(img, stripAmount, imageIndex, x, y) {
		const s = {
			w: img.width / stripAmount,
			h: img.height
		};
		this.ctx.drawImage(img, s.w * imageIndex, 0, s.w, s.h, x, y, s.w, s.h);
	},
	imageWithAnchor(img, x, y, anchorX, anchorY) {
		this.ctx.drawImage(img, x - img.width * anchorX, y - img.height * anchorY);
	},
	setFont(font) {
		this.ctx.font = font;
	},
	setHVAlign(h, v) {
		this.ctx.textAlign = h;
		this.ctx.textBaseline = v;
	},
	text(x, y, text) {
		this.ctx.fillText(text, x, y);
	},
	clear() {
		this.ctx.clearRect(0, 0, Room.size.x, Room.size.y);
	}
};

class MyInputClass {
	constructor(key) {
		this.key = key;
		this.held = false;
		this.pressed = false;
		this.released = false;
	}
	up() {
		this.held = false;
		this.released = true;
	}
	down() {
		this.held = true;
		this.pressed = true;
	}
	reset() {
		this.pressed = false;
		this.released = false;
	}
}

const Input = {
	Mouse: [],
	mousePosition: new Point(0, 0),
	getX() {
		return this.mousePosition.x;
	},
	getY() {
		return this.mousePosition.y;
	},
	getMouseText() {
		return `(${Math.floor(Input.mousePosition.x)}, ${Math.floor(Input.mousePosition.y)})`;
	},
	setup() {
		for (let i = 0; i < 3; i++) {
			this.Mouse[i] = new MyInputClass(i);
		}
	},
	reset() {
		for (let i = 0; i < 3; i++) {
			this.Mouse[i].reset();
		}
	},
	mouseUp(button) {
		return this.Mouse[button].released;
	},
	mouseDown(button) {
		return this.Mouse[button].pressed;
	},
	mouseHold(button) {
		return this.Mouse[button].held;
	},
	mouseUpEvent(e) {
		Input.Mouse[e.button].up();
	},
	mouseDownEvent(e) {
		const b = Input.Mouse[e.button];
		if (!b.held) b.down();
	},
	mouseMoveEvent(e) {
		const b = Canvas.getBoundingClientRect();
		Input.mousePosition.x = e.clientX - b.left;
		Input.mousePosition.y = e.clientY - b.top;
	}
};

const State = {
	WHITE: "WHITE",
	BLACK: "BLACK",
	GAME_MENU: "GAME_MENU",
	GAME_OVER: "GAME_OVER"
};

const Game = {
	turn: 0,
	state: State.GAME_MENU,
	gameOverState: "",
	pieceOnHighlight: null,
	positionOnHighlight: new Point(0, 0),
	highlightedBoardPositions: [],
	restart() {
		Board.setup();
		this.turn = 0;
		this.state = State.WHITE;
		this.gameOverState = "";
		this.pieceOnHighlight = null;
		this.positionOnHighlight.reset();
		this.highlightedBoardPositions.length = 0;
	},
	nextTurn() {
		if (this.state === State.BLACK) {
			this.state = State.WHITE;
			this.turn++;
		}
		else if (this.state === State.WHITE) {
			this.state = State.BLACK;
			this.turn++;
		}
	},
	getStateIndex() {
		return Object.values(State).indexOf(this.state);
	},
	getStateColor() {
		return ["W", "B"][this.getStateIndex()];
	},
	isTheFirst6Turn() {
		return this.turn < 6;
	},
	checkGameOver() {
		const horGameAscii = Board.getGameAsciiHorizontally().split("\n");
		const verGameAscii = Board.getGameAsciiVertically().split("\n");
		const diagGameAscii = Board.get2DiagonalGameAscii().split("\n");
		// Horizontal check
		if (horGameAscii.includes("WWWW")) {
			this.gameOverState = "WHITE WON!";
		}
		else if (horGameAscii.includes("BBBB")) {
			this.gameOverState = "BLACK WON!";
		}
		// Vertical check
		else if (verGameAscii.includes("WWWW")) {
			this.gameOverState = "WHITE WON!";
		}
		else if (verGameAscii.includes("BBBB")) {
			this.gameOverState = "BLACK WON!";
		}
		// Diagonal check
		else if (diagGameAscii.includes("WWWW")) {
			this.gameOverState = "WHITE WON!";
		}
		else if (diagGameAscii.includes("BBBB")) {
			this.gameOverState = "BLACK WON!";
		}
		return this.gameOverState !== "";
	},
	INGAME_UPDATE() {
		// Draw highlight
		for (let i = Tile.boardTiles.length - 1; i >= 0; i--) {
			const b = Tile.boardTiles[i];
			const h = b.isHovered();
			if (Tile.isHighlighted(b.boardPosition)) {
				let capturing = false;
				const bb = Board.get(b.boardPosition);
				if (bb instanceof Piece) {
					if (bb.color !== this.getStateColor()) {
						capturing = true;
					}
				}
				if (capturing) Draw.setColor("rgb(255, 40, 40)");
				else Draw.setColor("rgba(100, 100, 255, 0.7)");
				b.draw();
				if (h) {
					if (Input.mouseDown(0)) {
						if (this.pieceOnHighlight instanceof Piece) {
							if (capturing) {
								Board.set(Board.getEmptyOutBoardPoints()[this.getStateIndex()][0], bb);
							}
							Board.set(b.boardPosition, Piece.Create(this.pieceOnHighlight.getCode()));
							Board.set(this.positionOnHighlight, null);
							if (this.checkGameOver()) {
								this.state = State.GAME_OVER;
							}
							else {
								this.nextTurn();
							}
						}
					}
				}
			}
			if (h) {
				Draw.setColor("rgba(255, 255, 0, 0.5)");
				b.draw();
				if (Input.mouseDown(0)) {
					this.pieceOnHighlight = Board.get(b.boardPosition);
					if (this.pieceOnHighlight instanceof Piece) {
						if (this.pieceOnHighlight.color === this.getStateColor()) {
							let count = 0;
							if (this.isTheFirst6Turn()) {
								if (Board.insidePlayBoard(b.boardPosition)) {
									++count;
								}
							}
							if (count === 0) {
								this.positionOnHighlight = b.boardPosition;
								this.highlightedBoardPositions = Board.open(b.boardPosition);
							}
						}
						else {
							this.pieceOnHighlight = null;
							this.highlightedBoardPositions.length = 0;
						}
					}
				}
			}
		}
		this.drawPieces();
		// Set ui
		if (this.isTheFirst6Turn()) {
			UI.bottomText = `Put 3 ${this.state} piece on board (${~~(this.turn / 2)}/3)`;
		}
		else {
			UI.bottomText = `${this.state} turn`;
		}
	},
	drawPieces() {
		// Draw pieces from board
		for (let x = 0; x < Board.size.x; x++) {
			for (let y = 0; y < Board.size.y; y++) {
				const k = Board.boardArray[x][y];
				if (k instanceof Piece) {
					Draw.imageStrip(Draw.list["Piece"], 8, k.getImageIndex(), Room.board.offset.x + Tile.size * x, Room.board.offset.y - Tile.size * (y + 1));
				}
			}
		}
	}
};

const UI = {
	bottomText: ""
};

const GameStart = () => {
	Board.setup();
	Input.setup();
	window.addEventListener("mouseup", Input.mouseUpEvent);
	window.addEventListener("mousedown", Input.mouseDownEvent);
	window.addEventListener("mousemove", Input.mouseMoveEvent);
	const Css = document.createElement("style");
	Css.innerHTML = `
		* {
			margin: 0;
			padding: 0;
		}
		canvas {
			width: ${Room.size.x}px;
			height: ${Room.size.y}px;
			background-color: lightgrey;
		}
	`;
	Canvas.width = Room.size.x;
	Canvas.height = Room.size.y;
	document.head.appendChild(Css);
	document.body.appendChild(Canvas);
	Draw.addBitmap(
		"Board",
		Tile.size * Board.size.x,
		Tile.size * Board.size.y,
		() => {
			const s = Tile.size;
			for (let y = Board.size.y - 1; y >= 0; y--) {
				for (let x = 0; x < Board.size.x; x++) {
					if (y === 0 || y === Board.size.y - 1) {
						Draw.setColor(C.grey);
						Draw.circle(s * (x + 0.5), s * (y + 0.5), s * 0.4);
					}
					else {
						Draw.setColor(y % 2 === 0? (x % 2 === 0? C.white : C.black) : (x % 2 === 0? C.black : C.white));
						Draw.rect(s * x, s * y, s, s);
					}
				}
			}
		}
	);
	Room.board.offset.x = Room.size.x * 0.5 - Draw.list["Board"].width * 0.5;
	Room.board.offset.y = Room.size.y * 0.5 + Draw.list["Board"].height * 0.5;
	for (let x = 0; x < Board.size.x; x++) {
		for (let y = 0; y < Board.size.y; y++) {
			Tile.boardTiles.push(new BoardTiles(
				Room.board.offset.x + Tile.size * x,
				Room.board.offset.y - Tile.size * (y + 1),
				Tile.size,
				Tile.size,
				new Point(x, y)
			));
		}
	}
	Draw.addImage("Piece", "src/img/Pieces_strip8.png");
	GameUpdate(0);
};

const GameUpdate = (t) => {
	Time.update(t);
	Draw.clear();
	// Draw empty board
	Draw.imageWithAnchor(Draw.list["Board"], Room.size.x * 0.5, Room.size.y * 0.5, 0.5, 0.5);
	UI.bottomText = "";
	switch (Game.state) {
		case State.WHITE:
		case State.BLACK:
			Game.INGAME_UPDATE();
		break;
		case State.GAME_MENU: {
			if (Input.mouseDown(0)) {
				Game.restart();
			}
			UI.bottomText = "Click anywhere to start";
		}
		break;
		case State.GAME_OVER: {
			Game.drawPieces();
			if (Input.mouseDown(0)) {
				Game.restart();
			}
			const h = 90;
			Draw.setColor("rgba(0, 0, 0, 0.8)");
			Draw.rect(0, Room.size.y * 0.5 - h * 0.5, Room.size.x, h);
			Draw.setFont(Font.xxl);
			Draw.setColor("rgba(255, 255, 0, 1)");
			Draw.setHVAlign(Align.c, Align.m);
			Draw.text(Room.size.x * 0.5, Room.size.y * 0.5, Game.gameOverState);
			UI.bottomText = "Click anywhere to restart";
		}
		break;
	}
	Draw.setFont(Font.l);
	Draw.setColor(C.grey);
	Draw.setHVAlign(Align.c, Align.m);
	Draw.text(Room.size.x * 0.5, Tile.size * 0.5, "TIC TAC CHEC");

	Draw.setFont(Font.m);
	Draw.setHVAlign(Align.c, Align.b);
	Draw.setColor(C.black);
	Draw.text(Room.size.x * 0.5, Room.size.y - Tile.size * 0.5, UI.bottomText);

	Draw.setFont(Font.s);
	Draw.setColor(C.grey);
	Draw.text(Room.size.x * 0.5, Room.size.y - 7, "Sotsoult 2020");

	Input.reset();
	window.requestAnimationFrame(GameUpdate);
};

GameStart();
console.log(Board.ascii());