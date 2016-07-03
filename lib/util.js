'use strict';

const path = require('path');
const _ = require('lodash');
const microMatch = require('micromatch');
const bemNaming = require('bem-naming');
const bemWalk = require('bem-walk');
const bemFSScheme = require('bem-fs-scheme');
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
            .on('finish', () => resolve(result))
            .on('error', (error) => reject(error));
    });
};

exports.resolveDestinationEntity = (destination, useLevel) => {
    const destinationLevel = path.dirname(destination);
    const destinationEntity = bemNaming.parse(path.basename(destination));

    //TODO avoid process.cwd() usage
    if(destinationLevel && destinationLevel !== '.' && useLevel) {
        destinationEntity.level = path.join(process.cwd(), destinationLevel);
    }

    return destinationEntity;
};

exports.getSourceFilters = (config, source, levels) => {
    //получаем хеш для уровней проекта
    const projectLevels = _.keys(config.levelMapSync());

    const sourceLevel = path.dirname(source);
    if(sourceLevel && sourceLevel !== '.') {
        levels = levels.concat(path.join(sourceLevel));
    }

    //разворачиваем уровни до абсолютных путей на файловой системе
    //TODO avoid process.cwd() usage
    levels = levels.map(level => path.join(process.cwd(), level));

    //если во входных параметров уровни не были найдены,
    //то используются все уровни переопределения в проекте
    if(_.isEmpty(levels)) {
        levels = projectLevels;
    }

    return microMatch(projectLevels, levels, {})
        .map(level => new Matcher(source, level));
};

exports.resolveDestinationPath = (sourceEntity, destinationEntity, options) => {
    const effectiveEntity = {
        block: destinationEntity.block,
        elem: destinationEntity.elem || sourceEntity.elem,
        modName: destinationEntity.modName || sourceEntity.modName,
        modVal: destinationEntity.modVal ||
            (sourceEntity.modVal !== true ? sourceEntity.modVal : undefined)
    };

    //TODO hardcoded "nested" scheme
    const fileName = bemFSScheme('nested').path(effectiveEntity, sourceEntity.tech, options);
    return path.join(destinationEntity.level || sourceEntity.level, fileName);
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
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve();
        });
    });
};
