var http = require('http');
var should = require('should');
var request = require('request');
      /* 
describe('POST URL', function(){
  it('test post', function(done) {
    var req = http.request({ host: 'www.procata.com', path: '/cachetest/tests/posturi/step2.php', method: 'POST', 
    port:80, 
    
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 0
    }
    
    }, function(res) {
      console.log('STATUS: ' + res.statusCode);       
      var data = ''
      req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      res.on('data', function(chunk) { 
        console.log('Response: ' + chunk);
        data += chunk; });                               
      res.on('end', function() {
        console.log('11111111111111')                                                        
        // Check status
    	  res.should.have.status(200);
        done();
      });    
    });
    
    
    // write data to request body
    req.write('data\n');
    req.write('data\n');
    req.end();
    
   });         
 });         
 
        */   
        
        describe('GET URL con request', function(){
          it('test get', function(done) {


            var request = require('request');
            request('https://api.mercadolibre.com/sites/MLA', function (error, response, body) {
              if (!error && response.statusCode == 200) {
                console.log(body) // Print the google web page.
                done()
              }
            })


           });         
         });
        
 describe('GET URL', function(){
   it('test get', function(done) {
     
     
     http.get({host:'api.mercadolibre.com', path:'/sites/MLA', port:443}, function(res) {  
       console.log('STATUS: ' + res.statusCode);
       console.log('HEADERS: ' + JSON.stringify(res.headers));
       res.setEncoding('utf8');
       var data = '';
       res.on('data', function(chunk) { data += chunk; }); 
       res.on('end', function() { 
         console.log(data)                                                        
         // Check status
     	  res.should.have.status(200);
         done();       });
     });
     

    });         
  });
 
  describe('GET URL 2', function(){
    it('test get', function(done) {


      http.get({host:'en.wikipedia.org', path:'/wiki/Mint', port:80}, function(res) {  
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function(chunk) { data += chunk; }); 
        res.on('end', function() { 
          console.log(data)                                                        
          // Check status
      	  res.should.have.status(200);
          done();       });
      });


     });         
   });



 