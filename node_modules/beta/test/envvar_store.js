var should = require('should')
  , Store = require('../lib/envvar_store');

describe('EnvVarStore', function(){
  //arrange
  process.env.BETAFLAG_SOMEFLAG = '*';
  process.env.BETAFLAG_SOMEFLAG2 = 'false';
  process.env.BETAFLAG_SOMEFLAG3 = 'troy';
  process.env.BETAFLAG_SOMEFLAG4 = 'bob,troy';
  process.env.BETAFLAG_SOMEFLAG5 = 'troy,bob';
  process.env.BETAFLAG_SOMEFLAG6 = 'bob,troy,alice';
  process.env.BETAFLAG_SOMEFLAG7 = 'bob,alice';
  process.env.BETAFLAG_SOMEFLAG8 = 'acme:troy';
  process.env.BETAFLAG_SOMEFLAG9 = 'acme:*';
  process.env.BETAFLAG_SOMEFLAG10 = 'acme:bob';
  process.env.BETAFLAG_SOMEFLAG11 = 'enron:troy';
  process.env.BETAFLAG_SOMEFLAG12 = 'enron:*';
  var store = Store({});
  var account = null;
  var user = null;

  it('recognizes "on" flags as on.', function(done){
    //act
    store('SOMEFLAG', account, user, function(err, on){
      //assert
      on.should.equal(true);
      done();
    });
  });

  it('recognizes unknown flags as off.', function(done){
    //act
    store('SOMEFLAG2', account, user, function(err, on){
      //assert
      on.should.equal(false);
      done();
    });
  });

  it('supports lookups on an array of flags.', function(done){
    //act
    store(['SOMEFLAG', 'SOMEFLAG2'], account, user, function(err, flags){
      //assert
      flags.SOMEFLAG.should.equal(true);
      flags.SOMEFLAG2.should.equal(false);
      done();
    });
  });

  it('Allows lookups by user.', function(done){
    //act
    store(['SOMEFLAG3', 'SOMEFLAG4', 'SOMEFLAG5', 'SOMEFLAG6', 'SOMEFLAG7'], account, 'troy', function(err, flags){
      //assert
      flags.SOMEFLAG3.should.equal(true);
      flags.SOMEFLAG4.should.equal(true);
      flags.SOMEFLAG5.should.equal(true);
      flags.SOMEFLAG6.should.equal(true);
      flags.SOMEFLAG7.should.equal(false);
      done();
    });
  });

  it('Allows lookups by account+user.', function(done){
    //act
    store(['SOMEFLAG8', 'SOMEFLAG9', 'SOMEFLAG10', 'SOMEFLAG11', 'SOMEFLAG12'], 'acme', 'troy', function(err, flags){
      //assert
      flags.SOMEFLAG8.should.equal(true);
      flags.SOMEFLAG9.should.equal(true);
      flags.SOMEFLAG10.should.equal(false);
      flags.SOMEFLAG11.should.equal(false);
      flags.SOMEFLAG12.should.equal(false);
      done();
    });
  });
});
