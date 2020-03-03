class Cell {
	constructor(c, r) {
		this.c = c;
		this.r = r;
	}
	equal(c, r) {
		return r === undefined? this.c === c.c && this.r === c.r : this.c === c && this.r === r;
	}
}

const DATA = {
	Grid: {
		Size: 20,
		Type: {
			Empty: 'Empty',
			Block: 'Block'
		}
	},
	Unit: {
		State: {
			CalculatingPath: 'CalculatingPath',
			Moving: 'Moving',
			Standing: 'Standing'
		},
		Pathfinder: {
			STEP: 1,
			G_COST: 10,
			G_DIAG: 14,
			MAX_TIME: 20000,
			includes(set, cell) {
				for (let i = set.length - 1; i >= 0; i--) { if (set[i].equal(cell)) return true; }
				return false;
			},
			indexOf(set, cell) {
				for (let i = set.length - 1; i >= 0; i--) { if (set[i].equal(cell)) return i; }
				return -1;
			},
			create() {
				return {
					a: 0,
					b: new Cell(this.c, this.r),
					c: new Cell(this.c, this.r),
					d: [],
					e: [],
					f: [0],
					g: [0],
					h: [-1],
					i: [],
					j: [],
					push(g, c, r) {
						const n = new Cell(c, r);
						if (true) {
							if (!DATA.Unit.Pathfinder.includes(this.e, n)) {
								const h = DATA.Unit.Pathfinder.G_COST * (Math.abs(this.c.c - n.c) + Math.abs(this.c.r - n.r));
								if (!DATA.Unit.Pathfinder.includes(this.d, n)) {
									this.f.push(g + h);
									this.g.push(g);
									this.d.push(n);
									this.h.push(this.e.length - 1);
								}
								else {
									const i = DATA.Unit.Pathfinder.indexOf(this.d, n);
									if ((g + h) < this.f[i]) {
										this.f[i] = g + h;
										this.g[i] = g;
									}
								}
							}
						}
					},
					reset() {
						this.a = 0;
						this.b = new Cell(this.c, this.r);
						this.c = new Cell(this.c, this.r);
						this.d = [];
						this.e = [];
						this.f = [0];
						this.g = [0];
						this.h = [-1];
						this.i = [];
					},
					setup(b, c) {
						this.reset();
						this.b = b;
						this.c = c;
						this.d = [this.b];
					},
					update() {
						this.a += Time.deltaTime;
						if (this.a > DATA.Unit.Pathfinder.MAX_TIME) return 1;
						let step = DATA.Unit.Pathfinder.STEP;
						while (--step >= 0) {
							if (this.d.length > 0) {
								let iMin = 0;
								for (let i = this.d.length - 1; i > 0; i--) { if (this.f[i] < this.f[iMin]) iMin = i; }
								let n = this.d[iMin];
								const g = this.g[iMin];
								this.i.push(this.h[iMin]);
								this.e.push(n);
								this.d.splice(iMin, 1);
								this.h.splice(iMin, 1);
								this.f.splice(iMin, 1);
								this.g.splice(iMin, 1);
								if (n.equal(this.c)) {
									this.j = [];
									let i = 0;
									while (i !== -1) {
										this.j.push(n);
										i = this.i[DATA.Unit.Pathfinder.indexOf(this.e, n)];
										n = this.e[i];
									}
									this.j.pop();
									this.reset();
									return 3;
								}
								const e = { N: n.r > 0, E: n.c < DATA.Grid.Size - 1, S: n.r < DATA.Grid.Size - 1, W: n.c > 0 };
								if (e.N) this.push(g + DATA.Unit.Pathfinder.G_COST, n.c, n.r - 1);
								if (e.E) this.push(g + DATA.Unit.Pathfinder.G_COST, n.c + 1, n.r);
								if (e.S) this.push(g + DATA.Unit.Pathfinder.G_COST, n.c, n.r + 1);
								if (e.W) this.push(g + DATA.Unit.Pathfinder.G_COST, n.c - 1, n.r);
								if (e.N && e.E) this.push(g + DATA.Unit.Pathfinder.G_DIAG, n.c + 1, n.r - 1);
								if (e.S && e.W) this.push(g + DATA.Unit.Pathfinder.G_DIAG, n.c - 1, n.r + 1);
								if (e.N && e.W) this.push(g + DATA.Unit.Pathfinder.G_DIAG, n.c - 1, n.r - 1);
								if (e.S && e.E) this.push(g + DATA.Unit.Pathfinder.G_DIAG, n.c + 1, n.r + 1);
							}
							else return 2;
						}
						return 0;
					}
				}
			}
		}
	}
};

const Manager = {
	Game: {
		start() {
			OBJ.create(Unit, 32, 32);
		},
		update() {
			if (Input.mouseDown(0)) {
				const m = Input.mousePosition;
				OBJ.take(Unit)[0].moveTo(new Cell(~~(m.x / 32), ~~(m.y / 32)));
			}
		}
	}
};

class Unit extends BranthObject {
	constructor(x, y) {
		super(x, y);
		this.speed = 2;
		this.direction = 0;
		this.nearestEnemy = null;
		this.state = DATA.Unit.State.Standing;
		this.pathfinder = DATA.Unit.Pathfinder.create();
	}
	get c() {
		return ~~(this.x / 32);
	}
	get r() {
		return ~~(this.y / 32);
	}
	changeState(newState) {
		this.state = newState;
	}
	moveTo(cell) {
		this.pathfinder.setup(new Cell(this.c, this.r), cell);
		this.changeState(DATA.Unit.State.CalculatingPath);
	}
	update() {
		const stateUpdate = {
			CalculatingPath(a) {
				const i = a.pathfinder.update();
				if (i > 0) {
					switch (i) {
						case 1: a.changeState(DATA.Unit.State.Standing); break;
						case 2: a.changeState(DATA.Unit.State.Standing); break;
						case 3: a.changeState(DATA.Unit.State.Moving); break;
					}
				}
			},
			Moving(a) {
				let b = a.nearestEnemy;
				const c = a.pathfinder.j;
				if (c.length > 0) {
					const d = c[c.length - 1];
					b = new Vector2(d.c * 32, d.r * 32);
					if (Math.pointdis(a, b) < a.speed) {
						a.pathfinder.j.pop();
					}
				}
				if (b) {
					a.direction = Math.pointdir(a, b);
					const d = Math.lendir(a.speed, a.direction);
					a.x += d.x;
					a.y += d.y;
				}
				else {
					a.changeState(DATA.Unit.State.Standing);
				}
			},
			Standing() {
			}
		}[this.state];
		stateUpdate(this);
	}
	render() {
		Draw.setColor(C.green);
		for (const i of this.pathfinder.d) {
			Draw.rect(i.c * 32, i.r * 32, 32, 32);
		}
		Draw.setColor(C.red);
		for (const i of this.pathfinder.e) {
			Draw.rect(i.c * 32, i.r * 32, 32, 32);
		}
		Draw.setColor(C.orange);
		Draw.primitiveBegin();
		let count = 0;
		for (const i of this.pathfinder.j) {
			Draw.vertex(i.c * 32, i.r * 32);
		}
		Draw.primitiveEnd(Primitive.line);
		Draw.setColor(C.black);
		Draw.circle(this.x, this.y, 8);
	}
}

OBJ.add(Unit);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	Manager.Game.start();
};

Game.update = () => {
	Manager.Game.update();
};

BRANTH.start();
Room.start('Game');