SDL2_mixer Emscripten port notes:
	At the time of writing, the emscripten port for SDL2_mixer is at 
	version 2.0.1, but 2.0.2 is required for sound and music to work. 
	Tweaking your emscripten installation to use 2.0.2 is luckily
	very easy.

	Open the file $EMSDK/fastcomp/emscripten/tools/ports/sdl2_mixer.py
	for editing. 

	Replace TAG = 'release-2.0.1' with TAG = 'release-2.0.2'
	and replace HASH = '81fac757bd058adcb3eb5b2cc46addeaa44cee2cd4db653dad5d9666bdc0385cdc21bf5b72872e6dd6dd8eb65812a46d7752298827d6c61ad5ce2b6c963f7ed0' with
	HASH = '81fac757bd058adcb3eb5b2cc46addeaa44cee2cd4db653dad5d9666bdc0385cdc21bf5b72872e6dd6dd8eb65812a46d7752298827d6c61ad5ce2b6c963f7ed0'
	
	Now delete $HOME/.emscripten_ports/sdl2_mixer.zip and
	the $HOME/.emscripten_ports/sdl2_mixer directory.

	Then delete $HOME/.emscripten_cache/asmjs/libSDL2_mixer.a
	and the folder $HOME/.emscripten_cache/asmjs/sdl2_mixer

	At this point emscripten should use SDL2_mixer 2.0.2.
	Until Emscripten updates it SDL2_mixer port, this
	hack is required to build with emscripten

