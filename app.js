var __dirname = "."
var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');

// Module dependencies.  
//require.paths.unshift('./node_modules');

var express = require('express')
  , routes = require('./routes')
  , io = require('socket.io');

var app = module.exports = express.createServer()
  , io = io.listen(app);
         
// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

if(process.env.VMC_APP_PORT) {
    io.set('transports', [
        //'websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling'
    ]);
}

// Routes
app.get('/', routes.index);  

// Callback URL //
app.get('/callback', function(req, res){
	res.send(req.query['hub.challenge']);
});

app.post('/callback', function(req, res){  
	var pics = req.body;  
	io.sockets.emit('pics', pics);     
	res.send('ok');
}); 
       
// Web sockets
io.sockets.on('connection', function (socket) {
  socket.emit('news', { msg: 'connected' });
  socket.on('my other event', function (data) {
    console.log(data); 
  });
});

app.listen(port);
console.log("Server listening on port %d in %s mode", app.address().port, app.settings.env);
