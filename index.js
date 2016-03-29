var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    usersArray = [],
    moment = require('moment');
    
server.listen(process.env.PORT || 3000);  
        
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
    
app.get('/', function(req,res){
    res.render('index');
});

io.on('connection', function (socket) {
    socket.on('new user', function (data,callback){
      //Check if the user already exists
          if (usersArray.indexOf(data) != -1){
              callback(false);
          }else{
              callback(true);
              socket.username = data;
              usersArray.push(socket.username);
              updateUsernames();
          }   
          });
          
    function updateUsernames() {
                io.sockets.emit('register user', usersArray);
    }
    
    socket.on('send message', function (data) {
      io.sockets.emit('new message', {msg: data, user: socket.username, timestamp:moment().calendar()});
          });
          
    // Disconnect
	socket.on('disconnect', function(data){
		if(!socket.username) return;
		usersArray.splice(usersArray.indexOf(socket.username), 1);
		updateUsernames();
	});  
});

  
    