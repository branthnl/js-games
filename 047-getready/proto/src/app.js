const GR = {};

GR.DATA = {
	Object: {
		Data: {
			Boy: {
				name: "Little Boy"
			},
			Bed: {
				name: "Bed"
			},
			Desk: {
				name: "Desk"
			},
			Toys: {
				name: "Toys"
			},
			Window: {
				name: "Window"
			},
			Clothes: {
				name: "Clothes"
			},
			Wardrobe: {
				name: "Wardrobe"
			}
		}
	}
};

GR.UI = {
	CreateRect(x, y, w, h) {
		return { x, y, w, h};
	},
	MouseHoverRect(rect) {
		const m = Input.mousePosition;
		return m.x > rect.x && m.x < rect.x + rect.w && m.y > rect.y && m.y < rect.y + rect.h;
	},
	DrawRect(rect) {
		if (GLOBAL.debugMode % 2 !== 0) {
			Draw.setColor(C.black);
			Draw.rect(rect.x, rect.y, rect.w, rect.h, true);
		}
	}
};

GR.Game = {
	fallCount: 0,
	guideIndex: 0,
	seasonIndex: 0,
	weatherIndex: 0,
	WeatherWords: [
		"Rainy",
		"Sunny",
		"Snowy",
		"Cloudy"
	],
	GetWeatherWord() {
		return this.WeatherWords[this.weatherIndex];
	}
};

GR.Draw = {
	BGBedroom: null,
	CreateBGBedroom() {
		this.BGBedroom = document.createElement("canvas");
		this.BGBedroom.width = Room.w;
		this.BGBedroom.height = Room.h;
		Draw.setContext(this.BGBedroom.getContext("2d"));
		// Paint wall base
		Draw.setColor("rgba(131, 179, 226, 1)");
		Draw.rect(0, 0, Room.w, Room.h);
		// Paint wall strips
		const stripWidth = 10;
		const stripDistance = 32;
		Draw.setColor("rgba(193, 216, 242, 1)");
		for (let i = Room.w / (stripWidth + stripDistance); i >= 0; i--) {
			Draw.rect(i * (stripWidth + stripDistance), 0, stripWidth, Room.h);
		}
		// Lamp light
		Draw.setAlpha(0.25);
		Draw.setColor(C.white);
		Draw.CTX.beginPath();
		Draw.CTX.moveTo(30, 0);
		Draw.CTX.quadraticCurveTo(Room.w * 0.5, Room.h * 1.2 - 100 * (GR.Game.seasonIndex === 1), Room.w - 20, 0);
		Draw.CTX.fill();
		Draw.setAlpha(1);
		// Cut window
		Draw.setColor("rgba(125, 65, 12, 1)");
		Draw.roundRect(Room.w * 0.38, Room.h * 0.1, 200, 200, 10);
		Draw.CTX.globalCompositeOperation = "destination-out";
		Draw.roundRect(Room.w * 0.38 + 10, Room.h * 0.1 + 10, 180, 180, 10);
		Draw.CTX.globalCompositeOperation = BlendModes.Normal;
		// Draw floor
		Draw.setColor("rgba(78, 122, 171, 1)");
		Draw.rect(0, Room.h * 0.7, Room.w, Room.h * 0.3);
		// Draw wall frame
		Draw.setColor("rgba(125, 65, 12, 1)");
		Draw.rect(0, Room.h * 0.7 - 2, Room.w, 16);
		Draw.resetContext();
	}
};

GR.Reaction = {
	list: [],
	Type: {
		Click: "Click",
		DragAndDrop: "Drag and Drop"
	},
	AddReaction(timing, move_type, from, to) {
		if (move_type === GR.Reaction.Type.Click) {
			this.list.push({ timing, move_type, from });
		}
		else {
			this.list.push({ timing, move_type, from, to });
		}
	},
	DownloadReaction() {
		let data = "timing | move_type     | from       | to\n=================================================";
		for (const i of this.list) {
			// Stylized data to table
			let toName = '-';
			let timing = i.timing;
			let fromName = i.from.name;
			let moveType = i.move_type;
			while (timing.length < 6) { timing += ' '; }
			while (fromName.length < 10) { fromName += ' '; }
			while (moveType.length < 13) { moveType += ' '; }
			if (i.move_type === GR.Reaction.Type.DragAndDrop) toName = i.to.name;
			data += `\n${timing} | ${moveType} | ${fromName} | ${toName}`;
		}
		const filename = `player_reactions${GLOBAL.key}.txt`;
		const file = new Blob([data], { type: "text/plain" });
		if (navigator.msSaveOrOpenBlob) {
			navigator.msSaveOrOpenBlob(file, filename);
		}
		else {
			const a = document.createElement("a");
			const url = URL.createObjectURL(file);
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			setTimeout(() => {
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			});
		}
	}
};

