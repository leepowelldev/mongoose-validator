(function(undefined) {

'use strict';

var mongoose    = require('mongoose'),
    should      = require('should'),
    validate    = require('../lib/mongoose-validator'),
    extend      = require('../lib/mongoose-validator').extend,
    validatorjs = require('../lib/mongoose-validator').validatorjs,
    Schema      = mongoose.Schema;

// Create a custom validator directly to Node Validator prototype
// ------------------------------------------------------------
validatorjs.extend('contains', function (str, needle) {
  return -1 !== str.indexOf(needle);
});

// Create a custom validator using 'extend' method
// ------------------------------------------------------------
extend('isType', function(str, type) {
  return type === typeof str;
}, 'Not correct type');

extend('notEmpty', function(str) {
  return !str.match(/^[\s\t\r\n]*$/);
}, 'Empty');

extend('isArray', function(val) {
  return Array.isArray(val);
}, 'Not an array');

extend('isContextEqlModelInstance', function(val) {
  return this._id && this.name === val;
}, 'this is not a model instance');

// Tests
// ------------------------------------------------------------
describe('Mongoose Validator:', function() {
  var doc, schema, Person;

  before(function(done) {
    var url  = 'mongodb://127.0.0.1/mongoose_validator_test',
        date = Date.now();

    mongoose.connect(url);

    schema = new Schema({
      name: { type: String, default: null },
      interests: { type: Array, default: [] },
      age: { type: Number, default: null },
      date_created: { type: Date, default: date }
    });

    Person = mongoose.model('Person', schema, 'test.people');

    done();
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase();
    mongoose.disconnect();
    done();
  });

  beforeEach(function(done) {
    Person.create({}, function(err, d) {
      if (err) return done(err);
      if (! d) return done(new Error('No document found'));
      doc = d;
      return done();
    });
  });

  afterEach(function(done) {
    // Remove the attached validators from tests
    schema.paths.name.validators = [];
    schema.paths.interests.validators = [];
    schema.paths.age.validators = [];

    Person.remove({}, function(err) {
      if (err) return done(err);
      return done();
    });
  });

  describe('General Validation -', function() {
    it('Should pass a validator', function(done) {
      schema.path('name').validate(validate({ validator: 'isLength', arguments: [5, 10] }));

      should.exist(doc);

      doc.name = "Jonathan";

      doc.save(function(err, person) {
        should.not.exist(err);
        should.exist(person);
        person.should.have.property('name', 'Jonathan');
        return done();
      });
    });

    it('Should fail a validator', function(done) {
      schema.path('name').validate(validate({ validator: 'isLength', arguments: [5, 10] }));

      should.exist(doc);

      doc.name = "Joe";

      doc.save(function(err, person) {
        should.exist(err);
        should.not.exist(person);
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError');
        err.errors.name.should.have.property('path', 'name');
        return done();
      });
    });
  });

  describe('passIfEmpty Validation -', function() {
    it('Should pass a passIfEmpty validator', function(done) {
      schema.path('name').validate(validate({ validator: 'isLength', arguments: [5, 10], passIfEmpty: true }));

      should.exist(doc);

      doc.name = undefined;

      doc.save(function(err, person) {
        should.not.exist(err);
        should.exist(person);
        return done();
      });
    });

    it('Should fail a passIfEmpty validator', function(done) {
      schema.path('name').validate(validate({ validator: 'isLength', arguments: [5, 10], passIfEmpty: true }));

      should.exist(doc);

      doc.name = 'Joe';

      doc.save(function(err, person) {
        should.exist(err);
        should.not.exist(person);
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError');
        err.errors.name.should.have.property('path', 'name');
        return done();
      });
    });
  });

  describe('Custom Error Messages -', function() {
    it('Should use custom error message', function(done) {
      schema.path('name').validate(validate({ validator: 'isLength', arguments: [5, 10], message: 'Custom error message' }));

      should.exist(doc);

      doc.name = 'Joe';

      doc.save(function(err, person) {
        should.exist(err);
        should.not.exist(person);
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError');
        err.errors.name.should.have.property('path', 'name');
        err.errors.name.message.should.equal('Custom error message');
        return done();
      });
    });

    it('Should replace custom properties on error message', function (done) {
      schema.path('name').validate(validate({ validator: 'isLength', arguments: [5, 10], http: 403, message: 'Error {HTTP}: Something bad happened' }));

      should.exist(doc);

      doc.name = 'Joe';

      doc.save(function(err, person) {
        should.exist(err);
        should.not.exist(person);
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError');
        err.errors.name.should.have.property('path', 'name');
        err.errors.name.message.should.equal('Error 403: Something bad happened');
        return done();
      });
    });

    it('Should replace args on custom error message', function (done) {
      schema.path('name').validate(validate({ validator: 'isLength', arguments: [5, 10], message: 'At least {ARGS[0]} and less than {ARGS[1]}' }));

      should.exist(doc);

      doc.name = 'Joe';

      doc.save(function(err, person) {
        should.exist(err);
        should.not.exist(person);
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError');
        err.errors.name.should.have.property('path', 'name');
        err.errors.name.message.should.equal('At least 5 and less than 10');
        return done();
      });
    });
  });

  describe('Properties -', function() {
    it('Should support the `type` property', function (done) {
      schema.path('name').validate(validate({ validator: 'isLength', arguments: [5, 10], type: 'custom error type'}));

      should.exist(doc);

      doc.name = 'Joe';

      doc.save(function(err, person) {
        should.exist(err);
        should.not.exist(person);
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError');
        err.errors.name.should.have.property('kind', 'custom error type');
        err.errors.name.should.have.property('properties');
        err.errors.name.should.have.propertyByPath('properties', 'type').eql('custom error type');
        return done();
      });
    });

    // Support a custom property being added to the error object, only documentation I can find is from:
    // http://thecodebarbarian.com/2014/12/19/mongoose-397
    // In this case, `http` is a custom property and is passed across to the resulting error object
    it('Should support a custom property', function (done) {
      schema.path('name').validate(validate({ validator: 'isLength', arguments: [5, 10], http: 403}));

      should.exist(doc);

      doc.name = 'Joe';

      doc.save(function(err, person) {
        should.exist(err);
        should.not.exist(person);
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError');
        err.errors.name.should.have.property('properties');
        err.errors.name.should.have.propertyByPath('properties', 'http').eql(403);
        return done();
      });
    });
  });

  describe('Custom validator using `extend` method -', function() {
    it('Should use a custom extended validator and pass', function(done) {
      schema.path('name').validate(validate({ validator: 'isType', arguments: 'string'}));

      should.exist(doc);

      doc.name = 'Joe';

      doc.save(function(err, person) {
        should.not.exist(err);
        should.exist(person);
        return done();
      });
    });

    it('Should use a custom extended validator and fail', function(done) {
      schema.path('name').validate(validate({ validator: 'isType', arguments: 'boolean' }));

      should.exist(doc);

      doc.name = 'Joe';

      doc.save(function(err, person) {
        should.exist(err);
        should.not.exist(person);
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError');
        err.errors.name.should.have.property('path', 'name');
        err.errors.name.message.should.equal('Not correct type');
        return done();
      });
    });

    it('Should use a custom extended validator and fail with custom error message', function(done) {
      schema.path('name').validate(validate({ validator: 'isType', arguments: 'boolean', message: 'Custom error message' }));

      should.exist(doc);

      doc.name = 'Joe';

      doc.save(function(err, person) {
        should.exist(err);
        should.not.exist(person);
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError');
        err.errors.name.should.have.property('path', 'name');
        err.errors.name.message.should.equal('Custom error message');
        return done();
      });
    });
  });

  describe('Custom validator on validator.js prototype -', function() {
    it('Should use a custom prototype test and pass', function(done) {
      schema.path('name').validate(validate({ validator: 'contains', arguments: 'J' }));

      should.exist(doc);

      doc.name = 'Joe';

      doc.save(function(err, person) {
        should.not.exist(err);
        should.exist(person);
        return done();
      });
    });

    it('Should use a custom prototype test and fail', function(done) {
      schema.path('name').validate(validate({ validator: 'contains', arguments: 'K' }));

      should.exist(doc);

      doc.name = 'Joe';

      doc.save(function(err, person) {
        should.exist(err);
        should.not.exist(person);
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError');
        err.errors.name.should.have.property('path', 'name');
        return done();
      });
    });

    it('Should use a custom prototype test and fail with custom error message', function(done) {
      schema.path('name').validate(validate({ validator: 'contains', arguments: 'K', message: 'Custom error message' }));

      should.exist(doc);

      doc.name = 'Joe';

      doc.save(function(err, person) {
        should.exist(err);
        should.not.exist(person);
        err.should.be.instanceof(Error).and.have.property('name', 'ValidationError');
        err.errors.name.should.have.property('path', 'name');
        err.errors.name.message.should.equal('Custom error message');
        return done();
      });
    });
  });

  describe('Passing functions directly -', function () {
    it('Should pass custom validator when a custom function is passed directly', function(done) {
      schema.path('age').validate(validate({
          validator: function(val) {
              return val > 18;
          },
          message: 'Age must be greater than 18'
      }));

      should.exist(doc);

      doc.age = 20;

      doc.save(function(err, person) {
        should.not.exist(err);
        should.exist(person);
        person.should.have.property('age').and.match(20);
        return done();
      });
    });

    it('Should fail custom validator when a custom function is passed directly', function(done) {
      schema.path('age').validate(validate({
          validator: function(val) {
              return val > 18;
          },
          message: 'Age must be greater than 18'
      }));

      should.exist(doc);

      doc.age = 10;

      doc.save(function(err, person) {
          should.exist(err);
          should.not.exist(person);
          err.should.be.instanceof(Error).and.have.property('name', 'ValidationError');
          err.errors.age.should.have.property('path', 'age');
          err.errors.age.message.should.equal('Age must be greater than 18');
          return done();
      });
    });
  });

  describe('Miscellaneous -', function() {
    // https://github.com/leepowellcouk/mongoose-validator/issues/7#issuecomment-20494299
    it('Should pass on legacy isEmail method', function(done) {
      schema.path('name').validate(validate({ validator: 'isEmail' }));

      should.exist(doc);

      doc.name = 'username+suffix@googlemail.com';

      doc.save(function(err, person) {
        should.not.exist(err);
        should.exist(person);
        return done();
      });
    });

    it('Should pass custom validator using non-string value', function(done) {
      schema.path('interests').validate(validate({ validator: 'isArray' }));

      should.exist(doc);

      doc.interests = ['cycling', 'fishing'];

      doc.save(function(err, person) {
        should.not.exist(err);
        should.exist(person);
        person.should.have.property('interests').and.match(['cycling', 'fishing']);
        return done();
      });
    });

    it('Issue #12', function(done) {
      schema.path('name')
        .validate(validate({ validator: 'notEmpty', message: 'Username should not be empty' }))
        .validate(validate({ validator: 'isLength', arguments: [4, 40], message: 'Username should be between 4 and 40 characters' }))
        .validate(validate({ validator: 'isAlphanumeric', message: 'Username must only contain letters and digits' }));

      should.exist(doc);

      doc.name = '';

      doc.save(function(err, person) {
        should.exist(err);
        should.not.exist(person);
        err.errors.name.message.should.equal('Username should not be empty');
        return done();
      });
    });

    it('Custom validator calls with this = model instance', function(done) {

      schema.path('name').validate(validate({ validator: 'isContextEqlModelInstance' }));

      should.exist(doc);

      doc.name = 'Joe';

      doc.save(function(err, person) {
        should.not.exist(err);
        should.exist(person);
        return done();
      });
    });
  });
});

})();
