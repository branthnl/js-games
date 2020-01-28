const Game = new BranthRoom('Game', 720, 1280);
Room.add(Game);

const Tile = {
	w: 40,
	h: 40,
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	}
};

const Grid = {
	g: [],
	c: 18,
	r: 28,
	get mid() {
		return {
			c: this.c * 0.5,
			r: this.r * 0.5
		};
	},
	start() {
		this.g = [];
		for (let i = 0; i < this.c; i++) {
			this.g.push([]);
			for (let j = 0; j < this.r; j++) {
				this.g[i].push(null);
			}
		}
	}
};

const World = {
	get x() {
		return Room.mid.w - Grid.mid.c * Tile.w;
	},
	get y() {
		return 4 * Tile.h;
	},
	get w() {
		return Grid.c * Tile.w;
	},
	get h() {
		return Grid.r * Tile.h;
	},
	fromGrid(c, r) {
		return {
			x: this.x + c * Tile.w,
			y: this.y + r * Tile.h
		};
	},
	fromScreen(x, y, round) {
		x -= this.x;
		y -= this.y;
		if (round === true) {
			return {
				c: Math.floor(x / Tile.w),
				r: Math.floor(y / Tile.h)
			};
		}
		return {
			c: x / Tile.w,
			r: y / Tile.h
		};
	}
};

class Gold extends BranthBehaviour {
	constructor(x, y, c) {
		super(x, y);
		this.c = c;
		this.xto = x;
		this.yto = y;
		this.y -= Room.h + Tile.h;
		this.canMove = false;
		this.alarm[0] = 0.2 * (Room.w - this.xto) + (Room.h - this.yto) + Math.range(100, 200);
	}
	get hover() {
		const m = OBJ.take(Miner)[0].aim;
		return m.x > this.x && m.x < this.x + Tile.w && m.y > this.y && m.y < this.y + Tile.h;
	}
	update() {
		if (this.canMove) {
			this.x += 0.2 * (this.xto - this.x);
			this.y += 0.2 * (this.yto - this.y);
		}
	}
	render() {
		const t = 1 + Math.sin((Time.time + this.x) * 0.01) * (Game.over? 0.1 : (Math.max(0.5, Math.sin(Time.time * 0.0005)) - 0.5) * 0.1);
		const tt = Game.over? Math.sin((Time.time + this.x) * 0.01) * Tile.mid.h : 0;
		const d = {
			w: Tile.w * t,
			h: Tile.h * t,
			x: View.x + this.x - (Tile.w * t - Tile.w) * 0.5,
			y: View.y + this.y - (Tile.h * t - Tile.h) * 0.5 + tt
		};
		Draw.setColor(C.black);
		Draw.roundRect(d.x, d.y, d.w, d.h, 8, true);
		Draw.setColor(this.c);
		Draw.roundRect(d.x + 1, d.y + 1, d.w - 2, d.h - 2, 8);
	}
	renderUI() {
		if (this.hover) {
			Draw.setColor('rgba(0, 0, 0, 0.5)');
			Draw.rect(this.x, this.y, Tile.w, Tile.h);
		}
	}
	alarm0() {
		this.canMove = true;
	}
}
OBJ.add(Gold);

