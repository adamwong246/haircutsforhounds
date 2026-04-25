const modules = {
	'/Users/adam/Programming/adamwong246.github.io/src/projects/funkybundle/fixtures/index.js':
		function (exports, require) {
			console.log('hello from funkybundle/index.js');
			const _imported = require('/Users/adam/Programming/adamwong246.github.io/src/projects/funkybundle/fixtures/square.js');
			const _imported2 = require('/Users/adam/Programming/adamwong246.github.io/src/projects/funkybundle/fixtures/circle.js');
			let message =
				'Area of square: ' +
				_imported['default'](5) +
				'. Area of circle: ' +
				_imported2['default'](5);
			console.log(message);
			let body = document.querySelector('body');
			body.innerHTML = body.innerHTML + '<pre>' + message + '</pre>';
		},
	'/Users/adam/Programming/adamwong246.github.io/src/projects/funkybundle/fixtures/square.js':
		function (exports, require) {
			// filename: square.js
			function area(side) {
				return side * side;
			}
			exports.default = area;
		},
	'/Users/adam/Programming/adamwong246.github.io/src/projects/funkybundle/fixtures/circle.js':
		function (exports, require) {
			// filename: circle.js
			const PI = 3.141;
			function area(radius) {
				return PI * radius * radius;
			}
			exports.default = area;
		},
};
const entry =
	'/Users/adam/Programming/adamwong246.github.io/src/projects/funkybundle/fixtures/index.js';
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
webpackStart({modules, entry});
