let restify = require('restify'),
    appPackage = require('./package');

let server = restify.createServer(appPackage),
    port = 4201,
    appUrl = 'http://localhost:4200/';

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/api/23andme', function(req, res, next) {
    res.redirect(appUrl, next);
    return next();
});

server.listen(port, function() {
    console.log(server.name + ' running on ' + server.url);
});
