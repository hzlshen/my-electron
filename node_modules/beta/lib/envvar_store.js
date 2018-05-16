module.exports = function(opts){
  var prefix = (opts.envVarPrefix || 'BETAFLAG').toUpperCase();
  var delimiter = (opts.envVarDelimiter || ',');
  var accountAndUserCombiner = (opts.envVarAccountAndUserCombiner || function(account, user){
    if(account)
      return account + ':' + user;
    else
      return user;
  });

  var lookup = function(flag, account, user){
    var key = prefix + '_' + flag.toUpperCase();
    var value = process.env[key];

    if(value === undefined || value === null || !value.length || /^(false|0|off|no)$/i.test(value.toString())){
      return false;
    }else if(/^(\*|true|1|on|yes)$/i.test(value.toString())){
      return true;
    }else{
      var users = value.split(delimiter);
      if(users.indexOf(accountAndUserCombiner(account, '*')) !== -1)
         return true;
      else
        return users.indexOf(accountAndUserCombiner(account, user)) !== -1;
    };
  };

  return function(flags, account, user, cb){
    if(flags instanceof Array){
      var retval = {};
      flags.forEach(function(f){
        retval[f] = lookup(f, account, user);
      });
      cb(null, retval);
    }else{
      cb(null, lookup(flags, account, user));
    }
  };
};
