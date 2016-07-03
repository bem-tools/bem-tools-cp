'use strict';

const bemWalk = require('bem-walk');

/**
 *
 * @param {String[]} levels - array of block levels
 * @param {Object} config
 * @param {Matcher[]} matchers - array of matchers
 * @returns {Promise}
 */
exports.filterBEMEntities = (levels, config, matchers) => {
    const result = [];

    return new Promise((resolve, reject) => {
        bemWalk(levels, config)
            .on('data', (entity) => {
                if(matchers.some(matcher => matcher.match(entity))) {
                    result.push(entity);
                }
            })
            .on('finish', () => resolve(result))
            .on('error', (error) => reject(error));
    });
};
