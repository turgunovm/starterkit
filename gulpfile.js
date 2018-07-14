var gulp         = require("gulp"),
    sass         = require("gulp-sass"),
    plumber      = require("gulp-plumber"),
    postcss      = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    server       = require("browser-sync").create(),
    reload       = server.reload,
    mqpacker     = require("css-mqpacker"),
    minify       = require("gulp-csso"),
    rename       = require("gulp-rename"),
    imagemin     = require("gulp-imagemin"),
    svgstore     = require("gulp-svgstore"),
    svgmin       = require("gulp-svgmin"),
    sequence     = require("run-sequence"),
    concat       = require("gulp-concat"),
    uglify       = require("gulp-uglify");


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
        .pipe(minify())
        .pipe(rename("main.min.css"))
        .pipe(gulp.dest("src/css"))
        .pipe(reload({ stream: true }));

    });


  /* Minifying CSS Libs*/
    gulp.task("css-libs", function() {

      return gulp.src("src/sass/libs.scss")
        .pipe(sass())
        .pipe(minify())
        .pipe(rename("libs.min.css"))
        .pipe(gulp.dest("src/css"))

    });


  /* Image Optimization */
    gulp.task("images", function() {

      return  gulp.src("src/img/**/*")
                .pipe(imagemin([
                  imagemin.optipng({optimizationLevel: 3}),
                  imagemin.jpegtran({progressive: true})
                ]))
                .pipe(gulp.dest("dist/img"))

    });


  /* Minifying JS files */
    gulp.task("scripts", function() {

      return gulp.src([
        "src/vendor/jquery-3.3.1.slim.min.js",
        "src/vendor/slick/slick.min.js"
      ])
      .pipe(concat("libs.min.js"))
      .pipe(uglify())
      .pipe(gulp.dest("src/js"))

    });

  /* SVG Minification & SVG Sprites*/
    gulp.task("symbols", function() {

        gulp.src("img/icons/*.svg")
          .pipe(svgmin())
          .pipe(svgstore({
            inlineSvg: true
          }))
          .pipe(rename("symbols.svg"))
          .pipe(gulp.dest("dist/img/sprites"));

    });


  /* Launching Server */
    gulp.task("serve", ["css-libs", "style", "scripts"], function() {

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


  /* Copying to dist */
    gulp.task("copy", function() {
      return gulp.src([
        "src/fonts/**/*.{woff,woff2}",
        "src/img/**",
        "src/js/**",
        "src/*.html"
      ], {
        // base: "."
      })
      .pipe(gulp.dest("dist"))
    });


  /* Packaging */
    gulp.task("build", function(fn) {
      sequence("style", "images", "symbols", fn);
    });
