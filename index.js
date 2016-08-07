let restify = require('restify'),
    cookies = require('restify-cookies'),
    appPackage = require('./package');

let server = restify.createServer(appPackage),
    port = 4201,
    appUrl = 'http://localhost:4200/profile';

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(cookies.parse);

server.get('/api/23andme', function(req, res, next) {
    if (req.cookies['23andme'] !== 'connected') {
        res.setCookie('23andme', 'connected');
    }
    res.redirect(appUrl, next);
    return next();
});

server.listen(port, function() {
    console.log(server.name + ' running on ' + server.url);
});
