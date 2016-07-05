'use strict';

const _ = require('lodash');
const path = require('path');
const microMatch = require('micromatch');
const bemNaming = require('bem-naming');

module.exports = class Matcher {
    constructor(source, level) {
        const fileParts = path.basename(source).split('.');

        const bemEntityStr = fileParts[0];
        const bemEntity = bemNaming.parse(bemEntityStr);

        this.level = level;
        this.block = bemEntity.block;
        this.elem = bemEntity.elem;
        this.modName = bemEntity.modName;
        this.modVal = bemEntity.modVal;

        if(fileParts[1]) {
            this.techMask = `${_.drop(fileParts).join('.')}`;
        }
    }

    /**
     *
     * @param {Object} entity.entity - BEMWalk entity
     * @param {String} entity.entity.block - block name
     * @param {String} [entity.entity.elem] - elem name
     * @param {String} [entity.entity.modName] - modifier name
     * @param {String} [entity.entity.modVal] - modifier value
     * @param {String} entity.tech - BEM tech
     * @returns {Boolean}
     */
    match(entity) {
        const tech = entity.tech;
        entity = entity.entity;

        // compare block names
        if(!_.eq(entity.block, this.block)) {
            return false;
        }

        // compare elem names
        if(this.elem && !_.eq(entity.elem, this.elem)) {
            return false;
        }

        // compare modifier names
        if(this.modName && !_.eq(entity.modName, this.modName)) {
            return false;
        }

        // compare modifier values
        if(this.modVal && !_.eq(this.modVal, true) && !_.eq(entity.modVal, this.modVal)) {
            return false;
        }

        // compare by techs
        if(this.techMask && !microMatch.isMatch(tech, this.techMask, {})) {
            return false;
        }

        return true;
    }
};
