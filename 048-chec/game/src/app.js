class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const Piece = {
    BISHOP: "B",
    KNIGHT: "K",
    NULL: ".",
    PAWN: "P",
    ROOK: "R"
};

const Board = {
    boardWidth: 6,
    boardHeight: 4,
    boardArray: [
        [Piece.BISHOP, Piece.NULL, Piece.NULL, Piece.NULL, Piece.NULL, Piece.BISHOP],
        [Piece.KNIGHT, Piece.NULL, Piece.NULL, Piece.NULL, Piece.NULL, Piece.KNIGHT],
        [Piece.PAWN, Piece.NULL, Piece.NULL, Piece.NULL, Piece.NULL, Piece.PAWN],
        [Piece.ROOK, Piece.NULL, Piece.NULL, Piece.NULL, Piece.NULL, Piece.ROOK]
    ],
    /**
     * Returns boardArray in string model
     */
    ascii() {
        let message = "";
        for (let i = 0; i < this.boardArray.length; i++) {
            for (let j = 0; j < this.boardArray[i].length; j++) {
                message += this.boardArray[i][j];
            }
            if (i < this.boardArray.length - 1) message += "\n";
        }
        return message;
    },
    /**
     * Returns the piece from boardArray on specified position
     * @param {Number} x x-index of the piece on board
     * @param {Number} y y-index of the piece on board
     */
    getPiece(x, y) {
        return this.boardArray[x][y];
    },
    /**
     * Returns an array contains all possible position to move for the piece at specified location
     * @param {Number} x x-index of the piece on board
     * @param {Number} y y-index of the piece on board
     */
    getAllowedMovement(x, y) {
        const moves = [];
        const piece = this.getPiece(x, y);
        if (this.isPieceHasMovement(piece)) {
            switch (piece) {
                case Piece.BISHOP:
                    // 2 North 1 East
                    let targetLocation = new Point(x + 1, y - 2);
                    if (this.isInside(p.x, p.y)) {
                        const targetPiece = this.getPiece(p.x, p.y);
                        if (this.isPieceHasMovement(targetPiece)) {
                        }
                        moves.push(targetLocation);
                    }
                    // 2 North 1 West
                    p = new Point(x - 1, y - 2);
                    if (this.isInside(p.x, p.y)) moves.push(p);
                    // 2 East 1 North
                    p = new Point(x + 2, y - 1);
                    if (this.isInside(p.x, p.y)) moves.push(p);
                    // 2 East 1 South
                    p = new Point(x + 2, y + 1);
                    if (this.isInside(p.x, p.y)) moves.push(p);
                    // 2 South 1 East
                    p = new Point(x + 1, y + 2);
                    if (this.isInside(p.x, p.y)) moves.push(p);
                    // 2 North 1 West
                    p = new Point(x - 1, y + 2);
                    if (this.isInside(p.x, p.y)) moves.push(p);
                    // 2 West 1 North
                    p = new Point(x - 2, y - 1);
                    if (this.isInside(p.x, p.y)) moves.push(p);
                    // 2 West 1 South
                    p = new Point(x - 2, y + 1);
                    if (this.isInside(p.x, p.y)) moves.push(p);
                    break;
                case Piece.KNIGHT: break;
                case Piece.PAWN: break;
                case Piece.ROOK: break;
            }
        }
        else {
            console.log(`No movement avaiable at piece (${x}, ${y})`);
        }
        return moves;
    },
    /**
     * Returns true if the given position is inside the board
     * @param {Number} x 
     * @param {Number} y 
     */
    isInside(x, y) {
        return x >= 0 && x < this.boardWidth && y >= 0 && y < this.boardHeight;
    },
    /**
     * Returns true if piece is one of the pieces that has movement
     * @param {String} piece 
     */
    isPieceHasMovement(piece) {
        switch (piece) {
            case Piece.BISHOP:
            case Piece.KNIGHT:
            case Piece.PAWN:
            case Piece.ROOK: return true;
        }
        return false;
    }
};

console.log("FORGET COLOR");
// FORGET COLOR