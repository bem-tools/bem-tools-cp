'use strict';

const Matcher = require('../../lib/matcher');

describe('Matcher', () => {
    it('should match on level path', () => {
        const matcher = new Matcher('common.blocks/block1', 'desktop.blocks');
        const entity1 = {
            path: 'desktop.blocks/block1/block1.js',
            block: 'block1'
        };
        const entity2 = {
            path: 'common.blocks/block1/block1.js',
            block: 'block1'
        };

        expect(matcher.match(entity1)).to.equal(true);
        expect(matcher.match(entity2)).to.equal(false);
    });

    it('should match on block name', () => {
        const matcher = new Matcher('common.blocks/block1', 'common.blocks');
        const entity1 = {
            path: 'common.blocks/block1/block1.js',
            block: 'block1'
        };

        const entity2 = {
            path: 'common.blocks/block1/block1.js',
            block: 'block2'
        };

        expect(matcher.match(entity1)).to.equal(true);
        expect(matcher.match(entity2)).to.equal(false);
    });

    it('should match on element name', () => {
        const matcher = new Matcher('common.blocks/block1__elem1', 'common.blocks');
        const entity1 = {
            path: 'common.blocks/block1/block1__elem1.js',
            block: 'block1',
            elem: 'elem1'
        };

        const entity2 = {
            path: 'common.blocks/block1/block1__elem2.js',
            block: 'block1',
            elem: 'elem2'
        };

        expect(matcher.match(entity1)).to.equal(true);
        expect(matcher.match(entity2)).to.equal(false);
    });

    it('should match on modifier name (boolean modifier)', () => {
        const matcher = new Matcher('common.blocks/block1_mod1', 'common.blocks');
        const entity1 = {
            path: 'common.blocks/block1/block1_mod1.js',
            block: 'block1',
            modName: 'mod1',
            modVal: true
        };

        const entity2 = {
            path: 'common.blocks/block1/block1_mod2.js',
            block: 'block1',
            modName: 'mod2',
            modVal: true
        };

        expect(matcher.match(entity1)).to.equal(true);
        expect(matcher.match(entity2)).to.equal(false);
    });

    it('should match on modifier value', () => {
        const matcher = new Matcher('common.blocks/block1_mod1_val1', 'common.blocks');
        const entity1 = {
            path: 'common.blocks/block1/block1_mod1_val1.js',
            block: 'block1',
            modName: 'mod1',
            modVal: 'val1'
        };

        const entity2 = {
            path: 'common.blocks/block1/block1_mod1_val2.js',
            block: 'block1',
            modName: 'mod1',
            modVal: 'val2'
        };

        expect(matcher.match(entity1)).to.equal(true);
        expect(matcher.match(entity2)).to.equal(false);
    });

    it('should match on element modifier name', () => {
        const matcher = new Matcher('common.blocks/block1__elem1_mod1', 'common.blocks');
        const entity1 = {
            path: 'common.blocks/block1/block1__elem1_mod1.js',
            block: 'block1',
            elem: 'elem1',
            modName: 'mod1',
            modVal: true
        };

        const entity2 = {
            path: 'common.blocks/block1/block1_elem1_mod2.js',
            block: 'block1',
            elem: 'elem1',
            modName: 'mod2',
            modVal: true
        };

        expect(matcher.match(entity1)).to.equal(true);
        expect(matcher.match(entity2)).to.equal(false);
    });

    it('should match on element modifier value', () => {
        const matcher = new Matcher('common.blocks/block1__elem1_mod1_val1', 'common.blocks');
        const entity1 = {
            path: 'common.blocks/block1/block1__elem1_mod1.js',
            block: 'block1',
            elem: 'elem1',
            modName: 'mod1',
            modVal: 'val1'
        };

        const entity2 = {
            path: 'common.blocks/block1/block1_elem1_mod1_val2.js',
            block: 'block1',
            elem: 'elem1',
            modName: 'mod1',
            modVal: 'val2'
        };

        expect(matcher.match(entity1)).to.equal(true);
        expect(matcher.match(entity2)).to.equal(false);
    });

    it('should match on tech name', () => {
        
    });

    it('should match on tech names (wildcard)', () => {

    });
});
