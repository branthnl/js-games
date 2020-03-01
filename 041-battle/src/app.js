const DATA = {
	TILE_SIZE: 10,
	UNIT_STATE: {
		IDLE: 0,
		CHASE: 1,
		ATTACK: 2
	},
	UNIT: [
		{
			name: 'Militia',
			size: 1,
			hitPoint: 50,
			attackStrength: 2,
			attackRange: 1,
			machine: 
			// IDLE
			[{
				startChase(target) {
					this.target = target;
					this.changeState(DATA.UNIT_STATE.CHASE);
				},
				update() {
					const h = OBJ.take(Unit);
					for (let i = h.length - 1; i >= 0; i--) {
						const j = h[i];
						// Check if it is an enemy
						if (j.userIndex !== this.userIndex) {
							// Check if the enemy in range
							if (Math.pointdis(this, j) < this.data.attackRange * DATA.TILE_SIZE) {
								this.dispatch('startChase', j);
								break;
							}
						}
					}
				}
			},
			// CHASE
			{
				attack(target) {
					target.hp -= this.atk;
				},
				update() {
					if (this.target) {
					}
				}
			},
			// ATTACK
			{
			}]
		},
		{
			name: 'Archer',
			size: 1,
			hitPoint: 50,
			attackStrength: 2,
			attackRange: 1,
			machine: 
			// IDLE
			[{
				chase(target) {
					this.target = target;
					this.changeState(DATA.UNIT_STATE.CHASE);
				},
				update() {
					const h = OBJ.take(Unit);
					for (let i = h.length - 1; i >= 0; i--) {
						const j = h[i];
						// Check if it is an enemy
						if (j.userIndex !== this.userIndex) {
							// Check if the enemy in range
							if (Math.pointdis(this, j) < this.data.attackRange * DATA.TILE_SIZE) {
								this.dispatch('chase', j);
								break;
							}
						}
					}
				}
			},
			// CHASE
			{
				attack(target) {
					target.hp -= this.atk;
				}
			},
			// ATTACK
			{
			}]
		},
		{
			name: 'Cavalry',
			size: 2,
			hitPoint: 50,
			attackStrength: 2,
			attackRange: 1,
			machine: 
			// IDLE
			[{
				chase(target) {
					this.target = target;
					this.changeState(DATA.UNIT_STATE.CHASE);
				},
				update() {
					// const h = OBJ.take(Unit);
					// for (let i = h.length - 1; i >= 0; i--) {
					// 	const j = h[i];
					// 	// Check if it is an enemy
					// 	if (j.userIndex !== this.userIndex) {
					// 		// Check if the enemy in range
					// 		if (Math.pointdis(this, j) < this.data.attackRange * DATA.TILE_SIZE) {
					// 			this.dispatch('chase', j);
					// 			break;
					// 		}
					// 	}
					// }
				}
			},
			// CHASE
			{
				attack(target) {
					target.hp -= this.atk;
				}
			},
			// ATTACK
			{
			}]
		}
	]
};

class Unit extends BranthObject {
	constructor(userIndex, unitIndex, x, y) {
		super(x, y);
		this.state = DATA.UNIT_STATE.IDLE;
		this.userIndex = userIndex;
		this.unitIndex = unitIndex;
		this.target = null;
		this.acc = 2;
		this.velocity = new Vector2(0, 0);
	}
	get data() {
		return DATA.UNIT[this.unitIndex];
	}
	dispatch(actionName, ...payload) {
		const action = this.data.machine[this.state][actionName];
		if (action) action.apply(this, ...payload);
	}
	changeState(newState) {
		this.state = newState;
	}
	update() {
		this.dispatch('update');
	}
	render() {
		Draw.setColor({
			Militia: C.yellow,
			Archer: C.red,
			Cavalry: C.blue
		}[this.data.name]);
		Draw.circle(this.x, this.y, this.data.size * DATA.TILE_SIZE);
	}
}

OBJ.add(Unit);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	for (let i = 0; i < 10; i++) {
		OBJ.push(Unit, new Unit(0, 2, 50 + i * 50, 50));
		OBJ.push(Unit, new Unit(0, 0, 50 + i * 50, 150));
		OBJ.push(Unit, new Unit(1, 1, 50 + i * 50, 350));
		OBJ.push(Unit, new Unit(1, 2, 50 + i * 50, 450));
	}
};

Game.renderUI = () => {
	Draw.setFont(Font.m);
	Draw.setColor(C.black);
	Draw.setHVAlign(Align.c, Align.m);
	Draw.text(Room.mid.w, Room.mid.h, ~~Math.pointdir(new Vector2(Room.mid.w, Room.mid.h), Input.mousePosition));
};

BRANTH.start();
Room.start('Game');