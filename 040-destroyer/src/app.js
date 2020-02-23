const r = 100;

class Obj extends BranthObject {
	constructor(x, y) {
		super(x, y);
		this.depth = -y;
		this.color = C.orange;
	}
	awake() {
		this.active = false;
		console.log('Awake ' + this.id);
	}
	start() {
		console.log('Start ' + this.id);
	}
	afterStart() {
		console.log('After Start ' + this.id);
	}
	get mouseHover() {
		return Math.pointdis(this, Input.mousePosition) < r;
	}
	update() {
		console.log('Update ' + this.id);
		if (Input.mouseDown(0)) {
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

OBJ.add(Obj);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	for (let i = Room.w - r; i >= r; i -= r * 2) {
		for (let j = Room.h - r; j >= r; j -= r * 2) {
			OBJ.create(Obj, i, j);
		}
	}
};

Game.update = () => {
	if (Input.mouseDouble(0)) {
		console.log('Left double pressed.');
	}
	if (Input.mouseDouble(2)) {
		console.log('Right double pressed.');
	}
};

Game.render = () => {
	Draw.text(Room.mid.w, 32, `${~~Room.w}, ${~~Room.h}`);
};

Game.renderUI = () => {
	const n = OBJ.nearest(Obj, Input.mousePosition.x, Input.mousePosition.y);
	if (n) {
		Draw.text(n.x, n.y - 20, `I'm the nearest!`);
	}
};

BRANTH.start();
Room.start('Game');