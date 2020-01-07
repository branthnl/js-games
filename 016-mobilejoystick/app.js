Draw.add('Skeleton', 'skeleton_walking_strip10.png', 10, 10, 32, 32);

const Game = new BranthRoom('Game', 640, 360);
Room.add(Game);

class Joystick extends BranthGameObject {
	awake() {
		this.r = Room.w * 0.1;
		this.addMask(Mask.circle, 0, 0, this.r);
		this.drawMask = true;
		this.touchId = -1;
		this.dx = 0;
		this.dy = 0;
		this.cx = 0;
		this.cy = 0;
	}
	update() {
		this.x = Room.w - Room.w * 0.15;
		this.y = Room.h - Room.w * 0.15;
		if (Input.touchCount > 0) {
			for (let i = 0; i < Input.touchCount; i++) {
				if (Input.touchDown(i)) {
					const t = Input.screenToWorldPoint(Input.getTouch(i).position);
					if (this.hover(t)) {
						this.touchId = i;
					}
				}
			}
		}
		let c = {
			x: 0,
			y: 0
		};
		if (this.touchId > -1) {
			const t = Input.screenToWorldPoint(Input.getTouch(this.touchId).position);
			c = Math.lendir(Math.min(this.r, Math.pointdis(this.x, this.y, t.x, t.y)), Math.pointdir(this.x, this.y, t.x, t.y));
			this.dx = c.x / this.r;
			this.dy = c.y / this.r;
			if (Input.touchUp(this.touchId)) {
				this.touchId = -1;
				this.dx = 0;
				this.dy = 0;
			}
		}
		this.cx = Math.lerp(this.cx, c.x, 0.4);
		this.cy = Math.lerp(this.cy, c.y, 0.4);
	}
	renderUI() {
		Draw.setAlpha(0.8);
		Draw.setColor(C.white);
		Draw.circle(this.x + this.cx, this.y + this.cy, this.r * 0.3);
		Draw.setColor(C.black);
		Draw.stroke();
		Draw.setAlpha(1);
	}
}

class Skeleton extends BranthGameObject {
	awake() {
		this.spriteName = 'Skeleton';
		this.dx = 0;
		this.dy = 0;
	}
	update() {
		const j = OBJ.take(Joystick)[0];
		this.dx = Math.lerp(this.dx, j.dx, 0.1);
		this.dy = Math.lerp(this.dy, j.dy, 0.1);
		this.x += this.dx;
		this.y += this.dy;
		this.spriteIndex += Time.scaledDeltaTime * 0.2;
	}
}

OBJ.add(Joystick);
OBJ.add(Skeleton);

Game.start = () => {
	Game.text = '';
	OBJ.create(Joystick, Room.w - Room.w * 0.15, Room.h - Room.w * 0.15);
	OBJ.create(Skeleton, Room.mid.w, Room.mid.h);
}

Game.renderUI = () => {
	Draw.setColor(C.black);
	Draw.setHVAlign(Align.l, Align.t);
	Draw.setFont(Font.m);
	Game.text = (OBJ.get(0).touchId > -1? `Pressed by touch id: ${OBJ.get(0).touchId}` : `Not pressed`);
	Draw.text(16, 16, Game.text);
}

BRANTH.start();
Room.start('Game');