/**
 * Validators for Mongoose.js utilising validator.js
 * @module mongoose-validator
 * @author Lee Powell lee@leepowell.co.uk
 * @copyright MIT
 */

const validatorjs = require('validator')
const is = require('is')
const defaultErrorMessages = require('./default-error-messages.json')
const customValidators = {}
const customErrorMessages = {}

const omit = function omit(obj, ...keys) {
  return Object.keys(obj)
    .filter(key => !keys.includes(key))
    .reduce((acc, val) => {
      acc[val] = obj[val]
      return acc
    }, {})
}

const getValidatorFn = function getValidatorFn(validator) {
  // Validator has been passed as a function so just return it
  if (is.function(validator)) {
    return validator
  }
  // Validator has been passed as a string (i.e. 'isLength'), try to find the validator is validator.js or custom validators
  if (is.string(validator) && !is.empty(validator)) {
    return validatorjs[validator] || customValidators[validator] || undefined
  }
}

const toArray = (val = []) => (is.array(val) ? val : Array.of(val))

const findFirstString = (...vals) => vals.filter(is.string).shift()

const interpolateMessageWithArgs = (message = '', args = []) =>
  message.replace(/{ARGS\[(\d+)\]}/g, (match, submatch) => args[submatch] || '')

const createValidator = function createValidator(fn, args, passIfEmpty) {
  return function validator(val) {
    const validatorArgs = [val].concat(args)
    if ((passIfEmpty && (is.empty(val) || is.nil(val))) || is.undef(val)) {
      return true
    }
    return fn.apply(this, validatorArgs)
  }
}

/**
 * Create a validator object
 *
 * @alias module:mongoose-validator
 *
 * @param {object} options Options object
 * @param {string} options.validator Validator name to use
 * @param {*} [options.arguments=[]] Arguments to pass to validator. If more than one argument is required an array must be used. Single arguments will internally be coerced into an array
 * @param {boolean} [options.passIfEmpty=false] Weather the validator should pass if the value being validated is empty
 * @param {string} [options.message=Error] Validator error message
 *
 * @return {object} Returns validator compatible with mongoosejs
 *
 * @throws If validator option property is not defined
 * @throws If validator option is not a function or string
 * @throws If validator option is a validator method (string) and method does not exist in validate.js or as a custom validator
 *
 * @example
 * require('mongoose-validator').validate({ validator: 'isLength', arguments: [4, 40], passIfEmpty: true, message: 'Value should be between 4 and 40 characters' )
 */
const validate = function validate(options) {
  if (is.undef(options.validator)) {
    throw new Error('validator option undefined')
  }

  if (!is.function(options.validator) && !is.string(options.validator)) {
    throw new Error(
      `validator must be of type function or string, received ${typeof options.validator}`
    )
  }

  const validatorName = is.string(options.validator) ? options.validator : ''
  const validatorFn = getValidatorFn(options.validator)

  if (is.undef(validatorFn)) {
    throw new Error(
      `validator \`${validatorName}\` does not exist in validator.js or as a custom validator`
    )
  }

  const passIfEmpty = !!options.passIfEmpty
  const mongooseOpts = omit(
    options,
    'passIfEmpty',
    'message',
    'validator',
    'arguments'
  )
  const args = toArray(options.arguments)
  const messageStr = findFirstString(
    options.message,
    customErrorMessages[validatorName],
    defaultErrorMessages[validatorName],
    'Error'
  )
  const message = interpolateMessageWithArgs(messageStr, args)
  const validator = createValidator(validatorFn, args, passIfEmpty)

  return Object.assign(
    {
      validator,
      message,
    },
    mongooseOpts
  )
}

/**
 * Extend the mongoose-validator with a custom validator
 *
 * @param {string} name Validator method name
 * @param {function} fn Validator method function
 * @param {string} [msg=Error] Validator error message
 *
 * @return {undefined}
 *
 * @throws If name is not a string
 * @throws If validator is not a function
 * @throws If message is not a string
 * @throws If name is empty i.e ''
 * @throws If a validator of the same method name already exists
 *
 * @example
 * require('mongoose-validator').extend('isString', function (str) { return typeof str === 'string' }, 'Not a string')
 */
validate.extend = function extend(name, fn, msg = 'Error') {
  if (typeof name !== 'string') {
    throw new Error(`name must be a string, received ${typeof name}`)
  }

  if (typeof fn !== 'function') {
    throw new Error(`validator must be a function, received ${typeof fn}`)
  }

  if (typeof msg !== 'string') {
    throw new Error(`message must be a string, received ${typeof msg}`)
  }

  if (name === '') {
    throw new Error('name is required')
  }

  if (customValidators[name]) {
    throw new Error(`validator \`${name}\` already exists`)
  }

  customValidators[name] = function(...args) {
    return fn.apply(this, args)
  }
  customErrorMessages[name] = msg
}

/**
 * Default error messages
 */
validate.defaultErrorMessages = defaultErrorMessages

module.exports = validate
