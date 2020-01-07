const Game = new BranthRoom('Game', 640, 640);
Room.add(Game);

Draw.add('Basketball', 'ball_basketball.png');
Draw.add('Wall', 'wall_strip5.png', 5, 5, 32, 32);

class Ball extends BranthGameObject {
	awake() {
		this.depth = -1;
		this.spriteName = 'Basketball';
		this.addMask(Mask.rect, -68, -68, 34, 34);
		this.addMask(Mask.circle, 0, 0, 17);
		this.drawMask = true;
	}
	update() {
		const m = Input.screenToWorldPoint(Input.mousePosition);
		if (this.hover(m)) {
			this.drawMaskAlpha = Math.lerp(this.drawMaskAlpha, 0.2, 0.1);
			PARENT.style.cursor = 'pointer';
		}
		else {
			this.drawMaskAlpha = Math.lerp(this.drawMaskAlpha, 0.8, 0.1);
			PARENT.style.cursor = 'default';
		}
	}
}

class Wall extends BranthGameObject {
	awake() {
		this.spriteName = 'Wall';
	}
	hit() {
		this.spriteIndex++;
		if (this.spriteIndex >= Draw.getSprite(this.spriteName).amount) {
			OBJ.destroy(this.id);
		}
	}
}

OBJ.add(Ball);
OBJ.add(Wall);

Game.start = () => {
	OBJ.create(Ball, Room.mid.w, Room.mid.h);
	for (let i = 0; i <= Room.w / 32; i++) {
		OBJ.create(Wall, i * 32, Room.h - 16);
	}
	for (let i = 1; i < Room.h / 32; i++) {
		OBJ.create(Wall, 0, -16 + i*32);
		OBJ.create(Wall, Room.w, -16 + i*32);
	}
}

BRANTH.start();
Room.start('Game');