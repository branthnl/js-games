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
		const gap = Room.w * 0.05;
		const rs = Math.sin(Time.time * 0.08) * 0.32;
		const ss = Math.sin(Time.time * 0.015) * 0.02;
		for (let y = this.items.length - 1, i = 0; y >= 0; y--, i++) {
			const s = this.cursor === i;
			Draw.setHVAlign(Align.r, Align.b);
			Draw.setFont(Font.lb);
			Draw.setColor(s? C.red : C.black);
			const tx = Room.w - gap;
			const ty = Room.h - gap - y * Font.size * 1.2;
			if (s) {
				Draw.save();
				Draw.translate(tx, ty);
				Draw.rotate(rs);
				Draw.scale(1 + ss);
				Draw.text(0, 0, this.items[i]);
				Draw.restore();
			}
			else {
				Draw.text(tx, ty, this.items[i]);
			}
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