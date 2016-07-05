'use strict';

const path = require('path');
const bemNaming = require('bem-naming');
const bemFSScheme = require('bem-fs-scheme');

/**
 * Resolves destination path for given destination and source
 * @param {String} destination
 * @param {Object} options
 * @param {Boolean} [options.applyLevel]
 */
module.exports = (destination, options) => {
    options = options || {};

    const level = path.dirname(destination);
    const entity = bemNaming.parse(path.basename(destination));

    // TODO avoid process.cwd() usage
    if(level && level !== '.' && options.applyLevel) {
        entity.level = path.join(process.cwd(), level);
    }

    function resolveModVal(dest, source) {
        if(dest.modVal === true && source.modVal !== true) {
            return source.modVal;
        }

        return dest.modVal || source.modVal;
    }

    return (source) => {
        const merged = {
            block: entity.block,
            elem: entity.elem || source.entity.elem,
            modName: entity.modName || source.entity.modName,
            modVal: resolveModVal(entity, source.entity)
        };

        // TODO hardcoded "nested" scheme
        const fileName = bemFSScheme('nested').path(merged, source.tech, options);
        return path.join(entity.level || source.level, fileName);
    };
};
