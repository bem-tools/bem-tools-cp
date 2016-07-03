'use strict';

const _ = require('lodash');
const path = require('path');
const microMatch = require('micromatch');
const bemNaming = require('bem-naming');

module.exports = class Matcher {
    constructor(source, level) {
        const bemEntityStr = path.basename(source);
        const bemEntity = bemNaming.parse(bemEntityStr);

        this.level = level;
        this.block = bemEntity.block;
        this.elem = bemEntity.elem;
        this.modName = bemEntity.modName;
        this.modVal = bemEntity.modVal;
    }

    match(entity) {
        if(!microMatch.contains(entity.path, this.level)) {
            return false;
        }

        if(entity.block !== this.block) {
            return false;
        }

        if(this.elem && entity.elem !== this.elem) {
            return false;
        }

        if(this.modName && entity.modName !== this.modName) {
            return false;
        }

        if(this.modVal && entity.modVal !== this.modVal) {
            return false;
        }

        return true;
    }
};
