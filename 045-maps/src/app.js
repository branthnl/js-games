const DATA = {
	Cell: {
		Size: 80
	},
	Grid: {
		Seed: 5,
		get Width() {
			return 180;//Room.w / DATA.Cell.Size;
		},
		get Height() {
			return 180;//Room.h / DATA.Cell.Size;
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
		x: 0,
		y: 0,
		Scale: 1,
		World: null,
		setup() {
			for (let i = 0; i < DATA.Grid.Width; i++) {
				this.Grid.push([]);
				for (let j = 0; j < DATA.Grid.Height; j++) {
					this.Grid[i].push(0);
				}
			}
			DATA.Grid.GeneratePerlinNoise(this.Grid);
			this.World = document.createElement('canvas');
			this.World.width = DATA.Grid.Width * DATA.Cell.Size + DATA.Cell.Size;
			this.World.height = DATA.Grid.Height * DATA.Cell.Size * 0.5 + DATA.Cell.Size * 0.5;
			Draw.setContext(this.World.getContext('2d'));
			for (let i = 0; i < DATA.Grid.Width; i++) {
				for (let j = 0; j < DATA.Grid.Height; j++) {
					const xx = this.World.width * 0.5 + (i - j) * DATA.Cell.Size * 0.5;
					const yy = DATA.Cell.Size * 0.5 + (i + j) * DATA.Cell.Size * 0.25;
					Draw.setColor(DATA.Grid.GetColorZ(this.Grid[i][j]));
					if (i === DATA.Grid.Width - 1 && j === DATA.Grid.Height - 1) {
						Draw.setColor(C.black);
					}
					Draw.pointRect(
						new Vector2(xx, yy - 20),
						new Vector2(xx + 40, yy),
						new Vector2(xx, yy + 20),
						new Vector2(xx - 40, yy)
					);
					// Draw.rect(xx, yy, DATA.Cell.Size, DATA.Cell.Size);
				}
			}
			Draw.rect(0, 0, this.World.width, this.World.height, true);
			Draw.resetContext();
			Draw.add(Vector2.center, 'World', this.World);
		},
		render() {
			this.x += 10 * (Input.keyHold(KeyCode.Left) - Input.keyHold(KeyCode.Right));
			this.y += 10 * (Input.keyHold(KeyCode.Up) - Input.keyHold(KeyCode.Down));
			if (Input.keyHold(KeyCode.X) ^ Input.keyHold(KeyCode.Z)) {
				this.Scale *= 1 + 0.01 * Input.keyHold(KeyCode.X) - 0.01 * Input.keyHold(KeyCode.Z);
			}
			Draw.image('World', this.x, this.y, this.Scale, this.Scale);
			// if (Input.keyDown(KeyCode.Space)) {
			// 	DATA.Grid.GeneratePerlinNoise(this.Grid);
			// }
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

Game.renderUI = () => {
	Draw.setFont(Font.xxl, Font.bold);
	Draw.setColor(C.white);
	Draw.setHVAlign(Align.l, Align.t);
	Draw.text(20, 20, Time.FPS);
};

BRANTH.start();
Room.start('Boot');