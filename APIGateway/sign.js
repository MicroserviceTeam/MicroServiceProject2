var http = require('http');
var querystring = require('querystring');
var url = require('url');
var config = require('./config');
var util = require('util');

exports.findSpecific = function(thost,tport,tmethod, tpath, bodyObj, idObj, success) {

    var bodyQueryStr = bodyObj;
    console.log(bodyQueryStr);

    var contentStr = querystring.stringify(bodyQueryStr);
    var contentLen = Buffer.byteLength(contentStr, 'utf8');
    console.log(util.format('post data: %s, with length: %d', contentStr, contentLen));
    var httpModule = http;

    var opt = {
        host: thost,
        port: tport,
        path: '/api'+tpath,
        method: tmethod,
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': contentLen
        }
    };

    var req = httpModule.request(opt, function(httpRes) {
        var buffers = [];
        httpRes.on('data', function(chunk) {
            buffers.push(chunk);
        });

        httpRes.on('end', function(chunk) {
            var wholeData = Buffer.concat(buffers);
            var dataStr = wholeData.toString('utf8');

            console.log('content ' + wholeData);
            var dataObj = JSON.parse(wholeData);
            var data = [];

            if (Array.isArray(dataObj)) {
                data = dataObj;
                data.push(idObj);
            }
            else {
                data[0] = dataObj;
                data.push(idObj);
            }

            //dataObj.id=idObj;
            //success(dataObj);
            success(data);
        });
    }).on('error', function(err) {
        console.log('error ' + err);
        //res.send(JSON.stringify({ RET:500,status:"internal error" }));
    });

    req.write(contentStr);
    req.end();
}