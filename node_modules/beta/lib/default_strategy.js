var envvarStore = require('./envvar_store');

var nullAccountIdentifier = function(req, cb){
  cb();
};
var defaultUserIdentifier = function(req, cb){
  if(req.user && req.user.id){
    cb(null, req.user.id);
  }else{
    cb();
  }
};

module.exports = function(opts){
  opts = opts || {};
  var store = opts.store || envvarStore(opts);
  var accountIdentifier = opts.accountIdentifier || nullAccountIdentifier;
  var userIdentifier = opts.userIdentifier || defaultUserIdentifier;

  return function(flags, req, cb){
    if(typeof(req) === 'function') cb = req;
    accountIdentifier(req, function(err, account){
      if(err) return cb(err);
      userIdentifier(req, function(err, user){
        if(err) return cb(err);
        store(flags, account, user, cb);
      });
    });
  };
};
