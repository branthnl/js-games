const Tile = {
	w: 40,
	h: 20,
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	}
};

const Grid = {
	EMPTY: 'EMPTY',
	BLOCK: 'BLOCK',
	c: 18,
	r: 18,
	g: [],
	getPath(start, goal) {
		let current = start;
		const openSet = [start];
		const closedSet = [];
		const fScore = [0];
		const gScore = [0];
		const hScore = [0];
		while (openSet.length > 0) {
			let iMin = 0;
			for (let i = openSet.length - 1; i > 0; i--) {
				if (fScore[i] < fScore[iMin]) {
					iMin = i;
				}
			}
			current = openSet[iMin];
			const g = hScore[iMin] + 1;
			openSet.splice(iMin, 1);
			fScore.splice(iMin, 1);
			gScore.splice(iMin, 1);
			hScore.splice(iMin, 1);
			closedSet.push(current);
			if (current.equal(goal)) {
				return closedSet;
			}
			const neighbours = [];
			const push = (n) => {
				neighbours.push(n);
				if (!closedSet.includes(n)) {
					const h = Math.floor(Math.abs(n.c - goal.c) + Math.abs(n.r - goal.r));
					if (!openSet.includes(n)) {
						fScore.push(g + h);
						gScore.push(g);
						hScore.push(h);
						openSet.push(n);
					}
					else {
						const iN = openSet.indexOf(n);
						if ((g + h) < fScore[iN]) {
							fScore[iN] = f;
							gScore[iN] = g;
							hScore[iN] = h;
						}
					}
				}
			};
			if (current.c > 0) {
				push(new GridPoint(current.c - 1, current.r));
			}
			if (current.c < Grid.c - 1) {
				push(new GridPoint(current.c + 1, current.r));
			}
			if (current.r > 0) {
				push(new GridPoint(current.c, current.r - 1));
			}
			if (current.r < Grid.r - 1) {
				push(new GridPoint(current.c, current.r + 1));
			}
 		}
 		return null;
	}
};

const World = {
	getWorld(c, r) {
		return {
			x: Room.mid.w + (c - r) * Tile.mid.w,
			y: Tile.mid.h + (r + c + 0.5) * Tile.mid.h
		};
	}
};

class GridPoint {
	constructor(c, r) {
		this.c = c;
		this.r = r;
	}
	equal(g) {
		return this.c === g.c && this.r === g.r;
	}
}

class Cat extends BranthObject {
	constructor(c, r) {
		super(0, 0);
		this.c = c;
		this.r = r;
		this.targetPoints = [];
	}
	setTarget(target) {
		this.targetPoints = Grid.getPath(new GridPoint(this.c, this.r), target);
	}
	update() {
		const b = World.getWorld(this.c, this.r);
		[this.x, this.y] = [b.x, b.y];
		if (this.targetPoints.length > 0) {
			const p = this.targetPoints[0];
			const cdif = p.c - this.c;
			const rdif = p.r - this.r;
			const spd = 0.02;
			if (Math.abs(cdif) + Math.abs(rdif) < spd) {
				this.targetPoints.splice(0, 1);
			}
			else {
				this.c += spd * Math.sign(cdif);
				this.r += spd * Math.sign(rdif);
			}
		}
	}
	render() {
		Draw.setColor(C.black);
		Draw.circle(this.x, this.y, Tile.w * 0.4);
	}
}

OBJ.add(Cat);

const Game = new BranthRoom('Game', (Grid.c + 1) * Tile.w, (Grid.r + 1) * Tile.h);
Room.add(Game);

Game.start = () => {
	OBJ.create(Cat);
};

Game.render = () => {
	for (let r = 0; r < Grid.r; r++) {
		for (let c = 0; c < Grid.c; c++) {
			const b = World.getWorld(c, r);
			CTX.beginPath();
			CTX.moveTo(b.x, b.y - Tile.mid.h);
			CTX.lineTo(b.x + Tile.mid.w, b.y);
			CTX.lineTo(b.x, b.y + Tile.mid.h);
			CTX.lineTo(b.x - Tile.mid.w, b.y);
			CTX.closePath();
			Draw.setColor(C.black);
			CTX.stroke();
		}
	}
};

BRANTH.start();
Room.start('Game');