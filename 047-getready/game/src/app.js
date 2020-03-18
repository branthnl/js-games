const GR = {};

GR.DATA = {
	Season: {
		Spring: "Spring",
		Summer: "Summer",
		Autumn: "Autumn",
		Winter: "Winter"
	},
	Weather: {
		Sunny: "Sunny",
		Cloudy: "Cloudy",
		Rainy: "Rainy",
		Snowy: "Snowy"
	},
	ClothNames: {
		Red: "Red",
		Blue: "Blue",
		Lime: "Lime",
		Green: "Green",
		Purple: "Purple"
	},
	CreateBedroomBG() {
		Room.w = 960;
		Room.h = 540;
		const BG = document.createElement("canvas");
		BG.width = Room.w;
		BG.height = Room.h;
		Draw.setContext(BG.getContext("2d"));
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
		return BG;
	}
};

GR.Loader = {
	progress: 0,
	totalFileCount: 0,
	loadedFileCount: 0,
	loadingBar: {
		w: 192,
		h: 54
	},
	LoadImage(origin, name) {
		this.totalFileCount++;
		Draw.add(origin, name, `src/img/${name}.png`);
		Draw.getImage(name).onload = () => {
			GR.Loader.loadedFileCount++;
		};
	},
	LoadSound(name, ext) {
		this.totalFileCount++;
		Sound.add(name, `src/snd/${name}.${ext}`);
		Sound.get(name).onloadeddata = () => {
			GR.Loader.loadedFileCount++;
		};
	}
};

