const TIC = {};

TIC.WHITE_TOKEN = "WHITE";
TIC.BLACK_TOKEN = "BLACK";
TIC.GAME_OVER_TOKEN = "GAME_OVER";
TIC.GAME_START_TOKEN = "GAME_START";

TIC.turn = 0;
TIC.state = TIC.GAME_START_TOKEN;

TIC.reset = () => {
	TIC.turn = 0;
	TIC.state = TIC.GAME_START_TOKEN;
};

TIC.stateIsGame = () => TIC.state === TIC.WHITE_TOKEN || TIC.state === TIC.BLACK_TOKEN;

TIC.PAWN_W = 0;
TIC.ROOK_W = 1;
TIC.KNIGHT_W = 2;
TIC.BISHOP_W = 3;

TIC.PAWN_B = 4;
TIC.ROOK_B = 5;
TIC.KNIGHT_B = 6;
TIC.BISHOP_B = 7;

TIC.Board = [
	[-1, -1, -1, -1],
	[-1, -1, -1, -1],
	[-1, -1, -1, -1],
	[-1, -1, -1, -1]
];

TIC.OutBoard = [
	[4, 5, 6, 7],
	[0, 1, 2, 3]
];

TIC.BOARD_COUNT = 4;

TIC.BOARD_SIZE = 75;
TIC.BOARD_OFFSET_X = 37.5;
TIC.BOARD_OFFSET_Y = 150;

TIC.toBoard = (screenPosition) => {
	return {
		x: Math.floor((screenPosition.x - TIC.BOARD_OFFSET_X) / TIC.BOARD_SIZE),
		y: Math.floor((screenPosition.y - TIC.BOARD_OFFSET_Y) / TIC.BOARD_SIZE)
	};
};

TIC.toScreen = (boardPosition) => {
	return {
		x: TIC.BOARD_OFFSET_X + TIC.BOARD_SIZE * boardPosition.x,
		y: TIC.BOARD_OFFSET_Y + TIC.BOARD_SIZE * boardPosition.y
	};
};

TIC.Cursor = new Vector2(0, 0);

Draw.board = () => {
	for (let i = 0; i < TIC.BOARD_COUNT; i++) {
		for (let j = 0; j < TIC.BOARD_COUNT; j++) {
			const b = TIC.toScreen(new Vector2(i + 0.5, j + 0.5));
			Draw.strip("Pieces", TIC.Board[i][j], b.x, b.y);
		}
	}
};

Draw.outBoard = () => {
	for (let i = 0; i < TIC.BOARD_COUNT; i++) {
		let topPiece = TIC.toScreen(new Vector2(i + 0.5, -0.5));
		Draw.strip("Pieces", TIC.OutBoard[0][i], topPiece.x, topPiece.y);
		let bottomPiece = TIC.toScreen(new Vector2(i + 0.5, TIC.BOARD_COUNT + 0.5));
		Draw.strip("Pieces", TIC.OutBoard[1][i], bottomPiece.x, bottomPiece.y);
	}
};

TIC.insideBoard = (p) => {
	const b = {
		x: TIC.BOARD_OFFSET_X,
		y: TIC.BOARD_OFFSET_Y,
		w: TIC.BOARD_COUNT * TIC.BOARD_SIZE,
		h: TIC.BOARD_COUNT * TIC.BOARD_SIZE
	};
	return p.x > b.x && p.x < b.x + b.w && p.y > b.y && p.y < b.y + b.h;
};

TIC.insideAllBoard = (p) => {
	const b = {
		x: TIC.BOARD_OFFSET_X,
		y: TIC.BOARD_OFFSET_Y - TIC.BOARD_SIZE,
		w: TIC.BOARD_COUNT * TIC.BOARD_SIZE,
		h: (TIC.BOARD_COUNT + 2) * TIC.BOARD_SIZE
	};
	return p.x > b.x && p.x < b.x + b.w && p.y > b.y && p.y < b.y + b.h;
};

TIC.setOnAllBoard = (boardPosition, value) => {
	if (boardPosition.y === -1) {
		TIC.OutBoard[0][boardPosition.x] = value;
	}
	else if (boardPosition.y === TIC.BOARD_COUNT) {
		TIC.OutBoard[1][boardPosition.x] = value;
	}
	else {
		TIC.Board[boardPosition.x][boardPosition.y] = value;
	}
};

TIC.getHoveredData = () => {
	if (TIC.Cursor.y === -1) {
		return TIC.OutBoard[0][TIC.Cursor.x];
	}
	if (TIC.Cursor.y === TIC.BOARD_COUNT) {
		return TIC.OutBoard[1][TIC.Cursor.x];
	}
	return TIC.Board[TIC.Cursor.x][TIC.Cursor.y];
};

Draw.cursor = () => {
	let b = TIC.toBoard(Input.mousePosition);
	TIC.Cursor.x = Math.clamp(b.x, 0, TIC.BOARD_COUNT - 1);
	TIC.Cursor.y = Math.clamp(b.y, -1, TIC.BOARD_COUNT);
	b = TIC.toScreen(TIC.Cursor);
	Draw.setColor("rgba(255, 255, 0, 0.2)");
	Draw.rect(b.x, b.y, TIC.BOARD_SIZE, TIC.BOARD_SIZE);
};

