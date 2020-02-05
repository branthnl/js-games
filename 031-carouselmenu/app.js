class MenuItem {
	constructor(id, color) {
		this.x = 0;
		this.y = 0;
		this.id = id;
		this.color = color;
		this.text = 'title goes here';
		this.scale = 1;
	}
	get w() {
		return 32 * this.scale;
	}
	get h() {
		return 32 * this.scale;
	}
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	}
	draw(x, y, scale) {
		this.x = x;
		this.y = y;
		this.scale = scale;
		this.render();
	}
	render() {
		Draw.setColor(this.color);
		Draw.rect(this.x - this.mid.w, this.y - this.mid.h, this.w, this.h);
		Draw.setFont(Font.s);
		Draw.setColor(C.black);
		Draw.setHVAlign(Align.c, Align.m);
		Draw.text(this.x, this.y, this.id);
	}
}

class CarouselMenu extends BranthObject {
	start() {
		this.w = Room.w * 0.8;
		this.h = Room.mid.h;
		this.item = null;
		this.items = [
			new MenuItem(0, C.red),
			new MenuItem(1, C.orange),
			new MenuItem(2, C.yellow),
			new MenuItem(3, C.lime),
			new MenuItem(4, C.green),
			new MenuItem(5, C.skyBlue),
			new MenuItem(6, C.blue),
			new MenuItem(7, C.purple)
		];
		this.cursor = 0;
	}
	update() {
		this.x = Room.mid.w;
		this.y = Room.mid.h;
		if (Input.keyDown(KeyCode.Left)) {
			this.cursor -= 1;
		}
		if (Input.keyDown(KeyCode.Right)) {
			this.cursor += 1;
		}
		if (this.cursor < 0) {
			this.cursor += this.items.length;
		}
		this.item = this.items[this.cursor % this.items.length];
		if (Input.keyDown(KeyCode.Enter)) {
			console.log(this.item.id);
		}
	}
	renderUI() {
		if (this.item) {
			this.item.draw(this.x, this.y, 1);
		}
	}
}

OBJ.add(CarouselMenu);

const Menu = new BranthRoom('Menu', 640, 360);
Room.add(Menu);

Menu.start = () => {
	OBJ.create(CarouselMenu);
};

BRANTH.start();
Room.start('Menu');