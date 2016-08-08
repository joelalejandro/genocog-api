let request = require('request-promise'),
    config = require('config'),
    bluebird = require('bluebird'),
    fs = require('fs');

let genocogSettings = config.get('genocog'),
    api = config.get('api23andme');

module.exports = function(req, res, next) {
    let accessToken = req.header('X-Genocog-AT');

    if (!accessToken) {
        res.status(new UnauthorizedError());
        
        return next();
    }

    let headers = {
        'Authorization': 'Bearer ' + accessToken
    };

    let data = {};
    
    request({
        url: api.url + '/1/demo/names/',
        headers: headers,
        json: true
    }).then(function(body) {
        data.firstName = body.first_name;
        data.lastName = body.last_name;
        data.userId = body.id;
        data.profiles = body.profiles;

        fs.writeFile('data/profiles/' + data.userId + '.json', JSON.stringify(data));

        let requestSex = request({
            url: api.url + '/1/demo/phenotypes/' + data.profiles[0].id + '/sex/',
            headers: headers,
            json: true
        });
        let requestDateOfBirth = request({
            url: api.url + '/1/demo/phenotypes/' + data.profiles[0].id + '/date_of_birth/',
            headers: headers,
            json: true
        });
        let requestGenome = request({
            url: api.url + '/1/demo/genomes/' + data.profiles[0].id + '/',
            headers: headers,
            json: true
        });

        let requests = [requestSex, requestDateOfBirth, requestUser];

        /* */ 
        bluebird.all(requests).then(function(sexData, dobData, genomeData) {
            data.sex = sexData.value;
            data.dateOfBirth = dobData.value;
            data.genome = genomeData.genome;
            //data.user = userData;

            fs.writeFile('data/profiles/' + data.userId + '.json', JSON.stringify(data));
        }).catch(function(err) {
            console.log('Failed request'); 
        });
    });

    return next();
};
