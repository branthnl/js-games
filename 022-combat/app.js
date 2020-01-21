const Game = new BranthRoom('Game', 1280, 720);
Room.add(Game);

const Tile = {
	w: 24,
	h: 24
};

const Grid = {
	g: [],
	r: 40,
	c: 40,
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
}
OBJ.add(TownHall);

class Barbarian extends BranthBehaviour {}
OBJ.add(Barbarian);

Game.start = () => {
	const n = new TownHall(Grid.mid.r, Grid.mid.c);
	OBJ.push(TownHall, n);
};

BRANTH.start();
Room.start('Game');