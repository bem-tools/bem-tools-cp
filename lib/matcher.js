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
     * @param {Object} entity - BEMWalk entity
     * @param {String} entity.block - block name
     * @param {String} [entity.elem] - elem name
     * @param {String} [entity.modName] - modifier name
     * @param {String} [entity.modVal] - modifier value
     * @param {String} entity.tech - BEM tech
     * @returns {boolean}
     */
    match(entity) {
        //сравниваем названия блоков
        if(!_.eq(entity.block, this.block)) {
            return false;
        }

        //сравниваем названия элементов
        if(this.elem && !_.eq(entity.elem, this.elem)) {
            return false;
        }

        //сравниваем названия имен модификаторов
        if(this.modName && !_.eq(entity.modName, this.modName)) {
            return false;
        }

        //сравниваем названия значений модификаторов
        if(this.modVal && !_.eq(this.modVal, true) && !_.eq(entity.modVal, this.modVal)) {
            return false;
        }

        //сравниваем по технологии сущности
        if(this.techMask && !microMatch.isMatch(entity.tech, this.techMask, {})) {
            return false;
        }

        return true;
    }
};
