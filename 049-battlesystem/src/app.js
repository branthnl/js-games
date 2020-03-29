// Battle System
const BS = {};

BS.Loader = {
	progress: 0,
	totalFileCount: 0,
	loadedFileCount: 0,
	loadingBar: {
		w: 192,
		h: 54
	},
	loadJSON(key, name, url) {
		this.totalFileCount++;
		const req = new XMLHttpRequest();
		req.open("GET", url);
		req.send();
		req.onload = () => {
			BS.Game[key][name] = JSON.parse(req.response);
			BS.Loader.loadedFileCount++;
		};
	},
	LoadImage(origin, name, src) {
		this.totalFileCount++;
		Draw.add(origin, name, src);
		Draw.getImage(name).onload = () => {
			BS.Loader.loadedFileCount++;
		};
	},
	LoadSound(name, src) {
		this.totalFileCount++;
		Sound.add(name, src);
		Sound.get(name).onloadeddata = () => {
			BS.Loader.loadedFileCount++;
		};
	}
};

BS.UI = {
	CreateRect(x, y, w, h) {
		return { x, y, w, h };
	},
	MouseHoverRect(rect) {
		const m = Input.mousePosition;
		return m.x > rect.x && m.x < rect.x + rect.w && m.y > rect.y && m.y < rect.y + rect.h;
	},
	DebugRect(rect) {
		Draw.setColor(C.black);
		Draw.rect(rect.x, rect.y, rect.w, rect.h, true);
	}
};

BS.Game = {
	inputs: {},
	subTexture: {},
	input: null,
	createUnits() {
		for (let armyIndex = 1; armyIndex <= 2; armyIndex++) {
			const army = this.input[`army${armyIndex}`];
			const unitDataArray = Object.values(army).filter(x => typeof(x) === "object");
			for (let j = unitDataArray.length - 1; j >= 0; j--) {
				const k = unitDataArray[j];
				console.log(this.subTexture, k.textureName);
				OBJ.create(Unit, this.getPosition(armyIndex, j), k, this.subTexture[k.textureName].SubTexture);
			}
		}
	},
	getPosition(armyIndex, positionIndex) {
		return [
			new Vector2(393, 321),
			new Vector2(383, 243),
			new Vector2(250, 333),
			new Vector2(252, 236),
			new Vector2(130, 270)
		].map(x => new Vector2(x.x *= (armyIndex === 1? -1 : 1), x.y))[positionIndex];
	}
};

class Unit extends BranthObject {
	constructor(position, unitData, subTextureData) {
		super(position.x, position.y);
		this.data = unitData;
		this.subTextureData = subTextureData;
		console.log(this.subTextureData);
	}
	render() {
		for (let i = this.subTextureData.length - 1; i >= 0; i--) {
			const s = {
				x: this.subTextureData[i].x,
				y: this.subTextureData[i].y,
				w: this.subTextureData[i].width,
				h: this.subTextureData[i].height
			};
			Draw.CTX.drawImage(Draw.getImage(this.data.textureName), s.x, s.y, s.w, s.h, this.x, this.y, s.w, s.h);
		}
	}
}

class Button extends BranthObject {
	constructor(name, x, y) {
		super(x, y);
		this.name = name;
		this.w = 200;
		this.h = 80;
		this.scale = 1;
		this.rect = BS.UI.CreateRect(this.x - this.w * 0.5, this.y - this.h * 0.5, this.w, this.h);
	}
	onClick() {
		BS.Game.input = BS.Game.inputs[this.name];
		Room.start("Game");
	}
	update() {
		if (BS.UI.MouseHoverRect(this.rect)) {
			this.scale = Math.range(this.scale, 1.1, 0.2);
			if (Input.mouseDown(0)) {
				this.onClick();
			}
		}
		else {
			this.scale = Math.range(this.scale, 1, 0.2);
		}
	}
	render() {
		for (let i = 0; i < 2; i++) {
			Draw.setColor(i > 0? C.white : C.gray);
			Draw.roundRectTransformed(this.x, this.y + this.h * 0.1 * (i === 0), this.rect.w, this.rect.h, 10, false, this.scale, this.scale);
		}
		Draw.setFont(Font.xl);
		Draw.setColor(C.black);
		Draw.setHVAlign(Align.c, Align.m);
		Draw.textTransformed(this.x, this.y, this.name, this.scale, this.scale);
	}
}

OBJ.add(Unit);
OBJ.add(Button);

const Boot = new BranthRoom("Boot");
const Menu = new BranthRoom("Menu");
const Game = new BranthRoom("Game");
Room.add(Boot);
Room.add(Menu);
Room.add(Game);

