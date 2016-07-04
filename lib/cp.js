'use strict';

const path = require('path');
const BemConfig = require('bem-config');

const util = require('./util');
const optionParser = require('./option-validator');


function copyEntity(destinationEntity, options) {
    return (sourceEntity) => {
        const sourcePath = sourceEntity.path;
        const destinationPath = util.resolveDestinationPath(sourceEntity, destinationEntity, options);
        const destinationDir = path.dirname(destinationPath);

        return util.makeDir(destinationDir)
            .then(() => {
                return util.copyFile(sourcePath, destinationPath);
            })
            .then(() => {
                console.log(`Create file: ${destinationPath}`);
            });
    };
}

function copy(source, destination, levels, options) {
    const bemConfig = BemConfig();

    //проверка входных параметров
    source = optionParser.parseSourceOption(source);
    destination = optionParser.parseDestinationOption(destination);
    levels = levels || [];

    const filters = util.getSourceFilters(bemConfig, source, levels);
    const destinationEntity = util.resolveDestinationEntity(destination, filters.length === 1);

    return util.filterBEMEntities(filters.map(item => item.level), bemConfig.getSync(), filters)
        .then((entities) => {
            return Promise.all(entities.map(copyEntity(destinationEntity, options)));
        });
}

module.exports = copy;
