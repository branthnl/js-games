firebase.initializeApp({
// fill in with ur details
});

const db = firebase.database().ref();
const dbName = 'action-quiz';
const dbQuiz = db.child(dbName);

function getQuery(r, s) {
	return r.querySelector(s);
}

function getClass(r, s) {
	return r.getElementByClassName(s);
}

function getClasses(r, s) {
	return r.getElementsByClassName(s);
}

const Attr = {
	Set: function(element, attrName, attrValue) {
		element.setAttribute(attrName, attrValue);
	},
	Remove: function(element, attrName) {
		if (element.hasAttribute(attrName)) {
			element.removeAttribute(attrName);
		}
	}
}

const d = document;
const body = getQuery(d, 'body');
const actionQuiz = getQuery(body, '.actionQuiz');

// HEAD
const actionQuiz_head = getQuery(actionQuiz, '.actionQuiz_head');
const actionQuiz_nav = getQuery(actionQuiz_head, '.actionQuiz_nav');
const actionQuiz_navItem = getClasses(actionQuiz_nav, 'actionQuiz_navItem');
const actionQuiz_navQuestion = getQuery(actionQuiz_head, '.actionQuiz_navQuestion');

let actionQuiz_navQuestionItem = getClasses(actionQuiz_navQuestion, 'actionQuiz_navQuestionItem');

// CREATE
let actionQuiz_create = getQuery(actionQuiz, '.actionQuiz_create');
let actionQuiz_createQuestion = getQuery(actionQuiz_create, '.actionQuiz_createQuestion');
let actionQuiz_createAnswer = getQuery(actionQuiz_create, '.actionQuiz_createAnswer');

let actionQuiz_createAnswerItem = getClasses(actionQuiz_create, 'actionQuiz_createAnswerItem');

// QUIZ
let actionQuiz_quiz = getQuery(actionQuiz, '.actionQuiz_quiz');
let actionQuiz_quizQuestion = getQuery(actionQuiz_quiz, '.actionQuiz_quizQuestion');
let actionQuiz_quizAnswer = getQuery(actionQuiz_quiz, '.actionQuiz_quizAnswer');

let actionQuiz_quizAnswerItem = getClasses(actionQuiz_quizAnswer, 'actionQuiz_quizAnswerItem');

// CHECK
let actionQuiz_check = getQuery(actionQuiz, '.actionQuiz_check');
let actionQuiz_checkInfo = getQuery(actionQuiz_check, '.actionQuiz_checkInfo');

let QUIZ = {
	score: 0,
	questions: [],
	choices: [],
	answers: [],
	user: {
		questionIndex: -1,
		answers: []
	}
}

dbQuiz.on('value', snap => {
	QUIZ.questions = [];
	QUIZ.choices = [];
	QUIZ.answers = [];
	snap.forEach(c => {
		const key = c.key;
		let value = c.val();
		QUIZ.questions.push(value.question);
		QUIZ.choices.push(value.choices);
		QUIZ.answers.push(value.answer);
	});
	loadQuestion();
	changeScene();
});

function loadQuestion() {
	const actionQuiz_navItemRadioCreate = getQuery(actionQuiz_navItem[0], 'input[type="radio"]');
	actionQuiz_navQuestion.innerHTML = '';
	for (let i = 0; i < QUIZ.questions.length; i++) {
		// Create stuff
		let questionItem = document.createElement('div');
		Attr.Set(questionItem, 'class', 'actionQuiz_navQuestionItem');
		let questionItemInput = document.createElement('input');
		Attr.Set(questionItemInput, 'type', 'radio');
		Attr.Set(questionItemInput, 'name', 'navQuestion');
		Attr.Set(questionItemInput, 'id', 'navQuestion' + i);
		Attr.Set(questionItemInput, 'onclick', 'changeQuestion(' + i + ')');
		if (actionQuiz_navItemRadioCreate.checked) {
			Attr.Set(questionItemInput, 'disabled', '');
		}
		let questionItemLabel = document.createElement('label');
		Attr.Set(questionItemLabel, 'for', 'navQuestion' + i);
		questionItemLabel.innerHTML = i + 1;

		// Append stuff
		questionItem.appendChild(questionItemInput);
		questionItem.appendChild(questionItemLabel);
		actionQuiz_navQuestion.appendChild(questionItem);
	}
	// Update variable
	actionQuiz_navQuestionItem = getClasses(actionQuiz_navQuestion, 'actionQuiz_navQuestionItem');
}

function createQuestion() {
	let quizQuestion = {
		question: actionQuiz_createQuestion.value,
		choices: [],
		answer: -1
	}
	if (quizQuestion.question != '') {
		let questionCount = 0;
		for (let i = 0; i < actionQuiz_createAnswerItem.length; i++) {
			const actionQuiz_createAnswerItemRadio = getQuery(actionQuiz_createAnswerItem[i], 'input[type="radio"]');
			const actionQuiz_createAnswerItemText = getQuery(actionQuiz_createAnswerItem[i], 'input[type="text"]');
			if (actionQuiz_createAnswerItemText.value != '') {
				if (actionQuiz_createAnswerItemRadio.checked) {
						quizQuestion.answer = questionCount;
				}
				quizQuestion.choices.push(actionQuiz_createAnswerItemText.value);
				questionCount++;
			}
		}
		if (questionCount > 0) {
			if (quizQuestion.answer >= 0) {
				dbQuiz.push(quizQuestion);
				actionQuiz_createQuestion.value = '';
				for (let i = 0; i < actionQuiz_createAnswerItem.length; i++) {
					const actionQuiz_createAnswerItemText = getQuery(actionQuiz_createAnswerItem[i], 'input[type="text"]');
					actionQuiz_createAnswerItemText.value = '';
				}
			}
			else {
				window.alert('Please fill in the answer you choose.');
			}
		}
		else {
			window.alert('Please fill in the answer.');
		}
	}
	else {
		window.alert('Please fill in the question.');
	}
}