Boot.start = () => {
	BS.Loader.loadJSON("subTexture", "caption", "src/subtexture/caption.json");
	BS.Loader.loadJSON("subTexture", "cm", "src/subtexture/cm.json");
	BS.Loader.loadJSON("subTexture", "es", "src/subtexture/es.json");
	BS.Loader.loadJSON("subTexture", "med", "src/subtexture/med.json");
	BS.Loader.loadJSON("subTexture", "panda", "src/subtexture/panda.json");
	BS.Loader.loadJSON("subTexture", "pom", "src/subtexture/pom.json");
	BS.Loader.loadJSON("subTexture", "qop", "src/subtexture/qop.json");
	BS.Loader.loadJSON("subTexture", "sg", "src/subtexture/sg.json");
	BS.Loader.loadJSON("subTexture", "vs", "src/subtexture/vs.json");
	BS.Loader.loadJSON("subTexture", "zeus", "src/subtexture/zeus.json");
	BS.Loader.loadJSON("inputs", "input1", "src/input/input1.json");
	BS.Loader.loadJSON("inputs", "input2", "src/input/input2.json");
	BS.Loader.loadJSON("inputs", "input3", "src/input/input3.json");
	BS.Loader.LoadImage(Vector2.zero, "bg", "src/img/bg.png");
	BS.Loader.LoadImage(Vector2.zero, "caption", "src/img/caption.png");
	BS.Loader.LoadImage(Vector2.zero, "cm", "src/img/cm.png");
	BS.Loader.LoadImage(Vector2.zero, "es", "src/img/es.png");
	BS.Loader.LoadImage(Vector2.zero, "med", "src/img/med.png");
	BS.Loader.LoadImage(Vector2.zero, "panda", "src/img/panda.png");
	BS.Loader.LoadImage(Vector2.zero, "pom", "src/img/pom.png");
	BS.Loader.LoadImage(Vector2.zero, "qop", "src/img/qop.png");
	BS.Loader.LoadImage(Vector2.zero, "sg", "src/img/sg.png");
	BS.Loader.LoadImage(Vector2.zero, "vs", "src/img/vs.png");
	BS.Loader.LoadImage(Vector2.zero, "zeus", "src/img/zeus.png");
	BS.Loader.LoadSound("BGM", "src/snd/backgroundMusic.mp3");
	Draw.addStrip(new Vector2(0.5, 1), "icons", "src/img/icons_strip10.png", 10);
};

Boot.renderUI = () => {
	BS.Loader.progress = Math.range(BS.Loader.progress, BS.Loader.loadedFileCount / BS.Loader.totalFileCount, 0.2);
	Draw.setColor(C.gray);
	Draw.roundRect(Room.mid.w - BS.Loader.loadingBar.w * 0.5 + 2, Room.mid.h - BS.Loader.loadingBar.h * 0.5 + 2, BS.Loader.loadingBar.w - 4, BS.Loader.loadingBar.h - 4, 10);
	Draw.setColor(C.white);
	Draw.roundRect(Room.mid.w - BS.Loader.loadingBar.w * 0.5, Room.mid.h - BS.Loader.loadingBar.h * 0.5, BS.Loader.progress * BS.Loader.loadingBar.w, BS.Loader.loadingBar.h, 10);
	Draw.setFont(Font.xl);
	Draw.setColor(C.black);
	Draw.setHVAlign(Align.c, Align.m);
	Draw.text(Room.mid.w, Room.mid.h, `${Math.ceil(BS.Loader.progress * 100)}%`);
	if (BS.Loader.progress >= 0.999) Room.start("Menu");
};

Menu.start = () => {
	OBJ.create(Button, "input1", Room.mid.w, Room.h * 0.25);
	OBJ.create(Button, "input2", Room.mid.w, Room.h * 0.5);
	OBJ.create(Button, "input3", Room.mid.w, Room.h * 0.75);
};

Menu.renderUI = () => {
	Transition.Render();
};

Game.start = () => {
	BS.Game.createUnits();
};

Game.render = () => {
	Draw.image("bg", 0, 0);
};

Game.renderUI = () => {
	const m = Input.mousePosition;
	Draw.setColor(C.red);
	Draw.circle(m.x, m.y, 10);
	Draw.setFont(Font.xxl);
	Draw.setColor(C.black);
	Draw.setHVAlign(Align.c, Align.m);
	Draw.text(m.x, m.y, `(${~~m.x}, ${~~m.y})`);
	if (Input.mouseDown(0)) {
		console.log(m.x, m.y);
	}
};

BRANTH.start(960, 540, {
	backgroundColor: C.black
});
Room.start("Boot");