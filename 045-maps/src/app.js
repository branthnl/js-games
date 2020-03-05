class GridData {
	constructor(type, pass) {
		this.type = type;
		this.pass = pass;
	}
}

const DATA = {
	Grid: {
		Size: 1000
	}
};

const Manager = {
	Game: {
		Grid: [],
		Grid2: [],
		setup() {
			// Creating and loading grid
			let t = 0;
			const rtime = 10;
			const total1 = {
				creating: 0,
				looping: 0
			};
			const total2 = {
				creating: 0,
				looping: 0
			};
			const arr = [];
			for (let h = 0; h < rtime * 2; h++) {
				this.Grid = [];
				this.Grid2 = [];
				const type = h % 2 === 0? '1 ArrClass' : '2 ArrNumbers';
				if (type === '1 ArrClass') {
					// Creating
					t = performance.now();
					for (let i = 0; i < DATA.Grid.Size; i++) {
						this.Grid.push([]);
						for (let j = 0; j < DATA.Grid.Size; j++) {
							// this.Grid[i].push({
							// 	type: Math.irange(0, 8),
							// 	pass: Math.choose(0, 1, 2)
							// });
							this.Grid[i].push(new GridData(Math.irange(0, 8), Math.choose(0, 1, 2)));
						}
					}
					t = performance.now() - t;
					// arr.push({
					// 	type: `Creating ${type}`,
					// 	time: t
					// });
					total1.creating += t;
					// Set all properties to 0
					t = performance.now();
					for (let i = 0; i < DATA.Grid.Size; i++) {
						for (let j = 0; j < DATA.Grid.Size; j++) {
							this.Grid[i][j].type = 0;
							this.Grid[i][j].pass = 0;
						}
					}
					t = performance.now() - t;
					// arr.push({
					// 	type: `Set all properties to 0`,
					// 	time: t
					// });
					total1.looping += t;
				}
				else {
					// Creating
					t = performance.now();
					for (let i = 0; i < DATA.Grid.Size; i++) {
						this.Grid.push([]);
						this.Grid2.push([]);
						for (let j = 0; j < DATA.Grid.Size; j++) {
							this.Grid[i].push(Math.irange(0, 8));
							this.Grid2[i].push(Math.choose(0, 1, 2));
						}
					}
					t = performance.now() - t;
					// arr.push({
					// 	type: `Creating ${type}`,
					// 	time: t
					// });
					total2.creating += t;
					// Set all properties to 0
					t = performance.now();
					for (let i = 0; i < DATA.Grid.Size; i++) {
						for (let j = 0; j < DATA.Grid.Size; j++) {
							this.Grid[i][j] = 0;
							this.Grid2[i][j] = 0;
						}
					}
					t = performance.now() - t;
					// arr.push({
					// 	type: `Set all properties to 0`,
					// 	time: t
					// });
					total2.looping += t;
				}
			}
			arr.push({
				type: `Creating (${rtime}) 1 ArrClass TOTAL`,
				time: total1.creating
			});
			arr.push({
				type: `Creating (${rtime}) 2 ArrNumbers TOTAL`,
				time: total2.creating
			});
			arr.push({
				type: `Looping (${rtime}) 1 ArrClass TOTAL`,
				time: total1.looping
			});
			arr.push({
				type: `Looping (${rtime}) 2 ArrNumbers TOTAL`,
				time: total2.looping
			});
			arr.push({
				type: `Creating 1 ArrClass AVERAGE`,
				time: total1.creating / rtime
			});
			arr.push({
				type: `Creating 2 ArrNumbers AVERAGE`,
				time: total2.creating / rtime
			});
			arr.push({
				type: `Looping 1 ArrClass AVERAGE`,
				time: total1.looping / rtime
			});
			arr.push({
				type: `Looping 2 ArrNumbers AVERAGE`,
				time: total2.looping / rtime
			});
			console.table(arr, ['type', 'time']);
		}
	}
};

const Boot = new BranthRoom('Boot');
const Game = new BranthRoom('Game');
Room.add(Boot);
Room.add(Game);

Boot.start = () => {
	Manager.Game.setup();
};

BRANTH.start();
Room.start('Boot');