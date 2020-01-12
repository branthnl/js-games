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
		const rs = Math.sin(Time.time * 0.08) * 0.48;
		const ss = Math.sin(Time.time * 0.015) * 0.034;
		for (let y = this.items.length - 1, i = 0; y >= 0; y--, i++) {
			const s = this.cursor === i;
			Draw.setFont(Font.xlb);
			Draw.setHVAlign(Align.c, Align.m);
			const tt = this.items[i];
			const tw = Draw.textWidth(tt);
			const th = Draw.textHeight(tt);
			const tx = Room.w - gap - tw * 0.5;
			const ty = Room.h - gap - y * Font.size * 1.2 - th * 0.5;
			if (s) {
				const c = CTX.createLinearGradient(Room.w - gap * 0.5, ty - th * 0.65, -Room.w * 0.25, th);
				c.addColorStop(0, `rgba(0, 0, 0, 0.5)`);
				c.addColorStop(0.3, `rgba(255, 255, 255, 0)`);
				Draw.setColor(c);
				Draw.rect(Room.w - gap * 0.5, ty - th * 0.8, -Room.w * 0.25, th * 1.4);
				Draw.setColor(C.white);
				Draw.setShadow(0, 4, 5, `rgba(255, 0, 0, 0.5)`);
				Draw.save();
				Draw.translate(tx, ty);
				Draw.rotate(rs);
				Draw.scale(1 + ss);
				Draw.text(0, 0, tt);
				Draw.restore();
				Draw.resetShadow();
			}
			else {
				Draw.setColor(C.black);
				Draw.text(tx, ty, tt);
			}
		}
		Draw.setHVAlign(Align.l, Align.t);
		Draw.setFont(Font.m);
		Draw.setColor(C.black);
		Draw.text(32, 32, `Cursor: ${this.cursor}`);
		Draw.setHVAlign(Align.c, Align.t);
		Draw.setFont(Font.xxlb);
		Draw.text(Room.mid.w, 32, 'Menu Select');
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