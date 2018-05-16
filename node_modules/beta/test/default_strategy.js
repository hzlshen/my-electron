var should = require('should')
  , Strategy = require('../lib/default_strategy');

describe('Default Strategy with testing store', function(){
  //arrange
  var testStore = function(flags, account, user, cb){
    cb(null, flags === 'SOMEFLAG');
  };
  var strategy = Strategy({ store: testStore });

  it('recognizes "on" flags as on.', function(done){
    //act
    strategy('SOMEFLAG', function(err, on){
      //assert
      on.should.equal(true);
      done();
    });
  });

  it('recognizes unknown flags as off.', function(done){
    //act
    strategy('SOMEFLAG2', function(err, on){
      //assert
      on.should.equal(false);
      done();
    });
  });
});

describe('Default Strategy with testing store', function(){
  //arrange
  var passedUser = null;
  var passedAccount = null;
  var testStore = function(flags, account, user, cb){
    passedUser = user;
    passedAccount = account;
    cb(null, flags === 'SOMEFLAG');
  };
  var userIdentifier = function(req, cb){
    cb(null, 'troy');
  };
  var accountIdentifier = function(req, cb){
    cb(null, 'acme');
  };
  var strategy = Strategy({
    store: testStore,
    userIdentifier: userIdentifier,
    accountIdentifier: accountIdentifier
  });
  var req = {};

  it('passes user into store when identified.', function(done){
    //act
    strategy('SOMEFLAG2', req, function(err, on){
      //assert
      passedUser.should.equal('troy');
      done();
    });
  });

  it('passes account into store when identified.', function(done){
    //act
    strategy('SOMEFLAG2', req, function(err, on){
      //assert
      passedAccount.should.equal('acme');
      done();
    });
  });
});
