Draw.addStrip(new Vector2(0.5, 0.5), 'Skeleton', 'skeleton.png', 10);
Draw.add(new Vector2(0.5, 0.5), 'Ske', 'skeleton.png', 'skeleton.png');

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
		this.gravity = 0.5;
		this.imageSpeed = 1;
		// this.showCollider = true;
	}
	update() {
		this.hspeed = (Input.keyHold(KeyCode.Right) - Input.keyHold(KeyCode.Left)) * 2;
		this.imageSpeed = 0.5 + Math.abs(this.hspeed);
		if (this.x <= 16 || this.x >= Room.w - 16) {
			this.x = this.xprevious;
		}
		if (this.y >= Room.h - 32) {
			this.y = this.yprevious;
			this.vspeed *= -0.5;
			if (Input.keyDown(KeyCode.Space)) {
				this.vspeed = -10;
			}
		}
	}
}

OBJ.add(Player);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	Physics.add(OBJ.create(Player, Room.mid.w, Room.mid.h).id);
};

BRANTH.start();
Room.start('Game');