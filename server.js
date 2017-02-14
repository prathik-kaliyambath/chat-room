var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];

server.listen(process.env.PORT|| 3000);
console.log("Server up");

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

io.sockets.on('connection',function(socket){
    connections.push(socket);

    socket.on('disconnect',function(data){
        if(!socket.username){
            return;
        }
        users.splice(users.indexOf(socket.username),1);
        refreshUsers();
        connections.splice(connections.indexOf(socket),1);
    });
    socket.on('send',function(data){
        io.sockets.emit('new message',{message:data,username:socket.username});
    });

    socket.on('new user',function(data,cb){
        cb(true);
        socket.username= data;
        users.push(socket.username);
        refreshUsers();
    });

    function refreshUsers(){
        io.sockets.emit('get users',users);
    }
});