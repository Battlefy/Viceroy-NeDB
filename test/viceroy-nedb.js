
// modules
var test = require('tape');
var path = require('path');
var fs = require('fs');

// libs
var ViceroyNeDB = require('../').ViceroyNeDB;

test('ViceroyNeDB()', function(t) {

  t.throws(function() { new ViceroyNeDB(); });
  t.throws(function() { new ViceroyNeDB(null); });
  t.throws(function() { new ViceroyNeDB(1); });
  t.throws(function() { new ViceroyNeDB(false); });
  t.throws(function() { new ViceroyNeDB('s'); });
  t.throws(function() { new ViceroyNeDB({}); });
  t.throws(function() { new ViceroyNeDB({}, null); });
  t.throws(function() { new ViceroyNeDB({}, 1); });
  t.throws(function() { new ViceroyNeDB({}, false); });
  t.throws(function() { new ViceroyNeDB({}, 's'); });
  t.doesNotThrow(function() { new ViceroyNeDB({}, {}); });

  t.end();
});

test('viceroyNeDB{}', function(t) {

  var viceroyNeDB = new ViceroyNeDB({}, {});

  t.equal(typeof viceroyNeDB.connect, 'function');
  t.equal(typeof viceroyNeDB.close, 'function');
  t.equal(typeof viceroyNeDB.index, 'function');
  t.equal(typeof viceroyNeDB.count, 'function');
  t.equal(typeof viceroyNeDB.find, 'function');
  t.equal(typeof viceroyNeDB.insert, 'function');
  t.equal(typeof viceroyNeDB.update, 'function');
  t.equal(typeof viceroyNeDB.remove, 'function');

  t.end();
});

test('viceroyNeDB.connect()', function(t) {

  var viceroyNeDB = new ViceroyNeDB({ models: {}}, {});

  t.throws(function() { viceroyNeDB.connect(1); });
  t.throws(function() { viceroyNeDB.connect('s'); });
  t.throws(function() { viceroyNeDB.connect({}); });
  t.doesNotThrow(function() {
    viceroyNeDB.connect(function(err) {
      t.error(err);
    });
  });
  
  t.end();
});

test('viceroyNeDB.connect() - In memory', function(t) {

  var viceroyNeDB = new ViceroyNeDB({
    models: { Test: { collectionName: 'tests' }}
  }, {});
  
  viceroyNeDB.connect(function(err) {
    t.error(err);
    t.equal(typeof viceroyNeDB.collections.tests, 'object');
    t.end();
  });
});

test('viceroyNeDB.connect() - On disk', function(t) {

  var dbPath = path.resolve(__dirname, '../tmp/database');
  var dbCollectionPath = path.join(dbPath, 'tests.nedb');

  var viceroyNeDB = new ViceroyNeDB({
    models: { Test: { collectionName: 'tests' }}
  }, {
    databasePath: dbPath
  });

  t.throws(function() { viceroyNeDB.connect(1); });
  t.throws(function() { viceroyNeDB.connect('s'); });
  t.throws(function() { viceroyNeDB.connect({}); });
  
  viceroyNeDB.connect(function(err) {
    t.error(err);

    t.ok(fs.existsSync(dbPath));
    t.ok(fs.existsSync(dbCollectionPath));
    fs.unlinkSync(dbCollectionPath);
    fs.rmdirSync(dbPath);

    t.end();
  });
});

test('viceroyNeDB.close()', function(t) {

  var dbPath = path.resolve(__dirname, '../tmp/database');
  var dbCollectionPath = path.join(dbPath, 'tests.nedb');

  var viceroyNeDB = new ViceroyNeDB({
    models: { Test: { collectionName: 'tests' }}
  }, {});

  viceroyNeDB.connect(function(err) {
    t.error(err);
    t.equal(typeof viceroyNeDB.collections.tests, 'object');
    viceroyNeDB.close(function(err) {
      t.equal(viceroyNeDB.collections.tests, undefined);
      t.end();
    });
  });
});

