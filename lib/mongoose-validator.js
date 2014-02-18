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
      , keepOriginalValue = options.keepOriginalValue ? true: false
      , args       = Array.prototype.slice.call(arguments, (hasOptions ? 2 : 1));

    if (Validator[_method]) {
        return {
            validator: function(val, next) {
                if (passIfEmpty && (val === '' || val == null)) {
                    return next(true);
                }
                if (keepOriginalValue) {
                    return next(Validator.checkWithOptions(val, {keepOriginalValue:true})[_method].apply(Validator, args));
                }
                return next(Validator.check(val)[_method].apply(Validator, args));
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

Validator.checkWithOptions = function(str, options) {
    options || (options = {})
    if (options.keepOriginalValue)
        this.str = str;
    else
        this.str = typeof( str ) === 'undefined' || str === null || (isNaN(str) && str.length === undefined) ? '' : str+'';

    this.msg = options.fail_msg;
    this._errors = this._errors || [];
    return this;
}

module.exports = Validator;
