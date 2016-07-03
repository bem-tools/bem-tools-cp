'use strict';

const _ = require('lodash');

function parseTargetOption(type) {
    return value => {
        if(!_.isString(value)) {
            throw new Error(`${type} option value is not of String type`);
        }
        return value;
    }
}

exports.parseSourceOption = parseTargetOption('source');
exports.parseDestinationOption = parseTargetOption('destination');
