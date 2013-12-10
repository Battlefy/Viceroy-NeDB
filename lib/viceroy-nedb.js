var tools = require('primitive');
var Datastore = require('nedb');
var path = require('path');
var util = require('util');


function ViceroyNeDB(opts) {
  opts = opts || {};
  if(typeof opts != 'object') {
    throw new Error('opts must be an object');
  }
  this.opts = opts;
  this._collectionNames = [];
  this.db = {};
}

ViceroyNeDB.prototype.augmentModel = function(Model, opts) {
  this._collectionNames.push(opts.collection);
};

ViceroyNeDB.prototype.connect = function(callback) {

  // if there are no collection names then callback
  if(this._collectionNames.length < 1) { callback(); }

  // create the datastores
  for(var i = 0; i < this._collectionNames.length; i += 1) {
    var opts = {};
    var collectionName = this._collectionNames[i];
    if(this.opts.databasePath) {
      opts.filename = path.join(this.opts.databasePath, tools.hyphenate(collectionName));
    }
    this.db[collectionName] = new Datastore(opts);
  }

  // load the datastores
  var j = this._collectionNames.length;
  for(var i = 0; i < this._collectionNames.length; i += 1) {
    var collectionName = this._collectionNames[i];
    this.db[collectionName].loadDatabase(function(err) {
      if(err) { j = 0; callback(err); return; }
      j -= 1;
      if(j == 0) { callback(); }
    });
  }
};

ViceroyNeDB.prototype.index = function(indexes, opts, callback) {
  var j = indexes.length;
  for(var i = 0; i < indexes.length; i += 1) {
    var _opts = { fieldName: indexes[i] };
    if(opts.unique) { _opts.unique = true; }
    if(opts.sparse) { _opts.sparse = true; }
    this.db[opts.collection].ensureIndex(_opts, function(err) {
      if(err) { j = 0; callback(err); return; }
      j -= 1;
      if(j == 0) { callback(); }
    });
  }
};

ViceroyNeDB.prototype.find = function(query, opts, callback) {
  this.db[opts.collection].find(query, function(err, docs) {
    if(err) { callback(err); return; };
    callback(undefined, docs);
  });
};

ViceroyNeDB.prototype.findOne = function(query, opts, callback) {
  this.db[opts.collection].findOne(query, function(err, doc) {
    if(err) { callback(err); return; };
    callback(undefined, doc);
  });
};

ViceroyNeDB.prototype.count = function(query, opts, callback) {
  this.db[opts.collection].count(query, function(err, count) {
    if(err) { callback(err); return; };
    callback(undefined, count);
  });
};

ViceroyNeDB.prototype.insert = function(data, opts, callback) {
  this.db[opts.collection].insert(data, callback);
};

ViceroyNeDB.prototype.remove = function(query, opts, callback) {
  this.db[opts.collection].remove(query, { multi: true }, callback);
};

ViceroyNeDB.prototype.removeOne = function(query, opts, callback) {
  this.db[opts.collection].remove(query, callback);
};


module.exports = function(opts) {
  return function(viceroy) {
    //overwrite the id type with Number
    viceroy.types.ID = Number;
    return new ViceroyNeDB(opts);
  }
};
