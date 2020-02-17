Array.prototype.shuffle = function() {
	let i = this.length, j;
	while (--i > 0) {
		j = Math.irange(i + 1);
		[this[i], this[j]] = [this[j], this[i]];
	}
}

String.prototype.capitalize = function() {
	return this.substr(0, 1).toUpperCase().concat(this.substr(1));
}

class Turret extends BranthGameObject {
	awake() {
		this.angle = 0;
		this.alarm[0] = 500;
	}
	update() {
		if (Input.mouseHold(0)) {
			this.angle = Math.pointdir(this, Input.mousePosition);
			if (Math.abs(this.angle - this.imageAngle) > 300) {
				this.imageAngle += 300;
			}
		}
	}
	render() {
		Draw.setColor(C.gray);
		Draw.rectTransformed(this.x, this.y, 200, 40, false, 1, 1, this.imageAngle, new Vector2(0.2, 0.5));
	}
	renderUI() {
		Draw.setFont(Font.m);
		Draw.setColor(C.black);
		Draw.setHVAlign(Align.l, Align.t);
		Draw.text(8, 8, `${~~this.imageAngle}\n\n${~~this.angle}\n\n${~~(this.angle - this.imageAngle)}`);
	}
	alarm0() {
		this.imageAngle = Math.range(this.imageAngle, this.angle, 0.2);
		this.alarm[0] = 500;
	}
}

OBJ.add(Turret);

const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
	OBJ.create(Turret, Room.mid.w, Room.mid.h);
};

Game.renderUI = () => {
	const m = Input.mousePosition;
	Draw.setColor(C.white);
	Draw.circle(m.x, m.y, 8, true);
	Draw.plus(m.x, m.y, 8);
};

BRANTH.start(960, 540);
Room.start('Game');