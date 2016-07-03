'use strict';

const chai = require('chai');

global.sinon = require('sinon');
global.expect = chai.expect;

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
