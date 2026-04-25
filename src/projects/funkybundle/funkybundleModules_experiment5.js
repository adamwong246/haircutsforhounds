export default {
	'circle.js': function (exports, require) {
		const PI = 3.141;
		exports.default = function area(radius) {
			return PI * radius * radius;
		};
	},
	'square.js': function (exports, require) {
		exports.default = function area(side) {
			return side * side;
		};
	},
	'app.js': function (exports, require) {
		const squareArea = require('square.js').default;
		const circleArea = require('circle.js').default;

		let message =
			'Area of square: ' + squareArea(5) + '. Area of circle: ' + circleArea(5);
		console.log(message);

		let body = document.querySelector('body');
		body.innerHTML = body.innerHTML + '<pre>' + message + '</pre>';
	},
};
