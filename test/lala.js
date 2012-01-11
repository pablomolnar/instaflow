var assert = require('assert');
var http = require('http');
var express = require('./node_modules/express')
express.createServer();


describe('My Test Loko', function(){
  it('should provide an example', function(done){
    http.get({ path: '/', port: 8888 }, function(res){
      res.should.have.status(200);
      done();
    })
  })
})
