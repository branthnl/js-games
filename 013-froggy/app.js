class Background extends BranthObject {
	render() {
		Draw.setColor(C.lightSkyBlue);
		Draw.rect(0, 0, Room.w, Room.h);
	}
}

class LandOrigin extends BranthObject {
	render() {
		Draw.setColor(C.darkOrange);
		Draw.roundrect(0, -20, Room.w, 70, 20);
		Draw.setColor(C.brown);
		Draw.roundrect(0, -20, Room.w, 70, 20, true);
	}
}

class LandEnd extends BranthObject {
	render() {
		Draw.setColor(C.limeGreen);
		Draw.roundrect(0, Room.h - 50, Room.w, 70, 20);
		Draw.setColor(C.seaGreen);
		Draw.roundrect(0, Room.h - 50, Room.w, 70, 20, true);
	}
}

class Lotus extends BranthObject {
	start() {
		this.r = Math.range(28, 32);
		this.d = Math.range(0, 360);
		this.spd = Math.range(2, 2.5);
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
		this.x += this.spd * this.move * Time.scaledDeltaTime;
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
		this.jumpRange = 75;
		this.alarm[0] = 1000;
	}
	update() {
		this.alarmUpdate();
	}
	render() {
		Draw.setColor(C.yellow);
		Draw.star(this.x, this.y, 10);
		Draw.setColor(C.black);
		Draw.star(this.x, this.y, 10, true);
	}
	alarm0() {
		this.y -= this.jumpRange;
		if (this.y - this.jumpRange > 0) this.alarm[0] = 1000;
	}
}

OBJ.add(Background);
OBJ.add(LandOrigin);
OBJ.add(LandEnd);
OBJ.add(Lotus);
OBJ.add(Frog);

const Menu = new BranthRoom('Menu', 360, 640);
const Game = new BranthRoom('Game', 360, 640);
Room.add(Menu);
Room.add(Game);

Menu.start = () => {
	Room.start('Game');
}

Game.start = () => {
	OBJ.create(Background);
	OBJ.create(LandOrigin);
	OBJ.create(LandEnd);
	for (let i = 0; i < 7; i++) {
		OBJ.create(Lotus, Math.range(0, Room.w), Room.h - 97 - 75 * i);
	}
	OBJ.create(Frog, Room.w.mid(), Room.h - 22);
}

BRANTH.start();
Room.start('Menu');