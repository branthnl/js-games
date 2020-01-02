const D = document;
D.q = (q) => D.querySelector(q);

const daCanvas = D.q('.daCanvas');
const daCanvasCanvas = D.q('.daCanvas > canvas');
const ctx = daCanvasCanvas.getContext('2d');
const daToolWindow = D.q('.daToolWindow');
const daToolWindowItem = daToolWindow.getElementsByClassName('daTool');
const daToolWindowSize = D.q('.daToolWindow > fieldset');
const daToolWindowSizeItem = daToolWindowSize.getElementsByClassName('daTool');

const Draw = {
	lineW: 1,
	toolIndex: 0,
	begin: function(m) {
		ctx.beginPath();
		ctx.moveTo(m.x, m.y);
		this.draw(m);
	},
	draw: function(m) {
		ctx.lineTo(m.x, m.y);
		ctx.lineCap = 'round';
		ctx.lineWidth = this.lineW;
		ctx.strokeStyle = '#000000';
		ctx.stroke();
	}
}

let isDrawing = false;

daCanvasCanvas.addEventListener('mousedown', (e) => {
	const m = {
		x: e.clientX - daCanvas.offsetLeft,
		y: e.clientY - daCanvas.offsetTop
	}
	Draw.begin(m);
	isDrawing = true;
});

window.addEventListener('mousemove', (e) => {
	if (isDrawing) {
		const m = {
			x: e.clientX - daCanvas.offsetLeft,
			y: e.clientY - daCanvas.offsetTop
		}
		Draw.draw(m);
	}
});

window.addEventListener('mouseup', () => {
	isDrawing = false;
});

function changeTool(index) {
	Draw.toolIndex = index;
	for (let i = 0; i < 15; i++) {
		const div = daToolWindowItem[i];
		const index = +div.getAttribute('id').split('daTool').pop();
		if (Draw.toolIndex === index) {
			div.setAttribute('class', 'daTool selected');
		}
		else {
			div.setAttribute('class', 'daTool');
		}
	}
}

for (let i = 0; i < 15; i++) {
	const div = daToolWindowItem[i];
	const index = +div.getAttribute('id').split('daTool').pop();
	if (Draw.toolIndex === index) {
		div.setAttribute('class', 'daTool selected');
	}
	else {
		div.setAttribute('class', 'daTool');
	}
	div.setAttribute('onclick', `changeTool(${index})`);
}

function changeSize(size) {
	Draw.lineW = size;
	for (let i = 0; i < daToolWindowSizeItem.length; i++) {
		const div = daToolWindowSizeItem[i];
		const size = +div.getAttribute('id').split('daSize').pop();
		if (Draw.lineW == size) {
			div.setAttribute('class', 'daTool selected');
		}
		else {
			div.setAttribute('class', 'daTool');
		}
	}
}

for (let i = 0; i < daToolWindowSizeItem.length; i++) {
	const div = daToolWindowSizeItem[i];
	const size = +div.getAttribute('id').split('daSize').pop();
	if (Draw.lineW === size) {
		div.setAttribute('class', 'daTool selected');
	}
	else {
		div.setAttribute('class', 'daTool');
	}
	div.setAttribute('onclick', `changeSize(${size})`);
}