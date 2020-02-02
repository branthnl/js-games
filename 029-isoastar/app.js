const CTX = document.querySelector('canvas').getContext('2d');

class GridPoint {
	constructor(c, r) {
		this.c = c;
		this.r = r;
	}
	equal(g) {
		return this.c === g.c && this.r === g.r;
	}
}

const Grid = {
	EMPTY: 'Empty',
	BLOCK: 'Block',
	c: 9,
	r: 19,
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
		const includes = (set, n) => {
			for (const g of set) {
				if (g.equal(n)) {
					return true;
				}
			}
			return false;
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
					}
					else {
						const i = openSet.indexOf(n);
						if ((g + h) < fScore[i]) {
							fScore[i] = g + h;
							gScore[i] = g;
						}
					}
				}
			}
		};
		while (openSet.length > 0) {
			let iMin = 0;
			for (let i = 1; i < openSet.length; i++) {
				if (fScore[i] <= fScore[iMin]) {
					iMin = i;
				}
			}
			const current = openSet[iMin];
			const g = gScore[iMin] + 1;
			openSet.splice(iMin, 1);
			fScore.splice(iMin, 1);
			gScore.splice(iMin, 1);
			closedSet.push(current);
			if (current.equal(goal)) {
				return closedSet;
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
		}
		return [start];
	}
};

let path = [];

const start = () => {
	Grid.setup();
	path = Grid.getPath(new GridPoint(0, 0), new GridPoint(Grid.c - 1, Grid.r - 1));
	update();
};

const update = () => {
	CTX.lineWidth = 1;
	CTX.strokeStyle = 'black';
	CTX.clearRect(0, 0, 320, 640);
	for (let i = 0; i < Grid.c; i++) {
		for (let j = 0; j < Grid.r; j++) {
			CTX.beginPath();
			CTX.rect(16 + i * 32, 16 + j * 32, 32, 32);
			CTX.stroke();
		}
	}
	CTX.lineWidth = 10;
	CTX.strokeStyle = 'purple';
	CTX.beginPath();
	for (let i = 0; i < path.length; i++) {
		const p = path[i];
		if (i === 0) {
			CTX.moveTo(16 + p.c * 32 + 16, 16 + p.r * 32 + 16);
			CTX.lineTo(16 + p.c * 32 + 16, 16 + p.r * 32 + 16);
		}
		else {
			CTX.lineTo(16 + p.c * 32 + 16, 16 + p.r * 32 + 16);
		}
	}
	CTX.stroke();
	window.requestAnimationFrame(update);
};

start();