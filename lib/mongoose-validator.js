/**
 * Validators for Mongoose.js utilising node-validate
 *
 */
var validator = require('validator'),
    defaultError = validator.defaultError,
    Validator = new validator.Validator();

Validator.error = function() {
    return false;
};

Validator.validate = function(method) {
    var args = Array.prototype.slice.call(arguments, 1),
        msg = defaultError[method];

    if (validator.validators[method]) {
        return {
            validator: function(val, next) {				
				next( Validator.check(val)[method].apply(Validator, args) );
            },
            msg: msg
        }
    }

    throw new Error('Method ' +  method + ' does not exist on Validators.');
};

module.exports = Validator;