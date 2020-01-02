const yn = document.querySelector('.yn');
const ynMenu = document.querySelector('.ynMenu');
const ynMenuImg = document.querySelector('.ynMenu > div > img');
const ynMenuH3 = document.querySelector('.ynMenu > div > h3');
const ynShop = document.querySelector('.ynShop');
const ynGame = document.querySelector('.ynGame');
const ynGameH3 = document.querySelector('.ynGame > div:first-child > h3');
const ynGameScene = document.querySelector('.ynGame > .scene');
const ynGameTrue = document.querySelector('.ynGame > div:nth-child(3)');
const ynGameFalse = document.querySelector('.ynGame > div:nth-child(4)');

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

if (sessionStorage.getItem('char') === null) {
	sessionStorage.setItem('char', ynMenuH3.innerHTML.toLowerCase());
}

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

let gameTimer = 7000;

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

let currentQuestion = 0;

function loop(t) {
	Time.update(t);

	if (ynGame.style.display === 'grid') {
		// If on GAMEPLAY
		if (gameTimer <= 0) {
			let myAnswer = true;
			if (ynGameFalse.classList.contains('selected')) {
				myAnswer = false;
			}
			if (myAnswer === answers[currentQuestion]) {
				alert('Correct! Next question.');
				for (let i = 0; i < questions.length; i++) {
					if (i === currentQuestion) {
						questions = questions.filter((v, ind) => ind != i);
						answers = answers.filter((v, ind) => ind != i);
					}
				}
				if (questions.length <= 0) {
					alert('Congrats! You have answered all the questions correctly! Back to menu.');
					ynGame.style.display = 'none';
					ynMenu.style.display = 'grid';
					ynShop.style.display = 'grid';
				}
				else {
					changeQuestion();
				}
			}
			else {
				alert('Incorrect! Back to menu.');
				ynGame.style.display = 'none';
				ynMenu.style.display = 'grid';
				ynShop.style.display = 'grid';
			}
		}
		else {
			gameTimer -= Time.deltaTime;
			ynGameH3.innerHTML = questions[currentQuestion] + ' (' + toSec(gameTimer) + ')';
		}
	}
	else {
		// If on MENU
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
	}

	update(loop);
}

function onScroll() {
	scrollSnap = false;
	scrollAlarm = 1000;
}

function tapMouseDown(e) {
	const m = {
		x: e.clientX - yn.offsetLeft,
		y: e.clientY - yn.offsetTop
	}
	ynGameTrue.classList.remove('selected');
	ynGameFalse.classList.remove('selected');
	if (m.x > ynGame.clientWidth / 2) {
		ynGameFalse.classList.add('selected');
	}
	else {
		ynGameTrue.classList.add('selected');
	}
}

function tapTouchStart(e) {
	const m = {
		x: e.touches[0].clientX - yn.offsetLeft,
		y: e.touches[0].clientY - yn.offsetTop
	}
	ynGameTrue.classList.remove('selected');
	ynGameFalse.classList.remove('selected');
	if (m.x > ynGame.clientWidth / 2) {
		ynGameFalse.classList.add('selected');
	}
	else {
		ynGameTrue.classList.add('selected');
	}
}

yn.addEventListener('mousedown', tapMouseDown);
yn.addEventListener('touchstart', tapTouchStart);
yn.addEventListener('touchmove', onScroll);
yn.addEventListener('touchend', () => {
	scrollAlarm = 0;
});

const defquestions = [
	'Five plus five equal to ten.',
	'Abraham Lincoln had no middle name.',
	'Germany drinks the most beer in the world per person.',
	'Ronald Reagan was a waiter during high school.',
	'Nemo is a puffer fish.',
	'There was no World Series in 1994.',
	'John Lennon’s middle name was Edward.',
	'Broccoli was once banned from the White House.',
	'Japan has square watermelons.',
	'"Pinocchio" was the first animated, full-color Walt Disney feature film'
];

const defanswers = [
	true,
	true,
	false,
	false,
	false,
	true,
	false,
	true,
	true,
	false
];

let questions = defquestions;
let answers = defanswers;

const toSec = (n) => Math.max(0, Math.floor(n / 1000)) + 's';

function changeQuestion() {
	currentQuestion = Math.floor(Math.random() * questions.length);
	gameTimer = 7000;
	ynGameH3.innerHTML = questions[currentQuestion] + '(' + toSec(gameTimer) + ')';
}

function startGame() {
	ynMenu.style.display = 'none';
	ynShop.style.display = 'none';
	ynGame.style.display = 'grid';
	questions = defquestions;
	answers = defanswers;
	ynGameScene.innerHTML = `<img src="images/chars/${sessionStorage.getItem('char') || 'bear'}.png">`;
	changeQuestion();
}

loop();