class GameObject extends BranthBehaviour {
	constructor(x, y) {
		super(x, y);
		this.data = null;
		this.imageName = "";
		this.boundRect = GR.UI.CreateRect(this.x, this.y, 32, 32);
	}
	onClick() {}
	onRelease() {}
	render() {
		if (Draw.getSprite(this.imageName)) Draw.image(this.imageName, this.x, this.y);
		GR.UI.DrawRect(this.boundRect);
	}
}

class Boy extends GameObject {
	constructor(x, y) {
		super(x, y);
		this.depth = -1;
		this.data = GR.DATA.Object.Data.Boy;
		this.boundRect.w = 100;
		this.boundRect.h = 355;
		this.boundRect.x = this.x - this.boundRect.w * 0.5;
		this.boundRect.y = this.y - this.boundRect.h + 20;
		this.xto = this.x;
		this.yto = this.y;
		this.xfrom = this.x;
		this.yfrom = this.y;
		this.interval = 0;
		this.eyeOpen = true;
		this.isMoving = false;
		this.moveTime = 0;
		this.moveTimeIncrement = 0;
		this.mouthOpen = false;
		this.mouthOpenScalar = 0;
		this.ourShirt = null;
		this.isUsedShirt = false;
		this.ourPant = null;
		this.isUsedPant = false;
		this.pantLocalPosition = new Vector2(0, -200);
		this.shirtLocalPosition = new Vector2(0, -100);
		this.alarm[0] = Math.range(500, 1000);
		this.alarm[2] = Math.range(500, 5000);
	}
	goTo(x, y, interval) {
		this.xto = x;
		this.yto = y;
		this.xfrom = this.x;
		this.yfrom = this.y;
		this.isMoving = true;
		this.interval = interval;
		this.alarm[3] = this.interval;
	}
	update() {
		const t = Math.clamp(1 - (this.alarm[3] / this.interval), 0, 1);
		this.x = Math.range(this.xfrom, this.xto, t);
		this.y = Math.range(this.yfrom, this.yto, t);
		this.boundRect.x = this.x - this.boundRect.w * 0.5;
		this.boundRect.y = this.y - this.boundRect.h + 20;
		this.moveTime += this.moveTimeIncrement;
		this.moveTimeIncrement = Math.range(this.moveTimeIncrement, Time.fixedDeltaTime * (this.isMoving? 0.02 : 0.002), 0.1);
		this.mouthOpenScalar = Math.range(this.mouthOpenScalar, this.mouthOpen, 0.1);
		if (this.ourShirt) {
			this.ourShirt.xto = this.shirtLocalPosition.x;
			this.ourShirt.yto = this.shirtLocalPosition.y;
			this.ourPant.xto = this.pantLocalPosition.x;
			this.ourPant.yto = this.pantLocalPosition.y;
		}
	}
	onRelease() {
		for (const i of OBJ.take(Clothes)) {
			if (i.isDragged) {
				if (i.imageName.includes("Shirt")) {
					if (!this.isUsedShirt) {
						i.isUsed = true;
						this.ourShirt = i;
					}
				}
				else if (i.imageName.includes("Pant")) {
					if (!this.isUsedShirt) {
						i.isUsed = true;
						this.ourPant = i;
					}
				}
			}
		}
	}
	render() {
		const t = Math.sin(this.moveTime);
		const v = new Vector2(0, t);
		Draw.CTX.save();
		Draw.CTX.translate(this.x, this.y);
		Draw.CTX.scale(1 + t * 0.005, 1 - t * 0.005);
		Draw.image("BoyBody", v.x, v.y - 207);
		Draw.image("BoyHead", v.x, v.y - 200);
		Draw.image("BoyArm", v.x + 20, v.y - 180, 1, 1, 65 + t);
		Draw.image("BoyArm", v.x - 21, v.y - 182, -1, 1, 65 + t);
		Draw.image("BoyLeg", v.x + 18, v.y - 75 - Math.min(0, t), 1, 1, 90 - Math.max(0, t));
		Draw.image("BoyLeg", v.x - 18, v.y - 75 - Math.min(0, t), -1, 1, 90 - Math.max(0, t));
		for (let i = 0; i <= 1; i++) {
			Draw.setColor(C.black);
			if (this.eyeOpen) {
				Draw.ellipse(v.x + 32 - 64 * i, v.y - 255, 5, 7);
				Draw.setColor(C.white);
				Draw.circle(v.x + 31 - 64 * i, v.y - 258, 1);
				Draw.circle(v.x + 33 - 64 * i, v.y - 252, 1.5);
			}
			else {
				Draw.ellipse(v.x + 32 - 64 * i, v.y - 255, 5, 1);
			}
		}
		Draw.setColor("rgba(251, 114, 127, 1)");
		Draw.CTX.beginPath();
		Draw.CTX.moveTo(v.x + 18, v.y - 228);
		Draw.CTX.quadraticCurveTo(v.x, v.y - 226 + 6 * this.mouthOpenScalar, v.x - 18, v.y - 230 + 2 * this.mouthOpenScalar);
		Draw.CTX.quadraticCurveTo(v.x, v.y - 188 - 28 * this.mouthOpenScalar, v.x + 18, v.y - 228);
		Draw.CTX.fill();
		Draw.CTX.restore();
		GR.UI.DrawRect(this.boundRect);
	}
	alarm0() {
		this.eyeOpen = false;
		this.alarm[1] = Math.range(50, 100);
	}
	alarm1() {
		this.eyeOpen = true;
		this.alarm[0] = Math.range(500, 2000);
	}
	alarm2() {
		this.mouthOpen = !this.mouthOpen;
		this.alarm[2] = Math.range(500, 5000);
	}
	alarm3() {
		this.isMoving = false;
	}
}

