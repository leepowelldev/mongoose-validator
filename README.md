# Mongoose Validator

[![Build Status](https://travis-ci.org/leepowellcouk/mongoose-validator.svg?branch=master)](https://travis-ci.org/leepowellcouk/mongoose-validator)

Validators for [Mongoose](http://mongoosejs.com) schemas utilising [validator.js](https://github.com/chriso/validator.js).

Mongoose Validator simply returns Mongoose style validation objects that utilises validator.js for the data validation.

Version 1.0.x has been refactored to support a simpler interface and also validator.js 3.0.x

**NOTE**: If you were using 0.2.x with your projects please be aware that upgrading to 1.0.x will break them. As of validator.js 3.0.x - many of the avilable validators have been changed. For example, 'regex' validator no longer exists and has been replaced with 'matches'.

## Installation

```bash
$ npm i mongoose-validator -S
```

### Legacy install

If you need to install the 0.2.2 release, use the following command:

```bash
$ npm i mongoose-validator@0.2.2 -S
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
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
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
Set the error message to be used should the validator fail. If no error message is set then mongoose-validator will attempt to use one of the built-in default messages, if it can't then a simple message of 'Error' will be returned. Enhanced message templating is supported by giving the ability to use the validator arguments. You can use these like `{ARGS[argument index position]}`. Note: Use `{ARGS[0]}` if your arguments isn't an array.

```javascript
validate({
  validator: 'isLength',
  arguments: [3, 50],
  message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
}),

// On error produces: Name should be between 3 and 50 characters
```
The built in Mongoose message template variables still work as expected. You can find out more about those here: [http://mongoosejs.com/docs/api.html#error_messages_MongooseError-messages](http://mongoosejs.com/docs/api.html#error_messages_MongooseError-messages)

### option.type - optional
Set the type of validator type. If this is not defined, Mongoose will set this for you. Read more about this here: [http://mongoosejs.com/docs/api.html#schematype_SchemaType-validate](http://mongoosejs.com/docs/api.html#schematype_SchemaType-validate)

### Extending the error properties (mongoose version >= 3.9.7)

Any additional members added to the options object will be available in the 'err.properties' field of the mongoose validation error.

```javascript
var alphaValidator = validate({
    validator: 'isAlphanumeric',
    passIfEmpty: true,
    message: 'Name should contain alpha-numeric characters only',
    httpStatus: 400
  });
```
In this example the error object returned by mongoose will have its 'properties' extended with httpStatus should validation fail. More details can be found about this here: [http://thecodebarbarian.com/2014/12/19/mongoose-397](http://thecodebarbarian.com/2014/12/19/mongoose-397)

## Async validators

By default Mongoose runs all validators synchronously, if you need to perform asynchronous validation you can do so by returning a [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) from your validator.

```javascript
validate({
  validator: function(val) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(val > 0)
      }, 500)
    });
  },
  message: 'Count must be a positive number.'
})
```

## Custom validators

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

## Contributors

Special thanks to [Francesco Pasqua](https://github.com/cesconix/) for heavily refactoring the code into something far more future proof. Thanks also go to [Igor Escobar](https://github.com/igorescobar/) and [Todd Bluhm](https://github.com/toddbluhm/) for their contributions.

## License (MIT)

Copyright (c) 2015 Lee Powell <lee@leepowell.co.uk>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
