

// lib
var ViceroyNeDB = require('./lib/viceroy-nedb');


/**
 * Viceroy NeDB factory.
 * @param  {Object}   opts ViceroyNeDB opts.
 * @return {Function}      ViceroyNeDB inner factory.
 */
function viceroyNeDBFactory(opts) {

  // defaults
  opts = opts || {};

  // validate
  if(typeof opts != 'object') { throw new Error('opts must be an object'); }

  /**
   * Viceroy NeDB inner factory.
   * @param  {Object}   viceroy Viceroy instance.
   * @return {Function}         ViceroyNeDB instance.
   */
  return function(viceroy) {

    // validate
    if(typeof viceroy != 'object') { throw new Error('viceroy must be an object'); }

    // return new viceroy nedb instance.
    return new ViceroyNeDB(viceroy, opts);
  };
}


exports = module.exports = viceroyNeDBFactory;
exports.ViceroyNeDB = ViceroyNeDB;