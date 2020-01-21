const Game = new BranthRoom('Game', 1280, 720);
Room.add(Game);

const Tile = {
	w: 24,
	h: 24
};

const Grid = {
	g: [],
	r: 40,
	c: 25,
	get mid() {
		return {
			r: this.r * 0.5,
			c: this.c * 0.5
		};
	},
	EMPTY: 'Empty',
	BUILDING: 'Building'
};

const World = {
	get x() {
		return Room.mid.w - Grid.mid.r * Tile.w;
	},
	get y() {
		return Room.mid.h - Grid.mid.c * Tile.h;
	},
	get w() {
		return Grid.r * Tile.w;
	},
	get h() {
		return Grid.c * Tile.h;
	}
};

const getTileFromGrid = (r, c) => {
	return {
		x: World.x + r * Tile.w,
		y: World.y + c * Tile.h
	};
};

const getTileFromScreen = (x, y, round) => {
	if (round === false) {
		return {
			r: (x - World.x) / Tile.w,
			c: (y - World.y) / Tile.h
		};
	}
	return {
		r: Math.floor((x - World.x) / Tile.w),
		c: Math.floor((y - World.y) / Tile.h)
	};
};

for (let i = 0; i < Grid.r; i++) {
	Grid.g.push([]);
	for (let j = 0; j < Grid.c; j++) {
		Grid.g[i].push(Grid.EMPTY);
	}
}

class TownHall extends BranthBehaviour {
	constructor(r, c) {
		super(0, 0);
		this.r = r;
		this.c = c;
		this.hp = 1000;
		this.update();
	}
	update() {
		const b = getTileFromGrid(this.r, this.c);
		this.x = b.x;
		this.y = b.y;
	}
	render() {
		Draw.setColor(C.orange);
		Draw.circle(this.x, this.y, Math.max(Tile.w, Tile.h));
	}
	renderUI() {
		Draw.setFont(Font.m);
		Draw.setColor(C.black);
		Draw.setHVAlign(Align.c, Align.b);
		Draw.text(this.x, this.y - 12, Math.floor(this.hp));
	}
}
OBJ.add(TownHall);

class Barbarian extends BranthBehaviour {
	constructor(r, c) {
		super(0, 0);
		this._target = null;
		this.r = r;
		this.c = c;
		this.atk = 0.1;
		this.spd = 0.05;
		this.range = 1;
		this.update();
	}
	set target(value) {
		if (value instanceof TownHall) {
			const o = Math.lendir(this.range * Math.hypot(Tile.w, Tile.h), Math.pointdir(value.x, value.y, this.x, this.y));
			const b = getTileFromScreen(value.x + o.x, value.y + o.y, false);
			console.log(b);
			this._target = {
				r: b.r,
				c: b.c,
				v: value
			};
		}
		else {
			this._target = null;
		}
	}
	get target() {
		return this._target;
	}
	update() {
		const b = getTileFromGrid(this.r, this.c);
		this.x = b.x;
		this.y = b.y;
		if (this.target !== null) {
			const rdif = this.target.r - this.r;
			const cdif = this.target.c - this.c;
			this.r += Math.min(Math.abs(rdif), this.spd) * Math.sign(rdif);
			this.c += Math.min(Math.abs(cdif), this.spd) * Math.sign(cdif);
			if (Math.abs(rdif) + Math.abs(cdif) <= this.spd) {
				this.target.v.hp -= this.atk;
				if (this.target.v.hp <= 0) {
					OBJ.destroy(this.target.v.id);
					this.target = null;
				}
			}
		}
		else {
			this.target = OBJ.take(TownHall)[0];
		}
	}
	render() {
		Draw.setColor(C.blue);
		Draw.circle(this.x, this.y, 5);
	}
}
OBJ.add(Barbarian);

Game.start = () => {
	const n = new TownHall(Grid.mid.r, Grid.mid.c);
	OBJ.push(TownHall, n);
	this.unitAmount = 8;
};

Game.update = () => {
	if (Input.mouseDown(0) && this.unitAmount > 0) {
		const m = Input.screenToWorldPoint(Input.mousePosition);
		const b = getTileFromScreen(m.x, m.y);
		const n = new Barbarian(b.r + 0.5, b.c + 0.5);
		OBJ.push(Barbarian, n);
		this.unitAmount--;
	}
};

Game.render = () => {
	for (let r = 0; r < Grid.r; r++) {
		for (let c = 0; c < Grid.c; c++) {
			const b = getTileFromGrid(r, c);
			Draw.setColor(C.black);
			Draw.rect(b.x, b.y, Tile.w, Tile.h, true);
		}
	}
};

Game.renderUI = () => {
	Draw.setFont(Font.m);
	Draw.setColor(C.black);
	Draw.setHVAlign(Align.c, Align.m);
	Draw.text(32, Room.h - 32, this.unitAmount);
};

BRANTH.start();
Room.start('Game');