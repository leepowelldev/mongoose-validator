Mongoose Validator
==================

Validators for [mongoose](http://mongoosejs.com) schemas utilising [node-validator](https://github.com/chriso/node-validator).

Mongoose Validator simply returns Mongoose style validation objects that utilise node-validator for the data validation.

##Installation##

	npm install mongoose-validator

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

##Callback##
If you wish to enable a callback when a validator fails, simply do:

	var mongoose = require('mongoose'),
		validator = require('mongoose-validator');
	
	validator.callback = function(err){
		// do something with the error
	};
	
	...

This is a generic callback that gets fired with any validation failure, currently there is no support for individual callbacks per validation type.


##Verbose Mode##

By default there is no verbose logging of errors thrown by node-validator, to enable this simply do:

	var mongoose = require('mongoose'),
		validator = require('mongoose-validator');
	
	validator.verbose = true;
	
	...