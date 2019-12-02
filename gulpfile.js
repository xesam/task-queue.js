const {src, dest} = require('gulp');
const babel = require('gulp-babel');

function copy() {
    return src('src/*.js')
        .pipe(dest('dist/'));
}

function es5() {
    return src('src/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(dest('dist/'));
}

exports.es5 = es5;

exports.default = copy;