/**
 * Validators for Mongoose.js utilising node-validate
 *
 */
var Validator    = new require('validator')
  , defaultError = { 
      isEmail: 'Invalid email',
      isUrl: 'Invalid URL',
      isIP: 'Invalid IP',
      isAlpha: 'Invalid characters',
      isAlphanumeric: 'Invalid characters',
      isHexadecimal: 'Invalid hexadecimal',
      isBase64: 'Invalid base64',
      isHexColor: 'Invalid hexcolor',
      isNumeric: 'Invalid number',
      isLowercase: 'Invalid characters',
      isUppercase: 'Invalid characters',
      isInt: 'Invalid integer',
      isFloat: 'Invalid float',
      isDivisibleBy: 'Not divisible',
      isNull: 'String is not empty',
      notEmpty: 'String is empty',
      equals: 'Not equal',
      contains: 'Invalid characters',
      matches: 'Do not match',
      isLength: 'String is not in range',
      isByteLength: 'Invalid byte length',
      isUUID: 'Not a valid UUID',
      require_tld: 'Invalid TLD',
      isDate: 'Not a date',
      isAfter: 'Invalid date',
      isBefore: 'Invalid date',
      isIn: 'Unexpected value or invalid argument',
      isCreditCard: 'Invalid credit card',
      isISBN: 'Not a ISBN',
      isMultibyte: 'Not a Multibyte',
      isAscii: 'Not a ASCII',
      isFullWidth: 'Not contains full-width chars',
      isHalfWidth: 'Not contains half-width chars',
      isVariableWidth: 'Not contains a mixture of full and half-width chars',
      isSurrogatePair: 'Not contains any surrogate pairs chars'
    }
  , customError  = {};

Validator.error = function() {
    return false;
}

Validator.validate = function(options, method) {
    var hasOptions = 'object' === typeof options
      , _method    = hasOptions ? method : options
      , msg        = options.message ? options.message : (customError[_method] || defaultError[_method])
      , passIfEmpty = options.passIfEmpty ? options.passIfEmpty : false
      , args       = Array.prototype.slice.call(arguments, (hasOptions ? 2 : 1));

    if (Validator[_method]) {
        return {
            validator: function(val, next) {
                if (passIfEmpty && (val === '' || val == null)) {
                    return next(true);
                }
                next(Validator.check(val)[_method].apply(Validator, args));
            },
            msg: msg
        }
    }

    throw new Error('Method ' +  _method + ' does not exist on Validators.');
}

Validator.extend = function (name, fn, msg) {
    customError[name] = msg || "Error";
    Object.getPrototypeOf(Validator)[name] = fn;
}

module.exports = Validator;