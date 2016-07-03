'use strict';

const _ = require('lodash');
const path = require('path');
const proxyquire = require('proxyquire');
const util = require('../../lib/util');

describe('cp', () => {
    const sandbox = sinon.sandbox.create();
    let cp;

    beforeEach(() => {
        cp = proxyquire('../../lib/cp', {
            'bem-config': () => {
                return {
                    getSync: () => ({}),
                    levelMapSync: () =>
                        _.zipObject(_(['common.blocks', 'desktop.blocks'])
                        .map(item => path.join(process.cwd(), item))
                        .value(), [{}, {}])
                }
            }
        });

        sandbox.stub(util, 'filterBEMEntities');
    });

    afterEach(() => sandbox.restore());

    describe('constrain valid matchers for filter BEM entities', () => {

        beforeEach(() => {
            util.filterBEMEntities.returns(Promise.resolve([]));
        });
        
        it('should use all project levels if levels were not set in source and levels', () => {
            return cp('block1', 'block2', []).then(() => {
                expect(util.filterBEMEntities).to.be.calledWith([
                    sinon.match('common.blocks'),
                    sinon.match('desktop.blocks')
                ]);
            });
        });

        it('should use only source level if levels were not set', () => {
            return cp('common.blocks/block1', 'block2', []).then(() => {
                expect(util.filterBEMEntities).to.be.calledWith([
                    sinon.match('common.blocks')
                ]);
            });
        });

        it('should use levels if source does not contain level', () => {
            return cp('block1', 'block2', ['common.blocks']).then(() => {
                expect(util.filterBEMEntities).to.be.calledWith([
                    sinon.match('common.blocks')
                ]);
            });
        });

        it('should accept wildcards in source level', () => {
            return cp('desktop.*/block1', 'block2').then(() => {
                expect(util.filterBEMEntities).to.be.calledWith([
                    sinon.match('desktop.blocks')
                ]);
            });
        });

        it('should accept wildcard in levels', () => {
            return cp('block1', 'block2', ['common.*']).then(() => {
                expect(util.filterBEMEntities).to.be.calledWith([
                    sinon.match('common.blocks')
                ]);
            });
        });

        describe('should create valid matcher', () => {
            it('for block', () => {
                return cp('common.blocks/block1', 'block2').then(() => {
                    const matcher = util.filterBEMEntities.firstCall.args[2][0];
                    expect(matcher.block).to.equal('block1');
                });
            });

            it('for element', () => {
                return cp('common.blocks/block1__elem1', 'block2').then(() => {
                    const matcher = util.filterBEMEntities.firstCall.args[2][0];
                    expect(matcher.block).to.equal('block1');
                    expect(matcher.elem).to.equal('elem1');
                });
            });

            it('for modifier without val', () => {
                return cp('common.blocks/block1_mod1', 'block2').then(() => {
                    const matcher = util.filterBEMEntities.firstCall.args[2][0];
                    expect(matcher.block).to.equal('block1');
                    expect(matcher.modName).to.equal('mod1');
                });
            });

            it('for modifier with val', () => {
                return cp('common.blocks/block1_mod1_val1', 'block2').then(() => {
                    const matcher = util.filterBEMEntities.firstCall.args[2][0];
                    expect(matcher.block).to.equal('block1');
                    expect(matcher.modName).to.equal('mod1');
                    expect(matcher.modVal).to.equal('val1');
                });
            });

            it('for elem modifier without val', () => {
                return cp('common.blocks/block1__elem1_mod1', 'block2').then(() => {
                    const matcher = util.filterBEMEntities.firstCall.args[2][0];
                    expect(matcher.block).to.equal('block1');
                    expect(matcher.elem).to.equal('elem1');
                    expect(matcher.modName).to.equal('mod1');
                });
            });

            it('for elem modifier with val', () => {
                return cp('common.blocks/block1__elem1_mod1_val1', 'block2').then(() => {
                    const matcher = util.filterBEMEntities.firstCall.args[2][0];
                    expect(matcher.block).to.equal('block1');
                    expect(matcher.elem).to.equal('elem1');
                    expect(matcher.modName).to.equal('mod1');
                    expect(matcher.modVal).to.equal('val1');
                });
            });
        })
    });
});
