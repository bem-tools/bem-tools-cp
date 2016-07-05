'use strict';

const path = require('path');
const _ = require('lodash');
const BemConfig = require('bem-config');

const util = require('./util');
const optionValidator = require('./option-validator');
const destinator = require('./destinator');

/**
 * Copies source entity to path resolved by given destination function
 * @param {Function} destFunc - destination function which resolves destination path
 * for given source entity
 * @returns {function()}
 */
function copyEntity(destFunc) {
    return (sourceEntity) => {
        const sourcePath = sourceEntity.path;

        const destinationPath = destFunc(sourceEntity);
        const destinationDir = path.dirname(destinationPath);

        return util.makeDir(destinationDir)
            .then(() => util.copyFile(sourcePath, destinationPath))
            .then(() => {
                console.log(`Create file: ${destinationPath}`);
                return {
                    path: destinationPath,
                    tech: sourceEntity.tech
                };
            });
    };
}

/**
 * Copy BEM entities which matches source declaration to path
 * described by destination declaration
 * @param {String} source
 * @param {String} destination
 * @param {String[]} [levels] - optional array of block levels
 * @param {Object} options
 * @returns {Promise.<TResult>}
 */
function copy(source, destination, levels, options) {
    options = options || {};

    const bemConfig = BemConfig();

    //check arguments
    source = optionValidator.validateSourceTarget(source);
    destination = optionValidator.validateDestinationTarget(destination);
    levels = levels || [];

    const filters = util.getSourceFilters(bemConfig, source, levels);

    return util.filterBEMEntities(filters.map(item => item.level), bemConfig.getSync(), filters)
        .then((entities) => {
            return Promise.all(entities.map(
                copyEntity(destinator(destination, _.extend(options, {applyLevel: filters.length === 1}))))
            );
        });
}

module.exports = copy;
