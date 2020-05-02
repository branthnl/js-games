let cpm = 0;
let charCount = 0;

class Key {
	constructor(keyCode) {
		this.keyCode = keyCode;
		this.held = false;
		this.pressed = false;
		this.released = false;
	}
	up() {
		this.held = false;
		this.released = true;
	}
	down() {
		this.held = true;
		this.pressed = true;
	}
	reset() {
		this.pressed = false;
		this.released = false;
	}
}

const Keys = [];

for (let i = 0; i < 256; ++i) {
	Keys.push(new Key(i));
}

window.addEventListener("keydown", (e) => {
	Keys[e.keyCode].up();
});

window.addEventListener("keydown", (e) => {
	const k = Keys[e.keyCode];
	if (!k.held) k.down();
});

const loop = (t) => {
	for (let i = 0; i < 256; ++i) {
		if (Keys[i].pressed) {
			++charCount;
		}
		Keys[i].reset();
	}

	cpm = charCount * 60 / (t * 0.001);

	wpmDisplay.innerHTML = Math.round(cpm / 5);
	cpmDisplay.innerHTML = Math.round(cpm);
	charCountDisplay.innerHTML = charCount;
	wordCountDisplay.innerHTML = ~~(charCount / 5);
	timeDisplay.innerHTML = `${(t * 0.001).toFixed(2)}s`;

	window.requestAnimationFrame(loop);
};

window.onload = () => {
	window.requestAnimationFrame(loop);
;}