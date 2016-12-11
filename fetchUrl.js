var url = require('url');
var http = require('http');
var https = require('https');

module.exports = urlToFetch => new Promise((resolve, reject) => {
    var requestData = url.parse(urlToFetch);
    
    if (!requestData.port) {
        requestData.port = requestData.protocol === 'https:' ? 443 : 80;
    }
    
    requestData.headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'
    };
    
    requestData.method = 'GET';
    
    var module = requestData.protocol === 'https:' ? https : http;

    var request = module.request(requestData, response => {
        var chunks = [];
        response.on('data', chunk => chunks.push(chunk));
        response.on('end', () => resolve(chunks.join('')));
    });

    request.on('error', reject);
    request.end();
});