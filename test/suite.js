require('../app');

var assert = require('assert'),
    should = require('should'),
    http = require('http'), 
    feed = require('../feed');
	
describe('Callback URL', function(){
  it('should respond to the GET request with the hub.challenge ', function(done) {    	
    http.get({ path: '/callback?hub.mode=subscribe&hub.challenge=15f7d1a91c1f40f8a748fd134752feb3&hub.verify_token=myVerifyToken', port: 3000 }, function(response) {                   
	  // Check status
      response.should.have.status(200);        

      // Check body
	  response.on('data', function (chunk) {    
	    chunk.toString().should.equal('15f7d1a91c1f40f8a748fd134752feb3')
	  });    

      done();
    })
  }); 

  it('should recieve POST eveents of new photos', function(done) { 
	 
	// Move to fixtures
	var body =
	[
	    {
	        "subscription_id": "1",
	        "object": "user",
	        "object_id": "1234",
	        "changed_aspect": "media",
	        "time": 1297286541
	    },
	    {
	        "subscription_id": "2",
	        "object": "tag",
	        "object_id": "nofilter",
	        "changed_aspect": "media",
	        "time": 1297286541
	    }
	];	

	var req = http.request({ port: 3000, path: '/callback', method: 'POST' }, function(res) {       
	  var data = ''
	  res.on('data', function(chunk) { data += chunk; });                               
	  res.on('end', function() {
	    console.log(data)                                                        
	    // Check status
  	  res.should.have.status(200);
	    done();
	  });    
	});                         
	
	// write data to request body
	req.write(JSON.stringify(body));
	req.end();
  })
})

describe('Feed', function() {
  it('should build the correct url for a tag update', function(done) {  
    var update = 
      {
          "subscription_id": "2",
          "object": "tag",
          "object_id": "red",
          "changed_aspect": "media",
          "time": 1297286541
      }                  
      
    feed.settings.CLIENT_ID = 'TEST';
    feed.buildPath(update).should.equal('/v1/tags/red/media/recent?client_id=TEST&count=1');
    
    feed.minIds.tag = 5;
    feed.buildPath(update).should.equal('/v1/tags/red/media/recent?client_id=TEST&min_id=5');
    
     done();    
  })    
})



