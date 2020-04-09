const TC = {};
TC.Board = {
	boardArray: ["", "", "", "", "", "", "", "", ""],
	ascii() {
		return  this.horAscii().join("\n");
	},
	horAscii() {
		const h = ["", "", ""];
		for (let i = 0; i < 3; ++i) {
			for (let j = 0; j < 3; ++j) {
				h[i] += this.boardArray[3 * i + j] || ".";
			}
		}
		return h;
	},
	verAscii() {
		const h = ["", "", ""];
		for (let i = 0; i < 3; ++i) {
			for (let j = 0; j < 3; ++j) {
				h[i] += this.boardArray[i + j * 3] || ".";
			}
		}
		return h;
	},
	diagAscii() {
		const b = this.boardArray;
		const h = [`${b[0]}${b[4]}${b[8]}`, `${b[2]}${b[4]}${b[6]}`];
		return h;
	},
	checkFtw(b=this.boardArray) {
		const h = ["", "", "", "", "", ""];
		for (let i = 0; i < 3; ++i) {
			for (let j = 0; j < 3; ++j) {
				h[i] += b[3 * i + j] || ".";
				h[i + 3] += b[i + j * 3] || ".";
			}
		}
		h.push(`${b[0]}${b[4]}${b[8]}`, `${b[2]}${b[4]}${b[6]}`);
		return h.includes("OOO")? "O" : (h.includes("XXX")? "X" : ".");
	}
};
TC.Game = {
	player: "O",
	start() {
		this.move();
	},
	move() {
		const i = this.minimax(this.player);
		console.log(i);
		TC.Board.boardArray[i] = this.player;
		this.player = this.player === "O"? "X" : "O";
		console.log(TC.Board.ascii());
	},
	minimax(player) {
		const h = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		for (let i = 0; i < 9; ++i) {
			const b = TC.Board.boardArray.slice();
			if (b[i].player === ".") {
				b[i] = player;
				const j = TC.Board.checkFtw(b);
				if (j === player) {
					h[i] += 2;
				}
				else if (j !== ".") {
					h[i] += 1;
				}
			}
		}
		let k = -1;
		let l = -Infinity;
		for (let i = 0; i < 9; ++i) {
			if (h[i] >= l) {
				k = i;
				l = h[i];
			}
		}
		return k;
	}
};