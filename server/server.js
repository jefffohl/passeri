var fs = require('fs');
var http = require('http');
var logFile = fs.createWriteStream('./express.log', {flags: 'a'}); //use {flags: 'w'} to open in write mode
var express = require('express');
var config = require('./config.js');
var proxy = require('./lib/proxy');
require('express-namespace');
var app = express();
var server = http.createServer(app);

app.namespace('/twitter/:*', function() {
  app.all('/', proxy());
});
require('./lib/routes/static').addRoutes(app, config); // Handles the static assets, such as images, css, etc.

app.use(express.logger({stream: logFile})); // Log to express.log file
app.use(express.bodyParser());
require('./lib/routes/appFile').addRoutes(app, config);

// A standard error handler - it picks up any left over errors and returns a nicely formatted server 500 error
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Start up the server on the port specified in the config
server.listen(config.server.listenPort, '0.0.0.0', 511, function() {
  // // Once the server is listening we automatically open up a browser
  //var open = require('open');
  //open('http://localhost:' + config.server.listenPort + '/');
});
console.log('Passeri Server - listening on port: ' + config.server.listenPort);
