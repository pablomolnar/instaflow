require('../app');

var assert = require('assert'),
    should = require('should'),
    http = require('http');
	
                                                    
describe('Basic Suite', function(){
	
  it('should return Welcome to Express', function(done) {    	
    http.get({ path: '/', port: 3000 }, function(response) {                   
	  // Check status
      response.should.have.status(200);        

      // Check body
	  response.on('data', function (chunk) {    
	    chunk.toString().should.include('Welcome to Express')
	  });    
	
      done();
    })
  })


})