Mongoose Validator
==================

Validators for [Mongoose](http://mongoosejs.com) schemas utilising [node-validator](https://github.com/chriso/node-validator).

Mongoose Validator simply returns Mongoose style validation objects that utilise node-validator for the data validation.

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

##Error Messages##

Custom error messages are now back in `0.2.1` and can be set through the options object:

    validate({message: "String should be between 3 and 50 characters"}, 'len', 3, 50)
    
## Pass validation if empty ##

Some of `node-validator` validators require a value to check against (isEmail, isUrl etc). There may be instances where you don't have a value to check i.e. a path that is not required and as such these few validators return an false value causing validation to fail. This can now be bypassed by setting the `passIfEmpty` option:

    var validator = validate({passIfEmpty: true}, 'isUrl');
    
    website: {type: String, validate: validator};
    
## Custom validators ##

As of `0.2.1` custom validators can be added:

    require('mongoose-validator').extend('isBoolean', function () {
	    return 'boolean' === typeof this.str;
    }, 'Not a boolean');

    require('mongoose-validator').extend([method name], [validator], [default error message]);
    
Custom validators are called normally:

    validate({passIfEmpty: true}, 'isBoolean');

Arguments can be passed like so:

    require('mongoose-validator').extend('isType', function (type) {
	    return type === typeof this.str;
    }, 'Not correct type');
    
    validate('isType', 'string');

NOTE: As per `node-validator` documentation, the currently tested value is accessed through `this.str`.
	
##Contributors##

Special thanks to Francesco Pasqua for heavily refactoring the into something far more future proof.
