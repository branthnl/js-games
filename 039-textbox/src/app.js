const DATA = {
	TEXT: [
		`Not too bad.`,
		`My eyes are itchy.`,
		`Hi Bob, how are you?`,
		`I'm doing very well.`,
		`My ears are so cold.`,
		`Don't pick your nose.`,
		`Hey John, how have you been?`,
		`I have a cold sore on my lips.`,
		`Your whole face is\nturning red.`,
		`My nose turns red when I'm cold.`,
		`What movie did you come to see?`,
		`I have a canker sore\nin my mouth.`,
		`Twisting your knee is so painful.`,
		`I broke my ankle playing volleyball.`,
		`I like shoes that support my ankles.`,
		`Hi Nancy, what have\nyou been up to?`,
		`Do you come to this\nrestaurant often?`,
		`I usually turn red when I drink alcohol.`,
		`I get a runny nose during allergy season.`,
		`My ankle was swollen\nafter I sprained it.`,
		`I got this scar on my knee\nwhen I was little.`,
		`Andy, it's been a long time,\nhow are you man?`,
		`I banged my knee against the door and it hurts.`,
		`I hit my head on the desk\nafter picking up a pen.`,
		`I always get a runny nose\nduring the winter time.`,
		`I come pretty often.\nThis is my favorite restaurant.`,
		`Hey Jack, it's good to see you. What are you doing here?`,
		`Hi Steve, my name is Mike.\nIt is nice to meet you as well.`,
		`I heard a lot about you from John.\nHe had a lot of good things to say.`,
		`I've been here a couple of times,\nbut I don't come on a regular basis.`,
		`What a surprise. I haven't seen you in a long time.\nHow have you been?`,
		`I'm pretty busy at work these days,\nbut otherwise, everything is great.`,
		`Dang! I'm so busy at work, it's driving me crazy.\nI really wish I had your job.`,
		`I'm so bored. I have nothing to do at work.\nI just surf the Internet all day long.`,
		`I can't believe we haven't seen each other before.\nI come here at least twice a week.`,
		`Wow. How long has it been? It seems like more than a year.\nI'm doing pretty well. How about you?`,
		`I finally have some free time.\nI just finished taking a big examination,\nand I'm so relieved that I'm done with it.`
	]
};

class TextBox extends BranthObject {
	constructor(x, y, index) {
		super(x, y);
		this.index = index;
		this.text = DATA.TEXT[this.index];
		this.w = 0;
		this.h = 0;
		this.gap = 8;
		this.cursor = 0;
	}
	render() {
		const m = Input.mousePosition;
		const hover = m.x > this.x - this.gap && m.x < this.x + this.w + this.gap && m.y > this.y - this.gap && m.y < this.y + this.h + this.gap;
		if (hover) this.gap = Math.range(this.gap, 10, 0.2);
		else this.gap = Math.range(this.gap, 8, 0.2);
		Draw.setFont(Font.m);
		const txt = this.text.split('').splice(0, this.cursor).join('');
		const p = { w: Draw.textWidth(txt), h: Draw.textHeight(txt) };
		this.w = Math.range(this.w, p.w, 0.5);
		this.h = Math.range(this.h, p.h, 0.2);
		p.x = Math.clamp(this.x, this.gap * 2, Room.w - p.w - this.gap * 3);
		p.y = Math.clamp(this.y, this.gap * 2, Room.h - p.h - this.gap * 3);
		this.x = Math.range(this.x, p.x, 0.5);
		this.y = Math.range(this.y, p.y, 0.2);
		Draw.setColor(C.darkSlateBlue);
		Draw.roundRect(this.x - this.gap, this.y - this.gap, this.w + this.gap * 2, this.h + this.gap * 2, this.gap);
		Draw.setColor(C.white);
		Draw.setStrokeWeight(this.gap * 0.125);
		Draw.draw(true);
		Draw.resetStrokeWeight();
		Draw.setHVAlign(Align.l, Align.t);
		Draw.text(this.x, this.y, txt);
		let count = 0;
		if (this.cursor++ >= this.text.length + 5) {
			if (Input.keyDown(KeyCode.Enter) || (hover && Input.mouseDown(0))) {
				this.text = DATA.TEXT[++this.index % DATA.TEXT.length];
				this.w = 0;
				this.h = 0;
				this.cursor = 0;
			}
			else if (hover && Input.mouseDown(2)) {
				OBJ.destroy(this.id);
			}
			else {
				this.cursor = this.text.length + 5;
			}
			count++;
		}
		Draw.circle(this.x + this.w * 0.5, this.y + this.h + this.gap, this.gap * (0.8 + 0.1 * Math.sin(Time.time * (count === 0? 0.0025 : 0.01))), count > 0);
	}
}

OBJ.add(TextBox);

GLOBAL.message = (index) => {
	OBJ.push(TextBox, new TextBox(Math.range(Room.w), Math.range(Room.h), index));
};

const Game = new BranthRoom('Game');
Room.add(Game);

Game.update = () => {
	if (Input.keyDown(KeyCode.Space)) {
		GLOBAL.message(Math.irange(DATA.TEXT.length));
	}
};

BRANTH.start();
Room.start('Game');