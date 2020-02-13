Draw.addStrip(new Vector2(0.5, 0.5), 'Skeleton', 'skeleton.png', 10);

class Player extends BranthGameObject {
	awake() {
		this.spriteName = 'Skeleton';
		this.addCollider(BoxCollider2D, -10, 1, 20, 4);
		this.addCollider(CircleCollider2D, 0, -7, 9);
		this.addCollider(PolygonCollider2D, 0, 0, [
			new Vector2(0, 0),
			new Vector2(8, 6),
			new Vector2(4, 14),
			new Vector2(-4, 14),
			new Vector2(-8, 6),
		]);
		this.alarm[0] = 20;
	}
	update() {
		this.showCollider = GLOBAL.debugMode;
		this.x += Input.keyHold(KeyCode.Right) - Input.keyHold(KeyCode.Left);
	}
	alarm0() {
		this.imageIndex++;
		if (this.imageIndex >= 10) {
			this.imageIndex -= 10;
		}
		this.alarm[0] = 20;
	}
}

OBJ.add(Player);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	OBJ.create(Player, Room.mid.w, Room.mid.h);
};

BRANTH.start();
Room.start('Game');