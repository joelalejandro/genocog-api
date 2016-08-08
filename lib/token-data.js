let moment = require('moment');

module.exports = function(data) {
    this.accessToken = data.access_token || null;
    this.expiresIn = data.expires_in
                     ? moment().add(data.expires_in, 'seconds')
                     : null;
    this.refreshToken = data.refresh_token || null;
    this.scope = data.scope;
};
