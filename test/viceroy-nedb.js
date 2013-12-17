
var viceroy = require('viceroy');
var viceroyNeDB = require('../');


describe('viceroyNeDB (factory)', function() {

  it('accepts a database path', function() {
    viceroyNeDB({ databasePath: 'tmp/viceroy-nedb-tests' });
  });

  it('returns a viceroy middleware factory function', function() {
    var middlware = viceroyNeDB();
    middlware.should.be.type('function');
  });
});


describe('viceroyNeDB (instance)', function() {

  beforeEach(function() {
    this.instance = viceroyNeDB()(viceroy);
  });

  it('has an augmentModel method', function() {
    this.instance.augmentModel.should.be.type('function');
  });

  it('has a connect method', function() {
    this.instance.connect.should.be.type('function');
  });

  it('has an index method', function() {
    this.instance.index.should.be.type('function');
  });

  it('has a find method', function() {
    this.instance.find.should.be.type('function');
  });

  it('has a findOne method', function() {
    this.instance.findOne.should.be.type('function');
  });

  it('has an insert method', function() {
    this.instance.insert.should.be.type('function');
  });

  xit('has an update method', function() {
    this.instance.update.should.be.type('function');
  });

  it('has a remove method', function() {
    this.instance.remove.should.be.type('function');
  });

  it('has a removeOne method', function() {
    this.instance.removeOne.should.be.type('function');
  });
});
