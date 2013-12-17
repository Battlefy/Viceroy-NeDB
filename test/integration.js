
var util = require('util');
var fs = require('fs');
var rimraf = require('rimraf');
var path = require('path');
var viceroy = require('viceroy');
var viceroyNeDB = require('../');

var TEST_DB = path.resolve(__dirname, '../tmp/viceroy-nedb-tests');


describe('viceroy intergration', function() {

  before(function(done) {
    this.viceroy = new viceroy.Viceroy();
    this.viceroy.driver(viceroyNeDB({
      databasePath: TEST_DB
    }));
    function Person() {
      viceroy.Model.apply(this, arguments);
      this.schema({ name: { type: String, index: { sparse: true, unique: true }}});
    }
    util.inherits(Person, viceroy.Model);
    this.Person = Person;
    this.viceroy.model(Person);
    this.viceroy.connect(done);
  });

  after(function(done) {
    fs.exists(TEST_DB, function(ok) {
      if(ok) {
        rimraf(path.resolve(__dirname, '../tmp/viceroy-nedb-tests'), done);
      } else {
        done();
      }
    });
  });


  it('should store a model', function(done) {
    this.Person.create({
      name: 'Robert'
    }, function(err, robert) {
      if(err) { done(err); return; }
      robert.should.exist;
      robert._id.should.exist;
      robert.name.should.equal('Robert');
      done();
    });
  });

  it('fetch a model', function(done) {
    this.Person.findOne({
      name: 'Robert'
    }, function(err, robert) {
      if(err) { done(err); return; }
      robert.should.exist;
      robert._id.should.exist;
      robert.name.should.equal('Robert');
      done();
    });
  });

  it('remove a model', function(done) {
    var _this = this;
    this.Person.removeOne({
      name: 'Robert'
    }, function(err) {
      if(err) { done(err); return; }
      _this.Person.findOne({
        name: 'Robert'
      }, function(err, robert) {
        if(err) { done(err); }
        (!robert).should.be.true;
        done();
      });
    });
  });
});