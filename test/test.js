(function(undefined) {

const mongoose             = require('mongoose')
const should               = require('should')
const validate             = require('..')
const extend               = validate.extend
const defaultErrorMessages = validate.defaultErrorMessages
const Schema               = mongoose.Schema

// https://github.com/Automattic/mongoose/issues/4291
// http://mongoosejs.com/docs/promises.html
mongoose.Promise      = Promise


// Create a custom validator using 'extend' method
// ------------------------------------------------------------
extend('isType', function isType(val, type) {
  return type === typeof val
}, 'Not correct type')

extend('notEmpty', function notEmpty(val) {
  return !val.match(/^[\s\t\r\n]*$/)
}, 'Empty')

extend('isArray', function isArray(val) {
  return Array.isArray(val)
}, 'Not an array')

extend('isContextEqlModelInstance', function isContextEqlModelInstance(val) {
  return this._id && this.name === val
}, 'This is not a model instance')

extend('asyncIsTypeValidator', function asyncIsTypeValidator(val, type) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(type === typeof val)
    }, 250)
  })
}, 'Not correct type')

// Tests
// ------------------------------------------------------------
describe('Mongoose Validator:', () => {
  let doc, schema, Person

  before(done => {
    const url          = 'mongodb://127.0.0.1/mongoose_validator_test'
    const date         = Date.now()

    const name         = { type: String, default: null }
    const interests    = { type: Array,  default: []   }
    const age          = { type: Number, default: null }
    const date_created = { type: Date,   default: date }

    mongoose.connect(url)

    schema = new Schema({ name, interests, age, date_created })

    Person = mongoose.model('Person', schema, 'test.people')

    done()
  })

  after(done => {
    mongoose.connection.db.dropDatabase()
    mongoose.disconnect()
    done()
  })

  beforeEach(done => {
    Person.create({}, (err, document) => {
      if (err) return done(err)
      if (!document) return done(new Error('No document found'))
      doc = document
      return done()
    })
  })

  afterEach(done => {
    // Remove the attached validators from tests
    schema.paths.name.validators      = []
    schema.paths.interests.validators = []
    schema.paths.age.validators       = []

    Person.remove({}, err => {
      if (err) return done(err)
      return done()
    })
  })

  describe('Creating mongoose validators -', () => {
    it('Should create a validator', done => {
      const validator = validate(
        {
          validator: 'isLength',
          arguments: [5, 10],
          message:   'Not valid length',
          http:      403
        }
      )

      validator.should.have.property('validator')
      validator.should.have.property('message')
      validator.should.have.property('http')

      validator.message.should.equal('Not valid length')
      validator.message.should.be.type('string')

      validator.validator.should.be.type('function')

      validator.http.should.equal(403)

      return done()
    })

    it('Should throw error if validator option is not defined', done => {
      should.throws(
        function () {
          const validator = validate(
            {
            }
          )
        },
        function (err) {
          return err instanceof Error && err.message === 'validator option undefined'
        }
      )

      return done()
    })

    it('Should throw error if validator option is not valid type', done => {
      should.throws(
        function () {
          const validator = validate(
            {
              validator: [],
            }
          )
        },
        function (err) {
          return err instanceof Error && err.message === 'validator must be of type function or string, received object'
        }
      )

      return done()
    })

    it('Should throw error if validator option does not resolve a validator that exists', done => {
      should.throws(
        function () {
          const validator = validate(
            {
              validator: 'foo',
            }
          )
        },
        function (err) {
          return err instanceof Error && err.message === 'validator `foo` does not exist in validator.js or as a custom validator'
        }
      )

      return done()
    })
  })

  describe('Creating custom validators (extend method) -', () => {
    it ('Should create a custom validator', done => {
      should.doesNotThrow(() => {
        extend('isString', function (val) {
          return typeof val === 'string'
        })
      })
      return done()
    })

    it ('Should throw error if a validator already exists', done => {
      should.throws(
        function () {
          extend('isString', function (val) {
            return typeof val === 'string'
          })
        },
        function (err) {
          return err instanceof Error && err.message === 'validator `isString` already exists'
        }
      )
      return done()
    })

    it ('Should throw error if name not a string', done => {
      should.throws(
        function () {
          extend(['isString2'], function (val) {
            return typeof val === 'string'
          })
        },
        function (err) {
          return err instanceof Error && err.message === 'name must be a string, received object'
        }
      )
      return done()
    })

    it ('Should throw error if name not provided', done => {
      should.throws(
        function () {
          extend(function (val) {
            return typeof val === 'string'
          })
        },
        function (err) {
          return err instanceof Error && err.message === 'name must be a string, received function'
        }
      )
      return done()
    })

    it ('Should throw error if name is empty', done => {
      should.throws(
        function () {
          extend('', function (val) {
            return typeof val === 'string'
          })
        },
        function (err) {
          return err instanceof Error && err.message === 'name is required'
        }
      )
      return done()
    })

    it ('Should throw error if validator is not a function', done => {
      should.throws(
        function () {
          extend('isString', null)
        },
        function (err) {
          return err instanceof Error && err.message === 'validator must be a function, received object'
        }
      )
      return done()
    })

    it ('Should throw error if message is not a string', done => {
      should.throws(
        function () {
          extend('isString', function (val) {
            return typeof val === 'string'
          }, ['message'])
        },
        function (err) {
          return err instanceof Error && err.message === 'message must be a string, received object'
        }
      )
      return done()
    })
  })

  describe('General validation -', () => {
    it('Should pass a validator', done => {
      const validator = validate(
        {
          validator: 'isLength',
          arguments: [5, 10]
        }
      )

      schema.path('name').validate(validator)

      should.exist(doc)

      doc.name = "Jonathan"

      doc.save((err, person) => {
        should.not.exist(err)
        should.exist(person)
        person.should.have.property('name', 'Jonathan')
        return done()
      })
    })

    it('Should fail a validator', done => {
      const validator = validate(
        {
          validator: 'isLength',
          arguments: [5, 10]
        }
      )

      schema.path('name').validate(validator)

      should.exist(doc)

      doc.name = "Joe"

      doc.save((err, person) => {
        should.exist(err)
        should.not.exist(person)
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError')
        err.errors.name.should.have.property('path', 'name')
        return done()
      })
    })
  })

  describe('passIfEmpty validation -', () => {
    it('Should pass a passIfEmpty validator', done => {
      const validator = validate(
        {
          validator: 'isLength',
          arguments: [5, 10],
          passIfEmpty: true
        }
      )

      schema.path('name').validate(validator)

      should.exist(doc)

      doc.name = undefined

      doc.save((err, person) => {
        should.not.exist(err)
        should.exist(person)
        return done()
      })
    })

    it('Should fail a passIfEmpty validator', done => {
      const validator = validate(
        {
          validator: 'isLength',
          arguments: [5, 10],
          passIfEmpty: true
        }
      )

      schema.path('name').validate(validator)

      should.exist(doc)

      doc.name = 'Joe'

      doc.save((err, person) => {
        should.exist(err)
        should.not.exist(person)
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError')
        err.errors.name.should.have.property('path', 'name')
        return done()
      })
    })
  })

  describe('Error messages -', () => {
    it('Should use default message', done => {
      const validator = validate(
        {
          validator: 'isLength',
          arguments: [5, 10]
        }
      )

      schema.path('name').validate(validator)

      should.exist(doc)

      doc.name = 'Joe'

      doc.save((err, person) => {
        should.exist(err)
        should.not.exist(person)
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError')
        err.errors.name.should.have.property('path', 'name')
        err.errors.name.message.should.equal(validate.defaultErrorMessages.isLength)
        return done()
      })
    })

    it('Should use custom message', done => {
      const validator = validate(
        {
          validator: 'isLength',
          arguments: [5, 10],
          message: 'Custom error message'
        }
      )

      schema.path('name').validate(validator)

      should.exist(doc)

      doc.name = 'Joe'

      doc.save((err, person) => {
        should.exist(err)
        should.not.exist(person)
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError')
        err.errors.name.should.have.property('path', 'name')
        err.errors.name.message.should.equal('Custom error message')
        return done()
      })
    })

    it('Should use default `Error` message when nothing else exists', done => {
      const validator = validate(
        {
          validator: function () {
            return false
          }
        }
      )

      schema.path('name').validate(validator)

      should.exist(doc)

      doc.name = 'Joe'

      doc.save((err, person) => {
        should.exist(err)
        should.not.exist(person)
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError')
        err.errors.name.should.have.property('path', 'name')
        err.errors.name.message.should.equal('Error')
        return done()
      })
    })

    it('Should replace properties on error message', done => {
      const validator = validate(
        {
          validator: 'isLength',
          arguments: [5, 10],
          http: 403,
          message: 'Error {HTTP}: Something bad happened'
        }
      )

      schema.path('name').validate(validator)

      should.exist(doc)

      doc.name = 'Joe'

      doc.save((err, person) => {
        should.exist(err)
        should.not.exist(person)
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError')
        err.errors.name.should.have.property('path', 'name')
        err.errors.name.message.should.equal('Error 403: Something bad happened')
        return done()
      })
    })

    it('Should replace args on error message', done => {
      const validator = validate(
        {
          validator: 'isLength',
          arguments: [5, 10],
          message:   'At least {ARGS[0]} and less than {ARGS[1]}'
        }
      )

      schema.path('name').validate(validator)

      should.exist(doc)

      doc.name = 'Joe'

      doc.save((err, person) => {
        should.exist(err)
        should.not.exist(person)
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError')
        err.errors.name.should.have.property('path', 'name')
        err.errors.name.message.should.equal('At least 5 and less than 10')
        return done()
      })
    })
  })

  describe('Properties -', () => {
    // Support a custom property being added to the error object, only documentation I can find is from:
    // http://thecodebarbarian.com/2014/12/19/mongoose-397
    // In this case, `http` is a custom property and is passed across to the resulting error object
    it('Should support a custom property', done => {
      const validator = validate(
        {
          validator: 'isLength',
          arguments: [5, 10],
          http: 403
        }
      )

      schema.path('name').validate(validator)

      should.exist(doc)

      doc.name = 'Joe'

      doc.save((err, person) => {
        should.exist(err)
        should.not.exist(person)
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError')
        err.errors.name.should.have.property('properties')
        err.errors.name.should.have.propertyByPath('properties', 'http').eql(403)
        return done()
      })
    })
  })

  describe('Custom validators -', () => {
    it('Should use a custom validator and pass', done => {
      const validator = validate(
        {
          validator: 'isType',
          arguments: 'string'
        }
      )

      schema.path('name').validate(validator)

      should.exist(doc)

      doc.name = 'Joe'

      doc.save((err, person) => {
        should.not.exist(err)
        should.exist(person)
        return done()
      })
    })

    it('Should use a custom validator and fail', done => {
      const validator = validate(
        {
          validator: 'isType',
          arguments: 'boolean'
        }
      )

      schema.path('name').validate(validator)

      should.exist(doc)

      doc.name = 'Joe'

      doc.save((err, person) => {
        should.exist(err)
        should.not.exist(person)
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError')
        err.errors.name.should.have.property('path', 'name')
        err.errors.name.message.should.equal('Not correct type')
        return done()
      })
    })

    it('Should use a custom validator and fail with custom error message', done => {
      const validator = validate(
        {
          validator: 'isType',
          arguments: 'boolean',
          message: 'Custom error message'
        }
      )

      schema.path('name').validate(validator)

      should.exist(doc)

      doc.name = 'Joe'

      doc.save((err, person) => {
        should.exist(err)
        should.not.exist(person)
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError')
        err.errors.name.should.have.property('path', 'name')
        err.errors.name.message.should.equal('Custom error message')
        return done()
      })
    })

    it('Should use a custom async validator and pass', done => {
      const validator = validate(
        {
          validator: 'asyncIsTypeValidator',
          arguments: 'string'
        }
      )

      schema.path('name').validate(validator)

      should.exist(doc)

      doc.name = 'Joe'

      doc.save((err, person) => {
        should.not.exist(err)
        should.exist(person)
        return done()
      })
    })

    it('Should use a custom async validator and fail', done => {
      const validator = validate(
        {
          validator: 'asyncIsTypeValidator',
          arguments: 'boolean'
        }
      )

      schema.path('name').validate(validator)

      should.exist(doc)

      doc.name = 'Joe'

      doc.save((err, person) => {
        should.exist(err)
        should.not.exist(person)
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError')
        err.errors.name.should.have.property('path', 'name')
        err.errors.name.message.should.equal('Not correct type')
        return done()
      })
    })
  })

  describe('Passing functions directly -', () => {
    it('Should pass custom validator when a function is passed directly', done => {
      const validator = validate(
        {
          validator: function (val) {
              return val > 18
          },
          message: 'Age must be greater than 18'
        }
      )

      schema.path('age').validate(validator)

      should.exist(doc)

      doc.age = 20

      doc.save((err, person) => {
        should.not.exist(err)
        should.exist(person)
        person.should.have.property('age').and.match(20)
        return done()
      })
    })

    it('Should fail custom validator when a function is passed directly', done => {
      const validator = validate(
        {
          validator: function(val) {
              return val > 18
          },
          message: 'Age must be greater than 18'
        }
      )

      schema.path('age').validate(validator)

      should.exist(doc)

      doc.age = 10

      doc.save((err, person) => {
          should.exist(err)
          should.not.exist(person)
          err.should.be.instanceof(Error).and.have.property('name', 'ValidationError')
          err.errors.age.should.have.property('path', 'age')
          err.errors.age.message.should.equal('Age must be greater than 18')
          return done()
      })
    })
  })

  describe('Update validators -', () => {
    it('Should pass validation on a mongoose update', done => {
      const validator = validate(
        {
          validator: function(val) {
              return val > 18
          },
          message: 'Age must be greater than 18'
        }
      )

      const opts = { runValidators: true }

      schema.path('age').validate(validator)

      should.exist(doc)

      doc.age = 19

      doc.save((err, person) => {
        should.not.exist(err)
        should.exist(person)

        Person.update({}, { age: 20 }, opts, (err, person) => {
          should.not.exist(err)
          done()
        })
      })
    })

    it('Should fail validation on a mongoose update', done => {
      const validator = validate(
        {
          validator: function(val) {
              return val > 18
          },
          message: 'Age must be greater than 18'
        }
      )

      const opts = { runValidators: true }

      schema.path('age').validate(validator)

      should.exist(doc)

      doc.age = 19

      doc.save((err, person) => {
        should.not.exist(err)
        should.exist(person)

        Person.update({}, { age: 17 }, opts, (err, person) => {
          should.exist(err)
          err.errors.should.have.property('age')
          err.errors.age.should.have.property('message', 'Age must be greater than 18')
          done()
        })
      })
    })

    it('Should fail validation on a mongoose update', done => {
      const validator = validate(
        {
          validator: function(val) {
              return val > 18
          },
          message: 'Age must be greater than 18'
        }
      )

      const opts = { runValidators: true }

      schema.path('age').validate(validator)

      should.exist(doc)

      doc.age = 19

      doc.save((err, person) => {
        should.not.exist(err)
        should.exist(person)

        Person.update({}, { age: 17 }, opts, (err, person) => {
          should.exist(err)
          err.errors.should.have.property('age')
          err.errors.age.should.have.property('message', 'Age must be greater than 18')
          done()
        })
      })
    })
  })

  describe('Miscellaneous -', () => {
    // https://github.com/leepowellcouk/mongoose-validator/issues/7#issuecomment-20494299
    it('Should pass on legacy isEmail method', done => {
      const validator = validate(
        {
          validator: 'isEmail'
        }
      )

      schema.path('name').validate(validator)

      should.exist(doc)

      doc.name = 'username+suffix@googlemail.com'

      doc.save((err, person) => {
        should.not.exist(err)
        should.exist(person)
        return done()
      })
    })

    it('Should pass custom validator using non-string value', done => {
      const validator = validate(
        {
          validator: 'isArray'
        }
      )

      schema.path('interests').validate(validator)

      should.exist(doc)

      doc.interests = ['cycling', 'fishing']

      doc.save((err, person) => {
        should.not.exist(err)
        should.exist(person)
        person.should.have.property('interests').and.match(['cycling', 'fishing'])
        return done()
      })
    })

    it('Issue #12', done => {
      const validator1 = validate(
        {
          validator: 'notEmpty',
          message: 'Username should not be empty'
        }
      )

      const validator2 = validate(
        {
          validator: 'isLength',
          arguments: [4, 40],
          message: 'Username should be between 4 and 40 characters'
        }
      )

      const validator3 = validate(
        {
          validator: 'isAlphanumeric',
          message: 'Username must only contain letters and digits'
        }
      )

      schema.path('name').validate(validator1).validate(validator2).validate(validator3)

      should.exist(doc)

      doc.name = ''

      doc.save((err, person) => {
        should.exist(err)
        should.not.exist(person)
        err.errors.name.message.should.equal('Username should not be empty')
        return done()
      })
    })

    it('Custom validator calls with this = model instance', done => {
      const validator = validate(
        {
          validator: 'isContextEqlModelInstance'
        }
      )

      schema.path('name').validate(validator)

      should.exist(doc)

      doc.name = 'Joe'

      doc.save((err, person) => {
        should.not.exist(err)
        should.exist(person)
        return done()
      })
    })
  })
})

})()
