console.log('Hello from funkybundle/fixtures/index.js');

import squareArea from './square.js';
import circleArea from './circle.js';

let message =
	'Area of square: ' + squareArea(5) + '. Area of circle: ' + circleArea(5);
console.log(message);

let body = document.querySelector('body');
body.innerHTML = body.innerHTML + '<pre>' + message + '</pre>';
