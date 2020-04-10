const SE = {};

SE.imageName = "";
SE.imageSpeed = 20;

SE.previewCanvas = document.getElementById("previewCanvas");
SE.detailCanvas = document.getElementById("detailCanvas");
SE.imageInput = document.getElementById("imageInput");
SE.speedInput = document.getElementById("speedInput");

SE.imageInput.addEventListener("change", (e) =>{
	const file = e.target.files[0];
	const reader = new FileReader();
	reader.addEventListener("load", () => {
		SE.Start(SE.imageInput.value.split("\\").pop().split(".").shift(), reader.result);
	});
	if (file) {
		reader.readAsDataURL(file);
	}
});

SE.speedInput.onchange = SE.speedInput.onkeyup = (e) => {
	SE.imageSpeed = e.target.valueAsNumber || 0;
};

SE.Draw = {
	list: {},
	ctx: SE.previewCanvas.getContext("2d"),
	strip(img, index, x, y, xscale=1, yscale=1, rot=0, alpha=1) {
		if (img) {
			const s = {
				w: img.width / img.strip,
				h: img.height,
				get x() {
					return index * this.w;
				},
				y: 0
			};
			const d = {
				w: s.w * xscale,
				h: s.h * yscale,
				get x() {
					return -this.w * (xscale < 0? 1 - img.origin.x : img.origin.x);
				},
				get y() {
					return -this.h * (yscale < 0? 1 - img.origin.y : img.origin.y);
				}
			};
			this.ctx.save();
			this.ctx.translate(x, y);
			this.ctx.scale(Math.sign(xscale), Math.sign(yscale));
			this.ctx.rotate(rot * Math.PI / 180);
			this.ctx.globalAlpha = alpha;
			this.ctx.drawImage(img, s.x, s.y, s.w, s.h, d.x, d.y, d.w, d.h);
			this.ctx.globalAlpha = 1;
			this.ctx.restore();
		}
	}
};

SE.Start = (imageName, imageBase64) => {
	SE.imageName = imageName;
	SE.Draw.ctx.fillStyle = "#000";
	SE.Draw.ctx.textBaseline = "bottom";
	const imageStrip = imageName.split("strip").pop();
	const img = new Image();
	img.strip = imageStrip;
	img.src = imageBase64;
	img.origin = {
		x: 0.5,
		y: 0.5
	};
	SE.Draw.list["mainImage"] = img;
	img.onload = () => {
		SE.Update(0);
	};
};

SE.Update = (t) => {
	const imageIndex = Math.floor(t * 0.001 * SE.imageSpeed) % SE.Draw.list["mainImage"].strip;
	SE.Draw.ctx.clearRect(0, 0, SE.previewCanvas.width, SE.previewCanvas.height);
	SE.Draw.strip(SE.Draw.list["mainImage"], imageIndex, SE.previewCanvas.width * 0.5, SE.previewCanvas.height * 0.5);
	SE.Draw.ctx.textAlign = "left";
	SE.Draw.ctx.font = "12px Montserrat, serif";
	SE.Draw.ctx.fillText(SE.imageName, 4, SE.previewCanvas.height - 4);
	SE.Draw.ctx.textAlign = "right";
	SE.Draw.ctx.font = "24px Montserrat, serif";
	SE.Draw.ctx.fillText(imageIndex, SE.previewCanvas.width - 4, SE.previewCanvas.height - 4);
	window.requestAnimationFrame(SE.Update);
};