const r = 40;

class Obj extends BranthObject {
	constructor(x, y) {
		super(x, y);
		this.color = C.black;
	}
	get mouseHover() {
		return Math.pointdis(this, Input.mousePosition) < r;
	}
	update() {
		if (Input.mouseDown(0)) {
			if (this.mouseHover) {
				const id = Math.pick(OBJ.take(Math.choose(Obj1, Obj2, Obj3, Obj4, Obj5))).id;
				console.log(`${this.constructor.name} (${this.id}) destroys ${OBJ.get(id).constructor.name} (${id})`);
				OBJ.destroy(id);
			}
		}
	}
	render() {
		Draw.setColor(this.mouseHover? C.white : this.color);
		Draw.circle(this.x, this.y, r);
		Draw.setFont(Font.m);
		Draw.setColor(C.black);
		Draw.setHVAlign(Align.c, Align.m);
		Draw.text(this.x, this.y, this.id);
	}
}

class Obj1 extends Obj {
	awake() {
		this.color = C.red;
	}
}

class Obj2 extends Obj {
	awake() {
		this.color = C.orange;
	}
}

class Obj3 extends Obj {
	awake() {
		this.color = C.yellow;
	}
}

class Obj4 extends Obj {
	awake() {
		this.color = C.green;
	}
}

class Obj5 extends Obj {
	awake() {
		this.color = C.blue;
	}
}

OBJ.add(Obj1);
OBJ.add(Obj2);
OBJ.add(Obj3);
OBJ.add(Obj4);
OBJ.add(Obj5);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	for (let i = Room.w - r; i >= r; i -= r * 2) {
		for (let j = Room.h - r; j >= r; j -= r * 2) {
			OBJ.create(Math.choose(Obj1, Obj2, Obj3, Obj4, Obj5), i, j);
		}
	}
};

BRANTH.start();
Room.start('Game');