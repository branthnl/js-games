const Menu = new BranthRoom('Menu', 640, 640);
const Game = new BranthRoom('Game', 640, 640);
Room.add(Menu);
Room.add(Game);

Menu.update = () => {
	if (Input.keyDown(KeyCode.Enter)) {
		Room.start('Game');
	}
}

const Tile = {
	w: 32,
	get h() {
		return this.w * 0.5;
	},
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	},
	size: {
		x: 10,
		y: 8
	}
};

Game.render = () => {
	Draw.setColor(C.black);
	for (let i = 0; i < Tile.size.x; i++) {
		for (let j = 0; j < Tile.size.y; j++) {
			Draw.polyBegin();
			Draw.vertex(180 + i * Tile.mid.w - j * Tile.mid.w - Tile.mid.w, 180 + i * Tile.mid.h + j * Tile.mid.h);
			Draw.vertex(180 + i * Tile.mid.w - j * Tile.mid.w, 180 + i * Tile.mid.h + j * Tile.mid.h - Tile.mid.h);
			Draw.vertex(180 + i * Tile.mid.w - j * Tile.mid.w + Tile.mid.w, 180 + i * Tile.mid.h + j * Tile.mid.h);
			Draw.vertex(180 + i * Tile.mid.w - j * Tile.mid.w, 180 + i * Tile.mid.h + j * Tile.mid.h + Tile.mid.h);
			Draw.polyEnd(Poly.stroke);
		}
	}
}

BRANTH.start();
Room.start('Game');