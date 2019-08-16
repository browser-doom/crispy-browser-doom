mergeInto(LibraryManager.library, {
	BROWSERFS__deps: ["$FS", "$PATH", "$ERRNO_CODES"],
	BROWSERFS__postset: '__ATMAIN__.push(function() { _BROWSERFS(); })',
	BROWSERFS: function() {
		if('preloadFiles' in Module) {
			Module['preloadFiles'](FS, PATH, ERRNO_CODES);
		}
	}
});
