var settings = require('./settings'),
    request = require('request'),
    async = require('async');
    
var minIds = {};  

exports.settings = settings;
exports.minIds = minIds;

// Process the feed updates data and return the new pics
function process(updates, callback) { 
  var pics = [];      
  async.map(updates, function(update, callback) {
    var path = buildPath(update);

    request('https://api.instagram.com' + path, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body)
        
        var json = JSON.parse(body);    
        
        if(!json || !json.data) {
          console.log('Did not receive data for ' + path +':');
          console.log(data);
          return;
        }
        
        console.log('current:' + minIds[update.object]);
        console.log('next:   ' + json.pagination.next_min_id);     
        if(!json.pagination.next_min_id) {
            minIds[update.object] = json.pagination.next_min_id
        }

        for(idx in json.data) { 
          var media = json.data[idx];  

          var pic = {}    
          pic.thumbnail = media.images.thumbnail  
          pic.user = media.user.username
          
          pics.push(pic);
        }
        
        callback(null, update);
      }
    });
  }, function(err, updates){ 
       if(err != null) throw err;
       console.log('Retorno pics' + JSON.stringify(pics));
       callback(pics);
  }); 
}

exports.process = process

function buildPath(update) {             
  var resource
  if(update.object == 'tag') {
    resource = 'tags'
  } else if(update.object == 'geography') { 
    resource = 'geographies'
  } else {
    throw 'Unidentified resource: ' + update.object
  }

  // Build url
  var queryString = "?client_id="+ settings.CLIENT_ID;
  if(minIds[update.object]){
    queryString += '&min_id=' + minIds[update.object];
  } else {
    // If this is the first update, just grab the most recent.
    queryString += '&count=1';
  }
            
  var path = "/v1/" + resource + "/" + update['object_id'] + "/media/recent" + queryString    
  
  return path
}
exports.buildPath = buildPath 