class Bed extends GameObject {
	awake() {
		this.data = GR.DATA.Object.Data.Bed;
		this.imageName = "Bed";
		this.boundRect.w = 260;
		this.boundRect.h = 220;
		this.boundRect.x = this.x - this.boundRect.w * 0.5;
		this.boundRect.y = this.y - this.boundRect.h;
	}
}

class Desk extends GameObject {
	awake() {
		this.data = GR.DATA.Object.Data.Desk;
		this.imageName = "Desk";
	}
}

class Toys extends GameObject {
	awake() {
		this.hsp = Math.range(-1, 1);
		this.data = GR.DATA.Object.Data.Toys;
		this.imageName = "Toys";
		this.boundRect.w = 80;
		this.boundRect.h = 55;
		this.boundRect.x = this.x - this.boundRect.w * 0.5;
		this.boundRect.y = this.y - this.boundRect.h;
	}
	update() {
		this.x += this.hsp;
		this.hsp *= 0.99;
		this.boundRect.x = this.x - this.boundRect.w * 0.5;
		this.boundRect.y = this.y - this.boundRect.h;
	}
	onClick() {
		const spd = (this.xstart - this.x) * 0.02;
		this.hsp = Math.max(1, Math.abs(spd)) * Math.sign(spd);
	}
}

class Window extends GameObject {
	awake() {
		this.data = GR.DATA.Object.Data.Window;
		// this.imageName = "Window";
		this.boundRect.w = 200;
		this.boundRect.h = 200;
		this.boundRect.x = this.x - this.boundRect.w * 0.5;
		this.boundRect.y = this.y - this.boundRect.h * 0.5;
	}
}

