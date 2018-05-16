var should = require('should')
  , Beta = require('../lib');

describe('Beta with custom strategy', function(){
  //arrange
  var strategy = function(flags, cb){
    var on = flags === 'SOMEFLAG';
    cb(null, on);
  };
  var beta = new Beta({strategy: strategy});

  it('recognizes "on" flags as on.', function(done){
    //act
    beta.check('SOMEFLAG', function(err, on){
      //assert
      on.should.equal(true);
      done();
    });
  });

  it('recognizes unknown flags as off.', function(done){
    //act
    beta.check('SOMEFLAG2', function(err, on){
      //assert
      on.should.equal(false);
      done();
    });
  });
});

describe('Beta middleware', function(){
  //arrange
  var requestReceived = false;
  var strategy = function(flags, req, cb){
    if(req) requestReceived = true;
    cb();
  };
  var beta = new Beta({strategy: strategy});
  var req = {};

  //act
  beta.middleware(req, null, function(){
    it('should add a function to the request object.', function(done){
      //assert
      req.beta.should.be.a('function');
      done();
    });

    it('should pass the request object into the strategy automatically.', function(done){
      //act
      req.beta('SOMEFLAG', function(err, on){
        //assert
        requestReceived.should.equal(true);
        done();
      });
    });
  });
});

describe('Beta with default strategy', function(){
  //arrange
  var beta = new Beta();

  it('recognizes unknown flags as off.', function(done){
    //act
    beta.check('SOMEFLAG2', function(err, on){
      //assert
      on.should.equal(false);
      done();
    });
  });
});
