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
		while (openSet.length > 0) {
			return [goal];
		}
		return [goal];
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