class Clothes extends GameObject {
	awake() {
		this.depth = -2;
		this.data = GR.DATA.Object.Data.Clothes;
		this.xto = this.xstart;
		this.yto = this.ystart;
		this.isUsed = false;
		this.imageName = "ShirtMask";
		this.isDragged = false;
		this.boundRect.w = 80;
		this.boundRect.h = 96;
		this.boundRect.x = this.x - this.boundRect.w * 0.5;
		this.boundRect.y = this.y;
	}
	onClick() {
		if (!this.isUsed) this.isDragged = true;
	}
	update() {
		if (this.imageName.includes("Shirt")) {
			this.boundRect.w = 104;
			this.boundRect.h = 96;
		}
		else {
			this.boundRect.w = 72;
			this.boundRect.h = 58;
		}
		if (!this.isUsed) {
			if (!OBJ.take(Wardrobe)[0].isOpen) {
				this.visible = false;
				this.xto = this.xstart;
				this.yto = this.ystart;
				this.isDragged = false;
				this.boundRect.x = this.x - this.boundRect.w * 0.5;
				this.boundRect.y = this.y;
				return;
			}
			else {
				this.visible = true;
			}
			if (this.isDragged) {
				this.xto = Input.mousePosition.x;
				this.yto = Input.mousePosition.y - this.boundRect.h * 0.5;
				if (Input.mouseUp(0)) {
					if (GR.UI.MouseHoverRect(OBJ.take(Boy)[0])) {
						this.isUsed = true;
						this.isDragged = false;
					}
					else {
						this.isDragged = false;
					}
				}
			}
			else {
				this.xto = Math.range(this.xto, this.xstart, 0.1);
				this.yto = Math.range(this.yto, this.ystart, 0.1);
			}
		}
		this.x = Math.range(this.x, this.xto, 0.2);
		this.y = Math.range(this.y, this.yto, 0.2);
		this.boundRect.x = this.x - this.boundRect.w * 0.5;
		this.boundRect.y = this.y;
	}
}

class Wardrobe extends GameObject {
	awake() {
		this.data = GR.DATA.Object.Data.Wardrobe;
		this.imageName = "Wardrobe";
		this.isOpen = false;
		this.boundRect.w = 200;
		this.boundRect.h = 400;
		this.boundRect.x = this.x - this.boundRect.w * 0.5;
		this.boundRect.y = this.y - this.boundRect.h - 20;
	}
	onClick() {
		this.isOpen = true;
	}
}

