/**
 * Validators for Mongoose.js utilising node-validate
 */
var validator = require('validator');
var Validator = new validator.Validator();

Validator.error = function() {
	return false;
};

Validator.validate = function(method) {
	var args = arguments;

	if (validator.validators[method]) {
		return {
			validator : function(value, next) {
				next( Validator.check(value)[method].apply(Validator, Array.prototype.slice.call(args, 1)) );
			},
			msg : validator.defaultError[method]
		}
	}

	throw new Error('Method ' +  method + ' does not exist on Validators.');
};

module.exports = Validator;
