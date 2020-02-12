Draw.add(new Vector2(0.5, 0.38), 'House', 'src/img/House.png');

const Grid = {
	g: [],
	size: 20,
	chunkSize: 200,
	type: [
		{
			name: 'grass',
			color: C.springGreen
		},
		{
			name: 'soil',
			color: C.saddleBrown
		},
		{
			name: 'drygrass',
			color: C.navajoWhite
		},
		{
			name: 'water',
			color: C.lightSkyBlue
		},
		{
			name: 'stone',
			color: C.lightSlateGray
		},
		{
			name: 'coal',
			color: C.black
		}
	],
	get chunkAmount() {
		return this.size * this.size;
	},
	get totalSize() {
		return this.size * this.chunkSize;
	},
	convert(col, row) {
		const s = this.chunkSize;
		const [k, c, r] = [~~(col / s) + ~~(row / s) * this.size, col % s, row % s];
		return { k, c, r };
	},
	get(c, r) {
		const g = Grid.convert(c, r);
		return Grid.g[g.k][g.c][g.r];
	},
	set(c, r, value) {
		const g = Grid.convert(c, r);
		Grid.g[g.k][g.c][g.r] = value;
	},
	setup() {
		this.g = [];
		for (let k = 0; k < this.chunkAmount; k++) {
			this.g.push([]);
			for (let c = 0; c < this.chunkSize; c++) {
				this.g[k].push([]);
				for (let r = 0; r < this.chunkSize; r++) {
					this.g[k][c].push(Math.randbool(0.001)? 6 : Math.irange(6));
				}
			}
		}
	}
};

const Tile = {
	w: 40,
	h: 20,
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	},
	draw(x, y, c) {
		Draw.setColor(c);
		Draw.pointRect(
			new Vector2(x, y - this.mid.h),
			new Vector2(x + this.mid.w, y),
			new Vector2(x, y + this.mid.h),
			new Vector2(x - this.mid.w, y)
		);
	}
};

const World = {
	_c: 0,
	_r: 0,
	_x: 0,
	_y: 0,
	get size() {
		return Math.max(~~(Room.w / Tile.w), ~~(Room.h / Tile.h)) * 2;
	},
	get x() {
		return Room.mid.w + this._x;
	},
	get y() {
		return Room.mid.h - (this.size - 1) * Tile.mid.h + this._y;
	},
	set x(val) {
		this._x = val;
	},
	set y(val) {
		this._y = val;
	},
	clamp(x) {
		return Math.clamp(x, 0, Grid.totalSize - 1);
	},
	get c() {
		return this._c;
	},
	get r() {
		return this._r;
	},
	set c(val) {
		this._c = val;
		this._c = this.clamp(Math.min(this._c, Grid.totalSize - this.size));
	},
	set r(val) {
		this._r = val;
		this._r = this.clamp(Math.min(this._r, Grid.totalSize - this.size));
	},
	get cEnd() {
		return this.clamp(this.c + this.size - 1);
	},
	get rEnd() {
		return this.clamp(this.r + this.size - 1);
	},
	toWorld(c, r) {
		return new Vector2(
			this.x + (c - this.c - r + this.r) * Tile.mid.w,
			this.y + (c - this.c + r - this.r) * Tile.mid.h
		);
	},
	setPosition(c, r) {
		this.c = c;
		this.r = r;
	},
	update() {
		const keyW = Input.keyDown(KeyCode.Up);
		const keyA = Input.keyDown(KeyCode.Left);
		const keyS = Input.keyDown(KeyCode.Down);
		const keyD = Input.keyDown(KeyCode.Right);
		this.c += (keyD - keyA) * (1 + 9 * Input.keyHold(KeyCode.Space));
		this.r += (keyS - keyW) * (1 + 9 * Input.keyHold(KeyCode.Space));
	},
	render() {
		for (let i = this.c; i <= this.cEnd; i++) {
			for (let j = this.r; j <= this.rEnd; j++) {
				const g = Grid.get(i, j);
				if (g < 6) {
					const p = this.toWorld(i, j);
					Tile.draw(p.x, p.y, Grid.type[g].color);
				}
			}
		}
		for (let i = this.c; i <= this.cEnd; i++) {
			for (let j = this.r; j <= this.rEnd; j++) {
				const g = Grid.get(i, j);
				if (g === 6) {
					const p = this.toWorld(i, j);
					Draw.image('House', p.x, p.y);
				}
			}
		}
	},
	renderUI() {
		Draw.setFont(Font.l);
		Draw.setColor(C.lemonChiffon);
		Draw.setShadow(0, 4, 5, C.black);
		Draw.setHVAlign(Align.l, Align.b);
		const g = Grid.convert(this.c, this.r);
		Draw.text(8, Room.h - 8, `(${this.c}, ${this.r}) —> (${this.cEnd}, ${this.rEnd})\n\nGrid.g[${g.k}][${g.c}][${g.r}]\n\n(${~~Room.w}, ${~~Room.h})`);
		Draw.resetShadow();
	}
};

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
};

Game.update = () => {
	World.update();
};

Game.render = () => {
	World.render();
};

Game.renderUI = () => {
	World.renderUI();
};

Grid.setup();
BRANTH.start();
Room.start('Game');