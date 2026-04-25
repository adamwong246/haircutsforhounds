console.log('hello from funkybundle/experiment3.js');

const PI = 3.141;
function circleArea(radius) {
	return PI * radius * radius;
}

function squareArea(side) {
	return side * side;
}

let message =
	'Area of square: ' + squareArea(5) + '. Area of circle: ' + circleArea(5);
console.log(message);

let body = document.querySelector('body');
body.innerHTML = body.innerHTML + '<pre>' + message + '</pre>';
