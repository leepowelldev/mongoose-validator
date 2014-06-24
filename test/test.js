(function(undefined) {

'use strict';

var mongoose  = require('mongoose'),
    should    = require('should'),
    validate  = require('../lib/mongoose-validator').validate,
    extend    = require('../lib/mongoose-validator').extend,
    validator = require('validator'),
    Schema    = mongoose.Schema;

// Setters are not run for undefined values
function set(val) {
  return val;
}

// Create a custom validator directly to Node Validator prototype
// ------------------------------------------------------------
validator.extend('contains', function (str, needle) {
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

// Tests
// ------------------------------------------------------------
describe('Mongoose Validator', function() {
  var doc, schema, Person;

  before(function(done) {
    var url  = 'mongodb://localhost/mongoose_validator_test',
        date = Date.now();

    mongoose.connect(url);

    schema = new Schema({
      name: { type: String, default: null, set: set },
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
    schema.paths.name.validators = [];

    Person.remove({}, function(err) {
      if (err) return done(err);
      return done();
    });
  });

  it('Should pass a validator', function(done) {
    schema.path('name').validate(validate('isLength', 5, 10));

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
    schema.path('name').validate(validate('isLength', 5, 10));

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
    schema.path('name').validate(validate({ passIfEmpty: true }, 'isLength', 5, 10));

    should.exist(doc);

    doc.name = undefined;

    doc.save(function(err, person) {
      should.not.exist(err);
      should.exist(person);

      return done();
    });
  });

  it('Should fail a passIfEmpty validator', function(done) {
    schema.path('name').validate(validate({ passIfEmpty: true }, 'isLength', 5, 10));

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
    schema.path('name').validate(validate({ message: 'Custom error message' }, 'isLength', 5, 10));

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
    schema.path('name').validate(validate('isType', 'string'));

    should.exist(doc);

    doc.name = 'Joe';

    doc.save(function(err, person) {
      should.not.exist(err);
      should.exist(person);

      return done();
    });
  });

  it('Should use a custom extend test and fail', function(done) {
    schema.path('name').validate(validate('isType', 'boolean'));

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
    schema.path('name').validate(validate({ message: 'Custom error message' }, 'isType', 'boolean'));

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
    schema.path('name').validate(validate('contains', 'J'));

    should.exist(doc);

    doc.name = 'Joe';

    doc.save(function(err, person) {
      should.not.exist(err);
      should.exist(person);

      return done();
    });
  });

  it('Should use a custom prototype test and fail', function(done) {
    schema.path('name').validate(validate('contains', 'K'));

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
    schema.path('name').validate(validate({ message: 'Custom error message' }, 'contains', 'K'));

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
    schema.path('name').validate(validate('isEmail'));

    should.exist(doc);

    doc.name = 'username+suffix@googlemail.com';

    doc.save(function(err, person) {
      should.not.exist(err);
      should.exist(person);

      return done();
    });
  });

  it('Issue #12', function(done) {
    schema.path('name')
      .validate(validate({ message: "Username should not be empty" }, 'notEmpty'))
      .validate(validate({ message: "Username should be between 4 and 40 characters" }, 'isLength', 4, 40))
      .validate(validate({ message: "Username must only contain letters and digits" }, 'isAlphanumeric'));

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
      validate({ message: "Username should be between 4 and 40 characters" }, 'isLength', 4, 40),
      validate({ message: "Username must only contain letters and digits" }, 'isAlpha'),
      validate({ message: "Username should not be empty" }, "notEmpty")
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