function changeScene() {
	const actionQuiz_navItemRadioCreate = getQuery(actionQuiz_navItem[0], 'input[type="radio"]');
	const actionQuiz_navItemRadioAnswer = getQuery(actionQuiz_navItem[1], 'input[type="radio"]');
	const actionQuiz_navItemRadioCheck = getQuery(actionQuiz_navItem[2], 'input[type="radio"]');

	// HEAD
	actionQuiz_navQuestionItem = getClasses(actionQuiz_navQuestion, 'actionQuiz_navQuestionItem');
	for (let i = 0; i < actionQuiz_navQuestionItem.length; i++) {
		const actionQuiz_navQuestionItemRadio = getQuery(actionQuiz_navQuestionItem[i], 'input[type="radio"]');
		if (actionQuiz_navItemRadioCreate.checked) {
			Attr.Set(actionQuiz_navQuestionItemRadio, 'disabled', '');
		}
		else {
			Attr.Remove(actionQuiz_navQuestionItemRadio, 'disabled');
		}
	}

	// CREATE OR QUIZ
	if (actionQuiz_navItemRadioCreate.checked) {
		actionQuiz_create.style.display = 'block';
		actionQuiz_quiz.style.display = 'none';
		actionQuiz_check.style.display = 'none';
	}
	else if (actionQuiz_navItemRadioAnswer.checked) {
		actionQuiz_create.style.display = 'none';
		actionQuiz_quiz.style.display = 'block';
		actionQuiz_check.style.display = 'none';
		changeQuestion(QUIZ.user.questionIndex);
	}
	else {
		actionQuiz_create.style.display = 'none';
		actionQuiz_quiz.style.display = 'none';
		actionQuiz_check.style.display = 'block';
		checkAnswer();
	}

}

function changeQuestion(i) {
	let questionIndex = i || (i === 0? 0 : -1);

	// Clear quiz page
	actionQuiz_quizAnswer.innerHTML = '';

	// No question pick
	if (questionIndex < 0) {
		actionQuiz_quizQuestion.innerHTML = '<i>No question selected.</i>'
	}
	else {
		// Set question text
		actionQuiz_quizQuestion.innerHTML = QUIZ.questions[questionIndex];

		// Set question choices
		let questionChoiceIdCount = 0;
		for (let i = 0; i < QUIZ.choices[questionIndex].length; i++) {
			if (QUIZ.choices[questionIndex][i] != '') {
				// Create stuff
				let questionChoice = document.createElement('div');
				Attr.Set(questionChoice, 'class', 'actionQuiz_quizAnswerItem');
				let questionChoiceRadio = document.createElement('input');
				Attr.Set(questionChoiceRadio, 'type', 'radio');
				Attr.Set(questionChoiceRadio, 'name', 'quizAnswer');
				Attr.Set(questionChoiceRadio, 'id', questionChoiceIdCount);
				if (QUIZ.user.answers[questionIndex] != null) {
					if (QUIZ.user.answers[questionIndex] === questionChoiceIdCount) {
						Attr.Set(questionChoiceRadio, 'checked', '');
					}
				}
				Attr.Set(questionChoiceRadio, 'onclick', 'userUpdateAnswer(' + questionChoiceIdCount + ')');
				let questionChoiceLabel = document.createElement('label');
				Attr.Set(questionChoiceLabel, 'for', questionChoiceIdCount);
				questionChoiceLabel.innerHTML = QUIZ.choices[questionIndex][i];

				// Append stuff
				questionChoice.appendChild(questionChoiceRadio);
				questionChoice.appendChild(questionChoiceLabel);
				actionQuiz_quizAnswer.appendChild(questionChoice);

				questionChoiceIdCount++;
			}
		}
		// Update variable
		QUIZ.user.questionIndex = questionIndex;
		actionQuiz_quizAnswerItem = getClasses(actionQuiz_quizAnswer, 'actionQuiz_quizAnswerItem');
	}
}

function userUpdateAnswer(i) {
	if (QUIZ.user.questionIndex >= 0) {
		QUIZ.user.answers[QUIZ.user.questionIndex] = i;
		const actionQuiz_navQuestionItemRadio = actionQuiz_navQuestionItem[QUIZ.user.questionIndex];
		Attr.Set(actionQuiz_navQuestionItemRadio, 'answered', '');
		console.log(i);
	}
}

function checkAnswer() {
	QUIZ.score = 0;
	for (let i = 0; i < actionQuiz_navQuestionItem.length; i++) {
		const questionIndex = i;
		if (QUIZ.user.answers[questionIndex] === QUIZ.answers[questionIndex]) {
			QUIZ.score++;
			Attr.Remove(actionQuiz_navQuestionItem[i], 'incorrect');
			Attr.Set(actionQuiz_navQuestionItem[i], 'answered', '');
		}
		else {
			Attr.Set(actionQuiz_navQuestionItem[i], 'incorrect', '');
		}
	}
	actionQuiz_checkInfo.innerHTML = 'You answered ' + (QUIZ.score > 0? (QUIZ.score + '/' + QUIZ.questions.length) : 'no') + ' question' + (QUIZ.score > 1? 's' : '') + ' correctly.';
}

changeScene();