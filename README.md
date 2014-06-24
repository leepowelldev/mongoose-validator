Mongoose Validator
==================

Validators for [Mongoose](http://mongoosejs.com) schemas utilising [validator.js](https://github.com/chriso/validator.js).

Mongoose Validator simply returns Mongoose style validation objects that utilises validator.js for the data validation.

NOTE: As of validator.js 3.0.0 - many of the avilable validators have been changed. For example, 'regex' validator no longer exists and has been replaced with 'matches'.

##Installation##

	npm install mongoose-validator

##Usage##

	var mongoose = require('mongoose'),
		validate = require('mongoose-validator').validate;

	// validate([method], [arg1], [arg2] ... );

	var nameValidator = [validate('len', 3, 50), validate('isAlphanumeric')];

	var Schema = new mongoose.Schema({
		name: {type: String, required: true, validate: nameValidator}
	});

Error objects are returned as normal via Mongoose.

##Regular Expressions##

Mongoose Validator can use the validator.js `matches` method, however, it's worth noting that the regex can be passed in 2 ways - as per the validator.js documentation, firstly they can be passed as a literal:

    validate('matches', /^[a-zA-Z\-]+$/i);

or as a string with a further argument containing any required modifiers:

    validate('matches', '^[a-zA-Z\-]+$', 'i');

##Error Messages##

Custom error messages are now back in `0.2.1` and can be set through the options object:

    validate({message: "String should be between 3 and 50 characters"}, 'len', 3, 50)

## Pass validation if empty ##

Some of the validator.js validators require a value to check against (isEmail, isUrl etc). There may be instances where you don't have a value to check i.e. a path that is not required and as such these few validators return an false value causing validation to fail. This can now be bypassed by setting the `passIfEmpty` option:

    var validator = validate({passIfEmpty: true}, 'isUrl');

    website: {type: String, validate: validator};

## Custom validators ##

Custom validators can also be added:

    // extend([method name], [validator], [default error message])

    require('mongoose-validator').extend('isString', function (str) {
	    return 'string' === typeof str;
    }, 'Not a string');

Custom validators are called normally:

    validate({passIfEmpty: true}, 'isType', 'string');

NOTE: As per validator.js documentation, the currently tested value is accessed through the first argument that is automatically passed.

##Contributors##

Special thanks to Francesco Pasqua for heavily refactoring the code into something far more future proof.
