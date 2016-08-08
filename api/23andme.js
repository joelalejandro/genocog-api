let request = require('request-promise'),
    config = require('config'),
    TokenData = require('../lib/token-data'),
    fs = require('fs');

let genocogSettings = config.get('genocog');

let saveToken = function(token) {
    let tokenStore = JSON.parse(fs.readFileSync('data/tokens.json'));
    
    tokenStore.tokens.push(new TokenData(token));

    fs.writeFileSync('data/tokens.json', JSON.stringify(tokenStore));    
};

module.exports = function(req, res, next) {
    let settings = config.get('api23andme');

    settings.token_request_data.code = req.params.code;

    request({
        method: 'POST',
        url: settings.url + 'token',
        form: settings.token_request_data,
        json: true
    }).then(function(body) {
        saveToken(body);
        res.setCookie('api23andme', body);        
        res.redirect(genocogSettings.start_url, next);
        next();
    });
};
