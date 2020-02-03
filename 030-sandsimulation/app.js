OBJ.isExists = (cls, x, y) => {
	for (const n of OBJ.take(cls)) {
		if (n.x === x && n.y === y) {
			return true;
		}
	}
	return false;
};

class Sand extends BranthObject {
	update() {
		if (this.y < Room.h - 10) {
			if (!OBJ.isExists(Sand, this.x, this.y + 10)) {
				this.y += 10;
			}
		}
	}
	render() {
		Draw.setColor(C.yellow);
		Draw.rect(this.x, this.y, 10, 10);
	}
}

OBJ.add(Sand);

const Game = new BranthRoom('Game', 1280, 720);
Room.add(Game);

Game.update = () => {
	if (Input.mouseHold(0)) {
		const m = Input.screenToWorldPoint(Input.mousePosition);
		OBJ.create(Sand, Math.round(m.x / 10) * 10, Math.round(m.y / 10) * 10);
		if (OBJ.take(Sand).length > Room.w * Room.h * 0.01) {
			OBJ.take(Sand).splice(0, 1);
		}
	}
};

BRANTH.start();
Room.start('Game');