const Boot = new BranthRoom("Boot");
Boot.start = () => {
	Draw.add(Vector2.center, "Board", "src/img/Board.png");
	Draw.addStrip(Vector2.center, "Pieces", "src/img/Pieces_strip8.png", 8);
	Room.start("Game");
};

TIC.Drag = {
	item: -1,
	startX: 0,
	startY: 0,
	setStartPosition(boardPosition) {
		this.startX = boardPosition.x;
		this.startY = boardPosition.y;
	},
	getStartPosition() {
		return new Vector2(this.startX, this.startY);
	}
};

TIC.isAuthorize = (item, from, to) => {
	return true;
};

TIC.getCurrentStateColor = () => TIC.state === TIC.WHITE_TOKEN? 0 : 1;

TIC.getEmptyOutBoardPosition = (outBoardIndex) => {
	const emptyIndexes = [];
	for (let i = 0; i < TIC.BOARD_COUNT; i++) {
		if (TIC.OutBoard[outBoardIndex][i] === -1) {
			emptyIndexes.push(i);
		}
	}
	const x = Math.pick(emptyIndexes);
	const y = outBoardIndex === 0? -1 : TIC.BOARD_COUNT;
	console.log(x,y);
	return new Vector2(x, y);
};

Draw.ui = () => {
	let bottomText = "";
	// Game logic
	if (TIC.stateIsGame()) {
		if (Input.mouseDown(0)) {
			if (TIC.insideAllBoard(Input.mousePosition)) {
				const b = TIC.getHoveredData();
				if (b !== -1) {
					if (TIC.getColor(b) === TIC.getCurrentStateColor()) {
						TIC.Drag.setStartPosition(TIC.Cursor);
						TIC.Drag.item = b;
						TIC.setOnAllBoard(TIC.Cursor, -1);
					}
					else {
						// Try to move the other color
					}
				}
			}
			else {
				// Mouse outside board!
			}
		}
		if (TIC.Drag.item !== -1) {
			Draw.strip(
				"Pieces",
				TIC.Drag.item,
				Input.mousePosition.x,
				Input.mousePosition.y
			);
		}
		if (Input.mouseUp(0)) {
			if (TIC.Drag.item !== -1) {
				let count = 0;
				if (TIC.insideBoard(Input.mousePosition)) {
					// Move Logic
					const movementIsAuthorize = TIC.isAuthorize(TIC.Drag.item, TIC.Drag.getStartPosition(), TIC.Cursor);
					if (movementIsAuthorize) {
						const b = TIC.getHoveredData();
						// If the hovered position already has a piece
						if (b !== -1) {
							if (!TIC.isSameColor(TIC.Drag.item, b)) {
								// Capture Logic
								const outBoardIndex = 1 - TIC.getColor(b);
								TIC.setOnAllBoard(TIC.getEmptyOutBoardPosition(outBoardIndex), b);
							}
							else {
								// Try to capture same color
								count++;
							}
						}
						if (count === 0) {
							TIC.Board[TIC.Cursor.x][TIC.Cursor.y] = TIC.Drag.item;
							TIC.state = TIC.state === TIC.WHITE_TOKEN? TIC.BLACK_TOKEN : TIC.WHITE_TOKEN;
						}
					}
					else {
						// Movement not authorized
						count++;
					}
				}
				else {
					// Mouse outside board
					count++;
				}
				if (count > 0) {
					TIC.setOnAllBoard(TIC.Drag.getStartPosition(), TIC.Drag.item);
				}
				TIC.Drag.item = -1;
			}
		}
	}
	// Game state logic
	switch (TIC.state) {
		case TIC.WHITE_TOKEN:
			bottomText = "WHITE TURN";
			break;
		case TIC.BLACK_TOKEN:
			bottomText = "BLACK TURN";
			break;
		case TIC.GAME_OVER_TOKEN:
			bottomText = "Click anywhere to restart";
			break;
		case TIC.GAME_START_TOKEN:
			if (Input.mouseDown(0)) {
				TIC.state = TIC.WHITE_TOKEN;
			}
			bottomText = "Click anywhere to start";
			break;
	}
	Draw.setFont(Font.m, Font.bold);
	Draw.setColor(C.black);
	Draw.setHVAlign(Align.c, Align.b);
	Draw.text(Room.mid.w, Room.h - 12, bottomText);
};

TIC.isSameColor = (a, b) => {
	return ~~(a / 4) === ~~(b / 4);
};

TIC.getColor = (p) => Math.floor(p / 4);

const Game = new BranthRoom("Game");
Game.render = () => {
	Draw.image("Board", Room.mid.w, Room.mid.h);
	if (TIC.stateIsGame()) Draw.cursor();
	Draw.outBoard();
	Draw.board();
	Draw.ui();
	// Game logic is in Draw.ui();
};

Room.add(Boot);
Room.add(Game);

Room.start("Boot");
BRANTH.start(375, 600);