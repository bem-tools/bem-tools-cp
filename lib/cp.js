'use strict';

const path = require('path');
const _ = require('lodash');
const microMatch = require('micromatch');
const BemConfig = require('bem-config');

const util = require('./util');
const optionParser = require('./option-validator');
const Matcher = require('./matcher');

function copy(source, destination, levels) {
    const bemConfig = BemConfig();

    source = optionParser.parseSourceOption(source);
    destination = optionParser.parseDestinationOption(destination);
    levels = levels || [];

    const levelMap = bemConfig.levelMapSync();

    const projectLevels = _.keys(levelMap);
    const sourceLevel = path.dirname(source);

    if(sourceLevel && sourceLevel !== '.') {
        levels = levels.concat(path.join(sourceLevel));
    }

    levels = levels.map(level => path.join(process.cwd(), level));

    if(_.isEmpty(levels)) {
        levels = projectLevels;
    }

    const matchedLevels = microMatch(projectLevels, levels);
    const filters = matchedLevels.map(level => new Matcher(source, level));

    return util.filterBEMEntities(matchedLevels, bemConfig.getSync(), filters)
}

module.exports = copy;
