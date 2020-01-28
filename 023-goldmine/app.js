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
	},
	render() {
		// for (let c = 0; c < Grid.c; c++) {
		// 	for (let r = 0; r < Grid.r; r++) {
		// 		const b = this.fromGrid(c, r);
		// 		Draw.setColor(C.black);
		// 		Draw.rect(b.x, b.y, Tile.w, Tile.h, true);
		// 	}
		// }
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
		this.alarm[0] = 0.2 * (Room.w - this.xto) + (Room.h - this.yto);
	}
	get hover() {
		const m = Input.screenToWorldPoint(Input.mousePosition);
		return m.x > this.x && m.x < this.x + Tile.w && m.y > this.y && m.y < this.y + Tile.h;
	}
	update() {
		if (this.canMove) {
			this.x += 0.2 * (this.xto - this.x);
			this.y += 0.2 * (this.yto - this.y);
		}
	}
	render() {
		const t = 1 + Math.sin((Time.time + this.x) * 0.01) * (Math.max(0.5, Math.sin(Time.time * 0.0005)) - 0.5) * 0.1;
		const d = {
			w: Tile.w * t,
			h: Tile.h * t,
			x: View.x + this.x - (Tile.w * t - Tile.w) * 0.5,
			y: View.y + this.y - (Tile.h * t - Tile.h) * 0.5
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
	start() {
		this.count = 0;
		const b = World.fromScreen(this.x, this.y, true);
		if (b.c >= 0 && b.c < Grid.c && b.r >= 0 && b.r < Grid.r) {
			if (Grid.g[b.c][b.r] instanceof Gold) {
				const n = Grid.g[b.c][b.r];
				Game.gold++;
				OBJ.destroy(n.id);
				Emitter.preset('sparkle');
				Emitter.setArea(n.x + Tile.mid.w, n.x + Tile.mid.w, n.y + Tile.mid.h, n.y + Tile.mid.h);
				Emitter.setColor(C.gold);
				Emitter.emit(5);
				Emitter.setColor(C.lemonChiffon);
				Emitter.emit(5);
				Grid.g[b.c][b.r] = null;
				this.count++;
			}
		}
		this.alarm[0] = 60;
	}
	alarm0() {
		OBJ.destroy(this.id);
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
		Emitter.preset('puff');
		Emitter.setSize(2, 4);
		Emitter.setSpeed(2, 3);
		Emitter.setColor(C.brown);
		Emitter.setArea(this.x, this.x, this.y, this.y);
		Emitter.emit(Math.irange(2, 4));
		Emitter.setColor(C.gray);
		Emitter.emit(Math.irange(2, 4));
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
			View.shake(20, 300);
		}
		this.rot += this.rotSpd;
		Emitter.preset('puff');
		Emitter.setSize(2, 4);
		Emitter.setColor('rgba(255, 255, 255, 0.5)');
		Emitter.setArea(this.x, this.x, this.y, this.y);
		Emitter.emit(1);
	}
	render() {
		const x = this.x;
		const y = this.y;
		const r = this.rot;
		const w = 10;
		const h = 50;
		const p = [{
			x: Math.lendirx(h * 0.5, r) + Math.lendirx(w * 0.4, r - 90),
			y: Math.lendiry(h * 0.5, r) + Math.lendiry(w * 0.4, r - 90)
		}];
		p.push({
			x: Math.lendirx(h * 0.5, r) + Math.lendirx(w * 0.4, r + 90),
			y: Math.lendiry(h * 0.5, r) + Math.lendiry(w * 0.4, r + 90)
		});
		p.push({
			x: Math.lendirx(h * 0.5, r + 180) + Math.lendirx(w * 0.6, r + 90),
			y: Math.lendiry(h * 0.5, r + 180) + Math.lendiry(w * 0.6, r + 90)
		});
		p.push({
			x: Math.lendirx(h * 0.5, r + 180) + Math.lendirx(w * 0.6, r - 90),
			y: Math.lendiry(h * 0.5, r + 180) + Math.lendiry(w * 0.6, r - 90)
		});
		const aw = 45;
		const ah = 14;
		p.push({
			x: Math.lendirx(h * 0.5 - ah * 0.6, r) + Math.lendirx(aw * 0.5, r - 90),
			y: Math.lendiry(h * 0.5 - ah * 0.6, r) + Math.lendiry(aw * 0.5, r - 90)
		});
		p.push({
			x: Math.lendirx(h * 0.5 + ah * 0.9, r) + Math.lendirx(aw * 0.1, r - 90),
			y: Math.lendiry(h * 0.5 + ah * 0.9, r) + Math.lendiry(aw * 0.1, r - 90)
		});
		p.push({
			x: Math.lendirx(h * 0.5 + ah * 0.9, r) + Math.lendirx(aw * 0.1, r + 90),
			y: Math.lendiry(h * 0.5 + ah * 0.9, r) + Math.lendiry(aw * 0.1, r + 90)
		});
		p.push({
			x: Math.lendirx(h * 0.5 - ah * 0.6, r) + Math.lendirx(aw * 0.5, r + 90),
			y: Math.lendiry(h * 0.5 - ah * 0.6, r) + Math.lendiry(aw * 0.5, r + 90)
		});
		p.push({
			x: Math.lendirx(h * 0.5 - ah * 0.25, r) + Math.lendirx(aw * 0.1, r - 90),
			y: Math.lendiry(h * 0.5 - ah * 0.25, r) + Math.lendiry(aw * 0.1, r - 90)
		});
		p.push({
			x: Math.lendirx(h * 0.5 - ah * 0.25, r) + Math.lendirx(aw * 0.1, r + 90),
			y: Math.lendiry(h * 0.5 - ah * 0.25, r) + Math.lendiry(aw * 0.1, r + 90)
		});
		CTX.beginPath();
		CTX.moveTo(x + p[0].x, y + p[0].y);
		CTX.lineTo(x + p[1].x, y + p[1].y);
		CTX.lineTo(x + p[2].x, y + p[2].y);
		CTX.lineTo(x + p[3].x, y + p[3].y);
		CTX.closePath();
		Draw.setColor(C.brown);
		CTX.fill();
		CTX.beginPath();
		CTX.moveTo(x + p[4].x, y + p[4].y);
		CTX.bezierCurveTo(x + p[5].x, y + p[5].y, x + p[6].x, y + p[6].y, x + p[7].x, y + p[7].y);
		CTX.bezierCurveTo(x + p[8].x, y + p[8].y, x + p[9].x, y + p[9].y, x + p[4].x, y + p[4].y);
		CTX.closePath();
		Draw.setColor(C.gray);
		CTX.fill();
	}
}
OBJ.add(Pickaxe);

