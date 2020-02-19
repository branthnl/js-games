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
			// [0, 0, 30, 1],
			// [0, 21, 30, 1],
			// [0, 1, 1, 20],
			// [30, 0, 1, 8],
			// [30, 10, 1, 12],
			// [20, 10, 1, 11],
			// [21, 10, 5, 1],
			// [8, 15, 10, 1],
			// [10, 16, 1, 3],
			// [14, 18, 1, 3],
			[190, 0, 1, 90],
			[190, 98, 1, 90]
		],
		WATER: [
			// [0, 50, 25, 44],
			// [25, 70, 97, 24],
			// [150, 70, 30, 24],
			// [180, 0, 20, 94],
		]
	}]
};

const Tile = {
	w: 4,
	h: 4,
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
		if (this.g.length > 0) {
			return this.g[0].length;
		}
		return 0;
	},
	toGrid(x, y) {
		if (y === undefined) return new GridPoint(~~(x.x / Tile.w), ~~(x.y / Tile.h));
		return new GridPoint(~~(x / Tile.w), ~~(y / Tile.h));
	},
	toWorld(c, r, center = false) {
		const o = 0.45 * center;
		return new Vector2((c + o) * Tile.w, (r + o) * Tile.h);
	},
	setup(levelData = null) {
		this.g = [];
		for (let i = 0; i < ~~(Room.w / Tile.w); i++) {
			this.g.push([]);
			for (let j = 0; j < ~~(Room.h / Tile.h); j++) {
				this.g[i].push(Math.randbool(0.2) && i < 190? DATA.GRID_TYPE.BLOCK : DATA.GRID_TYPE.EMPTY);
			}
		}
		if (levelData) {
			for (const v of Object.keys(DATA.GRID_TYPE)) {
				if (levelData.hasOwnProperty(v)) {
					for (const d of levelData[v]) {
						let i = Math.min(d[2], this.c - d[0]);
						while (--i >= 0) {
							let j = Math.min(d[3], this.r - d[1]);
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
				if (this.g[i][j] !== DATA.GRID_TYPE.EMPTY) {
					switch (this.g[i][j]) {
						case DATA.GRID_TYPE.BLOCK: Draw.setColor(C.gray); break;
						case DATA.GRID_TYPE.WATER: Draw.setColor(C.blue); break;
					}
					Draw.rect(i * Tile.w, j * Tile.h, Tile.w, Tile.h);
				}
			}
		}
	}
};

class Unit extends BranthBehaviour {
	constructor(c, r, color = C.pink) {
		super(0, 0);
		this.c = c;
		this.r = r;
		this.color = color;
		this.unitIndex = 0;
		this.state = DATA.UNIT_STATE.IDLE;
		this.canMove = true;
		this.canOverlap = true;
		this.moveInterval = 10;
		this.waypoints = [];
		this.pathfinder = {
			step: 16,
			gCost: 10,
			gDiagCost: 14,
			maxTime: 10000,
			time: 0,
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
				this.time = 0;
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
	moveTo(c, r) {
		let goal = new GridPoint(c, r);
		if (r === undefined) goal = new GridPoint(c.c + this.id % 10, c.r + ~~(this.id / 10));
		this.pathfinder.setup(new GridPoint(this.c, this.r), goal);
	}
	awake() {
		Grid.g[this.c][this.r] = DATA.GRID_TYPE.EMPTY;
	}
	update() {
		let count = 0;
		switch (this.state) {
			case DATA.UNIT_STATE.IDLE:
				// Update
				// Transition
				if (Input.mouseDown(0)) {
					this.moveTo(Grid.toGrid(Input.mousePosition));
					this.state = DATA.UNIT_STATE.CALCULATING_PATH;
				}
				break;
			case DATA.UNIT_STATE.MOVE:
				// Update
				if (this.waypoints.length > 0) {
					if (this.canMove) {
						if (!this.canOverlap) {
							for (const i of OBJ.take(Unit)) {
								if (i.id !== this.id) {
									if (this.waypoints[0].equal(i)) {
										if (i.unitIndex === this.unitIndex && i.state === DATA.UNIT_STATE.IDLE) {
											count = -1;
										}
										else count++;
										break;
									}
								}
							}
						}
						if (count === 0) {
							this.c = this.waypoints[0].c;
							this.r = this.waypoints[0].r;
							this.waypoints.splice(0, 1);
						}
						this.canMove = false;
						this.alarm[0] = this.moveInterval;
					}
				}
				// Transition
				else {
					this.state = DATA.UNIT_STATE.IDLE;
				}
				if (count === -1) {
					this.waypoints = [];
					this.state = DATA.UNIT_STATE.IDLE;
				}
				if (Input.mouseDown(0)) {
					this.moveTo(Grid.toGrid(Input.mousePosition));
					this.waypoints = [];
					this.state = DATA.UNIT_STATE.CALCULATING_PATH;
				}
				break;
			case DATA.UNIT_STATE.CALCULATING_PATH:
				// Update
				const goal = this.pathfinder.goal;
				if (goal.c < 0 || goal.c > Grid.c - 1 || goal.r < 0 || goal.r > Grid.r - 1) {
					console.log(`Unit ${this.id}: The goal is out of reach.`);
					count++;
				}
				else if (Grid.g[goal.c][goal.r] !== DATA.GRID_TYPE.EMPTY) {
					console.log(`Unit ${this.id}: The goal is not empty.`);
					count++;
				}
				else if (this.pathfinder.time > this.pathfinder.maxTime) {
					console.log(`Unit ${this.id}: The process of finding a way over time. Try directing the unit little by little.`);
					count++;
				}
				else {
					this.pathfinder.time += Time.deltaTime;
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
								count++;
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
					else {
						console.log(`Unit ${this.id}: The goal is out of reach.`);
						count++;
					}
				}
				// Transition
				if (count > 0) {
					this.pathfinder.reset();
					this.state = DATA.UNIT_STATE.MOVE;
				}
				if (Input.mouseDown(0)) {
					this.moveTo(Grid.toGrid(Input.mousePosition));
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
			Draw.setColor(C.orange);
			Draw.primitiveEnd(Primitive.line);
			const b = Grid.toWorld(this.pathfinder.goal.c, this.pathfinder.goal.r, true);
			Draw.setColor(C.blue);
			Draw.circle(b.x, b.y, Math.min(Tile.mid.w, Tile.mid.h));
		}
		Draw.setColor(this.color);
		Draw.circle(this.x, this.y, Math.min(Tile.mid.w, Tile.mid.h));
		Draw.setColor(C.black);
		Draw.draw(true);
	}
	renderUI() {
		Draw.setFont(Font.s);
		Draw.setColor(C.black);
		Draw.setHVAlign(Align.c, Align.b);
		if (GLOBAL.debugMode) {
			Draw.text(this.x, this.y - Tile.h, this.state);
			if (this.state === DATA.UNIT_STATE.CALCULATING_PATH) {
				const txt = `${~~this.pathfinder.time}ms`;
				const h = Draw.textHeight(txt);
				Draw.rectRotated(this.x, this.y - Tile.h - h * 0.5 - 2, Draw.textWidth(txt) + 4, h + 4);
				Draw.setColor(C.white);
				Draw.text(this.x, this.y - Tile.h, txt);
			}
		}
	}
	alarm0() {
		this.canMove = true;
	}
}

class PathPointer extends BranthBehaviour {
	constructor(x, y) {
		super(x, y);
		this.alarm[0] = 300;
	}
	renderUI() {
		const t = Math.clamp(1 - this.alarm[0] / 1000, 0, 1);
		Draw.setColor(C.black);
		Draw.plus(this.x, this.y, 48 * (1 - t));
		Draw.circle(this.x, this.y, 10 * t, true);
	}
	alarm0() {
		OBJ.destroy(this.id);
	}
}

const Game = new BranthRoom('Game');

Game.start = () => {
	Grid.setup(DATA.GRID_LEVEL[0]);
	let j = 0;
	while (j++ < 10) {
		let i = 0;
		while (i++ < 10) {
			OBJ.push(Unit, new Unit(10 + i, 10 + j, C.random()));
		}
	}
};

Game.update = () => {
	if (Input.mouseDown(0)) {
		const m = Input.mousePosition;
		OBJ.create(PathPointer, m.x, m.y);
	}
};

Game.render = () => {
	Grid.render();
};

Game.renderUI = () => {
	let m = Grid.toGrid(Input.mousePosition); m = Grid.toWorld(m.c, m.r);
	Draw.setColor(`rgba(255, 120, 0, 0.5)`);
	Draw.rect(m.x, m.y, Tile.w * 10, Tile.h * 10);
	Draw.setFont(Font.m);
	Draw.setColor(C.black);
	Draw.setHVAlign(Align.r, Align.b);
	Draw.text(Room.w - 8, Room.h - 8, `(${Grid.c}x${Grid.r}) ${Time.FPS}/60`);
};

OBJ.add(Unit);
OBJ.add(PathPointer);

Room.add(Game);

GLOBAL.setProductionMode();
BRANTH.start(0, 0, { backgroundColor: C.white });
Room.start('Game');