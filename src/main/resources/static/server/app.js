'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug');
var http = require('http');
var config = require('./config/config.json')[process.env.NODE_ENV || "development"];
var viewPath = config.path;
var routes = require('./routes/index');
var port = normalizePort(process.env.PORT || '3000');


var app = express();

// view engine setup
app.engine('html', require('ejs').renderFile);
if(process.env.NODE_ENV === "development"){
  console.log("in development");
  // development인 경우, gulp가 .tmp 폴더에 컴포넌트들 inject한 html을 생성함. 따라서 그에 맞게 경로 설정해줌.
  app.use('/', express.static(path.join(__dirname, viewPath.index)));
  app.use('/app', express.static(path.join(__dirname, viewPath.view, 'app')));
  app.use('/assets', express.static(path.join(__dirname, viewPath.view, 'assets')));
  app.use('/bower_components', express.static(path.join(__dirname, viewPath.view, "bower_components")));
  app.use('/public', express.static(path.join(__dirname, "/../public")));
}
else{
  console.log("in production");
  // production인 경우, gulp가 전부 다 컴파일한 파일들을 생성하기 때문에 그것만 제대로 라우팅해주면 됨.
  app.use('/', express.static(path.join(__dirname, viewPath.index)));
  app.use('/public', express.static(path.join(__dirname, "/../public")));
}
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// routes 폴더에 명시된 라우팅 먼저 확인
app.use('/', routes);

// 없으면 angular url 라우팅.
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, viewPath.index, 'index.html'));
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status).send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status).send({
    message: err.message,
    error: {}
  });
});


app.set('port', port);
//models.sequelize.sync({logging:console.log});
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


