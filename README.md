Mongoose Validator
==================

Validators for [mongoose](http://mongoosejs.com) schemas utilising [node-validator](https://github.com/chriso/node-validator).

Mongoose Validator simply returns Mongoose style validation objects that utilise node-validator for the data validation.

##Usage##

	var mongoose = require('mongoose'),
		validator = require('mongoose-validator');
	
	var nameValidator = [validator.len(3, 50), validator.isAlphanumeric()];
	
	var Schema = new mongoose.Schema({
		name: {type: String, required: true, validate: nameValidator}
	});

Error objects are returned as normal via Mongoose.

##Error Messages##

By default error messages are used from node-validator, however you can use your own by passing them into the validation method.

	validator.len(3, 50, 'Name should be between 3 and 50 characters in length')