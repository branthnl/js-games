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
		if (this.y < Room.h - 10 && !OBJ.isExists(Sand, this.x, this.y + 10)) {
			this.y += 10;
			if (!OBJ.isExists(Sand, this.x, this.y + 10)) return;
			let i = 100, x = 10;
			while (i > 0) {
				if (this.x + x < Room.w) {
					if (!OBJ.isExists(Sand, this.x + x, this.y)) {
						this.x += x;
						break;
					}
				}
				if (this.x - x > 0) {
					if (!OBJ.isExists(Sand, this.x - x, this.y)) {
						this.x -= x;
						break;
					}
				}
				i--;
			}
		}
	}
	render() {
		const t = this.id / OBJ.ID;
		Draw.setColor(`rgba(${(1 - t) * 255}, ${t * 155 + 100}, 0, 1)`);
		Draw.rect(this.x, this.y, 10, 10);
	}
}

OBJ.add(Sand);

const Game = new BranthRoom('Game', 640, 360);
Room.add(Game);

Game.update = () => {
	if (Input.mouseHold(0)) {
		const m = Input.screenToWorldPoint(Input.mousePosition);
		const [x, y] = [Math.floor(m.x / 10) * 10, Math.floor(m.y / 10) * 10];
		if (!OBJ.isExists(Sand, x, y)) {
			OBJ.create(Sand, x, y);
			if (OBJ.take(Sand).length > Room.w * Room.h * 0.01) {
				OBJ.take(Sand).splice(0, 1);
			}
		}
	}
};

BRANTH.start();
Room.start('Game');