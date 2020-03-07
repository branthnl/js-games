const Grid = [];

class Wall extends BranthObject {
	constructor(c, r) {
		super(0, 0);
		this.c = c;
		this.r = r;
		this.updatePosition();
	}
	updatePosition() {
		this.x = this.c * 64;
		this.y = this.r * 64;
	}
	getWallAround() {
		let i = 0;
		let wallUp = false;
		let wallLeft = false;
		let wallDown = false;
		let wallRight = false;
		let wallUpLeft = false;
		let wallUpRight = false;
		let wallDownLeft = false;
		let wallDownRight = false;
		if (this.r > 0) if (Grid[this.c][this.r - 1] !== null) wallUp = true;
		if (this.c > 0) if (Grid[this.c - 1][this.r] !== null) wallLeft = true;
		if (this.r < Grid[0].length - 1) if (Grid[this.c][this.r + 1] !== null) wallDown = true;
		if (this.c < Grid.length - 1) if (Grid[this.c + 1][this.r] !== null) wallRight = true;
		if (this.c > 0 && this.r > 0) if (Grid[this.c - 1][this.r - 1] !== null) wallUpLeft = true;
		if (this.c < Grid.length - 1 && this.r > 0) if (Grid[this.c + 1][this.r - 1] !== null) wallUpRight = true;
		if (this.c > 0 && this.r < Grid[0].length - 1) if (Grid[this.c - 1][this.r + 1] !== null) wallDownLeft = true;
		if (this.c < Grid.length - 1 && this.r < Grid[0].length - 1) if (Grid[this.c + 1][this.r + 1] !== null) wallDownRight = true;
		return {
			N: wallUp,
			NE: wallUpRight,
			E: wallRight,
			SE: wallDownRight,
			S: wallDown,
			SW: wallDownLeft,
			W: wallLeft,
			NW: wallUpLeft
		};
	}
	render() {
		const img = this.getImage('tiles');
		if (img) {
			const sw = img.width / img.strip;
			const s = {
				w: img.width / img.strip,
				h: img.height,
				get x() {
					return index * this.w;
				},
				y: 0
			};
			const d = {
				w: s.w * xscale,
				h: s.h * yscale,
				get x() {
					return -this.w * (xscale < 0? 1 - img.origin.x : img.origin.x);
				},
				get y() {
					return -this.h * (yscale < 0? 1 - img.origin.y : img.origin.y);
				}
			};
			CTX.save();
			CTX.translate(x, y);
			CTX.scale(Math.sign(xscale), Math.sign(yscale));
			CTX.rotate(rot * Math.PI / 180);
			CTX.globalAlpha = alpha;
			CTX.drawImage(img, s.x, s.y, s.w, s.h, d.x, d.y, d.w, d.h);
			CTX.globalAlpha = 1;
			CTX.restore();
		}
	}
}

OBJ.add(Wall);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	Draw.add(Vector2.zero, 'tiles', 'src/img/grass_tile.png');
	for (let i = 0; i < Room.w / 64; i++) {
		Grid.push([]);
		for (let j = 0; j < Room.h / 64; j++) {
			Grid[i].push(null);
		}
	}
};

Game.update = () => {
	if (Input.mouseHold(0)) {
		let m = Input.mousePosition;
		m = new Vector2(~~(m.x / 64), ~~(m.y / 64));
		if (Grid[m.x][m.y] === null) {
			Grid[m.x][m.y] = OBJ.create(Wall, m.x, m.y);
			for (const i of OBJ.take(Wall)) {
				i.imageIndex = i.getAutoTileIndex();
			}
		}
	}
};

BRANTH.start();
Room.start('Game');