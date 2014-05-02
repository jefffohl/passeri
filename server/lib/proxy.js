var url = require('url');
var config = require('../config.js');
var cookie = require('cookie');
var http = require('http');

// For debugging with Charles proxy:
/*
var tunnel = require('tunnel');
var tunnelingAgent = tunnel.httpOverHttp({
  maxSockets: 5, // Defaults to 5
  proxy: {
    host: 'localhost',
    port: 8888 // default Charles proxy port
  }
});
*/
module.exports = function() {
  console.log('Proxying Passeri at', config.twitter.apiUrl);

  // adds the proper hostname, protocol, and pathname to the request, taken from the basePath, above.
  // @Returns a parsed Url object

  var mapUrl = module.exports.mapUrl = function(reqUrlString) {
    var basePath = url.parse(config.twitter.apiUrl);
    var reqUrl = url.parse(reqUrlString, true);
    var path = reqUrl.pathname;
    if(reqUrl.search) {
      path += reqUrl.search;
    }
    var newUrl = {
      hostname: basePath.hostname,
      protocol: basePath.protocol,
      path: path
    };
    return newUrl;
  };

  // Map the incoming request to a request to the API
  // This creates an object with the proper values that can be used by the node request.
  var mapRequest = module.exports.mapRequest = function(req) {
    var newReq = mapUrl(req.url);
    newReq.method = req.method;
    newReq.headers = req.headers || {};
    newReq.body = req.body;
    // add Basic Auth header

    return newReq;
  };

  // this is the returned function object when this module is called. See server.js for the function call.
  var proxy = function(req, res, next) {
    try {
      var options = mapRequest(req);
      //Create the request to the db
      var dbReq = http.request(options, function(dbRes) {
        var data = "";
        // In this callback function, we are handling the response from the API server.
        dbRes.setEncoding('utf8');
        dbRes.on('data', function(chunk) {
          // Pass back any data from the response.
          data = data + chunk;
        });
        // send data to the SpatialPooler
      });
      // Send any data the is passed from the original request
    } catch (error) {
      console.log('ERROR: ', error.stack);
      res.json(error);
    }
  };

  return proxy;
};
