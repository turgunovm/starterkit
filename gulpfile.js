var gulp         = require("gulp"),
    sass         = require("gulp-sass"),
    plumber      = require("gulp-plumber"),
    postcss      = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    server       = require("browser-sync").create(),
    reload       = server.reload,
    mqpacker     = require("css-mqpacker"),
    rename       = require("gulp-rename");


  /* Compiling Sass files */
    gulp.task("style", function() {

      gulp.src("src/sass/**/*.scss")
        .pipe(plumber())
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(postcss([
          autoprefixer({
            browsers: ["last 2 versions"],
            cascade: false
          }),
          mqpacker({ sort: true })
        ]))
        .pipe(gulp.dest("src/css"))
        .pipe(reload({ stream: true }));

    });



  /* Launching Server */
    gulp.task("serve", ["style"], function() {

      server.init({
        server: {
          baseDir: "./src"
        },
        notify: false
      });


      gulp.watch("src/sass/**/*.scss", ["style"]);
      gulp.watch("src/*.html").on("change", reload);
      gulp.watch('src/js/**/*.js').on("change", reload);

    });


  /* Defaul Gulp task */
    gulp.task("default", ["serve"]);
