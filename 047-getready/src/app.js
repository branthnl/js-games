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
	seasonIndex: 0
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
		// Draw window frame
		// Draw.setColor("rgba(125, 65, 12, 1)");
		// Draw.roundRect(Room.w * 0.38, Room.h * 0.1, 200, 200, 10);
		// Draw window screen
		// Draw.setColor(C.skyBlue);
		// Draw.roundRect(Room.w * 0.38 + 10, Room.h * 0.1 + 10, 180, 180, 10);
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
		let data = "timing;move_type;from;to (only for drag and drop)\n";
		for (const i of this.list) {
			data += `${i.timing};${i.move_type};${i.from.name};${i.move_type === GR.Reaction.Type.DragAndDrop? i.to.name : ''}\n`;
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
		this.mouthOpen = false;
		this.mouthOpenScalar = 0;
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
		this.mouthOpenScalar = Math.range(this.mouthOpenScalar, this.mouthOpen, 0.1);
	}
	render() {
		const t = Math.sin(Time.time * 0.02 * (this.isMoving? 1 : 0.1));
		const v = new Vector2(0, t);
		Draw.CTX.save();
		Draw.CTX.translate(this.x, this.y);
		Draw.CTX.scale(1 + t * 0.005, 1 - t * 0.005);
		Draw.image("BoyBody", v.x, v.y - 207);
		Draw.image("BoyHead", v.x, v.y - 200);
		Draw.image("BoyArm", v.x + 20, v.y - 180, 1, 1, 65 + t);
		Draw.image("BoyArm", v.x - 21, v.y - 182, -1, 1, 65 + t);
		Draw.image("BoyLeg", v.x + 18, v.y - 75, 1, 1, 90 - Math.max(0, t));
		Draw.image("BoyLeg", v.x - 18, v.y - 75, -1, 1, 90 - Math.max(0, t));
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
		Draw.CTX.quadraticCurveTo(v.x, v.y - 220 - 6 * this.mouthOpenScalar, v.x - 18, v.y - 228 - 2 * this.mouthOpenScalar);
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
		this.data = GR.DATA.Object.Data.Clothes;
		this.imageName = "Clothes";
	}
}

class Wardrobe extends GameObject {
	awake() {
		this.data = GR.DATA.Object.Data.Wardrobe;
		this.imageName = "Wardrobe";
		this.boundRect.w = 200;
		this.boundRect.h = 400;
		this.boundRect.x = this.x - this.boundRect.w * 0.5;
		this.boundRect.y = this.y - this.boundRect.h - 20;
	}
}

OBJ.add(Boy);
OBJ.add(Bed);
OBJ.add(Desk);
OBJ.add(Toys);
OBJ.add(Window);
OBJ.add(Clothes);
OBJ.add(Wardrobe);

const Boot = new BranthRoom("Boot");
const Bedroom = new BranthRoom("Bedroom");
Room.add(Boot);
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
	Room.start("Bedroom");
};

Bedroom.start = () => {
	GR.Game.seasonIndex = Math.irange(4);
	GR.Draw.CreateBGBedroom();
	OBJ.create(Boy, Room.w * 0.8, Room.h * 0.9);
	OBJ.create(Bed, Room.w * 0.8, Room.h * 0.85);
	OBJ.create(Toys, Room.w * 0.5, Room.h * 0.78);
	OBJ.create(Window, Room.w * 0.38 + 100, Room.h * 0.1 + 100);
	OBJ.create(Wardrobe, Room.w * 0.15, Room.h * 0.82);
};

Bedroom.update = () => {
	const go = [
		OBJ.take(Boy)[0],
		OBJ.take(Bed)[0],
		// OBJ.take(Desk)[0],
		OBJ.take(Toys)[0],
		OBJ.take(Window)[0],
		// OBJ.take(Clothes)[0],
		OBJ.take(Wardrobe)[0]
	];
	go.sort((a, b) => a.depth > b.depth? -1 : 1);
	for (let i = go.length - 1; i >= 0; i--) {
		const j = go[i];
		if (Input.mouseDown(0)) {
			if (GR.UI.MouseHoverRect(j.boundRect)) {
				GR.Reaction.AddReaction(Time.time, GR.Reaction.Type.Click, j.data);
				j.onClick();
				break;
			}
		}
	}
};

Bedroom.render = () => {
	Draw.sprite("Window", GR.Game.seasonIndex, Room.w * 0.38 + 100, Room.h * 0.1 + 100);
	if (GR.Game.seasonIndex === 1 || GR.Game.seasonIndex === 3) {
		if (++GR.Game.fallCount % 4 === 0) {
			const n = OBJ.take(Window)[0].boundRect;
			Emitter.preset(GR.Game.seasonIndex === 1? "Snow" : "Leaves");
			Emitter.setArea(n.x, n.x + n.w, n.y, n.y);
			Emitter.emit(1, false);
		}
		const o = OBJ.take(BranthParticle);
		for (let i = o.length - 1; i >= 0; i--) {
			o[i].render();
		}
	}
	Draw.CTX.drawImage(GR.Draw.BGBedroom, 0, 0);
};

BRANTH.start(960, 540, { HAlign: true, VAlign: true, backgroundColor: C.white });
Room.start("Boot");