GR.UI = {
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

GR.Game = {
	season: GR.DATA.Season.Spring,
	weather: GR.DATA.Weather.Sunny,
	draggedItem: null
};

class Boy extends BranthBehaviour {
	constructor(x, y) {
		super(x, y);
		this.depth = -1;
		this.w = 150;
		this.h = 333;
		this.rect = GR.UI.CreateRect(this.x - this.w * 0.5, this.y - this.h, this.w, this.h);
		this.clothes = {
			Pants: null,
			Short: null,
			Shirt: null
		};
	}
	render() {
		this.rect.x = this.x - this.w * 0.5;
		this.rect.y = this.y - this.h;
		if (Input.mouseUp(0)) {
			if (GR.Game.draggedItem instanceof Cloth) {
				if (GR.UI.MouseHoverRect(this.rect)) {
					if (this.clothes[GR.Game.draggedItem.type] === null) {
						this.clothes[GR.Game.draggedItem.type] = GR.Game.draggedItem;
					}
				}
			}
			GR.Game.draggedItem = null;
		}
		Draw.image("Boy", this.x, this.y);
		if (this.clothes.Pants) {
			this.clothes.Pants.x = this.x;
			this.clothes.Pants.y = this.y - 76;
		}
		else if (this.clothes.Short) {
			this.clothes.Short.x = this.x;
			this.clothes.Short.y = this.y - 76;
		}
		if (this.clothes.Shirt) {
			this.clothes.Shirt.x = this.x;
			this.clothes.Shirt.y = this.y - 155;
		}
	}
}

class Bed extends BranthObject {
	render() {
		Draw.image("Bed", this.x, this.y);
	}
}

class Toys extends BranthObject {
	constructor(x, y) {
		super(x, y);
		this.hsp = Math.range(-1, 1);
		const i = Draw.getImage("Toys");
		this.w = i.width;
		this.h = i.height;
		this.rect = GR.UI.CreateRect(this.x - this.w * 0.5, this.y - this.h, this.w, this.h);
	}
	render() {
		if (GR.UI.MouseHoverRect(this.rect)) {
			if (Input.mouseDown(0)) {
				const spd = (this.xstart - this.x) * 0.02;
				this.hsp = Math.max(1, 1 - Math.abs(spd)) * Math.sign(spd);
				Sound.play("Miss");
			}
		}
		this.x += this.hsp;
		this.hsp *= 0.99;
		this.rect.x = this.x - this.w * 0.5;
		this.rect.y = this.y - this.h;
		Draw.image("Toys", this.x, this.y);
	}
}

class Cloth extends BranthObject {
	constructor(x, y, name, type) {
		super(x, y);
		this.depth = type === "Shirt"? -3 : -2;
		this.w = 0;
		this.h = 0;
		this.name = name;
		this.type = type;
		this.rect = null;
	}
	render() {
		if (this.rect === null) {
			const i = Draw.getImage(`${this.name}${this.type}`);
			this.w = i.width;
			this.h = i.height;
			this.rect = GR.UI.CreateRect(this.x - this.w * 0.5, this.y, this.w, this.h);
		}
		else {
			this.rect.x = this.x - this.w * 0.5;
			this.rect.y = this.y;
			if (GR.UI.MouseHoverRect(this.rect)) {
				if (Input.mouseDown(0)) {
					if (GR.Game.draggedItem === null) {
						GR.Game.draggedItem = this;
					}
				}
			}
			Draw.image(`${this.name}${this.type}`, this.x, this.y);
			// GR.UI.DebugRect(this.rect);
		}
	}
}

class Window extends BranthObject {
	constructor(x, y) {
		super(x, y);
		this.w = 200;
		this.h = 200;
		this.name = "Window";
	}
}

class Wardrobe extends BranthObject {
	render() {
		Draw.image("Wardrobe", this.x, this.y, 1.5);
	}
}

class BackButton extends BranthObject {
	constructor(x, y) {
		super(x, y);
		this.r = 12;
		this.scale = 1;
		this.rect = GR.UI.CreateRect(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
	}
	render() {
		this.scale = Math.range(this.scale, 1 + 0.1 * GR.UI.MouseHoverRect(this.rect));
		Draw.setColor(C.burlyWood);
		Draw.circle(this.x, this.y, this.r * this.scale);
		Draw.setFont(Font.m, Font.bold);
		Draw.setColor(GR.UI.MouseHoverRect(this.rect)? C.white : C.black);
		Draw.setHVAlign(Align.c, Align.m);
		Draw.textTransformed(this.x, this.y - 1, "x", this.scale, this.scale);
		if (GR.UI.MouseHoverRect(this.rect)) {
			if (Input.mouseDown(0)) {
				Sound.play("Pop");
				Room.start("Menu");
			}
		}
	}
}

class MenuOption extends BranthBehaviour {
	constructor(x, y, name, isUnlocked=true) {
		super(x, y);
		this.w = 220;
		this.h = 120;
		this.name = name;
		this.xscale = 1.2;
		this.yscale = 1.2;
		this.isUnlocked = isUnlocked;
		this.rect = GR.UI.CreateRect(this.x - this.w * 0.5, this.y - this.h * 0.5, this.w, this.h);
	}
	update() {
		if (GR.UI.MouseHoverRect(this.rect)) {
			if (Input.mouseDown(0)) {
				if (this.isUnlocked) {
					Sound.play("Pop");
					Room.start(this.name);
				}
			}
		}
	}
	render() {
		this.yscale = this.xscale = Math.range(this.xscale, 1 + 0.1 * (GR.UI.MouseHoverRect(this.rect) && this.isUnlocked), 0.2);
		Draw.setColor(this.isUnlocked? C.burlyWood : C.gray);
		Draw.roundRectTransformed(this.x, this.y, this.w, this.h, 10, false, this.xscale, this.yscale, 0);
		Draw.setFont(Font.xl);
		Draw.setColor(this.isUnlocked? (GR.UI.MouseHoverRect(this.rect)? C.white : C.black) : C.lightGray);
		Draw.setHVAlign(Align.c, Align.m);
		Draw.textTransformed(this.x, this.y, this.name.toUpperCase(), this.xscale, this.yscale, 0);
	}
}

class MenuManager extends BranthBehaviour {
	constructor() {
		super(Room.mid.w, Room.mid.h);
		this.xto = this.x;
		this.yto = this.y;
		this.xscale = 0;
		this.yscale = 0;
		this.angle = 0;
		this.duration = 4000;
		this.alarm[0] = this.duration;
		this.optionIsSpawned = false;
	}
	spawnOption() {
		OBJ.create(MenuOption, Room.w * 0.25, Room.mid.h + 50, "Bedroom");
		OBJ.create(MenuOption, Room.w * 0.75, Room.mid.h + 50, "Kitchen", false);
		this.alarm[0] = -1;
	}
	render() {
		if (Input.mouseDown(0) && !this.optionIsSpawned) {
			this.alarm[0] = this.duration * 0.4;
			this.spawnOption();
			this.optionIsSpawned = true;
		}
		const t = Math.clamp(this.alarm[0] / this.duration, 0, 1);
		if (t > 0.4) {
			const u = 1 - (t - 0.4) / 0.6;
			this.yscale = this.xscale = 1.1 * u;
			this.angle = 180 - 180 * u;
		}
		else if (t > 0.3) {
			const u = 1 - (t - 0.3) / 0.1;
			this.yscale = this.xscale = 1.1 - 0.1 * u;
		}
		else if (t > 0) {
			const u = 1 - (t - 0) / 0.3;
			this.yto = Room.mid.h - Room.h * 0.25 * u;
		}
		else {
			if (!this.optionIsSpawned) {
				this.spawnOption();
				this.optionIsSpawned = true;
			}
			this.yto = Room.h * 0.25 + Math.sin(Time.time * 0.005) * 4;
			this.yscale = this.xscale = Math.range(this.xscale, 1, 0.2);
			this.angle = Math.range(this.angle, 0, 0.2);
		}
		this.x = Math.range(this.x, this.xto, 0.1);
		this.y = Math.range(this.y, this.yto, 0.1);
		Draw.setFont(Font.xxl);
		Draw.setColor(C.white);
		Draw.setHVAlign(Align.c, Align.m);
		Draw.textTransformed(this.x, this.y, "Getting Ready\nto School", this.xscale, this.yscale, this.angle);
		if (!this.optionIsSpawned) {
			Draw.setFont(Font.s);
			Draw.setHVAlign(Align.c, Align.b);
			for (let i = 1; i >= 0; i--) {
				Draw.setColor(i > 0? C.black : C.white);
				Draw.text(Room.mid.w + i, Room.h - 20 + i, "Click anywhere to skip intro");
			}
		}
	}
}

OBJ.add(Boy);
OBJ.add(Bed);
OBJ.add(Toys);
OBJ.add(Cloth);
OBJ.add(Window);
OBJ.add(Wardrobe);
OBJ.add(BackButton);
OBJ.add(MenuOption);
OBJ.add(MenuManager);

const Boot = new BranthRoom("Boot");
const Menu = new BranthRoom("Menu");
const Bedroom = new BranthRoom("Bedroom");
Room.add(Boot);
Room.add(Menu);
Room.add(Bedroom);

Boot.start = () => {
	Draw.add(new Vector2(0, 0), "BGBedroom", GR.DATA.CreateBedroomBG());
	GR.Loader.LoadImage(new Vector2(0.5, 0.5), "WindowSpring");
	GR.Loader.LoadImage(new Vector2(0.5, 0.5), "WindowSummer");
	GR.Loader.LoadImage(new Vector2(0.5, 0.5), "WindowAutumn");
	GR.Loader.LoadImage(new Vector2(0.5, 0.5), "WindowWinter");
	GR.Loader.LoadImage(new Vector2(0.5, 1), "Boy");
	GR.Loader.LoadImage(new Vector2(0.5, 1), "Bed");
	GR.Loader.LoadImage(new Vector2(0.5, 1), "Toys");
	GR.Loader.LoadImage(new Vector2(0.5, 1), "Wardrobe");
	for (const i of Object.values(GR.DATA.ClothNames)) {
		GR.Loader.LoadImage(new Vector2(0.5, 0), `${i}Pants`);
		GR.Loader.LoadImage(new Vector2(0.5, 0), `${i}Shirt`);
		GR.Loader.LoadImage(new Vector2(0.5, 0), `${i}Short`);
	}
	GR.Loader.LoadSound("Intro", "mp3");
	GR.Loader.LoadSound("Miss", "ogg");
	GR.Loader.LoadSound("Pop", "ogg");
	Sound.setVolume("Miss", 0.1);
};

Boot.renderUI = () => {
	GR.Loader.progress = Math.range(GR.Loader.progress, GR.Loader.loadedFileCount / GR.Loader.totalFileCount, 0.2);
	Draw.setColor(C.white);
	Draw.roundRect(Room.mid.w - GR.Loader.loadingBar.w * 0.5 + 2, Room.mid.h - GR.Loader.loadingBar.h * 0.5 + 2, GR.Loader.loadingBar.w - 4, GR.Loader.loadingBar.h - 4, 10);
	Draw.setColor(C.burlyWood);
	Draw.roundRect(Room.mid.w - GR.Loader.loadingBar.w * 0.5, Room.mid.h - GR.Loader.loadingBar.h * 0.5, GR.Loader.progress * GR.Loader.loadingBar.w, GR.Loader.loadingBar.h, 10);
	Draw.setFont(Font.xl);
	Draw.setColor(C.black);
	Draw.setHVAlign(Align.c, Align.m);
	Draw.text(Room.mid.w, Room.mid.h, `${Math.ceil(GR.Loader.progress * 100)}%`);
	if (GR.Loader.progress >= 0.999) Room.start("Menu");
};

Menu.start = () => {
	Sound.play("Intro");
	OBJ.create(MenuManager);
	OBJ.create(Transition, C.black);
};

Menu.renderUI = () => {
	// Fade in intro volume
	Sound.setVolume("Intro", Math.range(Sound.getVolume("Intro"), 1, 0.1));
	Transition.Render();
};

Bedroom.setup = () => {
	// Pick today's weather
	GR.Game.weather = Math.picko(Object.values(GR.DATA.Weather));
	// Change to sunny if it's snowy but current season is not winter
	if (GR.Game.weather === GR.DATA.Weather.Snowy && GR.Game.season !== GR.DATA.Season.Winter) {
		GR.Game.weather = GR.DATA.Weather.Sunny;
	}
	// Create wardrobe
	OBJ.create(Wardrobe, 180, Room.h * 0.82);
	// Put clothes in wardrobe
	const clothNames = Object.values(GR.DATA.ClothNames);
	const i1 = Math.randpop(clothNames);
	const i2 = Math.randpop(clothNames);
	const i3 = Math.randpop(clothNames);
	const wardrobeClothes = [
		[i1, i2, i3],
		[i1, i2, i3]
	];
	Math.shuffle(wardrobeClothes[0]);
	Math.shuffle(wardrobeClothes[1]);
	const shorts = [];
	for (let i = 0; i < 2; i++) {
		for (let j = 0; j < 3; j++) {
			const type = i > 0? "Short" : "Shirt";
			const n = OBJ.create(Cloth, 80 + 100 * j, 100 + 150 * i, wardrobeClothes[i][j], type);
			if (type === "Short") shorts.push(n);
		}
	}
	if (GR.Game.weather === GR.DATA.Weather.Rainy || GR.Game.weather === GR.DATA.Weather.Snowy) {
		shorts[Math.irange(shorts.length)].type = "Pants";
	}
	// Create other objects
	OBJ.create(Bed, Room.w * 0.8, Room.h * 0.85);
	OBJ.create(Toys, Room.w * 0.5, Room.h * 0.78);
	OBJ.create(Window, Room.w * 0.38 + 100, Room.h * 0.1 + 100);
	OBJ.create(BackButton, 20, 20);
	// Put the boy
	OBJ.create(Boy, Room.w * 0.8, Room.h - 30);
	OBJ.create(Transition, C.black);
};

Bedroom.start = () => {
	GR.Game.season = Math.picko(Object.values(GR.DATA.Season));
	Bedroom.setup();
};

Bedroom.fallCount = 0;
Bedroom.SpawnParticle = (name) => {
	const n = OBJ.take(Window)[0];
	Emitter.preset(name);
	Emitter.setArea(n.x - n.w, n.x + n.w, n.y - n.h, n.y - n.h);
	Emitter.emit(1, false);
};

Bedroom.render = () => {
	// Fade out intro volume
	Sound.setVolume("Intro", Math.range(Sound.getVolume("Intro"), 0, 0.1));
	// Control dragged item
	if (GR.Game.draggedItem instanceof Cloth) {
		GR.Game.draggedItem.x = Input.mousePosition.x;
		GR.Game.draggedItem.y = Input.mousePosition.y - GR.Game.draggedItem.h * 0.5;
	}
	// Draw garden
	Draw.image(`Window${GR.Game.season}`, Room.w * 0.38 + 100, Room.h * 0.1 + 100);
	// Fall some leaves on autumn
	if (GR.Game.season === GR.DATA.Season.Autumn) if (++Bedroom.fallCount % 20 === 0) Bedroom.SpawnParticle("Leaves");
	// Spawn particles according to the weather
	switch (GR.Game.weather) {
		case GR.DATA.Weather.Sunny: break;
		case GR.DATA.Weather.Cloudy: break;
		case GR.DATA.Weather.Rainy: if (++Bedroom.fallCount % 4 === 0) Bedroom.SpawnParticle("Rain"); break;
		case GR.DATA.Weather.Snowy: if (++Bedroom.fallCount % 4 === 0) Bedroom.SpawnParticle("Snow"); break;
	}
	// Render particles
	const o = OBJ.take(BranthParticle);
	for (let i = o.length - 1; i >= 0; i--) { o[i].render(); }
	Draw.image("BGBedroom", 0, 0);
};

Bedroom.renderUI = () => {
	Transition.Render();
};

Room.start("Boot");
// GLOBAL.setProductionMode(true); // Uncomment to hide console.logs that's being used to debug
BRANTH.start(960, 540, { HAlign: true, VAlign: true, backgroundColor: C.royalBlue });