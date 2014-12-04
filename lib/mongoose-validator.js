/**
 * Validators for Mongoose.js utilising validator.js
 * @module mongoose-validator
 * @author Lee Powell lee@leepowell.co.uk
 * @copyright MIT
 */

var validatorjs          = require('validator');
var defaultErrorMessages = require('./default-errors');
var errorMessages        = {};

validatorjs.extendCustom = function (name, fn) {
  validatorjs[name] = function () {
    var args = Array.prototype.slice.call(arguments);
    return fn.apply(validatorjs, args);
  };
};

/**
 * Create a validator object
 * @function validate
 * @param {object} options Options object
 * @param {string} options.validator Validator name to use
 * @param {*} [options.arguments] Arguments to pass to validator. If more than one argument is required an array must be used. Single arguments will internally be coerced into an array
 * @param {boolean} [options.passIfEmpty=false] Weather the validator should pass if the value being validated is empty
 * @param {string} [options.message] Validator error message
 * @returns {object} Returns validator compatible with mongoosejs
 * @throws Will throw error if validator does not exist
 * @example
 * require('mongoose-validator').validate({ validator: 'isLength', arguments: [4, 40], passIfEmpty: true, message: 'Value should be between 4 and 40 characters' );
 */
var validate = function(options) {
  var name         = options.validator;
  var args         = options.arguments || [];
  var passIfEmpty  = options.passIfEmpty !== undefined ? options.passIfEmpty : false;
  var message      = options.message || errorMessages[name] || defaultErrorMessages[name] || 'Error';
  var validator    = (name instanceof Function) ? name : validatorjs[name];

  args = !Array.isArray(args) ? [args] : args;

  if (validator) {
    return {
      validator: function(val, next) {
        var validatorArgs = [val].concat(args);

        if (passIfEmpty && (val === '' || val === null) || val === undefined) {
          return next(true);
        }

        return next(validator.apply(null, validatorArgs));
      },
      msg: message
    };
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
var extend = function (name, fn, errorMsg) {
  if (validatorjs[name] === undefined) {
    errorMessages[name] = errorMsg || 'Error';
    validatorjs.extendCustom(name, fn);
  }
  else {
    throw new Error('Validator `' +  name + '` already exists on validator.js');
  }
};

module.exports = validate;
module.exports.extend = extend;
module.exports.defaultErrorMessages = defaultErrorMessages;
module.exports.validatorjs = validatorjs;