class Boom extends BranthBehaviour {
	sparkle(n) {
		Emitter.preset('sparkle');
		Emitter.setArea(n.x + Tile.mid.w, n.x + Tile.mid.w, n.y + Tile.mid.h, n.y + Tile.mid.h);
		Emitter.setColor(C.gold);
		Emitter.emit(5);
		Emitter.setColor(C.lemonChiffon);
		Emitter.emit(5);
	}
	start() {
		this.count = 0;
		if (!Game.over) {
			const b = World.fromScreen(this.x, this.y, true);
			if (b.c >= 0 && b.c < Grid.c && b.r >= 0 && b.r < Grid.r) {
				if (Grid.g[b.c][b.r] instanceof Gold) {
					const n = Grid.g[b.c][b.r];
					Game.gold++;
					this.count++;
					this.sparkle(n);
					OBJ.destroy(n.id);
					Grid.g[b.c][b.r] = null;
					const gridToCheck = [[0, -1], [1, 0], [0, 1], [-1, 0]];
					for (let i = 0; i < gridToCheck.length; i++) {
						const c = b.c + gridToCheck[i][0];
						const r = b.r + gridToCheck[i][1];
						if (c >= 0 && c < Grid.c && r >= 0 && r < Grid.r) {
							if (Grid.g[c][r] instanceof Gold) {
								if (Grid.g[c][r].c === n.c) {
									const bb = World.fromGrid(c, r);
									const nn = OBJ.create(Boom, bb.x, bb.y);
									nn.count = ++this.count;
								}
							}
						}
					}
				}
			}
		}
		if (this.count > 2) {
			Game.bigGold++;
		}
		this.alarm[0] = 60;
	}
	alarm0() {
		OBJ.destroy(this.id);
		let count = 0;
		for (let i = 0; i < OBJ.take(Boom).length; i++) {
			const n = OBJ.take(Boom)[i];
			if (n) {
				count++;
			}
		}
		if (count === 0) {
			for (let r = Grid.r - 1; r >= 0; r--) {
				for (let c = 0; c < Grid.c; c++) {
					const g = Grid.g[c][r];
					if (g instanceof Gold) {
						for (let rr = r + 1; rr < Grid.r; rr++) {
							const bg = Grid.g[c][rr];
							if (bg === null) {
								const b = World.fromGrid(c, rr);
								g.xto = b.x;
								g.yto = b.y;
								Grid.g[c][rr] = g;
								for (let pr = rr - 1; pr >= r; pr--) {
									Grid.g[c][pr] = null;
								}
							}
						}
					}
				}
			}
		}
	}
	render() {
		if (this.count === 0) {
			Emitter.preset('puff');
			Emitter.setArea(this.x - Tile.mid.w, this.x + Tile.mid.w, this.y - Tile.mid.h, this.y + Tile.mid.h);
			Emitter.setColor(C.brown);
			Emitter.emit(1);
			Emitter.setColor(C.gray);
			Emitter.emit(1);
		}
	}
}
OBJ.add(Boom);

class Pickaxe extends BranthObject {
	constructor(x, y, target, rot) {
		super(x, y);
		this._target = new Vector(this.x, this.y);
		this.distanceToTarget = 0;
		this.target = target;
		this.rot = rot || 0;
		this.rotSpd = Math.range(10, 20) * Math.randneg();
		this.count = 0;
		Emitter.preset('puff');
		Emitter.setSize(2, 4);
		Emitter.setSpeed(2, 3);
		Emitter.setColor('rgba(255, 255, 255, 0.5)');
		Emitter.setArea(this.x, this.x, this.y, this.y);
		Emitter.emit(Math.irange(4, 8));
	}
	get target() {
		if (!this._target instanceof Vector) {
			this._target = new Vector(this.x, this.y);
		}
		return this._target;
	}
	set target(value) {
		if (value instanceof Vector) {
			this._target = value;
			this.distanceToTarget = Math.pointdis(this, this._target);
		}
		else {
			console.error(`Bruh, don't pass anything besides Vector`);
		}
	}
	update() {
		const dis = Math.pointdis(this, this.target);
		if (dis > 0) {
			const l = Math.min(dis, this.distanceToTarget / 20);
			const d = Math.pointdir(this, this.target);
			this.x += Math.lendirx(l, d);
			this.y += Math.lendiry(l, d);
		}
		else {
			OBJ.create(Boom, this.x, this.y);
			OBJ.destroy(this.id);
			View.shake(Tile.mid.w, 200);
		}
		this.rot += this.rotSpd;
	}
	render() {
		Draw.pickAxe(this.x, this.y, this.rot);
	}
}
OBJ.add(Pickaxe);