test('viceroyNeDB.index()', function(t) {

  var viceroyNeDB = new ViceroyNeDB({
    models: { Test: { collectionName: 'tests' }}
  }, {});

  viceroyNeDB.connect(function(err) {
    t.error(err);

    t.doesNotThrow(function() { viceroyNeDB.index(); });
    t.doesNotThrow(function() { viceroyNeDB.index(1); });
    t.doesNotThrow(function() { viceroyNeDB.index('s'); });
    t.doesNotThrow(function() { viceroyNeDB.index({}); });
    t.doesNotThrow(function() { viceroyNeDB.index(false); });
    t.doesNotThrow(function() { viceroyNeDB.index('tests', 1, function(err) { t.ok(err); }); });
    t.doesNotThrow(function() { viceroyNeDB.index('tests', 's', function(err) { t.ok(err); }); });
    t.doesNotThrow(function() { viceroyNeDB.index('tests', false, function(err) { t.ok(err); }); });
    t.doesNotThrow(function() { viceroyNeDB.index('tests', {}, 1); });
    t.doesNotThrow(function() { viceroyNeDB.index('tests', {}, 's'); });
    t.doesNotThrow(function() { viceroyNeDB.index('tests', {}, false); });
    t.throws(function() { viceroyNeDB.index('tests', {}, 'name', 1); });
    t.throws(function() { viceroyNeDB.index('tests', {}, 'name', 's'); });
    
    viceroyNeDB.collections.tests.ensureIndex = function(opts, cb) {
      t.equal(typeof opts, 'object');
      t.equal(opts.sparse, true);
      t.equal(opts.unique, true);
      t.equal(opts.fieldName, 'name');
      cb(null);
    };

    viceroyNeDB.index('tests', { sparse: true, unique: true }, 'name', function(err) {
      t.error(err);
      t.end();
    });
  });
});

test('viceroyNeDB.count()', function(t) {

  var viceroyNeDB = new ViceroyNeDB({
    models: { Test: { collectionName: 'tests' }}
  }, {});

  viceroyNeDB.connect(function(err) {
    t.error(err);

    t.throws(function() { viceroyNeDB.count(); });
    t.throws(function() { viceroyNeDB.count(1); });
    t.throws(function() { viceroyNeDB.count('s'); });
    t.throws(function() { viceroyNeDB.count('tests', 1); });
    t.throws(function() { viceroyNeDB.count('tests', 's'); });
    t.throws(function() { viceroyNeDB.count('tests', false); });
    t.throws(function() { viceroyNeDB.count('tests', {}, 1); });
    t.throws(function() { viceroyNeDB.count('tests', {}, 's'); });
    
    viceroyNeDB.collections.tests.count = function(neDBQuery, cb) {
      t.equal(typeof neDBQuery, 'object');
      t.equal(neDBQuery.name, 'test');
      cb(null, 10);
    };
    
    viceroyNeDB.count('tests', {}, {
      query: { name: 'test' },
      opts: {}
    }, {
      write: function(count) { t.equal(count, 10); },
      end: function() { t.end(); }
    });
  });
});

test('viceroyNeDB.find()', function(t) {

  var viceroyNeDB = new ViceroyNeDB({
    models: { Test: { collectionName: 'tests' }}
  }, {});

  viceroyNeDB.connect(function(err) {
    t.error(err);

    t.throws(function() { viceroyNeDB.find(); });
    t.throws(function() { viceroyNeDB.find(1); });
    t.throws(function() { viceroyNeDB.find('s'); });
    t.throws(function() { viceroyNeDB.find('tests', 1); });
    t.throws(function() { viceroyNeDB.find('tests', 's'); });
    t.throws(function() { viceroyNeDB.find('tests', false); });
    t.throws(function() { viceroyNeDB.find('tests', {}, 1); });
    t.throws(function() { viceroyNeDB.find('tests', {}, 's'); });
    t.throws(function() {
      viceroyNeDB.find('tests', {}, {
        query: {},
        opts: {}
      }, 1);
    });
    t.throws(function() {
      viceroyNeDB.find('tests', {}, {
        query: {},
        opts: {}
      }, 's');
    });
    
    viceroyNeDB.collections.tests.find = function(neDBQuery, cb) {
      t.equal(typeof neDBQuery, 'object');
      t.equal(neDBQuery.name, 'test');
      cb(null, [
        { name: 'test-a' },
        { name: 'test-b' },
        { name: 'test-c' }
      ]);
    };
    
    var recordNames = [
      'test-a',
      'test-b',
      'test-c'
    ];
    viceroyNeDB.find('tests', {}, {
      query: { name: 'test' },
      opts: {}
    }, {
      write: function(record) {
        var i = recordNames.indexOf(record.name);
        if(i !== -1) { recordNames.splice(i, 1); }
        t.notEqual(i, -1);
      },
      end: function() { t.end(); }
    });
  });
});

