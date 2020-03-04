Draw.addStrip(Vector2.center, 'Loot', 'src/img/Loot.png', 12);

const DATA = {
	Loot: {
		Amount: 12,
		Names: [
			'Apple',
			'Banana',
			'Bomb',
			'Book Blue',
			'Book Gold',
			'Book Red',
			'Boulder',
			'Burger',
			'Cherry',
			'Chocolate Bar',
			'Diamond',
			'Dynamite'
		]
	}
};

class Loot extends BranthObject {
	constructor(lootIndex, value, x, y) {
		super(x, y);
		this.lootIndex = lootIndex;
		this.value = value;
		this.r = 16;
	}
	render() {
		Draw.strip('Loot', this.lootIndex, this.x, this.y);
		Draw.setFont(Font.m);
		Draw.setColor(C.black);
		Draw.setHVAlign(Align.c, Align.m);
		Draw.textWB(this.x, this.y, this.value);
	}
}

class Player extends BranthObject {
	awake() {
		this.r = 16;
		this.loot = [];
		this.lootIndexes = [];
	}
	get spd() {
		return 2 + 2 * Input.keyHold(KeyCode.Shift);
	}
	addLoot(lootIndex, value) {
		let i = this.lootIndexes.indexOf(lootIndex);
		if (i === -1) {
			this.loot.push(0);
			this.lootIndexes.push(lootIndex);
			i = this.lootIndexes.length - 1;
		}
		this.loot[i] += value;
	}
	update() {
		this.x += this.spd * (Input.keyHold(KeyCode.D) - Input.keyHold(KeyCode.A));
		this.y += this.spd * (Input.keyHold(KeyCode.S) - Input.keyHold(KeyCode.W));
		const o = OBJ.take(Loot);
		for (let i = o.length - 1; i >= 0; i--) {
			const j = o[i];
			if (Vector2.distance(this, j) < this.r + j.r) {
				this.addLoot(j.lootIndex, j.value);
				OBJ.destroy(j.id);
			}
		}
	}
	render() {
		Draw.setColor(C.white);
		Draw.rectRotated(this.x, this.y, this.r * 2, this.r * 2);
		Draw.setColor(C.black);
		Draw.rectRotated(this.x, this.y, this.r * 2, this.r * 2, 0, true);
	}
}

class GameManager extends BranthBehaviour {
	constructor() {
		super(0, 0);
		this.alarm[0] = 100;
		this.p = OBJ.create(Player, Room.mid.w, Room.mid.h);
	}
	renderUI() {
		const m = ~~(Math.sqrt(DATA.Loot.Amount)) + 2;
		const x = Room.mid.w, y = Room.mid.h, s = 32, w = Math.min(m * 2, DATA.Loot.Amount * 2), h = Math.ceil(DATA.Loot.Amount / m) + 1 + Math.floor((DATA.Loot.Amount - 1) / m);
		Draw.setAlpha(0.5);
		Draw.setColor(C.black);
		Draw.rect(x - s * w * 0.5, y - s * h * 0.5, s * w, s * h);
		Draw.setAlpha(1)
		Draw.setFont(Font.sm);
		Draw.setHVAlign(Align.l, Align.t);
		const l = this.p.loot.length;
		for (let i = DATA.Loot.Amount - 1; i >= 0; i--) {
			const j = {
				x: x - s * (w * 0.5 - 0.5 - 2 * (i % m)),
				y: y - s * (h * 0.5 - 0.5 - 2 * ~~(i / m))
			};
			Draw.setColor(C.slateBlue);
			Draw.rect(j.x, j.y, s, s);
			if (l > i) {
				Draw.strip('Loot', this.p.lootIndexes[i], j.x + s * 0.5, j.y + s * 0.5);
				Draw.textWB(j.x + 4, j.y + 4, this.p.loot[i]);
			}
		}
		Draw.setFont(Font.m);
		Draw.setColor(C.black);
		Draw.setHVAlign(Align.c, Align.b);
		Draw.text(x, y - s * h * 0.5 - 8, 'INVENTORY');
	}
	alarm0() {
		if (OBJ.take(Loot).length < 50) {
			OBJ.create(Loot, Math.irange(DATA.Loot.Amount), Math.irange(1, 10), 32 + Math.range(Room.w - 64), 32 + Math.range(Room.h - 64));
		}
		this.alarm[0] = 100;
	}
}

OBJ.add(Loot);
OBJ.add(Player);
OBJ.add(GameManager);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	OBJ.create(GameManager);
};

Game.renderUI = () => {
	OBJ.take(GameManager)[0].renderUI();
};

BRANTH.start();
Room.start('Game');