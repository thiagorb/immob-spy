var htmlRender = require('./htmlRender');
var sendmail = require('sendmail')({
    silent: true
});

var config;

var sendMail = function (notification) {
    var data = {
      from: config.sender,
      to: config.recipients,
      subject: config.subject,
      html: htmlRender(notification)
    };
    
    return new Promise((resolve, reject) => {
        sendmail(
            data,
            (err, reply) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            }
        );
    });
};

module.exports = function (params) {
    config = params;
    return sendMail;
};