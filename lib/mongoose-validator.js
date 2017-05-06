/**
 * Validators for Mongoose.js utilising validator.js
 * @module mongoose-validator
 * @author Lee Powell lee@leepowell.co.uk
 * @copyright MIT
 */

var validatorjs          = require('validator');
var defaultErrorMessages = require('./default-errors');
var _                    = require('underscore');
var errorMessages        = {};

module.exports = validate;

/**
 * Create a validator object
 * @function validate
 * @param {object} options Options object
 * @param {string} options.validator Validator name to use
 * @param {*} [options.arguments] Arguments to pass to validator. If more than one argument is required an array must be used. Single arguments will internally be coerced into an array
 * @param {boolean} [options.passIfEmpty=false] Weather the validator should pass if the value being validated is empty
 * @param {string} [options.message] Validator error message
 * @param {string} [options.type] Validator error type
 * @returns {object} Returns validator compatible with mongoosejs
 * @throws Will throw error if validator does not exist
 * @example
 * require('mongoose-validator').validate({ validator: 'isLength', arguments: [4, 40], passIfEmpty: true, message: 'Value should be between 4 and 40 characters', type: 'myType' );
 */
function validate (options) {
  var name         = options.validator;
  var args         = options.arguments || [];
  var passIfEmpty  = options.passIfEmpty !== undefined ? options.passIfEmpty : false;
  var message      = options.message || errorMessages[name] || defaultErrorMessages[name] || 'Error';
  var validator    = (name instanceof Function) ? name : validatorjs[name];
  var extend       = _.omit(options, 'passIfEmpty', 'message', 'validator', 'arguments');

  // Coerse args into an array
  args = !Array.isArray(args) ? [args] : args;

  // Interpolate message with argument values
  message = message.replace(/{ARGS\[(\d+)\]}/g, function (replace, argIndex) {
    var val = args[argIndex];
    return val !== undefined ? val : '';
  });

  if (validator) {
    return _.extend({
      validator: function(val, next) {
        var validatorArgs = [val].concat(args);

        if (passIfEmpty && (val === '' || val === null) || val === undefined) {
          return next(true);
        }

        return next(validator.apply(this, validatorArgs));
      },
      isAsync: true,
      message: message
    }, extend);
  }

  throw new Error('Validator `' +  name + '` does not exist on validator.js');
};

/**
 * Extend the mongoose-validator with a custom validator
 * @function extend
 * @param {string} name Validator method name
 * @param {function} fn Validator method function
 * @param {string} [errorMsg] Validator error message
 * @throws Will throw error if a validator of the same method name already exists
 * @example
 * require('mongoose-validator').extend('isString', function (str) { return typeof str === 'string'; });
 */
validate.extend = function (name, fn, errorMsg) {
  if (!validatorjs[name]) {
    validatorjs[name]   = function () { return fn.apply(this, Array.prototype.slice.call(arguments)); };
    errorMessages[name] = errorMsg || 'Error';
  }
  else {
    throw new Error('Validator `' +  name + '` already exists on validator.js');
  }
};

validate.defaultErrorMessages = defaultErrorMessages;

validate.validatorjs = validatorjs;
