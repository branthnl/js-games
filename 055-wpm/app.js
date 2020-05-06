let cpm = 0;
let charCount = 0;

let progress = 0;

let cars = [];

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

window.addEventListener('keyup', (e) => {
	Keys[e.keyCode].up();
});

window.addEventListener('keydown', (e) => {
	const k = Keys[e.keyCode];
	if (!k.held) k.down();
});

const loop = (t) => {
	for (let i = 0; i < 256; ++i) {
		if (Keys[i].pressed) {
			++charCount;
			if (i === 32) {
				progress = Math.min(progress + 0.1, 1);
			}
		}
		Keys[i].reset();
	}

	cpm = charCount * 60 / (t * 0.001);

	wpmDisplay.innerHTML = Math.round(cpm / 5);
	cpmDisplay.innerHTML = Math.round(cpm);
	charCountDisplay.innerHTML = charCount;
	wordCountDisplay.innerHTML = ~~(charCount / 5);
	timeDisplay.innerHTML = `${(t * 0.001).toFixed(2)}s`;

	cars[0].style.left = `${progress * 100}%`;

	if (progress >= 1) {
		resultDisplay.innerHTML = 'You won!';
	}

	window.requestAnimationFrame(loop);
};

window.onload = () => {
	cars = document.querySelectorAll('canvas.car');
	for (let i = cars.length - 1; i >= 0; --i) {
		const ctx = cars[i].getContext('2d');
		ctx.fillStyle = `rgb(${100 + Math.random() * 156}, ${100 + Math.random() * 156}, ${100 + Math.random() * 156})`;
		ctx.fillRect(0, 0, cars[i].width, cars[i].height);
		ctx.fillStyle = 'black';
		ctx.fillText(`Guest ${i === 0? '(You)' : ''}`, 10, cars[i].height - 10);
	}
	window.requestAnimationFrame(loop);
};