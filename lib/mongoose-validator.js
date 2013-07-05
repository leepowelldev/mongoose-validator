/**
 * Validators for Mongoose.js utilising node-validate
 *
 */
var validator    = require('validator')
  , defaultError = validator.defaultError
  , Validator    = new validator.Validator()
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