console.log('hello from funkybundle/experiment4.js');

const modules = {
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

function webpackStart({modules, entry}) {
	const moduleCache = {};
	const require = moduleName => {
		// if in cache, return the cached version
		if (moduleCache[moduleName]) {
			return moduleCache[moduleName];
		}
		const exports = {};
		// this will prevent infinite "require" loop
		// from circular dependencies
		moduleCache[moduleName] = exports;

		// "require"-ing the module,
		// exported stuff will assigned to "exports"
		modules[moduleName](exports, require);
		return moduleCache[moduleName];
	};

	// start the program
	require(entry);
}

webpackStart({
	modules,
	entry: 'app.js',
});
