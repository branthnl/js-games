const r = 100;

class Obj extends BranthObject {
	constructor(x, y) {
		super(x, y);
		this.depth = -y;
		this.color = C.black;
	}
	get mouseHover() {
		return Math.pointdis(this, Input.mousePosition) < r;
	}
	update() {
		if (Input.mouseDown(0)) {
			console.log('Update ' + this.id);
			if (this.mouseHover) {
				let id = Math.pick(OBJ.take(this.constructor)).id;
				console.log(`${this.constructor.name} (${this.id}) destroys ${OBJ.get(id).constructor.name} (${id})`);
				OBJ.destroy(id);
				id = Math.pick(OBJ.take(this.constructor)).id;
				console.log(`${this.constructor.name} (${this.id}) destroys ${OBJ.get(id).constructor.name} (${id})`);
				OBJ.destroy(id);
			}
		}
	}
	render() {
		Draw.setColor(this.mouseHover? C.white : this.color);
		Draw.circle(this.x, this.y, r);
		Draw.setColor(C.black);
		Draw.draw(true);
		Draw.setFont(Font.s);
		Draw.setHVAlign(Align.c, Align.m);
		Draw.text(this.x, this.y, this.id);
	}
}

class Obj1 extends Obj {
	awake() {
		this.color = C.red;
	}
}

OBJ.add(Obj1);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	for (let i = Room.w - r; i >= r; i -= r * 2) {
		for (let j = Room.h - r; j >= r; j -= r * 2) {
			OBJ.create(Obj1, i, j);
		}
	}
};

BRANTH.start();
Room.start('Game');