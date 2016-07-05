'use strict';

const path = require('path');
const _ = require('lodash');
const microMatch = require('micromatch');
const bemWalk = require('bem-walk');
const fsExtra = require('fs-extra');

const Matcher = require('./matcher');

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
            .on('end', () => resolve(result))
            .on('error', (error) => reject(error));
    });
};

exports.getSourceFilters = (config, source, levels) => {
    const projectLevels = _.keys(config.levelMapSync());

    const sourceLevel = path.dirname(source);
    if(sourceLevel && sourceLevel !== '.') {
        levels = levels.concat(path.join(sourceLevel));
    }

    // TODO avoid process.cwd() usage
    levels = levels.map(level => path.join(process.cwd(), level));

    if(_.isEmpty(levels)) {
        levels = projectLevels;
    }

    return microMatch(projectLevels, levels, {})
        .map(level => new Matcher(source, level));
};

/**
 * Makes directory for given dirPath if it does not exists yet
 * @param {String} dirPath - path for directory creation
 * @returns {Promise}
 */
exports.makeDir = (dirPath) => {
    return new Promise((resolve, reject) => {
        fsExtra['ensureDir'](dirPath, (err) => {
            if(err) {
                console.error(err);
                reject(err);
            }
            resolve();
        });
    });
};

/**
 * Copies file from source path to destination path
 * @param {String} sourcePath - source file path
 * @param {String} destinationPath - destination file path
 * @returns {Promise}
 */
exports.copyFile = (sourcePath, destinationPath) => {
    return new Promise((resolve, reject) => {
        fsExtra['copy'](sourcePath, destinationPath, (err) => {
            if(err) {
                console.error(err);
                reject(err);
            }
            resolve();
        });
    });
};
