const CANVAS = document.querySelector('canvas');
const CTX = CANVAS.getContext('2d');

class GridPoint {
	constructor(c, r) {
		this.c = c;
		this.r = r;
	}
	equal(g) {
		return this.c === g.c && this.r === g.r;
	}
}

const Room = {
	w: CANVAS.width,
	h: CANVAS.height,
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	}
};

const Tile = {
	w: 40,
	h: 20,
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	},
	draw(x, y, outline) {
		CTX.beginPath();
		CTX.moveTo(x, y - this.mid.h);
		CTX.lineTo(x + this.mid.w, y);
		CTX.lineTo(x, y + this.mid.h);
		CTX.lineTo(x - this.mid.w, y);
		CTX.closePath();
		if (outline) {
			CTX.strokeStyle = 'black';
			CTX.stroke();
		}
		else {
			CTX.fillStyle = 'black';
			CTX.fill();
		}
	}
};

const Grid = {
	EMPTY: 'Empty',
	BLOCK: 'Block',
	c: 17,
	r: 18,
	g: [],
	setup() {
		for (let i = 0; i < this.c; i++) {
			this.g.push([]);
			for (let j = 0; j < this.r; j++) {
				this.g[i].push(this.EMPTY);
			}
		}
	},
	getPath(start, goal) {
		const openSet = [start];
		const closedSet = [];
		const fScore = [0];
		const gScore = [0];
		const cameSet = [-1];
		const cameFrom = [];
		const includes = (set, n) => {
			for (const g of set) {
				if (g.equal(n)) {
					return true;
				}
			}
			return false;
		};
		const indexOf = (set, n) => {
			for (const i in set) {
				if (set[i].equal(n)) {
					return +i;
				}
			}
			return -1;
		};
		const push = (g, c, r) => {
			if (this.g[c][r] === this.EMPTY) {
				const n = new GridPoint(c, r);
				if (!includes(closedSet, n)) {
					const h = Math.floor(Math.abs(goal.c - n.c) + Math.abs(goal.r - n.r));
					if (!includes(openSet, n)) {
						fScore.push(g + h);
						gScore.push(g);
						openSet.push(n);
						cameSet.push(closedSet.length - 1);
					}
					else {
						const i = indexOf(openSet, n);
						if ((g + h) < fScore[i]) {
							fScore[i] = g + h;
							gScore[i] = g;
						}
					}
				}
			}
		};
		const reconstruct = (current) => {
			const finalSet = [];
			let i = 0;
			while (i !== -1) {
				finalSet.push(current);
				i = cameFrom[indexOf(closedSet, current)];
				current = closedSet[i];
			}
			return finalSet.reverse();
		};
		while (openSet.length > 0) {
			let iMin = 0;
			for (let i = 1; i < openSet.length; i++) {
				if (fScore[i] <= fScore[iMin]) {
					iMin = i;
				}
			}
			const current = openSet[iMin];
			const g = gScore[iMin] + 10;
			openSet.splice(iMin, 1);
			fScore.splice(iMin, 1);
			gScore.splice(iMin, 1);
			closedSet.push(current);
			cameFrom.push(cameSet[iMin]);
			cameSet.splice(iMin, 1);
			if (current.equal(goal)) {
				return reconstruct(current);
			}
			const Exists = {
				Top: current.r > 0,
				Left: current.c > 0,
				Right: current.c < this.c - 1,
				Bottom: current.r < this.r - 1
			};
			if (Exists.Top) {
				push(g, current.c, current.r - 1);
			}
			if (Exists.Left) {
				push(g, current.c - 1, current.r);
			}
			if (Exists.Right) {
				push(g, current.c + 1, current.r);
			}
			if (Exists.Bottom) {
				push(g, current.c, current.r + 1);
			}
			if (Exists.Top && Exists.Left) {
				push(g + 4, current.c - 1, current.r - 1);
			}
			if (Exists.Top && Exists.Right) {
				push(g + 4, current.c + 1, current.r - 1);
			}
			if (Exists.Bottom && Exists.Left) {
				push(g + 4, current.c - 1, current.r + 1);
			}
			if (Exists.Bottom && Exists.Right) {
				push(g + 4, current.c + 1, current.r + 1);
			}
		}
		return [start];
	}
};

const World = {
	x: 10,
	y: 32,
	getWorld(c, r) {
		return {
			x: Room.mid.w + this.x + (c - r) * Tile.mid.w,
			y: this.y + (c + r) * Tile.mid.h
		};
	}
};

const blocks = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
	[1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1],
	[1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
	[1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
	[1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
	[1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let path = [];

const start = () => {
	Grid.setup();
	for (let i = 0; i < blocks.length; i++) {
		for (let j = 0; j < blocks[i].length; j++) {
			if (blocks[i][j] === 1) {
				Grid.g[j][i] = Grid.BLOCK;
			}
		}
	}
	path = Grid.getPath(new GridPoint(14, 12), new GridPoint(15, 16));
	update();
};

const update = () => {
	CTX.clearRect(0, 0, 320, 640);
	for (let i = 0; i < Grid.c; i++) {
		for (let j = 0; j < Grid.r; j++) {
			const b = World.getWorld(i, j);
			Tile.draw(b.x, b.y, Grid.g[i][j] === Grid.EMPTY);
		}
	}
	for (let i = 0; i < path.length; i++) {
		const p = path[i];
		const b = World.getWorld(p.c, p.r);
		const t = (i + 1) / path.length;
		CTX.fillStyle = `rgba(${t * 255}, ${t * 50}, ${(1 - t) * 255}, ${t * 0.5 + 0.5})`;
		CTX.beginPath();
		CTX.arc(b.x, b.y, 5, 0, 2 * Math.PI);
		CTX.fill();
	}
	CTX.beginPath();
	for (let i = 0; i < path.length; i++) {
		const p = path[i];
		const b = World.getWorld(p.c, p.r);
		if (i === 0) {
			CTX.moveTo(b.x, b.y);
			CTX.lineTo(b.x, b.y);
		}
		else {
			CTX.lineTo(b.x, b.y);
		}
	}
	CTX.strokeStyle = 'orange';
	CTX.stroke();
	window.requestAnimationFrame(update);
};

start();