class BubbleText extends BranthBehaviour {
	constructor() {
		super(0, 0);
		this.depth = -3;
		this.text = "";
		this.duration = 0;
		this.textPosition = new Vector2(0, 0);
		this.talkerPosition = new Vector2(0, 0);
		this.fadeOutSequence = 0;
	}
	setup(text, duration, textPosition, talkerPosition) {
		this.text = text;
		this.duration = duration;
		this.textPosition = textPosition;
		this.talkerPosition = talkerPosition;
		this.fadeOutSequence = 0;
		this.alarm[0] = this.duration;
	}
	render() {
		const v = new Vector2(this.textPosition.x, this.textPosition.y + Math.sin(Time.time * 0.0025) * 2);
		const d = Math.pointdir(v, this.talkerPosition);
		Draw.setFont(Font.l, Font.bold);
		Draw.setHVAlign(Align.c, Align.m);
		const drawBubble = (gap=0) => {
			let scale = 1;
			if (this.fadeOutSequence > 1) scale = this.alarm[2] / 500;
			Draw.roundRectTransformed(v.x, v.y, Draw.textWidth(this.text) + 30 + gap, Draw.textHeight(this.text) + 30 + gap, Font.size, false, scale, scale);
		};
		const drawTriangle = () => {
			if (this.fadeOutSequence < 2) {
				Draw.pointTriangle(
					Vector2.add(v, Math.lendir(10, d - 90)),
					Vector2.add(v, Math.lendir(10, d + 90)),
					this.talkerPosition
				);
				Draw.setStrokeWeight(2);
				Draw.CTX.strokeStyle = C.black;
				Draw.pointTriangle(
					Vector2.add(v, Math.lendir(10, d - 90)),
					Vector2.add(v, Math.lendir(10, d + 90)),
					this.talkerPosition, true
				);
				Draw.resetStrokeWeight();
			}
		};
		if (this.fadeOutSequence > 1) {
			if (this.alarm[2] > 0) {
				Draw.setAlpha(Math.clamp(this.alarm[2] / 500, 0, 1));
			}
			else return;
		}
		Draw.setColor(C.black);
		drawBubble(4);
		Draw.setColor(C.cadetBlue);
		drawTriangle();
		if (this.fadeOutSequence > 0) {
			Draw.setColor(`rgba(0, 0, 0, ${this.fadeOutSequence > 1? 1 : Math.clamp(1 - (this.alarm[1] / 500), 0, 1)})`);
			drawTriangle();
		}
		if (this.fadeOutSequence < 2) {
			Draw.setColor(C.cadetBlue);
			drawBubble();
			Draw.setColor(C.white);
			Draw.text(v.x, v.y, this.text);
		}
		if (this.fadeOutSequence > 0) {
			this.talkerPosition.x = Math.range(this.talkerPosition.x, this.textPosition.x, 0.1);
			this.talkerPosition.y = Math.range(this.talkerPosition.y, this.textPosition.y, 0.1);
			this.textPosition.x = Math.range(this.textPosition.x, this.talkerPosition.x, 0.005);
			this.textPosition.y = Math.range(this.textPosition.y, this.talkerPosition.y, 0.005);
			Draw.setColor(`rgba(0, 0, 0, ${this.fadeOutSequence > 1? 1 : Math.clamp(1 - (this.alarm[1] / 500), 0, 1)})`);
			drawBubble();
		}
		Draw.setAlpha(1);
	}
	alarm0() {
		// Fade out to black
		this.fadeOutSequence = 1;
		this.alarm[1] = 500;
	}
	alarm1() {
		// Fade out to transparent and scale down
		this.fadeOutSequence = 2;
		this.alarm[2] = 500;
	}
	alarm2() {
		OBJ.destroy(this.id);
	}
	static Push(text, duration, textPosition, talkerPosition) {
		BubbleText.Instance.setup(text, duration, textPosition, talkerPosition);
	}
	static get Instance() {
		return OBJ.take(BubbleText)[0] || OBJ.create(BubbleText);
	}
}

OBJ.add(Boy);
OBJ.add(Bed);
OBJ.add(Desk);
OBJ.add(Toys);
OBJ.add(Window);
OBJ.add(Clothes);
OBJ.add(Wardrobe);
OBJ.add(BubbleText);

const Boot = new BranthRoom("Boot");
const Menu = new BranthRoom("Menu");
const Bedroom = new BranthRoom("Bedroom");
Room.add(Boot);
Room.add(Menu);
Room.add(Bedroom);

