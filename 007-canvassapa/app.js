const D = document;
D.a = (a) => D.createElement(a);
D.q = (q) => D.querySelector(q);
D.c = (c) => D.getElementsByClassName(c);

const C = {
	red: '#f22',
	blue: '#229',
	gray: '#999',
	green: '#292',
	orange: '#f92'
}

const cnvNavItems = D.c('cnvNavItem');
function cnvNavItemClick(ii) {
	for (let i = 0; i < cnvNavItems.length; i++) {
		cnvNavItems[i].classList.remove('active');
		if (i === ii) {
			cnvNavItems[i].classList.add('active');
		}
	}
}
for (let i = 0; i < cnvNavItems.length; i++) {
	cnvNavItems[i].setAttribute('onclick', 'cnvNavItemClick(' + i + ');');
}


const cnvContentCourse = D.q('.cnvContentCourse');
function cnvContentAddCourse(name, grade, term, c) {
	const div = D.a('div');
	const divp = D.a('p');
	const divdiv = D.a('div');
	const divdivh3 = D.a('h3');
	const divdivsmall = D.a('small');
	div.style.backgroundColor = c;
	divp.style.color = c;
	divdivh3.style.color = c;
	divp.innerHTML = grade;
	divdivh3.innerHTML = name;
	divdivsmall.innerHTML = term;
	divdiv.appendChild(divdivh3);
	divdiv.appendChild(divdivsmall);
	div.setAttribute('class', 'cnvContentCourseItem');
	div.appendChild(divp);
	div.appendChild(divdiv);
	cnvContentCourse.appendChild(div);
}

const cnvContentGroup = D.q('.cnvContentGroup');
function cnvContentAddGroup(name, course, term, c) {
	const div = D.a('div');
	const divdiv = D.a('div');
	const divdivh3 = D.a('h3');
	const divdivp = D.a('p');
	const divdivsmall = D.a('small');
	div.style.backgroundColor = c;
	divdivp.style.color = c;
	divdivh3.innerHTML = name;
	divdivp.innerHTML = course;
	divdivsmall.innerHTML = term;
	divdiv.appendChild(divdivh3);
	divdiv.appendChild(divdivp);
	divdiv.appendChild(divdivsmall);
	div.setAttribute('class', 'cnvContentGroupItem');
	div.appendChild(divdiv);
	cnvContentGroup.appendChild(div);
}

cnvContentAddCourse('Sains', 'B- 78.52%', '2020-SMT1-SM12-SAI', C.red);
cnvContentAddCourse('Matematika', 'A+ 100%', '2020-SMT1-SD6-MTK', C.blue);
cnvContentAddCourse('B. Inggris', 'A 90.25%', '2020-SMT1-SM12-BIG', C.green);
cnvContentAddCourse('B. Indonesia', 'B+ 82.1%', '2020-SMT1-SM12-BIN', C.orange);
cnvContentAddCourse('Fisika', 'C 72.54%', '2020-SMT1-SM12-FSK', C.gray);

cnvContentAddGroup('Sains Project', 'Sains', '2020-Semester 1', C.green);
cnvContentAddGroup('Sapa FC', 'O2SN', '2020-Semester 1', C.gray);
cnvContentAddGroup('Survival In The City', 'Class', '2020-Semester 2', C.red);
cnvContentAddGroup('CEI 2020', 'Conference', '2020-Semester 2', C.orange);