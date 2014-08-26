# Mongoose Validator

[![Build Status](https://travis-ci.org/leepowellcouk/mongoose-validator.svg?branch=master)](https://travis-ci.org/leepowellcouk/mongoose-validator)

Validators for [Mongoose](http://mongoosejs.com) schemas utilising [validator.js](https://github.com/chriso/validator.js).

Mongoose Validator simply returns Mongoose style validation objects that utilises validator.js for the data validation.

Version 1.0.x has been refactored to support a simpler interface and also validator.js 3.0.x

**NOTE**: If you were using 0.2.x with your projects please be aware that upgrading to 1.0.x will break them. As of validator.js 3.0.x - many of the avilable validators have been changed. For example, 'regex' validator no longer exists and has been replaced with 'matches'.

## Installation

```bash
$ npm install mongoose-validator --save
```

### Legacy install

If you need to install the 0.2.2 release, use the following command:

```bash
$ npm install mongoose-validation@0.2.2 --save
```

More details on 0.2.2 can be found [here](https://github.com/leepowellcouk/mongoose-validator/blob/0.2.2/README.md)

## Usage

```javascript
var mongoose = require('mongoose');
var validate = require('mongoose-validator');

var nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Name should be between 3 and 50 characters'
  }),
  validate({
    validator: 'isAlphanumeric',
    passIfEmpty: true,
    message: 'Name should contain alpha-numeric characters only'
  })
];

var Schema = new mongoose.Schema({
  name: {type: String, required: true, validate: nameValidator}
});
```

Error objects are returned as normal via Mongoose.

## Options

### option.validator {string} or {function} - required
Name of the validator or a custom function you wish to use, this can be any one of the [built-in validator.js validators](https://github.com/chriso/validator.js/#validators), or a [custom validator](#custom-validators).

### option.arguments - optional
Arguments to be passed to the validator. These can either be an array of arguments (for validators that can accept more than one i.e. `isLength`), or a single argument as any type.

### option.passIfEmpty {boolean} - optional - default: false
Some of the validator.js validators require a value to check against (isEmail, isUrl etc). There may be instances where you don't have a value to check i.e. a path that is not required and as such these few validators return an false value causing validation to fail. This can now be bypassed by setting the `passIfEmpty` option.

### option.message - optional
Set the error message to be used should the validator fail. If no error message is set then mongoose-validator will attempt to use one of the built-in default messages, if it can't then a simple message of 'Error' will be returned.

## Regular Expressions

Mongoose Validator can use the validator.js `matches` method, however, it's worth noting that the regex can be passed in 2 ways - as per the validator.js documentation, firstly they can be passed as a literal:

```javascript
validate({
  validator: 'matches',
  arguments: /^[a-zA-Z\-]+$/i
});
```

or as a string with a further argument containing any required modifiers:

```javascript
validate({
  validator: 'matches',
  arguments: ['^[a-zA-Z\-]+$', 'i']
});
```

## <a name="custom-validators"></a>Custom validators

Custom validators can also be added - these are then added to the validator.js object.
**NOTE**: Validator.js converts all values to strings internally for built-in validators - however custom validators do *not* do this. This allows you to create custom validators for checking all types such as arrays and objects.

```javascript
// extend([method name], [validator], [default error message])

var extend = require('mongoose-validator').extend;

extend('isString', function (val) {
  return Object.prototype.toString.call(val) === '[object String]';
}, 'Not a string');
```

Custom validators are called normally:

```javascript
validate({
  validator: 'isString'
});
```

Custom validator can be passed directly as a function:

```javascript
validate({
  validator: function(val) {
    return val > 0;
  },
  message: 'Count must be a positive number.'
})
```

NOTE: As per validator.js documentation, the currently tested value is accessed through the first argument that is automatically passed to the validator function.

## Contributors

Special thanks to [Francesco Pasqua](https://github.com/cesconix/) for heavily refactoring the code into something far more future proof. Thanks also go to [Igor Escobar](https://github.com/igorescobar/) and [Todd Bluhm](https://github.com/toddbluhm/) for their contributions.
