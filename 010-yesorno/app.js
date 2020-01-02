const yn = document.querySelector('.yn');

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