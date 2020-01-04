class Lotus extends BranthBasicObject {
	start() {
		this.r = Math.range(28, 32);
		this.d = Math.range(0, 360);
		this.spd = Math.range(0.8, 1.7);
		this.dinc = Math.range(-0.5, 0.5);
		this.move = Math.randneg();
		this.off = {
			x: Math.range(-3, 3),
			y: Math.range(-3, 3)
		}
	}
	update() {
		if (this.x + this.r >= Room.w) {
			this.move = -1;
		}
		if (this.x - this.r <= 0) {
			this.move = 1;
		}
		this.x = Math.clamp(this.x + this.spd * this.move * Time.scaledDeltaTime, 0, Room.w);
		this.d += this.dinc * Time.scaledDeltaTime;
	}
	render() {
		const off = {
			x: this.x + this.off.x,
			y: this.y + this.off.y
		}
		Draw.polyBegin();
		Draw.vertex(off.x + Math.lendirx(this.r * 0.5, this.d),
					off.y + Math.lendiry(this.r * 0.5, this.d));
		Draw.vertex(off.x + Math.lendirx(this.r, this.d + 15),
					off.y + Math.lendiry(this.r, this.d + 15));
		Draw.vertex(off.x + Math.lendirx(this.r * 1.3, this.d + 70),
					off.y + Math.lendiry(this.r * 1.3, this.d + 70));
		Draw.vertex(off.x + Math.lendirx(this.r * 1.4, this.d + 140),
					off.y + Math.lendiry(this.r * 1.4, this.d + 140));
		Draw.vertex(off.x + Math.lendirx(this.r, this.d + 187),
					off.y + Math.lendiry(this.r, this.d + 187));
		Draw.vertex(off.x + Math.lendirx(this.r * 1.3, this.d - 125),
					off.y + Math.lendiry(this.r * 1.3, this.d - 125));
		Draw.vertex(off.x + Math.lendirx(this.r * 1.3, this.d - 70),
					off.y + Math.lendiry(this.r * 1.3, this.d - 70));
		Draw.vertex(off.x + Math.lendirx(this.r, this.d - 15),
					off.y + Math.lendiry(this.r, this.d - 15));
		Draw.beginPath();
		Draw.moveTo(Draw.vertices[0].x, Draw.vertices[0].y);
		Draw.lineTo(Draw.vertices[1].x, Draw.vertices[1].y);
		Draw.bezierCurveTo(
			Draw.vertices[2].x, Draw.vertices[2].y,
			Draw.vertices[3].x, Draw.vertices[3].y,
			Draw.vertices[4].x, Draw.vertices[4].y
		);
		Draw.bezierCurveTo(
			Draw.vertices[5].x, Draw.vertices[5].y,
			Draw.vertices[6].x, Draw.vertices[6].y,
			Draw.vertices[7].x, Draw.vertices[7].y
		);
		Draw.closePath();
		Draw.setColor(C.limeGreen);
		Draw.draw();
		Draw.setLineWidth(3);
		Draw.setColor(C.seaGreen);
		Draw.draw(true);
		Draw.resetLineWidth();
	}
}

