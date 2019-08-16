set(CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/cmake")

cmake_minimum_required(VERSION 3.7.2)
project("CrispyBrowser Doom" VERSION 5.6.0 LANGUAGES C)

# Autotools variables
set(top_srcdir ${CMAKE_CURRENT_SOURCE_DIR})
set(top_builddir ${CMAKE_CURRENT_BINARY_DIR})

# AC_INIT variables
set(PACKAGE_NAME "${PROJECT_NAME}")
set(PACKAGE_TARNAME "crispy-browser-doom")
set(PACKAGE_VERSION "${PROJECT_VERSION}")
set(PACKAGE_STRING "${PROJECT_NAME} ${PROJECT_VERSION}")
set(PACKAGE_BUGREPORT "https://github.com/browser-doom/crispy-browser-doom/issues")

string(REGEX REPLACE " Doom$" "" PACKAGE_SHORTNAME "${PACKAGE_NAME}")
set(PACKAGE_COPYRIGHT "Copyright (C) 1993-2019")
set(PACKAGE_LICENSE "GNU General Public License, version 2")

# Any settings that should apply to all targets in this directory and all
# subdirectories should go here.  Use judiciously.
if(MSVC)
    add_definitions("/D_CRT_SECURE_NO_WARNINGS" "/D_CRT_SECURE_NO_DEPRECATE"
                    "/D_CRT_NONSTDC_NO_DEPRECATE")
else()
    add_compile_options("-Wall" "-Wdeclaration-after-statement"
                        "-Wredundant-decls")
endif()

if (EMSCRIPTEN)
	set(EMSCRIPTEN_HEAP_SIZE 268435456)
	add_compile_options("SHELL:-s WASM=1 -s ASSERTIONS=2 -s TOTAL_MEMORY=${EMSCRIPTEN_HEAP_SIZE} -s BINARYEN_TRAP_MODE=\"clamp\" -s EXIT_RUNTIME=1")
	add_link_options("SHELL:-s WASM=1 -s ASSERTIONS=2 -s TOTAL_MEMORY=${EMSCRIPTEN_HEAP_SIZE} -s BINARYEN_TRAP_MODE=\"clamp\" -s EXIT_RUNTIME=1")
	add_library(SDL2::SDL2     INTERFACE IMPORTED GLOBAL) 
	add_library(SDL2::SDL2main INTERFACE IMPORTED GLOBAL) 
	add_library(SDL2::mixer    INTERFACE IMPORTED GLOBAL) 
	add_library(SDL2::net      INTERFACE IMPORTED GLOBAL) 
	add_library(PNG::PNG       INTERFACE IMPORTED GLOBAL)

	target_link_options(SDL2::SDL2  INTERFACE "SHELL:-s USE_SDL=2")
	target_link_options(SDL2::mixer INTERFACE "SHELL:-s USE_SDL_MIXER=2")
	target_link_options(SDL2::net   INTERFACE "SHELL:-s USE_SDL_NET=2")
	target_link_options(PNG::PNG   INTERFACE "SHELL:-s USE_LIBPNG=1")

	set_target_properties(SDL2::SDL2 PROPERTIES INTERFACE_COMPILE_OPTIONS
		"SHELL:-s USE_SDL=2")
	set_target_properties(SDL2::SDL2main PROPERTIES INTERFACE_COMPILE_OPTIONS
		"SHELL:-s USE_SDL=2")
	set_target_properties(SDL2::mixer PROPERTIES INTERFACE_COMPILE_OPTIONS
		"SHELL:-s USE_SDL_MIXER=2")
	set_target_properties(SDL2::net PROPERTIES INTERFACE_COMPILE_OPTIONS
		"SHELL:-s USE_SDL_NET=2")
	set_target_properties(PNG::PNG PROPERTIES INTERFACE_COMPILE_OPTIONS
		"SHELL:-s USE_LIBPNG=1")
	set(PNG_FOUND TRUE)
else()
	find_package(SDL2 2.0.1)
	find_package(SDL2_mixer 2.0.0)
	find_package(SDL2_net 2.0.0)
	find_package(PNG)
endif()

# Check for libsamplerate.
set(HAVE_LIBSAMPLERATE TRUE)

# Check for libpng.
if(PNG_FOUND)
    set(HAVE_LIBPNG TRUE)
endif()

find_package(m)

include(CheckSymbolExists)
include(CheckIncludeFile)
check_symbol_exists(strcasecmp "strings.h" HAVE_DECL_STRCASECMP)
check_symbol_exists(strncasecmp "strings.h" HAVE_DECL_STRNCASECMP)
check_include_file("dirent.h" HAVE_DIRENT_H)

string(CONCAT WINDOWS_RC_VERSION "${PROJECT_VERSION_MAJOR}, "
    "${PROJECT_VERSION_MINOR}, ${PROJECT_VERSION_PATCH}, 0")

# Without a hyphen. This is used for the bash-completion scripts.
string(TOLOWER "${PACKAGE_SHORTNAME}" PROGRAM_SPREFIX)

# With a hyphen, used almost everywhere else.
set(PROGRAM_PREFIX "${PROGRAM_SPREFIX}-")

configure_file(cmake/config.h.cin config.h)

configure_file(src/resource.rc.in src/resource.rc)
configure_file(src/setup-res.rc.in src/setup-res.rc)
configure_file(src/setup/setup-manifest.xml.in src/setup/setup-manifest.xml)

foreach(SUBDIR libsamplerate textscreen midiproc opl pcsound src)
    add_subdirectory("${SUBDIR}")
endforeach()
