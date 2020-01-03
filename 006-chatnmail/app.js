const D = document;
D.q = (q) => D.querySelector(q);
D.c = (c) => D.createElement(c);

const isNoLetter = (s) => s.replace(/[A-Za-z0-9]/g, "").length === s.length;

const USER = {
	name: 'anonymous',
	score: 0
}

firebase.initializeApp({
	apiKey: "AIzaSyDWh7EVq6tRyq0I8i40ATGoUc6vc5s3dpU",
	authDomain: "exam-ae3d4.firebaseapp.com",
	databaseURL: "https://exam-ae3d4.firebaseio.com",
	projectId: "exam-ae3d4",
	storageBucket: "exam-ae3d4.appspot.com",
	messagingSenderId: "233636355104",
	appId: "1:233636355104:web:3aafa9028aa808ae287045",
	measurementId: "G-Y8D3K31GYB"
});

const db = firebase.database().ref('me');
db.c = (c) => db.child(c);
const dbUsers = db.c('users');

const me = D.q('.me');
const meLogin = D.q('.meLogin');
const meLoginForm = D.q('.meLoginForm');
const meLoginFormUser = D.q('.meLoginForm > input[type="text"]');
// const meLoginFormPass = D.q('.meLoginForm > input[type="password"]');
const meLoginFormSubmit = D.q('.meLoginForm > button');
const meMenu = D.q('.meMenu');
const meMenuH5 = D.q('.meMenu > h5');
const meMenuTable = D.q('.meMenu > table');
const meExam = D.q('.meExam');
const meExamNavSelect = D.q('.meExamNav > select');
const meExamNavButton = D.q('.meExamNav > button');
const meExamQuestion = D.q('.meExamQuestion');
const meExamAnswers = D.q('.meExamAnswers');
const meCheck = D.q('.meCheck');
const meCheckNavSelect = D.q('.meCheckNav > select');
const meCheckNavButton = D.q('.meCheckNav > button');
const meCheckQuestion = D.q('.meCheckQuestion');
const meCheckAnswers = D.q('.meCheckAnswers');

const ME = {
	questionID: 1,
	answers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	changeAnswer: function(id, value) {
		this.answers[id] = value;
	},
	changeQuestion: function(id) {
		id = id || this.questionID;
		meExamQuestion.innerHTML = 'Question ' + id;
		meExamAnswers.innerHTML = '';
		for (i of [1, 2, 3, 4]) {
			const div = D.c('div');
			const divRadio = D.c('input');
			const divLabel = D.c('label');
			divRadio.setAttribute('type', 'radio');
			divRadio.setAttribute('id', 'choice' + i);
			divRadio.setAttribute('name', 'choice');
			divRadio.setAttribute('class', 'custom-control-input');
			divRadio.setAttribute('onclick', `ME.changeAnswer(${id - 1}, ${i});`);
			if (this.answers[id - 1] == i) {
				divRadio.setAttribute('checked', '');
			}
			divLabel.setAttribute('for', 'choice' + i);
			divLabel.setAttribute('class', 'custom-control-label');
			divLabel.innerHTML = 'Incorrect answer';//'Choice ' + i;
			if (i == 1) {
				divLabel.innerHTML = 'Correct answer';
			}
			div.setAttribute('class', 'custom-control custom-radio');
			div.appendChild(divRadio);
			div.appendChild(divLabel);
			meExamAnswers.appendChild(div);
		}
	},
	checkQuestion: function(id) {
		id = id || this.questionID;
		meCheckQuestion.innerHTML = 'Question ' + id;
		meCheckAnswers.innerHTML = '';
		for (i of [1, 2, 3, 4]) {
			const div = D.c('div');
			const divRadio = D.c('input');
			const divLabel = D.c('label');
			divRadio.setAttribute('type', 'radio');
			divRadio.setAttribute('id', 'choice' + i);
			divRadio.setAttribute('class', 'custom-control-input');
			divRadio.setAttribute('disabled', '');
			if (this.answers[id - 1] == i) {
				divRadio.setAttribute('checked', '');
			}
			divLabel.setAttribute('class', 'custom-control-label');
			divLabel.innerHTML = 'Incorrect answer';//'Choice ' + i;
			if (i == 1) {
				divLabel.innerHTML = 'Correct answer';
			}
			div.setAttribute('class', 'custom-control custom-radio');
			div.appendChild(divRadio);
			div.appendChild(divLabel);
			meCheckAnswers.appendChild(div);
		}
	}
}

