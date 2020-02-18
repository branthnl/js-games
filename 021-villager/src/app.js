class GridPoint {
	constructor(c, r) {
		this.c = c;
		this.r = r;
	}
	equal(g) {
		return this.c === g.c && this.r === g.r;
	}
}

const DATA = {
	GRID_TYPE: {
		EMPTY: 0,
		BLOCK: 1,
		WATER: 2
	},
	UNIT_STATE: {
		IDLE: 0,
		MOVE: 1,
		CALCULATING_PATH: 2
	},
	GRID_LEVEL: [{
		BLOCK: [
			// x, y, w, h
			[0, 0, 30, 1],
			[0, 21, 30, 1],
			[0, 0, 1, 21],
			[30, 0, 1, 8],
			[30, 10, 1, 12],
			[20, 10, 1, 11],
			[21, 10, 5, 1],
			// [0, 30, 5, 10]
		],
		WATER: [
			// [10, 10, 20, 20]
		]
	}]
};

const Tile = {
	w: 32,
	h: 32,
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	}
};

const Grid = {
	g: [],
	get c() {
		return this.g.length;
	},
	get r() {
		return this.g[0].length;
	},
	toGrid(x, y) {
		return new GridPoint(~~(x / Tile.w), ~~(y / Tile.h));
	},
	toWorld(c, r, center = false) {
		const o = 0.45 * center;
		return new Vector2((c + o) * Tile.w, (r + o) * Tile.h);
	},
	setup(levelData = null) {
		this.g = [];
		for (let i = 0; i < ~~(Room.w / Tile.w) - 1; i++) {
			this.g.push([]);
			for (let j = 0; j < ~~(Room.h / Tile.h) - 1; j++) {
				this.g[i].push(DATA.GRID_TYPE.EMPTY);
			}
		}
		if (levelData) {
			for (const v of Object.keys(DATA.GRID_TYPE)) {
				if (levelData.hasOwnProperty(v)) {
					for (const d of levelData[v]) {
						let i = d[2];
						while (--i >= 0) {
							let j = d[3];
							while (--j >= 0) {
								this.g[d[0] + i][d[1] + j] = DATA.GRID_TYPE[v];
							}
						}
					}
				}
			}
		}
	},
	render() {
		for (let i = 0; i < this.g.length; i++) {
			for (let j = 0; j < this.g[i].length; j++) {
				switch (this.g[i][j]) {
					case DATA.GRID_TYPE.EMPTY: Draw.setColor(C.white); break;
					case DATA.GRID_TYPE.BLOCK: Draw.setColor(C.gray); break;
					case DATA.GRID_TYPE.WATER: Draw.setColor(C.blue); break;
				}
				Draw.rect(i * Tile.w, j * Tile.h, Tile.w, Tile.h);
			}
		}
	}
};

