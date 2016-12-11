var https = require('https');
var url = require('url');
var htmlRender = require('./htmlRender');
var config;

var send = function (notification) {
    var requestData = url.parse(config.hook);
    var attachments = [];

    notification.items.forEach(trackerNewItems => {
        var i = 0;
        while (i < trackerNewItems.items.length) {
            var attachment = {};
            var currentFilter = trackerNewItems.items[i].filterUrl;
            attachment.title = trackerNewItems.tracker.name;
            attachment.title_link = currentFilter;
            var text = [];
            while (i < trackerNewItems.items.length && currentFilter == trackerNewItems.items[i].filterUrl) {
                var item = trackerNewItems.items[i];
                text.push(`<${item.url}|${item.title}>`);
                i++;
            }
            attachment.text = text.join('\n');
            attachments.push(attachment);
        }
    });
    
    var postData = 'payload=' + JSON.stringify({
        'text': config.text,
        'attachments': attachments
    });

    requestData.method = 'POST';
    requestData.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    };
    
    return new Promise((resolve, reject) => {
        var request = https.request(requestData, response => {
            response.on('data', () => false);
            response.on('end', () => resolve(true));
        });

        request.on('error', reject);
        request.write(postData);
        request.end();
    });
};

module.exports = function (params) {
    config = params;
    return send;
};