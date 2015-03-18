var NwBuilder = require('node-webkit-builder');
var gulp = require('gulp');

gulp.task('nw', function () {

    var nw = new NwBuilder({
        version: '0.12.0',
        files: './assets/**',
        winIco:'./icons/icon.ico',
        platforms: ['win32']
    });

    // Log stuff you want
    nw.on('log', function (msg) {
        console.log(msg);
    });

    // Build returns a promise, return it so the task isn't called in parallel
    return nw.build().catch(function (err) {
        console.log(err);
    });
});

gulp.task('watch',function () {
    gulp.watch('assets/**',['nw']);
})
gulp.task('default', ['nw','watch']);