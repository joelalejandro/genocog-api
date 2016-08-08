let restify = require('restify'),
    cookies = require('restify-cookies'),
    appPackage = require('./package'),
    config = require('config');

let genocogSettings = config.get('genocog'),
    server = restify.createServer(appPackage),
    port = genocogSettings.api.port,
    routes = genocogSettings.api.routes,
    endpoints = {};

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(cookies.parse);

endpoints.api23andme = require('./api/23andme');
endpoints.genome = require('./api/genome');

server.get(routes.api23andme, endpoints.api23andme);
server.get(routes.genome, endpoints.genome);

server.listen(port, function() {
    console.log(server.name + ' running on ' + server.url);
});
