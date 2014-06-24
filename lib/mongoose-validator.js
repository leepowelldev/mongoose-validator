/**
 * Validators for Mongoose.js utilising node-validate
 *
 */

var validator           = require('validator');
var mongooseValidator   = {};
var errorMessages       = {};
var defaultErrorMessage = 'Error';

mongooseValidator.validate = function(options, methodName) {
    var hasOptions  = 'object' === typeof options,
        method      = hasOptions ? methodName : options,
        msg         = options.message ? options.message : (errorMessages[method] || defaultErrorMessage),
        passIfEmpty = options.passIfEmpty ? options.passIfEmpty : false,
        args        = Array.prototype.slice.call(arguments, (hasOptions ? 2 : 1));

    if (validator[method]) {
        return {
            validator: function(val, next) {
                if (passIfEmpty && (val === '' || val == null)) {
                    return next(true);
                }
                return next(validator[method].apply(null, [val].concat(args)));
            },
            msg: msg
        };
    }

    throw new Error('Method ' +  method + ' does not exist on validator.');
};

mongooseValidator.extend = function (methodName, fn, msg) {
    if (validator[methodName] === undefined) {
      errorMessages[methodName] = msg || "Error";
      return validator.extend(methodName, fn);
    }

    throw new Error('The method ' +  method + ' already exists on validator.');
};

module.exports = mongooseValidator;
