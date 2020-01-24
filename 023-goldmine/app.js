const Menu = new BranthRoom('Menu', 720, 1280);
const Game = new BranthRoom('Game', 720, 1280);
Room.add(Menu);
Room.add(Game);

const Tile = {
	w: 40,
	h: 40
};

const Grid = {
	g: [],
	c: 18,
	r: 29,
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
		for (let c = 0; c < Grid.c; c++) {
			for (let r = 0; r < Grid.r; r++) {
				const b = this.fromGrid(c, r);
				Draw.setColor(C.black);
				Draw.rect(b.x, b.y, Tile.w, Tile.h, true);
			}
		}
	}
};

class Gold extends BranthObject {
	render() {
		Draw.setColor(C.gold);
		Draw.roundRect(this.x + 1, this.y + 1, Tile.w - 2, Tile.h - 2, 4);
	}
}
OBJ.add(Gold);

class Boom extends BranthBehaviour {
	start() {
		const b = World.fromScreen(this.x, this.y, true);
		if (b.c >= 0 && b.c < Grid.c && b.r >= 0 && b.r < Grid.r) {
			if (Grid.g[b.c][b.r] instanceof Gold) {
				Game.gold++;
				OBJ.destroy(Grid.g[b.c][b.r].id);
			}
		}
		this.alarm[0] = 60;
	}
	alarm0() {
		OBJ.destroy(this.id);
	}
	render() {
		Emitter.preset('sparkle');
		Emitter.setArea(this.x - Tile.w * 0.5, this.x + Tile.w * 0.5, this.y - Tile.h * 0.5, this.y + Tile.h * 0.5);
		Emitter.setColor(C.gold);
		Emitter.emit(1);
		Emitter.setColor(C.lemonChiffon);
		Emitter.emit(1);
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
		}
		this.rot += this.rotSpd;
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

Menu.update = () => {
	if (Input.mouseDown(0)) {
		Room.start('Game');
	}
};

Menu.renderUI = () => {
	Draw.setFont(Font.xlb);
	Draw.setColor(C.black);
	Draw.setHVAlign(Align.c, Align.t);
	Draw.text(Room.mid.w, 20, 'Gold Mine');
	Draw.setFont(Font.l);
	Draw.setHVAlign(Align.c, Align.m);
	Draw.text(Room.mid.w, Room.mid.h, 'Tap anywhere to start');
};

Game.gold = 0;
Game.start = () => {
	Game.gold = 0;
	Grid.start();
	for (let c = 0; c < Grid.c; c++) {
		for (let r = 0; r < Grid.r; r++) {
			const b = World.fromGrid(c, r, true);
			Grid.g[c][r] = OBJ.create(Gold, b.x, b.y);
		}
	}
	OBJ.create(Miner, Room.mid.w, 32);
};

Game.render = () => {
	World.render();
};

Game.renderUI = () => {
	Draw.setFont(Font.lb);
	Draw.setColor(C.gold);
	Draw.setShadow(0, 2, 2, C.black);
	Draw.setHVAlign(Align.l, Align.t);
	Draw.text(16, 16, Game.gold);
	Draw.resetShadow();
	Draw.setColor(C.white);
	Draw.text(16, 14, Game.gold);
};

BRANTH.start();
Room.start('Game');