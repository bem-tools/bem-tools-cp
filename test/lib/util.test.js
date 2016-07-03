'use strict';

const path = require('path');
const _ = require('lodash');
const fsExtra = require('fs-extra');

const Matcher = require('../../lib/matcher');
const util = require('../../lib/util');

describe('util', () => {
    const sandbox = sinon.sandbox.create();

    afterEach(() => sandbox.restore());

    describe('resolveDestinationEntity', () => {
        it('should have valid value for block', () => {
            expect(util.resolveDestinationEntity('common.blocks/block1').block)
                .to.equal('block1');
        });

        it('should have valid value for element', () => {
            expect(util.resolveDestinationEntity('common.blocks/block1__elem1').elem)
                .to.equal('elem1');
        });

        it('should have valid value for block modifier field', () => {
            expect(util.resolveDestinationEntity('common.blocks/block1_mod1').modName)
                .to.equal('mod1');
        });

        it('should have valid value for block modifier value field', () => {
            expect(util.resolveDestinationEntity('common.blocks/block1_mod1_val1').modVal)
                .to.equal('val1');
        });

        it('should have valid value for element modifier field', () => {
            expect(util.resolveDestinationEntity('common.blocks/block1_mod1').modName)
                .to.equal('mod1');
        });

        it('should have valid value for element modifier value', () => {
            expect(util.resolveDestinationEntity('common.blocks/block1_mod1_val1').modVal)
                .to.equal('val1');
        });

        it('should have level if presented and "useLevel" flag enabled', () => {
            expect(util.resolveDestinationEntity('common.blocks/block1', true).level)
                .to.match(/common\.blocks$/);
        });

        it('should not have level if level is missed', () => {
            expect(util.resolveDestinationEntity('block1', true).level).to.be.undefined;
        });

        it('should not have level if level equals to "."', () => {
            expect(util.resolveDestinationEntity('block1', true).level).to.be.undefined;
        });

        it('should not have level if it presented but "useLevel" flag disabled', () => {
            expect(util.resolveDestinationEntity('common.blocks/block1', false).level).to.be.undefined;
        });
    });

    describe('resolveDestinationPath', () => {
        it('should use destination block name', () => {
            expect(util.resolveDestinationPath(
                {
                    level: 'common.blocks',
                    block: 'block1',
                    tech: 'js'
                },
                {
                    level: 'common.blocks',
                    block: 'block2'
                }
            )).to.equal('common.blocks/block2/block2.js');
        });

        it('should use destination element name if it exists', () => {
            expect(util.resolveDestinationPath(
                {
                    level: 'common.blocks',
                    block: 'block1',
                    elem: 'elem1',
                    tech: 'js'
                },
                {
                    level: 'common.blocks',
                    block: 'block2',
                    elem: 'elem2'
                }
            )).to.equal('common.blocks/block2/__elem2/block2__elem2.js');
        });

        it('should fall back to source element name if destination elem does not exists', () => {
            expect(util.resolveDestinationPath(
                {
                    level: 'common.blocks',
                    block: 'block1',
                    elem: 'elem1',
                    tech: 'js'
                },
                {
                    level: 'common.blocks',
                    block: 'block2'
                }
            )).to.equal('common.blocks/block2/__elem1/block2__elem1.js');
        });

        it('should use destination mod name if it exists', () => {
            expect(util.resolveDestinationPath(
                {
                    level: 'common.blocks',
                    block: 'block1',
                    modName: 'mod1',
                    tech: 'js'
                },
                {
                    level: 'common.blocks',
                    block: 'block2',
                    modName: 'mod2'
                }
            )).to.equal('common.blocks/block2/_mod2/block2_mod2.js');
        });

        it('should fall back to source mod name if destination mod name does not exists', () => {
            expect(util.resolveDestinationPath(
                {
                    level: 'common.blocks',
                    block: 'block1',
                    modName: 'mod1',
                    tech: 'js'
                },
                {
                    level: 'common.blocks',
                    block: 'block2'
                }
            )).to.equal('common.blocks/block2/_mod1/block2_mod1.js');
        });

        it('should use mod val if it exists', () => {
            expect(util.resolveDestinationPath(
                {
                    level: 'common.blocks',
                    block: 'block1',
                    modName: 'mod1',
                    modVal: 'val1',
                    tech: 'js'
                },
                {
                    level: 'common.blocks',
                    block: 'block2',
                    modName: 'mod2',
                    modVal: 'val2'
                }
            )).to.equal('common.blocks/block2/_mod2/block2_mod2_val2.js');
        });

        it('should fall back to source mod val in common case', () => {
            expect(util.resolveDestinationPath(
                {
                    level: 'common.blocks',
                    block: 'block1',
                    modName: 'mod1',
                    modVal: 'val1',
                    tech: 'js'
                },
                {
                    level: 'common.blocks',
                    block: 'block2',
                    modName: 'mod2'
                }
            )).to.equal('common.blocks/block2/_mod2/block2_mod2_val1.js');
        });

        it('should not set source mod val in case of logical modifier', () => {
            expect(util.resolveDestinationPath(
                {
                    level: 'common.blocks',
                    block: 'block1',
                    modName: 'mod1',
                    modVal: true,
                    tech: 'js'
                },
                {
                    level: 'common.blocks',
                    block: 'block2',
                    modName: 'mod2'
                }
            )).to.equal('common.blocks/block2/_mod2/block2_mod2.js');
        });

        it('should use destination level by default', () => {

        });

        it('should fallback to source level', () => {

        });
    });

    describe('makeDir', () => {
        beforeEach(() => {
            sandbox.stub(fsExtra, 'ensureDir');
        });

        it('should pass param', () => {
            fsExtra.ensureDir.yields(null);
            return util.makeDir('some/dir/path').then(() => {
                expect(fsExtra.ensureDir).to.be.calledWith('some/dir/path');
            });
        });

        it('should return rejected promise on fail directory creation', () => {
            fsExtra.ensureDir.yields(new Error('some-error'));
            return expect(util.makeDir('some/dir/path')).to.be.rejectedWith('some-error');
        });
    });

    describe('copyFile', () => {
        beforeEach(() => {
            sandbox.stub(fsExtra, 'copy');
        });

        it('should pass params', () => {
            fsExtra.copy.yields(null);
            return util.copyFile('some/source/path', 'some/destination/path').then(() => {
                expect(fsExtra.copy).to.be.calledWith('some/source/path', 'some/destination/path');
            });
        });

        it('should return rejected promise on fail directory creation', () => {
            fsExtra.copy.yields(new Error('some-error'));
            return expect(util.copyFile('some/source/path', 'some/destination/path')).to.be.rejectedWith('some-error');
        });
    });
});
