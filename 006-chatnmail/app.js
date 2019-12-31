const d = document;
d.q = (q) => d.querySelector(q);
d.c = (c) => d.createElement(c);
d.a = (a) => d.appendChild(a);

const dateFormat = (date) => (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
const isNoLetter = (s) => s.replace(/[A-Za-z0-9]/g, "").length === s.length;

const USER = {
	name: ''
}

firebase.initializeApp({
	apiKey: "AIzaSyDOFPgoi-1C5e9gf52mW9yY-UgYqCUT2IM",
	authDomain: "mail-c5d4e.firebaseapp.com",
	databaseURL: "https://mail-c5d4e.firebaseio.com",
	projectId: "mail-c5d4e",
	storageBucket: "mail-c5d4e.appspot.com",
	messagingSenderId: "182515294698",
	appId: "1:182515294698:web:cc3386e1fc8ea1c99b5293",
	measurementId: "G-4VRDHKBFNH"
});

const db = firebase.database().ref('mn');
db.c = (c) => db.child(c);
const dbChat = db.c('chat');
const dbUsers = db.c('users');
let dbMail = db.c('users/' + USER.name + '/mail');

const mnMailText = d.q('.mnMailText');
const mnMailCompose = d.q('.mnMailCompose');
const mnMailNotification = d.q('.mnMailNotification');

const mnChat = d.q('.mnChat');
const mnChatText = d.q('.mnChatText');
const mnChatInput = d.q('.mnChatInput');
const mnChatSubmit = d.q('.mnChatSubmit');

const mnCompose = d.q('.mnCompose');
const mnComposeTo = d.q('.mnComposeInput[id="to"]');
const mnComposeTitle = d.q('.mnComposeInput[id="title"]');
const mnComposeContent = d.q('.mnComposeInput[id="content"]');
const mnComposeSubmit = d.q('.mnComposeSubmit');

const mnLogin = d.q('.mnLogin');
const mnLoginInfo = d.q('.mnLoginInfo');
const mnLoginUser = d.q('.mnLoginInput[type="text"]');
const mnLoginPass = d.q('.mnLoginInput[type="password"]');
const mnLoginSubmit = d.q('.mnLoginSubmit');

function mnMailComposeStart() {
	mnCompose.style.display = 'block';
	mnChatInput.setAttribute('tabindex', -1);
	mnChatSubmit.setAttribute('tabindex', -1);
	mnComposeTo.setAttribute('tabindex', 6);
	mnComposeTitle.setAttribute('tabindex', 7);
	mnComposeContent.setAttribute('tabindex', 8);
	mnComposeSubmit.setAttribute('tabindex', 9);
}

function mnChatTextPush(from, text, date) {
	const i = d.c('div');
	const b = d.c('b');
	const p = d.c('p');
	const t = d.c('p');
	b.innerHTML = from;
	p.innerHTML = text;
	t.innerHTML = date;
	if (from === USER.name) {
		b.style.color = '#22a';
		i.style.textAlign = 'right';
	}
	i.setAttribute('class', 'mnChatTextItem');
	i.appendChild(b);
	i.appendChild(p);
	i.appendChild(t);
	mnChatText.appendChild(i);
}

function mnChatSubmitClick() {
	const m = mnChatInput.value;
	if (isNoLetter(m)) {
		return;
	}
	const t = {
		from: USER.name,
		text: m,
		date: dateFormat(new Date())
	}
	mnChatTextPush(t.from, t.text, t.date);
	dbChat.push(t);
	mnChatText.scrollTo(0, mnChatText.scrollHeight);
	mnChatInput.value = '';
}

function mnComposeSubmitClick() {
	const m = {
		to: mnComposeTo.value,
		title: mnComposeTitle.value,
		content: mnComposeContent.value
	}
	dbUsers.child(m.to).child('mail').push({
		from: USER.name || 'Branth NL',
		title: m.title,
		content: m.content
	});
	mnChatInput.setAttribute('tabindex', 4);
	mnChatSubmit.setAttribute('tabindex', 5);
	mnCompose.style.display = 'none';
}

function mnLoginPopInfo(s) {
	mnLoginInfo.innerHTML = s;
	if (mnLoginInfo.style.display != 'block') {
		mnLoginInfo.style.display = 'block';
	}
}

function mnLoginSubmitClick() {
	const u = mnLoginUser.value;
	const p = mnLoginPass.value;
	if (isNoLetter(u)) {
		mnLoginPopInfo('Please include at least one letter in username');
		return;
	}
	if (isNoLetter(p)) {
		mnLoginPopInfo('Please include at least one letter in password');
		return;
	}
	let isExists = false;
	dbUsers.once('value', snap => {
		snap.forEach(c => {
			if (c.key == u) {
				if (c.val().pass != p) {
					mnLoginPopInfo('Incorrect password for this existing username');
					return;
				}
				isExists = true;
			}
		});
	});
	// Questionable
	// if (!isExists) {
	// 	dbUsers.child(u).set({
	// 		pass: p,
	// 		mail: [{
	// 			from: 'Branth NL',
	// 			title: 'Welcome to Mail Notification!'
	// 		}]
	// 	});
	// }
	USER.name = mnLoginUser.value;
	dbMail = db.c('users/' + USER.name + '/mail');
	mnChatInput.setAttribute('tabindex', 4);
	mnChatSubmit.setAttribute('tabindex', 5);
	mnMailTextLoad();
	mnChatTextLoad();
	mnLogin.style.display = 'none';
}

function mnMailTextLoad() {
	dbMail.on('value', snap => {
		mnMailText.innerHTML = '';
		snap.forEach(c => {
			const v = c.val();
			const i = d.c('div');
			const h = d.c('h3');
			h.innerHTML = v.title + ' <i>— ' + v.from + '</i>';
			i.setAttribute('class', 'mnMailItem');
			i.appendChild(h);
			mnMailText.appendChild(i);
		});
	});
}

function mnChatTextLoad() {
	dbChat.on('value', snap => {
		mnChatText.innerHTML = '';
		snap.forEach(c => {
			const v = c.val();
			mnChatTextPush(v.from, v.text, v.date);
			// Questionable
			// if ((mnChatText.scrollTop + mnChatText.clientHeight) > (mnChatText.scrollHeight - 20)) {
			// 	mnChatText.scrollTo(0, mnChatText.scrollHeight);
			// }
		});
	});
}

window.onload = function() {
	const isEnter = (e) => e.which == 13 || e.keyCode == 13;
	mnMailCompose.setAttribute('onclick', 'mnMailComposeStart()');
	mnChatInput.addEventListener('keydown', (e) => { if (isEnter(e)) mnChatSubmitClick(); });
	mnChatSubmit.addEventListener('keydown', (e) => { if (isEnter(e)) mnChatSubmitClick(); });
	mnChatSubmit.setAttribute('onclick', 'mnChatSubmitClick()');
	mnComposeSubmit.addEventListener('keydown', (e) => { if (isEnter(e)) mnComposeSubmitClick(); });
	mnComposeSubmit.setAttribute('onclick', 'mnComposeSubmitClick()');
	mnLoginUser.addEventListener('keydown', (e) => { if (isEnter(e)) mnLoginSubmitClick(); });
	mnLoginPass.addEventListener('keydown', (e) => { if (isEnter(e)) mnLoginSubmitClick(); });
	mnLoginSubmit.addEventListener('keydown', (e) => { if (isEnter(e)) mnLoginSubmitClick(); });
	mnLoginSubmit.setAttribute('onclick', 'mnLoginSubmitClick()');
}