test('viceroyNeDB.insert()', function(t) {

  var viceroyNeDB = new ViceroyNeDB({
    models: { Test: { collectionName: 'tests' }}
  }, {});

  viceroyNeDB.connect(function(err) {
    t.error(err);

    t.throws(function() { viceroyNeDB.insert(); });
    t.throws(function() { viceroyNeDB.insert(1); });
    t.throws(function() { viceroyNeDB.insert('s'); });
    t.throws(function() { viceroyNeDB.insert('tests', 1); });
    t.throws(function() { viceroyNeDB.insert('tests', 's'); });
    t.throws(function() { viceroyNeDB.insert('tests', false); });
    t.throws(function() { viceroyNeDB.insert('tests', {}, 1); });
    t.throws(function() { viceroyNeDB.insert('tests', {}, 's'); });
    t.throws(function() {
      viceroyNeDB.insert('tests', {}, {
        all: function() {}
      }, 1);
    });
    t.throws(function() {
      viceroyNeDB.insert('tests', {}, {
        all: function() {}
      }, 's');
    });
    
    viceroyNeDB.collections.tests.insert = function(records, cb) {
      t.equal(typeof records, 'object');
      t.equal(typeof records.length, 'number');

      cb(null, records);
    };
    
    var recordNames = [
      'test-a',
      'test-b',
      'test-c'
    ];
    viceroyNeDB.insert('tests', {}, {
      all: function(cb) {
        cb(null, [
          { name: 'test-a' },
          { name: 'test-b' },
          { name: 'test-c' }
        ]);
      }
    }, {
      write: function(record) {
        var i = recordNames.indexOf(record.name);
        if(i !== -1) { recordNames.splice(i, 1); }
        t.notEqual(i, -1);
      },
      end: function() { t.end(); }
    });
  });
});

test('viceroyNeDB.update()', function(t) {

  var viceroyNeDB = new ViceroyNeDB({
    models: { Test: { collectionName: 'tests' }}
  }, {});

  viceroyNeDB.connect(function(err) {
    t.error(err);

    t.throws(function() { viceroyNeDB.update(); });
    t.throws(function() { viceroyNeDB.update(1); });
    t.throws(function() { viceroyNeDB.update('s'); });
    t.throws(function() { viceroyNeDB.update('tests', 1); });
    t.throws(function() { viceroyNeDB.update('tests', 's'); });
    t.throws(function() { viceroyNeDB.update('tests', false); });
    t.throws(function() { viceroyNeDB.update('tests', {}, 1); });
    t.throws(function() { viceroyNeDB.update('tests', {}, 's'); });
    t.throws(function() { viceroyNeDB.update('tests', {}, false); });
    t.throws(function() {
      viceroyNeDB.update('tests', {}, {
        query: {},
        opts: {}
      }, 1);
    });
    t.throws(function() {
      viceroyNeDB.update('tests', {}, {
        query: {},
        opts: {}
      }, 's');
    });
    t.throws(function() {
      viceroyNeDB.update('tests', {}, {
        query: {},
        opts: {}
      }, {}, 1);
    });
    t.throws(function() {
      viceroyNeDB.update('tests', {}, {
        query: {},
        opts: {}
      }, {}, 's');
    });
    
    viceroyNeDB.collections.tests.update = function(neDBQuery, neDBDelta, cb) {
      t.equal(typeof neDBQuery, 'object');
      t.equal(neDBQuery.name, 'test');
      t.equal(typeof neDBDelta, 'object');
      t.equal(typeof neDBDelta.$set, 'object');
      t.equal(neDBDelta.$set.name, 'test-a');
      cb(null, 3);
    };
    
    viceroyNeDB.update('tests', {}, {
      query: { name: 'test' },
      opts: {}
    }, { diff: { $set: { name: 'test-a' }}}, {
      write: function(count) { t.equal(count, 3); },
      end: function() { t.end(); }
    });
  });
});

test('viceroyNeDB.remove()', function(t) {

  var viceroyNeDB = new ViceroyNeDB({
    models: { Test: { collectionName: 'tests' }}
  }, {});

  viceroyNeDB.connect(function(err) {
    t.error(err);

    t.throws(function() { viceroyNeDB.remove(); });
    t.throws(function() { viceroyNeDB.remove(1); });
    t.throws(function() { viceroyNeDB.remove('s'); });
    t.throws(function() { viceroyNeDB.remove('tests', 1); });
    t.throws(function() { viceroyNeDB.remove('tests', 's'); });
    t.throws(function() { viceroyNeDB.remove('tests', false); });
    t.throws(function() { viceroyNeDB.remove('tests', {}, 1); });
    t.throws(function() { viceroyNeDB.remove('tests', {}, 's'); });
    t.throws(function() { viceroyNeDB.remove('tests', {}, false); });
    t.throws(function() {
      viceroyNeDB.remove('tests', {}, {
        query: {},
        opts: {}
      }, 1);
    });
    t.throws(function() {
      viceroyNeDB.remove('tests', {}, {
        query: {},
        opts: {}
      }, 's');
    });
    
    viceroyNeDB.collections.tests.remove = function(neDBQuery, cb) {
      t.equal(typeof neDBQuery, 'object');
      t.equal(neDBQuery.name, 'test');
      cb(null, 3);
    };
    
    viceroyNeDB.remove('tests', {}, {
      query: { name: 'test' },
      opts: {}
    }, {
      write: function(count) { t.equal(count, 3); },
      end: function() { t.end(); }
    });
  });
});




