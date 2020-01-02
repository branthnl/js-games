const yn = document.querySelector('.yn');
const ynMenu = document.querySelector('.ynMenu');
const ynMenuImg = document.querySelector('.ynMenu > div > img');
const ynMenuH3 = document.querySelector('.ynMenu > div > h3');
const ynShop = document.querySelector('.ynShop');

const charList = [
	'bear',
	'buffalo',
	'chick',
	'chicken',
	'cow',
	'crocodile',
	'dog',
	'duck',
	'elephant',
	'frog',
	'giraffe',
	'goat',
	'gorilla',
	'hippo',
	'horse',
	'monkey',
	'moose',
	'narwhal',
	'owl',
	'panda',
	'parrot',
	'penguin',
	'pig',
	'rabbit',
	'rhino',
	'sloth',
	'snake',
	'walrus',
	'whale',
	'zebra'
];

const capitalize = (s) => s.toLowerCase().split('').map((v, i) => (i === 0? v.toUpperCase() : v)).join('');

if (sessionStorage.getItem('char') != null) {
	const char = sessionStorage.getItem('char');
	ynMenuImg.setAttribute('src', 'images/chars/' + char + '.png');
	ynMenuH3.innerHTML = capitalize(char);
}

function changeChar(char) {
	ynMenuImg.setAttribute('src', 'images/chars/' + char + '.png');
	ynMenuH3.innerHTML = capitalize(char);
	sessionStorage.setItem('char', char);
	const charImgs = ynShop.querySelectorAll('img');
	for (let i = 0; i < charImgs.length; i++) {
		charImgs[i].classList.remove('selected');
		if (charImgs[i].getAttribute('src').includes(char)) {
			charImgs[i].classList.add('selected');
		}
	}
}

for (char of charList) {
	const img = document.createElement('img');
	img.setAttribute('src', 'images/chars/' + char + '.png');
	if (char === 'bear') {
		img.classList.add('selected');
	}
	img.setAttribute('onclick', `changeChar("${char}")`);
	ynShop.appendChild(img);
}

const update = window.requestAnimationFrame
	|| window.msRequestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.webkitRequestAnimationFrame;

let scrollSnap = true;
let scrollAlarm = 1000;

const Time = {
	time: 0,
	lastTime: 0,
	deltaTime: 1000 / 60,
	update: function(t) {
		this.lastTime = this.time || 0;
		this.time = t || 0;
		this.deltaTime = this.time - this.lastTime || 1000 / 60;
	}
}

function loop(t) {
	Time.update(t);

	if (scrollAlarm <= 0 && scrollAlarm != -1) {
		scrollSnap = true;
		scrollAlarm = -1;
	}
	else {
		scrollAlarm -= Time.deltaTime;
	}

	if (scrollSnap) {
		if (yn.scrollLeft > yn.clientWidth  / 2) {
			// Snap to the right (to width)
			yn.scrollLeft += 0.1 * (yn.clientWidth - yn.scrollLeft);
		}
		else {
			// Snap to the left (to 0)
			yn.scrollLeft += 0.1 * (0 - yn.scrollLeft);
		}
	}

	update(loop);
}

function onScroll() {
	scrollSnap = false;
	scrollAlarm = 1000;
}

yn.addEventListener('touchmove', onScroll);
yn.addEventListener('touchend', () => {
	scrollAlarm = 0;
});

loop();