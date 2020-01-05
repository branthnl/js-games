Draw.add('man', 'explorer_climb_strip8.png', 8, 8, 32, 32);
Draw.add('wall', 'wall.png');
Audio.add('jump', 'jump.ogg', 'jump.mp3');

class Lotus extends BranthObject {
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
		if (!Game.over) {
			if (this.x + this.r >= Room.w) {
				this.move = -1;
			}
			if (this.x - this.r <= 0) {
				this.move = 1;
			}
			this.x = Math.clamp(this.x + this.spd * this.move * Time.scaledDeltaTime, 0, Room.w);
		}
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
		Draw.setAlpha(0.1);
		Draw.setColor(C.white);
		Draw.circle(this.x - this.off.x, this.y - this.off.y, this.r * 0.7);
		Draw.setAlpha(1);
	}
}

class Frog extends BranthGameObject {
	awake() {
		this.depth = -1;
		this.spriteName = 'man';
		this.xto = this.x;
		this.yto = this.y;
		this.xshift = 0;
		this.jumpRange = 75;
		this.isJumping = false;
		this.currentLotus = -1;
		this.canMove = false;
	}
	start() {
		this.alarm[0] = 10000;
		this.alarm[1] = 100;
	}
	update() {
		if (!this.canMove) {
			if (Input.keyDown(KeyCode.Enter)) {
				this.alarm[0] = 0;
			}
			if (Input.getMouse(Mouse.Left).hold) {
				this.xto = Input.mousePosition.x;
				this.yto = Input.mousePosition.y;
			}
		}
		if (!Game.over) {
			if (this.canMove && !this.isJumping) {
				if (Input.keyDown(KeyCode.Enter) || Input.mouseDown(Mouse.Left)) {
					this.yto -= this.jumpRange;
					this.isJumping = true;
					this.currentLotus = -1;
					Audio.play('jump');
				}
				if (this.yto - this.jumpRange < 0) {
					Game.message = 'You did it! Yeayy!';
					Game.over = true;
				}
			}
			if (this.isJumping && Math.dis(this.y, this.yto) < 10) {
				let count = 0;
				for (const l of OBJ.take(Lotus)) {
					if (this.x >= l.x - l.r && this.x <= l.x + l.r
					 && this.y >= l.y - l.r && this.y <= l.y + l.r) {
					 	this.xshift = Math.dif(l.x, this.xto);
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
				this.xto = OBJ.get(this.currentLotus).x + this.xshift;
			}
		}
		this.x = Math.lerp(this.x, this.xto, 0.15);
		this.y = Math.lerp(this.y, this.yto, 0.15);
		this.alarmUpdate();
	}
	renderUI() {
		if (this.alarm[0] > 0) {
			Draw.setColor(C.red);
			Draw.setHVAlign(Align.c, Align.m);
			Draw.setFont(Font.largeBold);
			Draw.text(Room.mid.w, Room.mid.h, `Start in ${Time.toSeconds(this.alarm[0])}s`);
			Draw.setHVAlign(Align.c, Align.b);
			Draw.setFont(Font.mediumBold);
			Draw.text(Room.mid.w, Room.h - 60, 'Press enter to skip.');
		}
	}
	alarm0() {
		this.canMove = true;
		this.xto = this.xs;
		this.yto = this.ys;
	}
	alarm1() {
		this.spriteIndex++;
		this.alarm[1] = 100;
	}
}

OBJ.add(Lotus);
OBJ.add(Frog);

const Menu = new BranthRoom('Menu', 360, 640);
const Game = new BranthRoom('Game', 360, 640);
const TouchTest = new BranthRoom('test', 640, 640);
Room.add(Menu);
Room.add(Game);
Room.add(TouchTest);

Menu.renderUI = () => {
	if (Input.getKey(KeyCode.Enter).pressed || Input.getMouse(Mouse.Left).pressed || Input.getTouch(0).pressed) {
		Room.start('Game');
	}
	if (Input.keyDown(KeyCode.U)) {
		Audio.play('jump');
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
	Game.message = 'Game Over';
	for (let i = 0; i < 7; i++) {
		const n = OBJ.create(Lotus, Math.range(0, Room.w), Room.h - 97 - 75 * i);
		n.depth = i;
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
		Draw.text(Room.mid.w, Room.mid.h - 20, Game.message);
		Draw.setHVAlign(Align.c, Align.t);
		Draw.setFont(Font.smallBold);
		Draw.text(Room.mid.w, Room.mid.h, 'Press Enter to retry.');
		Draw.text(Room.mid.w, Room.mid.h + Font.size * 2, 'Press Escape to go back to menu.');
	}
}

TouchTest.renderUI = () => {
	Draw.setColor(C.darkGray);
	Draw.rect(0, 0, Room.w, Room.h);
	Draw.setColor(C.black);
	Draw.setFont(Font.smallBold);
	Draw.setHVAlign(Align.l, Align.t);
	Draw.text(10, 10, 'Touches:');
	for (const i in Input.list[2]) {
		Draw.text(10, 10 + (Font.size + 5) * (+i + 1), `[${i}]:`);
	}
	for (const i in Input.touches) {
		const t = Input.getTouch([Input.touches[i].id]);
		Draw.text(40, 10 + (Font.size + 5) * (+i + 1), `${t.id}, x: ${Math.floor(t.position.x)}, y: ${Math.floor(t.position.y)}`);
	}
}

BRANTH.start();
Room.start('Game');