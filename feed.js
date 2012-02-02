var settings = require('./settings'),
    request = require('request'),
    async = require('async');
    
var minIds = {};      
var last30pics = [];  

exports.settings = settings;
exports.minIds = minIds; 
exports.last30pics = last30pics; 

// Process the feed updates data and return the new pics
function process(updates, picsCallback) { 
  var pics = [];      
  async.map(updates, function(update, callback) {
    var path = buildPath(update);
    if(path == null) {
      return callback(null, update);
    }

    request('https://api.instagram.com' + path, function (error, response, body) {
      console.log(body)
      if (!error && response.statusCode == 200) {
        var json = JSON.parse(body);    
        if(!json || !json.data) {
          console.log('Did not receive data for ' + path +':');
          console.log(data);
          return callback(null, update);
        }
        
        if(json.pagination.next_min_id) {
          minIds[update.object] = json.pagination.next_min_id;
        }

        for(idx in json.data) { 
          var media = json.data[idx];  

          var pic = {};
          pic.thumbnail = media.images.thumbnail;
          pic.user = media.user.full_name;
          pic.text = "";
          if(media.caption != null) {
            pic.text = media.caption.text;
            if(pic.text.length > 25) {
              pic.text = pic.text.substring(0, 25) + "...";
            }
          }
          
          pic.user = escape(pic.user)
          pic.text = escape(pic.text)
          
          pics.push(pic);     
          
          // Track last 15 pics
          last30pics.push(pic); 
          if(last30pics.length > 15) last30pics.shift();
        }
        
        return callback(null, update);
      } else {
        console.log('status:' + response.statusCode + ', body:' + body);
        return callback(null, update);
      }
    });
  }, function(err, updates){ 
       if(err != null) {
         console.log('ERROR:' + err);
         throw err;
       }
       console.log('Retorno pics' + JSON.stringify(pics));
       picsCallback(pics);
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
    var error = 'Unidentified resource: ' + update.object 
    console.log(error)
    return null
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


