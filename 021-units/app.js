// const Game = new BranthRoom('Game', 1280, 720);
// Room.add(Game);
// BRANTH.start();
// Room.start('Game');

const input = {
	calendar1: [['9:00', '10:30'], ['12:00', '13:00'], ['16:00', '18:00']],
	bound1: ['9:00', '20:00'],
	calendar2: [['10:00', '11:30'], ['12:30', '14:30'], ['14:30', '15:00'], ['16:00', '17:00']],
	bound2: ['10:00', '18:30'],
	time: 30
};

// Expected output: [['11:30', '12:00'], ['15:00', '15:30'], ['18:00', '18:30']]

const intToTime = (int) => {
	const i = int;
	const h = Math.floor(i / 60);
	const m = i - h * 60;
	return h + ':' + (m < 10? '0' + m : m);
};
const timeToInt = (time) => {
	const t = time.split(':');
	const h = +t[0] * 60;
	const m = +t[1];
	return h + m;
};
const getTimeDifference = (timeA, timeB) => {
	const a = timeToInt(timeA);
	const b = timeToInt(timeB);
	return b - a;
};
const getAvailableSchedule = (input) => {
	const getFreeTimeBlock = (calendar, bound) => {
		const ftb = [];
		for (let i = -1; i < calendar.length; i++) {
			let endA, firstB;
			if (i === -1) endA = bound[0];
			else endA = calendar[i][1];
			if (i === calendar.length - 1) firstB = bound[1];
			else firstB = calendar[i + 1][0];
			if (getTimeDifference(endA, firstB) >= input.time) {
				ftb.push([endA, firstB]);
			}
		}
		return ftb;
	};
	const ftb1 = getFreeTimeBlock(input.calendar1, input.bound1);
	const ftb2 = getFreeTimeBlock(input.calendar2, input.bound2);
	const availSchedule = [];
	for (let i = 0; i < ftb1.length; i++) {
		for (let j = 0; j < ftb2.length; j++) {
			const a = ftb1[i];
			const b = ftb2[j];
			const latestStart = Math.max(timeToInt(a[0]), timeToInt(b[0]));
			const earliestEnd = Math.min(timeToInt(a[1]), timeToInt(b[1]));
			if (earliestEnd - latestStart >= input.time) {
				availSchedule.push([intToTime(latestStart), intToTime(latestStart + input.time)]);
			}
		}
	}
	return availSchedule;
};

console.log(getAvailableSchedule(input));