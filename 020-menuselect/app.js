class Choice extends BranthObject {
	constructor(x, y) {
		super(x, y);
		this.items = [];
		this.cursor = 0;
	}
	get selectedItem() {
		return this.items[this.cursor];
	}
	proceed() {}
	update() {
		const keyA = Input.keyDown(KeyCode.Up);
		const keyB = Input.keyDown(KeyCode.Down);
		const keyProceed = Input.keyDown(KeyCode.Enter);
		if (keyA) {
			if (this.cursor > 0) {
				this.cursor -= 1;
			}
			else {
				this.cursor = this.items.length - 1;
			}
		}
		if (keyB) {
			if (this.cursor < this.items.length - 1) {
				this.cursor += 1;
			}
			else {
				this.cursor = 0;
			}
		}
		if (keyProceed) {
			this.proceed();
		}
	}
	renderUI() {
		for (let y = this.items.length - 1, i = 0; y >= 0; y--, i++) {
			Draw.setHVAlign(Align.r, Align.b);
			Draw.setFont(Font.l);
			const gap = Room.w * 0.05;
			Draw.setColor(this.cursor === i? C.red : C.black);
			Draw.text(Room.w - gap, Room.h - gap - y * Font.size, this.items[i]);
		}
		Draw.setHVAlign(Align.l, Align.t);
		Draw.setFont(Font.m);
		Draw.setColor(C.black);
		Draw.text(32, 32, `Cursor: ${this.cursor}`);
	}
}

class MenuChoice extends Choice {
	awake() {
		this.items = ['Free Roam', 'Garage', 'Options', 'Exit'];
	}
	proceed() {
		alert(this.items[this.cursor]);
	}
}

OBJ.add(Choice);
OBJ.add(MenuChoice);

const Menu = new BranthRoom('Menu', 1280, 720);
Room.add(Menu);

Menu.start = () => {
	OBJ.create(MenuChoice);
}

BRANTH.start();
Room.start('Menu');