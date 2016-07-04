'use strict';

const Matcher = require('../../lib/matcher');

describe('Matcher', () => {
    it('should match on block name', () => {
        const matcher = new Matcher('common.blocks/block1', 'common.blocks');
        const entity1 = {
            block: 'block1'
        };

        const entity2 = {
            block: 'block2'
        };

        expect(matcher.match(entity1)).to.equal(true);
        expect(matcher.match(entity2)).to.equal(false);
    });

    it('should match on element name', () => {
        const matcher = new Matcher('common.blocks/block1__elem1', 'common.blocks');
        const entity1 = {
            block: 'block1',
            elem: 'elem1'
        };

        const entity2 = {
            block: 'block1',
            elem: 'elem2'
        };

        expect(matcher.match(entity1)).to.equal(true);
        expect(matcher.match(entity2)).to.equal(false);
    });

    it('should match on modifier name (boolean modifier)', () => {
        const matcher = new Matcher('common.blocks/block1_mod1', 'common.blocks');
        const entity1 = {
            block: 'block1',
            modName: 'mod1',
            modVal: true
        };

        const entity2 = {
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
            block: 'block1',
            modName: 'mod1',
            modVal: 'val1'
        };

        const entity2 = {
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
            block: 'block1',
            elem: 'elem1',
            modName: 'mod1',
            modVal: true
        };

        const entity2 = {
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
            block: 'block1',
            elem: 'elem1',
            modName: 'mod1',
            modVal: 'val1'
        };

        const entity2 = {
            block: 'block1',
            elem: 'elem1',
            modName: 'mod1',
            modVal: 'val2'
        };

        expect(matcher.match(entity1)).to.equal(true);
        expect(matcher.match(entity2)).to.equal(false);
    });

    it('should match on tech name', () => {
        const matcher = new Matcher('common.blocks/block1.deps.js', 'common.blocks');
        const entity1 = {
            path: 'common.blocks/block1.deps.js',
            block: 'block1',
            tech: 'deps.js'
        };

        const entity2 = {
            path: 'common.blocks/block1.deps.js',
            block: 'block1',
            tech: 'css'
        };

        expect(matcher.match(entity1)).to.equal(true);
        expect(matcher.match(entity2)).to.equal(false);
    });

    it('should match on tech names (wildcard)', () => {
        const matcher = new Matcher('common.blocks/block1.{deps.js,styl}', 'common.blocks');
        const entity1 = {
            path: 'common.blocks/block1.deps.js',
            block: 'block1',
            tech: 'deps.js'
        };

        const entity2 = {
            path: 'common.blocks/block1.styl',
            block: 'block1',
            tech: 'styl'
        };

        const entity3 = {
            path: 'common.blocks/block1.css',
            block: 'block1',
            tech: 'css'
        };

        expect(matcher.match(entity1)).to.equal(true);
        expect(matcher.match(entity2)).to.equal(true);
        expect(matcher.match(entity3)).to.equal(false);
    });
});
