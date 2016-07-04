'use strict';

const destinator = require('../../lib/destinator');

describe('destinator', () => {

    describe('should create valid destination file path', () => {
        it('for copy block file on the same level', () => {
            const source = {
                level: 'common.blocks',
                block: 'block1',
                tech: 'js'
            };
            const destination = 'common.blocks/block2';

            expect(destinator(destination, {})(source))
                .to.equal('common.blocks/block2/block2.js');
        });

        it('for copy block file to another level', () => {
            const source = {
                level: 'common.blocks',
                block: 'block1',
                tech: 'js'
            };
            const destination = 'desktop.blocks/block2';

            expect(destinator(destination, {applyLevel: true})(source))
                .to.match(/desktop\.blocks\/block2\/block2\.js$/);
        });

        it('for copy element file to another element inside one block', () => {
            const source = {
                level: 'common.blocks',
                block: 'block1',
                elem: 'elem1',
                tech: 'js'
            };
            const destination = 'common.blocks/block1__elem2';

            expect(destinator(destination, {})(source))
                .to.equal('common.blocks/block1/__elem2/block1__elem2.js');
        });

        it('for copy element file between different blocks', () => {
            const source = {
                level: 'common.blocks',
                block: 'block1',
                elem: 'elem1',
                tech: 'js'
            };
            const destination = 'common.blocks/block2__elem2';

            expect(destinator(destination, {})(source))
                .to.equal('common.blocks/block2/__elem2/block2__elem2.js');
        });

        it('for copy block logical modifier to another modifier inside one block', () => {
            const source = {
                level: 'common.blocks',
                block: 'block1',
                modName: 'mod1',
                modVal: true,
                tech: 'js'
            };
            const destination = 'common.blocks/block1_mod2';

            expect(destinator(destination, {})(source))
                .to.equal('common.blocks/block1/_mod2/block1_mod2.js');
        });

        it('for copy block logical modifier from one block to another', () => {
            const source = {
                level: 'common.blocks',
                block: 'block1',
                modName: 'mod1',
                modVal: true,
                tech: 'js'
            };
            const destination = 'common.blocks/block2_mod2';

            expect(destinator(destination, {})(source))
                .to.equal('common.blocks/block2/_mod2/block2_mod2.js');
        });

        it('for copy block modifier value file to another modifier inside one block', () => {
            const source = {
                level: 'common.blocks',
                block: 'block1',
                modName: 'mod1',
                modVal: 'val1',
                tech: 'js'
            };
            const destination = 'common.blocks/block1_mod2';

            expect(destinator(destination, {})(source))
                .to.equal('common.blocks/block1/_mod2/block1_mod2_val1.js');
        });

        it('for copy block modifier value file to another block modifier', () => {
            const source = {
                level: 'common.blocks',
                block: 'block1',
                modName: 'mod1',
                modVal: 'val1',
                tech: 'js'
            };
            const destination = 'common.blocks/block2_mod2';

            expect(destinator(destination, {})(source))
                .to.equal('common.blocks/block2/_mod2/block2_mod2_val1.js');
        });

        it('for copy block element modifier inside one element', () => {
            const source = {
                level: 'common.blocks',
                block: 'block1',
                elem: 'elem1',
                modName: 'mod1',
                modVal: 'val1',
                tech: 'js'
            };
            const destination = 'common.blocks/block1__elem1_mod2_val2';

            expect(destinator(destination, {})(source))
                .to.equal('common.blocks/block1/__elem1/_mod2/block1__elem1_mod2_val2.js');
        });

        it('for copy block element modifier between two elements of the same block', () => {
            const source = {
                level: 'common.blocks',
                block: 'block1',
                elem: 'elem1',
                modName: 'mod1',
                modVal: 'val1',
                tech: 'js'
            };
            const destination = 'common.blocks/block1__elem2';

            expect(destinator(destination, {})(source))
                .to.equal('common.blocks/block1/__elem2/_mod1/block1__elem2_mod1_val1.js');
        });

        it('for copy block element modifier to another element of another block', () => {
            const source = {
                level: 'common.blocks',
                block: 'block1',
                elem: 'elem1',
                modName: 'mod1',
                modVal: 'val1',
                tech: 'js'
            };
            const destination = 'common.blocks/block2__elem2_mod2_val2';

            expect(destinator(destination, {})(source))
                .to.equal('common.blocks/block2/__elem2/_mod2/block2__elem2_mod2_val2.js');
        });
    });
});
