class Player extends BranthObject {
	constructor(x, y) {
		super(x, y);
		this.speed = 2;
		this.faceDirection = 0; //south, 1=north, 2=west, 3=east
	}
	update() {
		if (Input.keyHold(KeyCode.Up)) {
			this.faceDirection = 1;
			this.y -= this.speed;
		}
		else if (Input.keyHold(KeyCode.Left)) {
			this.faceDirection = 2;
			this.x -= this.speed;
		}
		else if (Input.keyHold(KeyCode.Down)) {
			this.faceDirection = 0;
			this.y += this.speed;
		}
		else if (Input.keyHold(KeyCode.Right)) {
			this.faceDirection = 3;
			this.x += this.speed;
		}
	}
	render() {
		Draw.strip("hero", this.faceDirection, this.x, this.y);
	}
}

OBJ.add("Player");

const Game = Room.add("Game");

Branth.onLoadStart = () => {
	Loader.loadImage(new Vector2(0, 0), "bg", "src/img/bg.png");
	Loader.loadStrip(new Vector2(0, 0), "hero", "src/img/hero.png", 4);
	Loader.loadStrip(new Vector2(0, 0), "monster", "src/img/monster.png", 4);
};

Branth.onLoadFinish = () => {
	Room.start("Game");
};

Game.start = () => {
	OBJ.push("Player", new Player(Room.mid.w, Room.mid.h));
};

Game.render = () => {
	OBJ.updateAll();
	OBJ.renderAll();
};

Branth.start({
	w: 800,
	h: 600,
	styleParent: true,
	removeAllGap: true
});