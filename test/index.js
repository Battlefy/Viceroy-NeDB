
// modules
var test = require('tape');

// libs
var viceroyNeDB = require('../');

test('viceroyNeDBFactory()', function(t) {
  t.throws(function() { viceroyNeDB(1); });
  t.throws(function() { viceroyNeDB('s'); });
  t.throws(function() { viceroyNeDB(true); });
  t.doesNotThrow(function() { viceroyNeDB(); });
  t.doesNotThrow(function() { viceroyNeDB({}); });

  t.equal(typeof viceroyNeDB(), 'function');

  t.end();
});

test('viceroyNeDBInnerFactory()', function(t) {
  var inner = viceroyNeDB({});
  t.throws(function() { inner(); });
  t.throws(function() { inner(null); });
  t.throws(function() { inner(1); });
  t.throws(function() { inner(false); });
  t.throws(function() { inner('s'); });
  t.doesNotThrow(function() { inner({}); });

  var vNeDB = inner({});
  t.equal(typeof vNeDB, 'object');

  t.end();
});