class Miner extends BranthObject {
	start() {
	}
	update() {
		if (Input.mouseDown(0)) {
			const m = Input.screenToWorldPoint(Input.mousePosition);
			const n = new Pickaxe(this.x, this.y, new Vector(m.x, m.y), Math.range(0, 360));
			OBJ.push(Pickaxe, n);
		}
	}
	render() {
		Draw.setColor(C.brown);
		Draw.circle(this.x, this.y, 12);
	}
}
OBJ.add(Miner);

Game.gold = 0;
Game.start = () => {
	Game.gold = 0;
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
	for (let r = 0; r < Grid.r; r++) {
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
// CANVAS.style.backgroundImage = `radial-gradient(burlywood 33%, peru)`;
	Draw.rect(0, 0, Room.w, Room.h);
};

Game.renderUI = () => {
	const t = Math.sin(Time.time * 0.01) * 2;
	Draw.setFont(Font.lb);
	Draw.setColor(C.gold);
	Draw.setShadow(0, 2, 2, C.black);
	Draw.setHVAlign(Align.l, Align.t);
	Draw.text(16, 16 + t, Game.gold);
	Draw.resetShadow();
	Draw.setColor(C.white);
	Draw.text(16, 14 + t, Game.gold);
};

BRANTH.start();
Room.start('Game');