function meLoginFormSubmitEvent() {
	const u = meLoginFormUser.value;
	if (isNoLetter(u)) {
		alert('Please include at least one letter in username.');
		return;
	}
	USER.name = u;
	dbUsers.child(USER.name + '/name').set(USER.name);
	meLogin.style.display = 'none';
	meMenuH5.innerHTML = 'Logged in as: ' + USER.name;
	meMenu.style.display = 'block';
}

meLoginForm.addEventListener('keypress', (e) => {
	if (e.which == 13 || e.keyCode == 13) {
		meLoginFormSubmitEvent();
	}
});

meLoginFormSubmit.addEventListener('click', () => {
	meLoginFormSubmitEvent();
});

function meMenuButtonEvent() {
	meMenu.style.display = 'none';
	meExamNavSelect.value = '1';
	meExam.style.display = 'block';
	ME.questionID = 1;
	ME.answers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	ME.changeQuestion();
}

meExamNavButton.addEventListener('click', () => {
	meExam.style.display = 'none';
	meCheckNavSelect.innerHTML = '';
	let count = 0;
	for (i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
		const option = D.c('option');
		option.setAttribute('value', i);
		option.innerHTML = 'Question ' + i;
		if (i == 1) {
			option.setAttribute('selected', '');
		}
		if (ME.answers[i - 1] == 1) {
			option.setAttribute('class', 'correct');
			count++;
		}
		else {
			option.setAttribute('class', 'incorrect');
		}
		meCheckNavSelect.appendChild(option);
	}
	USER.score = count;
	dbUsers.child(USER.name + '/score').set(USER.score);
	meCheckNavSelect.value = '1';
	meCheck.style.display = 'block';
	ME.questionID = 1;
	ME.checkQuestion();
});

meExamNavSelect.addEventListener('click', () => {
	const id = meExamNavSelect.value;
	if (id != ME.questionID) {
		ME.questionID =  +id;
		ME.changeQuestion();
	}
});

meCheckNavButton.addEventListener('click', () => {
	meCheck.style.display = 'none';
	meMenu.style.display = 'block';
});

meCheckNavSelect.addEventListener('click', () => {
	const id = meCheckNavSelect.value;
	if (id != ME.questionID) {
		ME.questionID =  +id;
		ME.checkQuestion();
	}
});

let RANK = [];

dbUsers.on('value', snap => {
	let rank = [];
	let scores = [];
	meMenuTable.innerHTML = '';
	const thead = D.c('thead');
	thead.innerHTML = `
		<tr>
			<th scope="col">#</th>
			<th scope="col">Username</th>
			<th scope="col">Score</th>
		</tr>
	`;
	const tbody = D.c('tbody');
	let count = 0;
	snap.forEach(childSnap => {
		const user = {
			name: childSnap.val().name,
			score: (childSnap.val().score || 0) * 10 + '%'
		}
		rank.push(user);
		scores.push(user.score + count);
		count++;
	});
	if (count > 0) {
		const sortedId = scores.map((v) => +v.split('%').join('')).sort((a, b) => b - a).map((v) => +('' + v)[('' + v).length - 1]);
		for (i in sortedId) {
			const user = rank[sortedId[i]];
			const tr = D.c('tr');
			const trTh = D.c('th');
			const trTd1 = D.c('td');
			const trTd2 = D.c('td');
			trTh.setAttribute('scope', 'row');
			trTh.innerHTML = +i + 1;
			trTd1.innerHTML = user.name;
			trTd2.innerHTML = user.score;
			tr.appendChild(trTh);
			tr.appendChild(trTd1);
			tr.appendChild(trTd2);
			tbody.appendChild(tr);
		}
		meMenuTable.appendChild(thead);
		meMenuTable.appendChild(tbody);
	}
});

function meMenuLogoutEvent() {
	meMenu.style.display = 'none';
	meLogin.style.display = 'block';
}