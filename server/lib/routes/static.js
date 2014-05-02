var express = require('express');

exports.addRoutes = function(app, config) {
  // Serve up the favicon
  // app.use(express.favicon(config.server.distFolder + '/favicon.ico'));
  // First looks for a static file: index.html, css, images, etc.
  app.use(config.server.staticUrl, express.compress());
  app.use(config.server.staticUrl, express.static(config.server.distFolder));
  // serve robots.txt
  app.use(function (req, res, next) {
    if ('/robots.txt' === req.url) {
        res.type('text/plain');
        res.send(config.server.robots);
    } else {
        next();
    }
  });
  app.use(config.server.staticUrl, function(req, res, next) {
    res.send(404); // If we get here then the request for a static file is invalid
  });
};
