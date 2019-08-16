add_library(samplerate samplerate.c src_linear.c src_sinc.c src_zoh.c)
target_include_directories(samplerate PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
