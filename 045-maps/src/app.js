const DATA = {
	Cell: {
		Size: 8
	},
	Grid: {
		Seed: 5,
		get Width() {
			return Room.w / DATA.Cell.Size;
		},
		get Height() {
			return Room.h / DATA.Cell.Size;
		},
		GetColorZ(z) {
			return z < 50? `rgba(0, ${50 + z * 4}, 0, 1)` : `rgba(0, 0, ${50 + (z - 50) * 4}, 1)`;
		},
		randomSeed(range, xx) {
			let seed = this.Seed + xx;
		},
		GetPerlinNoise2D(x, y, range) {
			let chunkSize = 16;
			let noise = 0;
			range *= 0.5;
			let r00 = this.randomSeed(range);
			while (chunkSize-- > 0) {
			}
		},
		GeneratePerlinNoise(grid) {
			for (let i = 0; i < this.Width; i++) {
				for (let j = 0; j < this.Height; j++) {
					let zz = Math.range(100);
					grid[i][j] = zz;
				}
			}
		}
	}
};

const Manager = {
	Game: {
		Grid: [],
		setup() {
			for (let i = 0; i < DATA.Grid.Width; i++) {
				this.Grid.push([]);
				for (let j = 0; j < DATA.Grid.Height; j++) {
					this.Grid[i].push(0);
				}
			}
			DATA.Grid.GeneratePerlinNoise(this.Grid);
		},
		render() {
			for (let i = 0; i < DATA.Grid.Width; i++) {
				const xx = i * DATA.Cell.Size;
				for (let j = 0; j < DATA.Grid.Height; j++) {
					const yy = j * DATA.Cell.Size;
					Draw.setColor(DATA.Grid.GetColorZ(this.Grid[i][j]));
					Draw.rect(xx, yy, DATA.Cell.Size, DATA.Cell.Size);
				}
			}
			if (Input.keyDown(KeyCode.Space)) {
				DATA.Grid.GeneratePerlinNoise(this.Grid);
			}
		}
	}
};

const Boot = new BranthRoom('Boot');
const Game = new BranthRoom('Game');
Room.add(Boot);
Room.add(Game);

Boot.start = () => {
	Manager.Game.setup();
	Room.start('Game');
};

Game.render = () => {
	Manager.Game.render();
};

BRANTH.start();
Room.start('Boot');