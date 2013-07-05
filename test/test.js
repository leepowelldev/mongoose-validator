'use strict';

var mongoose  = require('mongoose'),
    should    = require('should'),
    validate = require('../lib/mongoose-validator').validate,
    Schema    = mongoose.Schema;

// Setters are not run for undefined values
function set(val) {
    return val === '' ? null : val;
}

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
        schema.path('name').validate(validate('len', 5, 10));

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
        schema.path('name').validate(validate('len', 5, 10));

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
        schema.path('name').validate(validate({ passIfEmpty: true }, 'len', 5, 10));

        should.exist(doc);

        doc.name = undefined;

        doc.save(function(err, person) {
            should.not.exist(err);
            should.exist(person);

            return done();
        });
    });

    it('Should fail a passIfEmpty validator', function(done) {
        schema.path('name').validate(validate({ passIfEmpty: true }, 'len', 5, 10));

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
        schema.path('name').validate(validate({ message: 'Custom error message' }, 'len', 5, 10));

        should.exist(doc);

        doc.name = 'Joe';

        doc.save(function(err, person) {
            should.exist(err);
            should.not.exist(person);
            err.should.be.instanceof(Error).and.have.property('name', 'ValidationError');
            err.errors.name.should.have.property('path', 'name');
            err.errors.name.type.should.equal('Custom error message');

            return done();
        });
    });
});