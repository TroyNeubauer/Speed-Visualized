
const canvas = $("#canvas")[0];

// Get the device pixel ratio, falling back to 1.
var dpr = window.devicePixelRatio || 1;
// Get the size of the canvas in CSS pixels.
var rect = canvas.getBoundingClientRect();
// Give the canvas pixel dimensions of their CSS
// size * the device pixel ratio.
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
var ctx = canvas.getContext('2d');
console.log("DPR: " + dpr);
// Scale all drawing operations by the dpr, so you
// don't have to worry about the difference.
ctx.scale(dpr, dpr);

var backgroundColor = "white";
var itemColor = "black";
var itemTextColor = "red";
var infoTextColor = "black";

var start = null, last = null;
var zoom = 10;// pixels/second
var zoomVel = 0;

function scroll(event) {
	zoomVel += (-event.deltaY / 500);
	zoomVel *= 1 + Math.abs(event.deltaY / 1000);
}

canvas.addEventListener("wheel", scroll);

function drawObj(seconds, label) {
	var x = 1;
	var y = Math.sqrt(canvas.height / canvas.width * 3);
	var width = 12;
	var height = 1;

	ctx.save();
	ctx.scale(zoom * seconds, zoom * seconds);
	ctx.fillStyle = itemColor;
	ctx.fillRect(x, y, width, height);
	ctx.fillStyle = itemTextColor;
	ctx.font = "3px Arial";
	ctx.fillText(label, x, y + 4);
	ctx.restore();
	//console.log(width);
}

function render(now) {
	if (!start) start = now;
	if (last) {
		var delta = now - last;
		zoom *= 1.0 + (zoomVel * delta / 1000.0);
		zoomVel *= 0.95;
	}
	if (zoomVel >  10) zoomVel =  10;
	if (zoomVel < -10) zoomVel = -10;
	last = now;
	const progress = now - start;
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.save();
	ctx.save();
	ctx.translate(canvas.width / 3, canvas.height / 3);
	drawObj(0.000000001, "Nanosecond");
	drawObj(0.000001, "Microsecond");
	drawObj(0.001, "Millisecond");
	drawObj(1, "Second");
	var unit = 60;
	drawObj(unit, "Minute");
	unit *= 60;
	drawObj(unit, "Hour");
	unit *= 24;
	drawObj(unit, "Day");
	drawObj(unit * 7, "Week");
	drawObj(unit * 30, "Month");
	unit *= 365.256363004;

	drawObj(unit, "Year");
	drawObj(unit * 10, "Decade");
	drawObj(unit * 100, "Century");
	drawObj(unit * 1000, "Millennium");

	var secondsPerPixel = 1.0 / zoom;
	var barWidth = canvas.width / 5;
	var time = Math.sqrt(secondsPerPixel * secondsPerPixel * barWidth);
	var exp = Math.log10(time);
	ctx.restore();

	ctx.fillStyle = infoTextColor;
	ctx.fillText("10 ^" + Math.round(exp * 10) / 10 + " seconds", 10, canvas.height - 20);
	ctx.fillRect(10, canvas.height - 50, barWidth, 10);

	ctx.restore();

	window.requestAnimationFrame(render);
}


window.requestAnimationFrame(render);