class Miner extends BranthBehaviour {
	start() {
		this.xs = 1;
		this.ys = 1;
		this.xto = this.x;
		this.yto = this.y;
		this.c = Grid.mid.c;
		this.r = 0;
		this.aim = new Vector(this.x, this.y);
		this.alpha = 1;
		this.axeAngle = 0;
		this.axeScale = 1;
		this.triggerTime = 0;
	}
	movement() {
		let keyA = Input.keyHold(KeyCode.Left) || Input.keyHold(KeyCode.A);
		let keyD = Input.keyHold(KeyCode.Right) || Input.keyHold(KeyCode.D);
		let keyAd = Input.keyDown(KeyCode.Left) || Input.keyDown(KeyCode.A);
		let keyDd = Input.keyDown(KeyCode.Right) || Input.keyDown(KeyCode.D);
		if (keyA) {
			this.triggerTime += Time.deltaTime;
			if (this.triggerTime > 200) {
				keyAd = true;
			}
		}
		if (keyD) {
			this.triggerTime += Time.deltaTime;
			if (this.triggerTime > 200) {
				keyDd = true;
			}
		}
		if (keyAd) {
			if (this.c > 0) {
				if (Grid.g[this.c - 1][this.r] === null) {
					this.c--;
				}
			}
		}
		if (keyDd) {
			if (this.c < Grid.c - 1) {
				if (Grid.g[this.c + 1][this.r] === null) {
					this.c++;
				}
			}
		}
		if (keyAd || keyDd) {
			this.triggerTime = 0;
			this.c = Math.clamp(this.c, 0, Grid.c - 1);
		}
		const b = World.fromGrid(this.c, this.r);
		this.xto = b.x + Tile.mid.w;
		this.yto = b.y + Tile.h;
	}
	dropMovement() {
		if (Math.abs(this.xto - this.x) < 0.2) {
			if (this.r < Grid.r - 1) {
				if (Grid.g[this.c][this.r + 1] === null) {
					this.r++;
					if (this.r >= Grid.r - 1 && !Game.over) {
						Game.over = true;
						for (let r = 1; r < Grid.r; r++) {
							for (let c = 0; c < Grid.c; c++) {
								const n = Grid.g[c][r];
								if (n !== null) {
									// n.yto -= Room.mid.h + Math.range(0, Tile.h * 0.25);
									// n.xto += Room.mid.w * Math.randneg() + Math.range(0, Tile.w * 0.25);
									n.xto += (c > this.c? Tile.w : -Tile.w) * 2;
									n.canMove = false;
									n.alarm[0] = Math.range(100, 500);
								}
							}
						}
					}
				}
			}
		}
	}
	aimMovement() {
		const m = Input.screenToWorldPoint(Input.mousePosition);
		const p = Math.lendir(Math.min(Room.mid.h * 0.5, Math.pointdis(this, m)), Math.pointdir(this, m));
		this.aim.x = this.x + p.x;
		this.aim.y = this.y + p.y;
		this.axeAngle = 90 + Math.sin(Time.time * 0.002) * 75;
	}
	spawnManager() {
		if (Input.mouseDown(0)) {
			const n = new Pickaxe(this.x, this.y, new Vector(this.aim.x, this.aim.y), this.axeAngle);
			OBJ.push(Pickaxe, n);
			this.axeScale = 0;
		}
	}
	keepScale() {
		this.x += 0.2 * (this.xto - this.x);
		this.y += 0.2 * (this.yto - this.y);
		this.xs += 0.2 * (1 - this.xs);
		this.ys += 0.2 * (1 - this.ys);
		this.axeScale += 0.2 * (1 - this.axeScale);
	}
	update() {
		this.movement();
		this.dropMovement();
		this.aimMovement();
		this.spawnManager();
		this.keepScale();
	}
	render() {
		const d = {
			x: View.x + this.x - Tile.mid.w * this.xs,
			y: View.y + this.y - Tile.h * this.ys,
			w: Tile.w * this.xs,
			h: Tile.h * this.ys
		};
		Draw.setAlpha(this.alpha);
		Draw.setColor(C.brown);
		Draw.roundRect(d.x, d.y, d.w, d.h, 5);
		Draw.setColor(C.black);
		Draw.roundRect(d.x, d.y, d.w, d.h, 5, true);
		CTX.save();
		CTX.translate(this.x, this.y);
		CTX.scale(this.axeScale, this.axeScale);
		Draw.pickAxe(0, 0, this.axeAngle);
		CTX.restore();
		Draw.setAlpha(1);
	}
	renderUI() {
		const a = this.aim; a.r = 8 + Math.sin(Time.time * 0.013) * 0.5;
		Draw.setColor(C.white);
		CTX.lineCap = Cap.round;
		CTX.lineWidth = 3;
		Draw.circle(a.x, a.y, a.r, true);
		Draw.line(a.x - a.r * 1.8, a.y, a.x + a.r * 1.8, a.y);
		Draw.line(a.x, a.y - a.r * 1.8, a.x, a.y + a.r * 1.8);
		CTX.lineWidth = 1;
	}
}
OBJ.add(Miner);

