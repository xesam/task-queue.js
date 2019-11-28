const {src, dest} = require('gulp');

function copy() {
    return src('src/*.js')
        .pipe(dest('output/'));
}

exports.default = copy;