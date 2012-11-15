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

Custom error messages have been removed from 0.2.0 and as such Mongoose Validator makes sole use of the error messages provided by node-validator.
	
##Contributors##

Special thanks to Francesco Pasqua for heavily refactoring the into something far more future proof.
