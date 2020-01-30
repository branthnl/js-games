const Tile = {
	w: 32,
	h: 32
};

const Grid = {
	EMPTY: 'EMPTY',
	BLOCK: 'BLOCK',
	c: 30,
	r: 20,
	g: []
};

class Spot {
	constructor(c, r, type = Grid.EMPTY) {
		this.type = type;
		this.c = c;
		this.r = r;
		this.g = 0;
		this.h = 0;
	}
	get f() {
		return this.g + this.h;
	}
	get neighbors() {
		const n = [];
		const push = (g) => {
			if (g.type !== Grid.BLOCK) {
				n.push(g);
			}
		};
		const Empty = {
			top: this.r > 0,
			right: this.c < Grid.c - 1,
			bottom: this.r < Grid.r - 1,
			left: this.c > 0
		};
		const Bound = {
			top: this.r - 1,
			right: this.c + 1,
			bottom: this.r + 1,
			left: this.c - 1
		};
		if (Empty.top) {
			push(Grid.g[this.c][Bound.top]);
		}
		if (Empty.right && Empty.top) {
			push(Grid.g[Bound.right][Bound.top]);
		}
		if (Empty.right) {
			push(Grid.g[Bound.right][this.r]);
		}
		if (Empty.right && Empty.bottom) {
			push(Grid.g[Bound.right][Bound.bottom]);
		}
		if (Empty.bottom) {
			push(Grid.g[this.c][Bound.bottom]);
		}
		if (Empty.left && Empty.bottom) {
			push(Grid.g[Bound.left][Bound.bottom]);
		}
		if (Empty.left) {
			push(Grid.g[Bound.left][this.r]);
		}
		if (Empty.left && Empty.top) {
			push(Grid.g[Bound.left][Bound.top]);
		}
		return n;
	}
	show(col, outline) {
		Draw.setColor(col);
		Draw.rect(this.c * Tile.w + Tile.w * 0.05, this.r * Tile.h + Tile.h * 0.05, Tile.w * 0.9, Tile.h * 0.9, outline);
		Draw.setFont(Font.s);
		Draw.setColor(C.black);
		Draw.setHVAlign(Align.c, Align.m);
		Draw.text((this.c + 0.5) * Tile.w, (this.r + 0.5) * Tile.h, this.f);
	}
	circle(col) {
		Draw.setColor(col);
		Draw.circle((this.c + 0.5) * Tile.w, (this.r + 0.5) * Tile.h, Math.min(Tile.w, Tile.h) * 0.4);
	}
}

class AStar extends BranthObject {
	start() {
		Grid.g = [];
		for (let i = 0; i < Grid.c; i++) {
			Grid.g.push([]);
			for (let j = 0; j < Grid.r; j++) {
				Grid.g[i].push(new Spot(i, j, Math.random() > 0.8? Grid.BLOCK : Grid.EMPTY));
			}
		}
		this.start = Grid.g[0][0];
		this.goal = Grid.g[Math.irange(0, Grid.c)][Math.irange(0, Grid.r)];
		this.current = this.start;
		this.openSet = [this.start];
		this.closedSet = [];
	}
	update() {
		if (Input.keyDown(KeyCode.Space)) {
			for (const i of Grid.g) {
				for (const j of i) {
					j.g = 0;
					j.h = 0;
				}
			}
			this.goal = Grid.g[Math.irange(0, Grid.c)][Math.irange(0, Grid.r)];
			this.openSet = [this.current];
			this.closedSet = [];
		}
		if (Input.keyHold(KeyCode.Enter)) {
			if (this.openSet.length > 0) {
				let iMin = 0;
				for (let i = this.openSet.length - 1; i > 0; i--) {
					const f = this.openSet[i].f;
					if (f < this.openSet[iMin].f) {
						iMin = i;
					}
				}
				this.current = this.openSet[iMin];
				this.openSet.splice(iMin, 1);
				this.closedSet.push(this.current);
				if (this.current === this.goal) {
					console.log('DONE!');
					this.openSet = [];
					return;
				}
				for (let i = 0; i < this.current.neighbors.length; i++) {
					const n = this.current.neighbors[i];
					if (!this.closedSet.includes(n)) {
						const g = n.g + 1;
						const h = Math.abs(this.goal.c - n.c) + Math.abs(this.goal.r - n.r);
						if (!this.openSet.includes(n)) {
							n.g = g;
							n.h = h;
							this.openSet.push(n);
						}
						else {
							if ((g + h) < n.f) {
								n.g = g;
								n.h = h;
							}
						}
					}
				}
			}
		}
	}
	render() {
		for (const i of Grid.g) {
			for (const j of i) {
				j.show(C.black, true);
				if (j.type === Grid.BLOCK) {
					j.show(C.gray);
				}
			}
		}
		for (const i of this.openSet) {
			i.show(C.green);
		}
		for (const i of this.closedSet) {
			i.show(C.red);
		}
		this.goal.circle(C.yellow);
		this.current.circle(C.blue);
	}
}

OBJ.add(AStar);

const Game = new BranthRoom('Game', Grid.c * Tile.w, Grid.r * Tile.h);
Room.add(Game);

Game.start = () => {
	OBJ.create(AStar);
};

BRANTH.start();
Room.start('Game');