Boot.start = () => {
	Draw.add(new Vector2(0.5, 0), "BoyBody", "src/img/BoyBody.png");
	Draw.add(new Vector2(0.5, 1), "BoyHead", "src/img/BoyHead.png");
	Draw.add(new Vector2(0.05, 0.55), "BoyArm", "src/img/BoyArm.png");
	Draw.add(new Vector2(0.05, 0.72), "BoyLeg", "src/img/BoyLeg.png");
	Draw.add(new Vector2(0.5, 1), "Bed", "src/img/Bed.png");
	Draw.add(new Vector2(0.5, 1), "Toys", "src/img/Toys.png");
	Draw.add(new Vector2(0.5,0.5), "Window", "src/img/WindowSpring.png", "src/img/WindowWinter.png", "src/img/WindowSummer.png", "src/img/WindowAutumn.png");
	Draw.add(new Vector2(0.5, 1), "Wardrobe", "src/img/Wardrobe.png");
	Draw.addStrip(new Vector2(0.5, 0.5), "LevelButton", "src/img/LevelButton_strip2.png", 2);
	Draw.add(new Vector2(0.5, 0.5), "BackButton", "src/img/BackButton.png");
	Draw.add(new Vector2(0.5, 0), "ShirtMask", "src/img/ShirtMask.png");
	Draw.add(new Vector2(0.5, 0), "PantMask", "src/img/PantMask.png");
	Sound.add("BGM", "src/snd/BGM.mp3");
	Sound.setLoopRange("BGM", 0, 0.98);
	setTimeout(() => {
		const shirts = [
			{
				c: C.red,
				name: "Red"
			},
			{
				c: C.blue,
				name: "Blue"
			},
			{
				c: C.yellow,
				name: "Yellow"
			}
		];
		for (const i of shirts) {
			const shirt = document.createElement("canvas");
			shirt.width = 104;
			shirt.height = 96;
			Draw.setContext(shirt.getContext("2d"));
			Draw.setColor(i.c);
			Draw.rect(0, 0, shirt.width, shirt.height);
			Draw.CTX.globalCompositeOperation = "destination-in";
			Draw.image("ShirtMask", shirt.width * 0.5, 0);
			Draw.CTX.globalCompositeOperation = BlendModes.Normal;
			Draw.resetContext();
			Draw.add(new Vector2(0.5, 0), i.name + "Shirt", shirt);
		}
		const pants = [
			{
				c: C.red,
				name: "Red"
			},
			{
				c: C.blue,
				name: "Blue"
			},
			{
				c: C.yellow,
				name: "Yellow"
			}
		];
		for (const i of pants) {
			const pant = document.createElement("canvas");
			pant.width = 72;
			pant.height = 58;
			Draw.setContext(pant.getContext("2d"));
			Draw.setColor(i.c);
			Draw.rect(0, 0, pant.width, pant.height);
			Draw.CTX.globalCompositeOperation = "destination-in";
			Draw.image("PantMask", pant.width * 0.5, 0);
			Draw.CTX.globalCompositeOperation = BlendModes.Normal;
			Draw.resetContext();
			Draw.add(new Vector2(0.5, 0), i.name + "Pant", pant);
		}
		Room.start("Menu");
	}, 1000);
};

Menu.start = () => {
	if (!Sound.isPlaying("BGM")) Sound.loop("BGM");
};

Menu.renderUI = () => {
	let scale = 1;
	let x = Room.w * 0.25;
	let y = Room.mid.h;
	let w = 320;
	let h = 300;
	let boundRect = GR.UI.CreateRect(x - w * 0.5, y - h * 0.5, w, h);
	if (GR.UI.MouseHoverRect(boundRect)) {
		if (Input.mouseDown(0)) {
			Room.start("Bedroom");
		}
		scale = 1.05;
	}
	else scale = 1;
	Draw.strip("LevelButton", 0, Room.w * 0.25, Room.mid.h, scale, scale);
	Draw.strip("LevelButton", 1, Room.w * 0.75, Room.mid.h);
};

Bedroom.start = () => {
	if (!Sound.isPlaying("BGM")) Sound.loop("BGM");
	setTimeout(() => { GR.Reaction.DownloadReaction(); }, 90000);
	GR.Game.seasonIndex = Math.irange(4);
	switch (GR.Game.seasonIndex) {
		// Spring (Rainy, Sunny, -, Cloudy)
		case 0: GR.Game.weatherIndex = Math.choose(0, 1, 3); break;
		// Winter (-, Sunny, Snowy, -)
		case 1: GR.Game.weatherIndex = Math.choose(1, 2); break;
		// Summer (-, Sunny, -, -)
		case 2: GR.Game.weatherIndex = Math.choose(1); break;
		// Autumn (Rainy, Sunny, -, Cloudy)
		case 3: GR.Game.weatherIndex = Math.choose(0, 1, 3); break;
	}
	GR.Draw.CreateBGBedroom();
	OBJ.create(Boy, Room.w * 0.8, Room.h * 0.9);
	OBJ.create(Bed, Room.w * 0.8, Room.h * 0.85);
	OBJ.create(Toys, Room.w * 0.5, Room.h * 0.78);
	OBJ.create(Window, Room.w * 0.38 + 100, Room.h * 0.1 + 100);
	let n = OBJ.create(Clothes, 80, 123);
	n.imageName = "RedShirt";
	n = OBJ.create(Clothes, 160, 123);
	n.imageName = "BlueShirt";
	n = OBJ.create(Clothes, 240, 123);
	n.imageName = "YellowShirt";
	n = OBJ.create(Clothes, 80, 300);
	n.imageName = "RedPant";
	n = OBJ.create(Clothes, 160, 300);
	n.imageName = "BluePant";
	n = OBJ.create(Clothes, 240, 300);
	n.imageName = "YellowPant";
	OBJ.create(Wardrobe, Room.w * 0.15, Room.h * 0.82);
	BubbleText.Push(`Today it is ${GR.Game.GetWeatherWord().toLowerCase()}. What\nshould ${GR.DATA.Object.Data.Boy.name} wear?`, 7000, new Vector2(461, 300), new Vector2(461, 226));
};

