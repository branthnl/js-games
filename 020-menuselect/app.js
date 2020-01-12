Audio.add('Pop1', 'Pop1.ogg', 'Pop1.mp3');
Audio.add('Pop2', 'Pop2.ogg', 'Pop2.mp3');

class Choice extends BranthObject {
	constructor(x, y) {
		super(x, y);
		this.items = [];
		this.cursor = 0;
		this.cy = 0;
		this.holdTime = 0;
		this.holdFirst = true;
		this.holdThreshold = 100;
		this.holdFirstThreshold = 300;
	}
	get selectedItem() {
		return this.items[this.cursor];
	}
	proceed() {}
	update() {
		let keyA = Input.keyDown(KeyCode.Up);
		let keyB = Input.keyDown(KeyCode.Down);
		const keyUpA = Input.keyUp(KeyCode.Up);
		const keyUpB = Input.keyUp(KeyCode.Down);
		const keyHoldA = Input.keyHold(KeyCode.Up);
		const keyHoldB = Input.keyHold(KeyCode.Down);
		const keyProceed = Input.keyDown(KeyCode.Enter);
		if (keyUpA) {
			this.holdTime = 0;
			this.holdFirst = true;
		}
		if (keyHoldA) {
			const t = this.holdFirst? this.holdFirstThreshold : this.holdThreshold;
			if (this.holdTime > t) {
				keyA = true;
				this.holdTime = 0;
				this.holdFirst = false;
			}
			this.holdTime += Time.deltaTime;
		}
		if (keyUpB) {
			this.holdTime = 0;
			this.holdFirst = true;
		}
		if (keyHoldB) {
			const t = this.holdFirst? this.holdFirstThreshold : this.holdThreshold;
			if (this.holdTime > t) {
				keyB = true;
				this.holdTime = 0;
				this.holdFirst = false;
			}
			this.holdTime += Time.deltaTime;
		}
		if (keyA) {
			if (this.cursor > 0) {
				this.cursor -= 1;
			}
			else {
				this.cursor = this.items.length - 1;
			}
			Audio.play('Pop2');
		}
		if (keyB) {
			if (this.cursor < this.items.length - 1) {
				this.cursor += 1;
			}
			else {
				this.cursor = 0;
			}
			Audio.play('Pop2');
		}
		if (keyProceed) {
			this.proceed();
		}
	}
	render() {
		const gap = Room.w * 0.05;
		const rs = Math.sin(Time.time * 0.031 * 2) * 0.52;
		const ss = Math.sin(Time.time * 0.031) * 0.027;
		const css = 1 + Math.abs(Math.sin(Time.time * 0.031 * 0.2) * 0.27);
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
				this.cy = Math.lerp(this.cy, ty - th * 0.8, 0.4);
				const c = CTX.createLinearGradient(Room.w - gap * 0.5, ty - th * 0.65, -Room.w * 0.25, th);
				c.addColorStop(0, `rgba(80, 80, 80, 1)`);
				c.addColorStop(0.3, `rgba(255, 255, 255, 0)`);
				Draw.setColor(c);
				Draw.rect(Room.w - gap * 0.5, this.cy, -Room.w * 0.25, th * 1.4);
				Draw.setColor(C.white);
				Draw.setShadow(0, 4, 5, `rgba(255, 0, 0, 0.5)`);
				Draw.save();
				Draw.translate(tx, ty);
				Draw.rotate(rs);
				Draw.scale(1 + ss, 1 - ss);
				Draw.text(0, 0, tt);
				Draw.restore();
				Draw.resetShadow();
				const crx = Room.w - gap * 0.5 - Room.w * 0.25 + th * 0.6;
				const cry = this.cy + th * 0.7;
				const crr = th * 0.3 * css;
				const crd = Math.floor(Time.time * 0.1);
				Draw.setColor(C.darkGray);
				Draw.circle(crx, cry, crr);
				Draw.setColor(C.white);
				Draw.circle(crx, cry, crr * 0.4);
				Draw.circle(
					crx + Math.lendirx(crr * 0.7, crd),
					cry + Math.lendiry(crr * 0.7, crd),
					crr * 0.15
				);
				Draw.circle(
					crx + Math.lendirx(crr * 0.7, crd + 120),
					cry + Math.lendiry(crr * 0.7, crd + 120),
					crr * 0.15
				);
				Draw.circle(
					crx + Math.lendirx(crr * 0.7, crd + 240),
					cry + Math.lendiry(crr * 0.7, crd + 240),
					crr * 0.15
				);
			}
			else {
				Draw.setShadow(1, 2, 0, C.black);
				Draw.setColor(`rgba(0, 0, 0, 0.5)`);
				Draw.save();
				Draw.translate(tx, ty);
				Draw.scale(0.9, 0.7);
				Draw.text(0, 0, tt);
				Draw.restore();
				Draw.resetShadow();
			}
		}
		Draw.setHVAlign(Align.l, Align.b);
		Draw.setFont(Font.mb);
		Draw.setColor(C.black);
		Draw.text(32, Room.h - 32, `Cursor: ${this.cursor} | Mouse move? ${Input.mouseMove}`);
	}
}

class MenuChoice extends Choice {
	awake() {
		this.items = ['Career', 'Quick Race', 'Free Roam', 'Multiplayer', 'Garage', 'Profile', 'Options', 'Exit'];
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

Menu.renderUI = () => {
	Draw.setHVAlign(Align.r, Align.t);
	Draw.setFont(Font.xxlb);
	Draw.setShadow(0, 4, 0, C.white);
	Draw.setColor(C.black);
	Draw.text(Room.w - 48, 48 + Math.sin(Time.time * 0.01) * 3, 'Menu Select');
	Draw.resetShadow();
	Draw.setColor(`rgba(0, 0, 0, ${Math.clamp(1 - Time.time / 200, 0, 1)})`);
	Draw.rect(0, 0, Room.w, Room.h);
}

BRANTH.start();
Room.start('Menu');