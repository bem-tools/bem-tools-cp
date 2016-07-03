'use strict';

const cp = require('./index');

module.exports = function() {
    return this
        .title('BEM Tool Copy')
        .helpful()
        .completable()
        .arg()
            .name('source')
            .title('source')
            .req()
        .end()
        .arg()
            .name('destination')
            .title('destination')
            .req()
        .end()
        .opt()
            .name('level')
            .title('Name(s) of level. This option can be used multiple times')
            .short('l')
            .long('level')
            .arr()
        .end()
        .act((opts, args) => {
            return cp(args.source, args.destination, opts.level);
        });
};
