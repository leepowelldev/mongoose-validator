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

// Tests
// ------------------------------------------------------------
describe('Mongoose Validator', function() {
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

  it('Should use a custom extend test and pass', function(done) {
    schema.path('name').validate(validate({ validator: 'isType', arguments: 'string'}));

    should.exist(doc);

    doc.name = 'Joe';

    doc.save(function(err, person) {
      should.not.exist(err);
      should.exist(person);
      return done();
    });
  });

  it('Should use a custom extend test and fail', function(done) {
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

  it('Should use a custom extend test and fail with custom error message', function(done) {
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
});

describe('Mongoose Validator - Validators in schema declaration', function() {
  var doc, schema, User;

  before(function(done) {
    var url  = 'mongodb://localhost/mongoose_validator_test',
        date = Date.now(),
        many;

    many = [
      validate({ validator: 'notEmpty', message: 'Username should not be empty' }),
      validate({ validator: 'isLength', passIfEmpty: true, arguments: [4, 40], message: 'Username should be between 4 and 40 characters' }),
      validate({ validator: 'isAlphanumeric', passIfEmpty: true, message: 'Username must only contain letters and digits' })
    ];

    mongoose.connect(url);

    schema = new Schema({
      name: { type: String, default: null, validate: many },
      date_created: { type: Date, default: date }
    });

    User = mongoose.model('User', schema, 'test.user');

    done();
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase();
    mongoose.disconnect();
    done();
  });

  beforeEach(function(done) {
    done();
  });

  afterEach(function(done) {
    done();
  });

  it('Should fail on notEmpty', function(done) {
    var vals = {
      name: ''
    };

    User.create(vals, function(err, user) {
      should.exist(err);
      should.not.exist(user);
      err.errors.name.should.have.property('path', 'name');
      err.errors.name.message.should.equal('Username should not be empty');
      return done();
    });
  });

  it('Should fail on length', function(done) {
    var vals = {
      name: 'Joh'
    };

    User.create(vals, function(err, user) {
      should.exist(err);
      should.not.exist(user);
      err.errors.name.should.have.property('path', 'name');
      err.errors.name.message.should.equal('Username should be between 4 and 40 characters');
      return done();
    });
  });

  it('Should fail on isAlphanumeric', function(done) {
    var vals = {
      name: 'Joh&'
    };

    User.create(vals, function(err, user) {
      should.exist(err);
      should.not.exist(user);
      err.errors.name.should.have.property('path', 'name');
      err.errors.name.message.should.equal('Username must only contain letters and digits');
      return done();
    });
  });

  it('Should pass', function(done) {
    var vals = {
      name: 'John'
    };

    User.create(vals, function(err, user) {
      should.not.exist(err);
      should.exist(user);
      user.name.should.equal('John');
      return done();
    });
  });
});

})();