Bedroom.update = () => {
	const go = [
		OBJ.take(Boy)[0],
		OBJ.take(Bed)[0],
		// OBJ.take(Desk)[0],
		OBJ.take(Toys)[0],
		OBJ.take(Window)[0],
		OBJ.take(Clothes)[0],
		OBJ.take(Wardrobe)[0]
	];
	go.sort((a, b) => a.depth > b.depth? -1 : 1);
	for (let i = go.length - 1; i >= 0; i--) {
		const j = go[i];
		if (GR.UI.MouseHoverRect(j.boundRect)) {
			if (Input.mouseDown(0)) {
				if (j.data.name === "Wardrobe" && j.isOpen) {
					continue;
				}
				else {
					GR.Reaction.AddReaction(`${Time.mm}:${Time.ss}`, GR.Reaction.Type.Click, j.data);
					j.onClick();
					break;
				}
			}
			if (Input.mouseUp(0)) {
				for (const i of OBJ.take(Clothes)) {
					if (i.isDragged) {
						GR.Reaction.AddReaction(`${Time.mm}:${Time.ss}`, GR.Reaction.Type.DragAndDrop, { name: i.imageName }, j.data);
						break;
					}
				}
				j.onRelease();
				break;
			}
		}
	}
	const updateGuide = {
		"0"() {
			if (OBJ.take(BubbleText).length === 0) {
				OBJ.take(Boy)[0].goTo(382, 487, Math.range(5000, 7000));
				GR.Game.guideIndex = 1;
			}
		},
		"1"() {
			if (!OBJ.take(Boy)[0].isMoving) {
				BubbleText.Push(`Can you help me\nopen the wardrobe?`, 7000, new Vector2(605, 173), new Vector2(473, 242));
				GR.Game.guideIndex = 2;
			}
		},
		"2"() {
		}
	}[GR.Game.guideIndex];
	updateGuide();
};

Bedroom.render = () => {
	Draw.sprite("Window", GR.Game.seasonIndex, Room.w * 0.38 + 100, Room.h * 0.1 + 100);
	if (GR.Game.seasonIndex === 1 && GR.Game.weatherIndex === 2) {
		if (++GR.Game.fallCount % 4 === 0) {
			const n = OBJ.take(Window)[0].boundRect;
			Emitter.preset("Snow");
			Emitter.setArea(n.x, n.x + n.w, n.y, n.y);
			Emitter.emit(1, false);
		}
	}
	else if (GR.Game.seasonIndex === 3) {
		if (++GR.Game.fallCount % 20 === 0) {
			const n = OBJ.take(Window)[0].boundRect;
			Emitter.preset("Leaves");
			Emitter.setArea(n.x, n.x + n.w, n.y, n.y);
			Emitter.emit(1, false);
		}
	}
	const o = OBJ.take(BranthParticle);
	for (let i = o.length - 1; i >= 0; i--) {
		o[i].render();
	}
	Draw.CTX.drawImage(GR.Draw.BGBedroom, 0, 0);
};

Bedroom.renderUI = () => {
	let scale = 1;
	const boundRect = GR.UI.CreateRect(8, 8, 32, 32);
	if (GR.UI.MouseHoverRect(boundRect)) {
		scale = 1.05;
		if (Input.mouseDown(0)) {
			Room.start("Menu");
		}
	}
	else scale = 1;
	Draw.image("BackButton", 24, 24, scale, scale);
	if (GLOBAL.debugMode % 2 !== 0) {
		Draw.text(Room.mid.w, Room.mid.h, `${~~Input.mousePosition.x}, ${~~Input.mousePosition.y}`);
	}
};

BRANTH.start(960, 540, { HAlign: true, VAlign: true, backgroundColor: C.white });
Room.start("Boot");