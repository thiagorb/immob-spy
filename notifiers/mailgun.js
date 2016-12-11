var htmlRender = require('./htmlRender');
var mailgun;
var config;

var sendMail = function (notification) {
    var data = {
      from: config.sender,
      to: config.recipients,
      subject: config.subject,
      html: htmlRender(notification)
    };
    
    return new Promise((resolve, reject) => {
        mailgun.messages().send(data, function (error, body) {
            if (error) {
                return reject(error);
            }
    
            resolve();
        });
    });
};

module.exports = function (params) {
    config = params;
    
    mailgun = require('mailgun-js')({
        apiKey: config.apiKey,
        domain: config.domain
    });
    
    return sendMail;
};