Game.gold = 0;
Game.bigGold = 0;
Game.over = false;
Game.score = () => {
	return Game.gold + Game.bigGold * 5;
};
Game.start = () => {
	Game.gold = 0;
	Game.bigGold = 0;
	Game.over = false;
	Grid.start();
	Emitter.setDepth(-1);
	let count = 0;
	const colors = [
		C.sandyBrown,
		C.lightSlateGray,
		C.gold,
		C.slateBlue,
		C.whiteSmoke
	];
	let colorsIndex = LEVEL.LVL1.map(x => x.split('')).flat();
	for (let r = 1; r < Grid.r; r++) {
		for (let c = 0; c < Grid.c; c++) {
			const b = World.fromGrid(c, r, true);
			const n = new Gold(b.x, b.y, colors[colorsIndex[count]]);
			OBJ.push(Gold, n);
			Grid.g[c][r] = n;
			count++;
		}
	}
	OBJ.create(Miner, Room.mid.w, 32);
};

Game.render = () => {
	Draw.setColor(C.burlyWood);
	Draw.rect(0, 0, Room.w, Room.h);
};

Game.renderUI = () => {
	if (Game.over) {
		Draw.setAlpha(0.8);
		Draw.setColor(C.black);
		Draw.rect(0, Room.h * 0.2, Room.w, Room.h * 0.45);
		Draw.setAlpha(1);
		Draw.setFont(Font.xxlb);
		Draw.setColor(C.white);
		Draw.setHVAlign(Align.c, Align.t);
		Draw.setShadow(0, 2, 5, C.black);
		Draw.text(Room.mid.w, Room.h * 0.25, 'Game Over');
		Draw.setVAlign(Align.b);
		Draw.text(Room.mid.w, Room.h * 0.6, `Total: ${Game.score()}`);
		const y1 = Room.h * 0.25 + Font.size * 2;
		Draw.setFont(Font.xlb);
		Draw.setHVAlign(Align.l, Align.t);
		Draw.text(Room.w * 0.2, y1,'Gold:');
		Draw.text(Room.w * 0.2, y1 + Font.size * 1.2, 'Big Gold:');
		Draw.setHAlign(Align.r);
		Draw.text(Room.w * 0.8, y1, `${Game.gold} (x1)`);
		Draw.text(Room.w * 0.8, y1 + Font.size * 1.2, `${Game.bigGold} (x5)`);
		Draw.resetShadow();
	}
	else {
		const t = Math.sin(Time.time * 0.01) * 2;
		Draw.setFont(Font.lb);
		Draw.setColor(C.gold);
		Draw.setShadow(0, 2, 2, C.black);
		Draw.setHVAlign(Align.l, Align.t);
		Draw.text(16, 16 + t, Game.gold);
		Draw.resetShadow();
		Draw.setColor(C.white);
		Draw.text(16, 14 + t, Game.gold);
	}
};

BRANTH.start();
Room.start('Game');