class Frog extends BranthObject {
	start() {
		this.yto = this.y;
		this.xshift = 0;
		this.jumpRange = 75;
		this.isJumping = false;
		this.currentLotus = -1;
		this.canMove = false;
		this.alarm[0] = 3000;
	}
	update() {
		if (!this.canMove) {
			if (Input.keyDown(KeyCode.Enter)) {
				this.alarm[0] = 0;
			}
		}
		if (!Game.over) {
			if (this.canMove && !this.isJumping) {
				if (Input.keyDown(KeyCode.Enter) || Input.keyDown(KeyCode.Space) || Input.keyDown(KeyCode.Up)) {
					this.yto -= this.jumpRange;
					this.isJumping = true;
					this.currentLotus = -1;
				}
				if (this.yto - this.jumpRange < 0) {
					Game.over = true;
				}
			}
			if (this.isJumping && Math.dis(this.y, this.yto) < 10) {
				let count = 0;
				for (const l of OBJ.take(Lotus)) {
					if (this.x >= l.x - l.r && this.x <= l.x + l.r
					 && this.y >= l.y - l.r && this.y <= l.y + l.r) {
					 	this.xshift = Math.dif(l.x, this.x);
						this.currentLotus = l.id;
						this.isJumping = false;
						count++;
						break;
					}
				}
				if (count === 0) {
					Game.over = true;
				}
			}
			if (this.currentLotus > -1) {
				this.x = OBJ.get(this.currentLotus).x + this.xshift;
			}
		}
		this.y = Math.lerp(this.y, this.yto, 0.1);
		this.alarmUpdate();
	}
	render() {
		Draw.setColor(C.yellow);
		Draw.star(this.x, this.y, 10);
		Draw.setColor(C.black);
		Draw.star(this.x, this.y, 10, true);
		const n = OBJ.nearest(Lotus, this.x, this.y);
		Draw.setAlpha(0.5);
		Draw.setColor(C.yellow);
		Draw.star(n.x + n.off.x, n.y + n.off.y, n.r * (1 + 0.2 * Math.sin(Time.time / 100)));
		Draw.setAlpha(1);
		Emitter.preset('sparkle');
		Emitter.setArea(n.x, n.x, n.y, n.y);
		Emitter.emit(1);
	}
	renderUI() {
		if (this.alarm[0] > 0) {
			Draw.setColor(C.red);
			Draw.setHVAlign(Align.c, Align.m);
			Draw.setFont(Font.largeBold);
			Draw.text(Room.mid.w, Room.mid.h, `Start in ${Time.toSeconds(this.alarm[0])}s`);
			Draw.setHVAlign(Align.c, Align.b);
			Draw.setFont(Font.mediumBold);
			Draw.text(Room.mid.w, Room.h - 20, 'Press enter to skip.');
		}
	}
	alarm0() {
		this.canMove = true;
	}
}

OBJ.add(Lotus);
OBJ.add(Frog);

const Menu = new BranthRoom('Menu', 360, 640);
const Game = new BranthRoom('Game', 360, 640);
Room.add(Menu);
Room.add(Game);

Menu.renderUI = () => {
	if (Input.keyDown(KeyCode.Enter)) {
		Room.start('Game');
	}
	Draw.setColor(C.white);
	Draw.setHVAlign(Align.c, Align.b);
	Draw.setFont(Font.largeBold);
	Draw.text(Room.mid.w, Room.mid.h - 20, 'Froggy');
	Draw.setHVAlign(Align.c, Align.t);
	Draw.setFont(Font.mediumBold);
	Draw.text(Room.mid.w, Room.mid.h, 'How to play:');
	Draw.text(Room.mid.w, Room.mid.h + Font.size * 1.5, 'Press Enter to jump.');
	Draw.setHVAlign(Align.c, Align.b);
	Draw.setFont(Font.smallBold);
	Draw.text(Room.mid.w, Room.h - 20, 'Press Enter to start.');
}

Game.start = () => {
	Game.over = false;
	for (let i = 0; i < 7; i++) {
		OBJ.create(Lotus, Math.range(0, Room.w), Room.h - 97 - 75 * i);
	}
	OBJ.create(Frog, Room.mid.w, Room.h - 22);
}
Game.update = () => {
	if (Input.keyDown(KeyCode.Escape)) {
		Room.start('Menu');
	}
	if (Game.over) {
		if (Input.keyDown(KeyCode.Enter)) {
			Room.start('Game');
		}
	}
}
Game.render = () => {
	Draw.setColor(C.lightSkyBlue);
	Draw.rect(0, 0, Room.w, Room.h);
	Draw.setColor(C.darkOrange);
	Draw.roundrect(0, -20, Room.w, 70, 20);
	Draw.setColor(C.brown);
	Draw.roundrect(0, -20, Room.w, 70, 20, true);
	Draw.setColor(C.limeGreen);
	Draw.roundrect(0, Room.h - 50, Room.w, 70, 20);
	Draw.setColor(C.seaGreen);
	Draw.roundrect(0, Room.h - 50, Room.w, 70, 20, true);
}
Game.renderUI = () => {
	if (Game.over) {
		Draw.setColor(C.red);
		Draw.setHVAlign(Align.c, Align.b);
		Draw.setFont(Font.mediumBold);
		Draw.text(Room.mid.w, Room.mid.h, 'Game Over');
		Draw.setHVAlign(Align.c, Align.t);
		Draw.setFont(Font.smallBold);
		Draw.text(Room.mid.w, Room.mid.h, 'Press Enter to retry.');
		Draw.text(Room.mid.w, Room.mid.h + Font.size, 'Press Escape to go back to menu.');
	}
}

BRANTH.start();
Room.start('Menu');