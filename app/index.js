/* jslint node: true */

var express = require('express');
var path = require('path');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dev = process.argv[2] === '-dev';

var PUBLIC = !dev ? '/public/' : '/../dev/';

function showSlides(request, response) {
  response.render('index.html');
}

function showController(request, response) {
  response.render('controller.html');
}

function onConnection(socket) {

  socket.on('ttr:right', function() {
    io.emit('ttr:right');
  });

  socket.on('ttr:left', function() {
    io.emit('ttr:left');
  });

  socket.on('ttr:drop', function() {
    io.emit('ttr:drop');
  });

  socket.on('ttr:rotatecw', function() {
    io.emit('ttr:rotatecw');
  });

  socket.on('ttr:rotateccw', function() {
    io.emit('ttr:rotateccw');
  });

}

function init() {
  app.set('views', __dirname + PUBLIC);
  app.engine('.html', require('nunjucks').render);
  app.use(express.static(path.join(__dirname, PUBLIC)));
  app.get('/', showSlides);
  app.get('/c', showController);
  io.on('connection', onConnection);
  http.listen(8000);
}

init();
