const Game = new BranthRoom('Game', 640, 640);
Room.add(Game);

Draw.add('Basketball', 'ball_basketball.png');
Draw.add('Wall', 'wall_strip5.png', 5, 5, 32, 32);

const Mask = {
	rect: 'rect',
	circle: 'circle'
};

class Collider extends BranthObject {
	constructor(...args) {
		super(args[1], args[2]);
		this.mask = args[0];
		this.w = 0;
		this.h = 0;
		this.r = 0;
		switch (this.mask) {
			case Mask.rect:
				this.w = args[3];
				this.h = args[4];
				break;
			case Mask.circle:
				this.r = args[3];
				break;
		}
	}
	hover(x, y) {
		let px, py;
		if (y) {
			px = x;
			py = y;
		}
		else {
			px = x.x;
			py = x.y;
		}
		switch (this.mask) {
			case Mask.rect: return (px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h); break;
			case Mask.circle: return (Math.pointdis(px, py, this.x, this.y) <= this.r); break;
		}
		return false;
	}
	draw() {
		Draw.setColor(C.magenta);
		switch (this.mask) {
			case Mask.rect:
				Draw.rect(this.x, this.y, this.w, this.h);
				break;
			case Mask.circle:
				Draw.circle(this.x, this.y, this.r);
				break;
		}
	}
	collide() {
		const allCollider = OBJ.take(Collider);
		for (const c of allCollider) {
			if (c) {
				if (c.id != this.id) {
					const cs = this.mask + c.mask;
					switch (cs) {
						case 'rectrect':
						if (c.x <= this.x && c.x + c.w >= this.x && c.y <= this.y && c.y + c.h >= this.y
						 || this.x <= c.x && this.x + c.w >= c.x && this.y <= c.y && this.y + this.h >= c.y
						 || c.x >= this.x && c.x + c.w <= this.x && c.y >= this.y && c.y + c.h <= this.y
						 || this.x >= c.x && this.x + c.w <= c.x && this.y >= c.y && this.y + this.h <= c.y) {
							return true;
						}
						break;
						case 'circlecircle':
						if (Math.pointdis(this.x, this.y, c.x, c.y) <= (c.r + this.r)) {
							return true;
						}
						break;
					}
				}
			}
		}
		return false;
	}
}

class Ball extends BranthGameObject {
	awake() {
		this.depth = -1;
		this.spriteName = 'Basketball';
		this.dx = 0;//Math.range(-4, 4);
		this.dy = 0;//Math.range(-4, 4);
		this.collider = new Collider(Mask.circle, this.x, this.y, 16);
		OBJ.push(Collider, this.collider);
		this.canCollide = true;
	}
	update() {
		const m = Input.screenToWorldPoint(Input.mousePosition);
		this.x = m.x;
		this.y = m.y;
		if (this.canCollide) {
			if (this.collider.collide()) {
				this.x = this.xp;
				this.y = this.yp;
				this.dx *= -1;
				this.dy *= -1;
				this.canCollide = false;
				this.alarm[0] = 100;
			}
		}
		this.collider.x = this.x;
		this.collider.y = this.y;
	}
	render() {
		this.drawSelf();
		Draw.setAlpha(0.3);
		if (this.collider.collide()) {
			Draw.setAlpha(1);
		}
		this.collider.draw();
		Draw.setAlpha(1);
	}
	alarm0() {
		this.canCollide = true;
	}
}

class Wall extends BranthGameObject {
	awake() {
		this.spriteName = 'Wall';
		// this.collider = new Collider(Mask.rect, this.x - 14, this.y - 14, 28, 28);
		this.collider = new Collider(Mask.circle, this.x, this.y, 14);
		OBJ.push(Collider, this.collider);
	}
	hit() {
		this.spriteIndex++;
		if (this.spriteIndex >= Draw.getSprite(this.spriteName).amount) {
			OBJ.destroy(this.id);
		}
	}
	render() {
		this.drawSelf();
		Draw.setAlpha(0.3);
		if (this.collider.collide()) {
			Draw.setAlpha(1);
		}
		this.collider.draw();
		Draw.setAlpha(1);
	}
}

OBJ.add(Ball);
OBJ.add(Wall);
OBJ.add(Collider);

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