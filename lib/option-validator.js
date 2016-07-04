'use strict';

const _ = require('lodash');

/**
 * Validates target option for given type and throws exception
 * @param type
 * @returns {function()}
 */
function validateTarget(type) {
    return value => {
        if(!_.isString(value)) {
            throw new Error(`${type} option value is not of String type`);
        }
        return value;
    }
}

exports.validateSourceTarget = validateTarget('source');
exports.validateDestinationTarget = validateTarget('destination');
