/**
 * Validators for Mongoose.js utilising node-validate
 */
var validator = require('validator');
var Validator = new validator.Validator();

Validator.error = function() {
	return false;
};

Validator.validate = function(method) {
	var args = [].slice.call(arguments, 1);

	if (validator.validators[method]) {
		return {
			validator : function(value, next) {
				next( Validator.check(value)[method].apply(Validator, args) );
			},
			msg : validator.defaultError[method]
		}
	}

	throw new Error('Method ' +  method + ' does not exist on Validators.');
};

module.exports = Validator;