class Unit extends BranthBehaviour {
	constructor(c, r) {
		super(0, 0);
		this.c = c;
		this.r = r;
		this.state = DATA.UNIT_STATE.IDLE;
		this.canMove = true;
		this.moveInterval = 300;
		this.waypoints = [];
		this.pathfinder = {
			step: 1,
			gCost: 10,
			gDiagCost: 14,
			start: new GridPoint(this.c, this.r),
			goal: new GridPoint(this.c, this.r),
			openSet: [],
			closedSet: [],
			fScore: [0],
			gScore: [0],
			cameSet: [-1],
			cameFrom: [],
			includes(set, n) {
				for (const g of set) {
					if (g.equal(n)) {
						return true;
					}
				}
				return false;
			},
			indexOf(set, n) {
				for (const i in set) {
					if (set[i].equal(n)) {
						return +i;
					}
				}
				return -1;
			},
			push(g, c, r) {
				const n = new GridPoint(c, r);
				if (n.equal(this.goal) || Grid.g[c][r] === DATA.GRID_TYPE.EMPTY) {
					if (!this.includes(this.closedSet, n)) {
						const h = ~~(Math.abs(this.goal.c - n.c) + Math.abs(this.goal.r - n.r)) * this.gCost;
						if (!this.includes(this.openSet, n)) {
							this.fScore.push(g + h);
							this.gScore.push(g);
							this.openSet.push(n);
							this.cameSet.push(this.closedSet.length - 1);
						}
						else {
							const i = this.indexOf(this.openSet, n);
							if ((g + h) < this.fScore[i]) {
								this.fScore[i] = g + h;
								this.gScore[i] = g;
							}
						}
					}
				}
			},
			reset() {
				this.start = new GridPoint(this.c, this.r);
				this.goal = new GridPoint(this.c, this.r);
				this.openSet = [];
				this.closedSet = [];
				this.fScore = [0];
				this.gScore = [0];
				this.cameSet = [-1];
				this.cameFrom = [];
			},
			setup(start, goal) {
				this.reset();
				this.start = start;
				this.goal = goal;
				this.openSet = [this.start];
			}
		};
	}
	update() {
		switch (this.state) {
			case DATA.UNIT_STATE.IDLE:
				// Update
				// Transition
				if (Input.mouseDown(0)) {
					let m = Input.mousePosition; m = Grid.toGrid(m.x, m.y);
					this.pathfinder.setup(
						new GridPoint(this.c, this.r),
						new GridPoint(m.c, m.r)
					);
					this.state = DATA.UNIT_STATE.CALCULATING_PATH;
				}
				break;
			case DATA.UNIT_STATE.MOVE:
				// Update
				if (this.waypoints.length > 0) {
					if (this.canMove) {
						this.c = this.waypoints[0].c;
						this.r = this.waypoints[0].r;
						this.waypoints.splice(0, 1);
						this.canMove = false;
						this.alarm[0] = this.moveInterval;
					}
				}
				// Transition
				else {
					this.state = DATA.UNIT_STATE.IDLE;
				}
				if (Input.mouseDown(0)) {
					let m = Input.mousePosition; m = Grid.toGrid(m.x, m.y);
					this.pathfinder.setup(
						new GridPoint(this.c, this.r),
						new GridPoint(m.c, m.r)
					);
					this.waypoints = [];
					this.state = DATA.UNIT_STATE.CALCULATING_PATH;
				}
				break;
			case DATA.UNIT_STATE.CALCULATING_PATH:
				// Update
				if (this.pathfinder.openSet.length > 0) {
					let step = this.pathfinder.step;
					while (--step >= 0) {
						let iMin = 0;
						for (let i = 1; i < this.pathfinder.openSet.length; i++) {
							if (this.pathfinder.fScore[i] <= this.pathfinder.fScore[iMin]) {
								iMin = i;
							}
						}
						let current = this.pathfinder.openSet[iMin];
						const g = this.pathfinder.gScore[iMin];
						this.pathfinder.cameFrom.push(this.pathfinder.cameSet[iMin]);
						this.pathfinder.closedSet.push(current);
						this.pathfinder.openSet.splice(iMin, 1);
						this.pathfinder.cameSet.splice(iMin, 1);
						this.pathfinder.fScore.splice(iMin, 1);
						this.pathfinder.gScore.splice(iMin, 1);
						if (current.equal(this.pathfinder.goal)) {
							this.waypoints = [];
							let i = 0;
							while (i !== -1) {
								this.waypoints.push(current);
								i = this.pathfinder.cameFrom[this.pathfinder.indexOf(this.pathfinder.closedSet, current)];
								current = this.pathfinder.closedSet[i];
							}
							this.waypoints.reverse();
							this.pathfinder.reset();
							break;
						}
						const Exists = {
							Top: current.r > 0,
							Left: current.c > 0,
							Right: current.c < Grid.c - 1,
							Bottom: current.r < Grid.r - 1
						};
						if (Exists.Top) this.pathfinder.push(g + this.pathfinder.gCost, current.c, current.r - 1);
						if (Exists.Left) this.pathfinder.push(g + this.pathfinder.gCost, current.c - 1, current.r);
						if (Exists.Right) this.pathfinder.push(g + this.pathfinder.gCost, current.c + 1, current.r);
						if (Exists.Bottom) this.pathfinder.push(g + this.pathfinder.gCost, current.c, current.r + 1);
						if (Exists.Top && Exists.Left) this.pathfinder.push(g + this.pathfinder.gDiagCost, current.c - 1, current.r - 1);
						if (Exists.Top && Exists.Right) this.pathfinder.push(g + this.pathfinder.gDiagCost, current.c + 1, current.r - 1);
						if (Exists.Bottom && Exists.Left) this.pathfinder.push(g + this.pathfinder.gDiagCost, current.c - 1, current.r + 1);
						if (Exists.Bottom && Exists.Right) this.pathfinder.push(g + this.pathfinder.gDiagCost, current.c + 1, current.r + 1);
					}
				}
				// Transition
				else {
					this.state = DATA.UNIT_STATE.IDLE;
				}
				if (this.waypoints.length > 0) {
					this.state = DATA.UNIT_STATE.MOVE;
				}
				if (Input.mouseDown(0)) {
					let m = Input.mousePosition; m = Grid.toGrid(m.x, m.y);
					this.pathfinder.setup(
						new GridPoint(this.c, this.r),
						new GridPoint(m.c, m.r)
					);
				}
				break;
		}
		const b = Grid.toWorld(this.c, this.r, true);
		this.x = b.x;
		this.y = b.y;
	}
	render() {
		if (GLOBAL.debugMode) {
			Draw.setColor(C.green);
			for (const a of this.pathfinder.openSet) {
				const b = Grid.toWorld(a.c, a.r);
				Draw.rect(b.x, b.y, Tile.w, Tile.h);
			}
			Draw.setColor(C.red);
			for (const a of this.pathfinder.closedSet) {
				const b = Grid.toWorld(a.c, a.r);
				Draw.rect(b.x, b.y, Tile.w, Tile.h);
			}
			Draw.primitiveBegin();
			for (const a of this.waypoints) {
				const b = Grid.toWorld(a.c, a.r, true);
				Draw.vertex(b.x, b.y);
			}
			Draw.setColor(C.yellow);
			Draw.primitiveEnd(Primitive.line);
			const b = Grid.toWorld(this.pathfinder.goal.c, this.pathfinder.goal.r, true);
			Draw.setColor(C.blue);
			Draw.circle(b.x, b.y, 10);
		}
		Draw.setColor(C.pink);
		Draw.circle(this.x, this.y, 10);
		Draw.setColor(C.black);
		Draw.draw(true);
	}
	renderUI() {
		Draw.setFont(Font.m);
		Draw.setColor(C.black);
		Draw.setHVAlign(Align.c, Align.m);
		if (GLOBAL.debugMode) {
			Draw.text(this.x, this.y + 1, this.state);
			for (const i in this.pathfinder.openSet) {
				const a = this.pathfinder.openSet[i];
				const b = Grid.toWorld(a.c, a.r, true);
				Draw.text(b.x, b.y, this.pathfinder.fScore[i]);
			}
		}
		else if (this.state === DATA.UNIT_STATE.CALCULATING_PATH) {
			Draw.text(this.x, this.y - Tile.h, `Calculating path ${~~(this.pathfinder.closedSet.length / this.pathfinder.step / 60)}s`);
		}
	}
	alarm0() {
		this.canMove = true;
	}
}

const Game = new BranthRoom('Game');

Game.start = () => {
	Grid.setup(DATA.GRID_LEVEL[0]);
	OBJ.push(Unit, new Unit(5, 5));
};

Game.render = () => {
	Grid.render();
};

OBJ.add(Unit);
Room.add(Game);
BRANTH.start();
Room.start('Game');