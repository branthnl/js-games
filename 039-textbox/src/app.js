const DATA = {
	TEXT: [
`Lorem ipsum dolor sit amet,
consectetur adipiscing elit,
sed do eiusmod tempor incididunt
ut labore et dolore magna aliqua.`,
`Nec feugiat nisl pretium fusce. Aliquet enim tortor at auctor urna nunc id.
Massa tincidunt dui ut ornare. Urna nec tincidunt praesent semper feugiat nibh sed pulvinar proin.`,
`Sed felis eget\nvelit aliquet sagittis.`,
`Volutpat\ndiam\nut\nvenenatis tellus.`
	]
};

class TextBox extends BranthObject {
	constructor(x, y, text) {
		super(x, y);
		this.text = text;
		this.w = 0;
		this.h = 0;
		this.gap = 8;
		this.cursor = 0;
	}
	render() {
		Draw.setFont(Font.m);
		const txt = this.text.split('').splice(0, this.cursor).join('');
		const p = { w: Draw.textWidth(txt), h: Draw.textHeight(txt) };
		this.w = Math.range(this.w, p.w, 0.5);
		this.h = Math.range(this.h, p.h, 0.2);
		p.x = Math.clamp(this.x, this.gap * 2, Room.w - p.w - this.gap * 4);
		p.y = Math.clamp(this.y, this.gap * 2, Room.h - p.h - this.gap * 4);
		this.x = Math.range(this.x, p.x, 0.2);
		this.y = Math.range(this.y, p.y, 0.2);
		Draw.setColor(C.darkSlateBlue);
		Draw.roundRect(this.x, this.y, this.w + this.gap * 2, this.h + this.gap * 2, this.gap);
		Draw.setColor(C.white);
		Draw.setStrokeWeight(this.gap * 0.125);
		Draw.draw(true);
		Draw.resetStrokeWeight();
		Draw.setHVAlign(Align.l, Align.t);
		Draw.text(this.x + this.gap, this.y + this.gap, txt);
		let count = 0;
		if (this.cursor++ >= this.text.length + 5) {
			if (Input.keyDown(KeyCode.Enter)) {
				OBJ.destroy(this.id);
			}
			this.cursor = this.text.length + 5;
			count++;
		}
		Draw.circle(this.x + this.w * 0.5 + this.gap, this.y + this.h + this.gap * 2, this.gap * (0.8 + 0.1 * Math.sin(Time.time * (count === 0? 0.0025 : 0.01))), count > 0);
	}
}

OBJ.add(TextBox);

GLOBAL.message = (txt) => {
	OBJ.push(TextBox, new TextBox(Math.range(Room.w), Math.range(Room.h), txt));
};

const Game = new BranthRoom('Game');
Room.add(Game);

Game.update = () => {
	if (Input.keyDown(KeyCode.Enter) || Input.keyDown(KeyCode.Space)) {
		GLOBAL.message(DATA.TEXT[Math.irange(DATA.TEXT.length)]);
	}
};

BRANTH.start();
Room.start('Game');