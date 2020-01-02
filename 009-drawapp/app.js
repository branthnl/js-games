const D = document;
D.q = (q) => D.querySelector(q);

const daCanvas = D.q('.daCanvas');
const daCanvasCanvas = D.q('.daCanvas > canvas');
const ctx = daCanvasCanvas.getContext('2d');

const Draw = {
	begin: function(m) {
		ctx.beginPath();
		ctx.moveTo(m.x, m.y);
		ctx.stroke();
	},
	draw: function(m) {
		ctx.lineTo(m.x, m.y);
		ctx.lineCap = 'round';
		ctx.lineWidth = 1;
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