export default ({modules, entry}) => {
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
};
