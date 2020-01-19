const Game = new BranthRoom('Game', 640, 360);
Room.add(Game);

const Task = {
	IDLE: 0,
	BUILD: 1,
	GATHER: 2
};

const Storage = {
	wood: 0,
	food: 0,
	gold: 0,
	stone: 0
};

class Resource extends BranthObject {
	static get WOOD() {
		return 'wood';
	}
	static get FOOD() {
		return 'food';
	}
	static get GOLD() {
		return 'gold';
	}
	static get STONE() {
		return 'stone';
	}
	awake() {
		this.type = Math.choose(Resource.WOOD, Resource.FOOD, Resource.GOLD, Resource.STONE);
		this.amount = 100;
		this.boxW = Math.range(24, 64);
		this.boxH = Math.range(24, 64);
		this.bound = {
			l: 0,
			r: 0,
			t: 0,
			b: 0
		};
	}
	hover(m) {
		return m.x >= this.bound.l && m.x <= this.bound.r && m.y >= this.bound.t && m.y <= this.bound.b;
	}
	onclick() {
		const v = OBJ.take(Villager)[0];
		v.setTarget(Task.GATHER, this);
	}
	update() {
		this.bound.l = this.x - this.boxW * 0.5;
		this.bound.r = this.x + this.boxW * 0.5;
		this.bound.t = this.y - this.boxH * 0.5;
		this.bound.b = this.y + this.boxH * 0.5;
		if (Input.mouseDown(0)) {
			const m = Input.screenToWorldPoint(Input.mousePosition);
			if (this.hover(m)) {
				this.onclick();
			}
		}
	}
	render() {
		Draw.setColor(C.blue);
		Draw.rect(this.bound.l, this.bound.t, this.boxW, this.boxH);
		Draw.setFont('bold 8px');
		Draw.setHVAlign(Align.c, Align.m);
		Draw.setColor(C.gold);
		Draw.text(this.x, this.y, this.type.toUpperCase()[0] + this.type.split('').filter((v, i) => i > 0).join(''));
	}
}
OBJ.add(Resource);

class Villager extends BranthBehaviour {
	awake() {
		this.task = Task.BUILD;
		this.buildTarget = null;
		this.gatherTarget = null;
		this.xto = this.x;
		this.yto = this.y;
		this.xdif = 0;
		this.ydif = 0;
		this.wood = 0;
		this.food = 0;
		this.gold = 0;
		this.stone = 0;
		this.canStore = false;
		this.canGather = true;
		this.walkToStorage = false;
	}
	setTarget(task, target) {
		this.task = task;
		switch (this.task) {
			case Task.BUILD: this.buildTarget = target; break;
			case Task.GATHER: this.gatherTarget = target; break;
		}
	}
	get rangeToTarget() {
		return Math.abs(this.xdif) + Math.abs(this.ydif);
	}
	update() {
		switch (this.task) {
			case Task.BUILD: break;
			case Task.GATHER:
				if (this.gatherTarget instanceof Resource) {
					if (!this.walkToStorage) {
						this.xto = this.gatherTarget.x;
						this.yto = this.gatherTarget.y;
						if (this.rangeToTarget < 10) {
							if (this.canGather) {
								switch (this.gatherTarget.type) {
									case Resource.WOOD: this.wood++; break;
									case Resource.FOOD: this.food++; break;
									case Resource.GOLD: this.gold++; break;
									case Resource.STONE: this.stone++; break;
								}
								if (this.wood >= 10 || this.food >= 10 || this.gold >= 10 || this.stone >= 10) {
									this.xto = 32;
									this.yto = 32;
									this.canStore = true;
									this.walkToStorage = true;
								}
								this.alarm[0] = Math.range(800, 1200);
								this.canGather = false;
							}
						}
					}
					else {
						if (this.rangeToTarget < 10) {
							if (this.canStore) {
								Storage.wood += this.wood;
								Storage.food += this.food;
								Storage.gold += this.gold;
								Storage.stone += this.stone;
								this.wood = 0;
								this.food = 0;
								this.gold = 0;
								this.stone = 0;
								this.canStore = false;
								this.alarm[1] = Math.range(1800, 2200);
							}
						}
					}
				}
				break;
		}
		this.xdif = this.xto - this.x;
		this.ydif = this.yto - this.y;
		this.x += Math.sign(this.xdif) * Math.min(Math.abs(this.xdif), 1);
		this.y += Math.sign(this.ydif) * Math.min(Math.abs(this.ydif), 1);
	}
	render() {
		Draw.setColor(C.gray);
		Draw.circle(this.x, this.y, 6);
	}
	renderUI() {
		Draw.setFont('bold 8px');
		Draw.setColor(C.black);
		Draw.setHVAlign(Align.c, Align.b);
		Draw.text(this.x, this.y - 10, `Wood: ${this.wood}, Food: ${this.food}, Gold: ${this.gold}, Stone: ${this.stone}`);
	}
	alarm0() {
		this.canGather = true;
	}
	alarm1() {
		this.walkToStorage = false;
	}
}
OBJ.add(Villager);

Game.start = () => {
	for (let i = 0; i < 10; i++) {
		OBJ.create(Resource, Math.range(i % 2 === 0? 32 : Room.mid.w, i % 2 === 0? Room.mid.w : Room.w - 32), 32 + Math.floor(i * 0.5) * Room.h * 0.2);
	}
	OBJ.create(Villager, Room.mid.w, Room.mid.h);
};

Game.renderUI = () => {
	Draw.setFont(Font.s);
	Draw.setColor(C.black);
	Draw.setHVAlign(Align.l, Align.t);
	Draw.text(4, 4, `Wood: ${Storage.wood}, Food: ${Storage.food}, Gold: ${Storage.gold}, Stone: ${Storage.stone}`);
};

BRANTH.start();
Room.start('Game');