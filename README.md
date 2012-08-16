Mongoose Validator
==================

Validators for [Mongoose](http://mongoosejs.com) schemas utilising [node-validator](https://github.com/chriso/node-validator).

Mongoose Validator simply returns Mongoose style validation objects that utilise node-validator for the data validation.

##Installation##

	npm install mongoose-validator

##Usage##

	var mongoose = require('mongoose'),
		mongooseValidator = require('mongoose-validator'),
		validator = mongooseValidator.validator;
	
	var nameValidator = [validator.len(3, 50), validator.isAlphanumeric()];
	
	var Schema = new mongoose.Schema({
		name: {type: String, required: true, validate: nameValidator}
	});

Error objects are returned as normal via Mongoose.

##Error Messages##

By default error messages are used from node-validator, however you can use your own by passing them into the validation method.

	validator.len(3, 50, 'Name should be between 3 and 50 characters in length')

Alternatively you can overwrite any of the defaultError messages from node-validator for use in all calls to a particaular method.
	
	var mongoose = require('mongoose'),
		mongooseValidator = require('mongoose-validator'),
		validator = mongooseValidator.validator;
	
	// batch
		
	mongooseValidator.setDefaultErrorMessage({
		len: 'A new error message that will be used for all len calls',
		isRegex: 'A new error message that will be used for all isRegex calls'
	});
	
	// single
	
	mongooseValidator.setDefaultErrorMessage('len', 'A new error message that will be used for all len calls');