var http = require('http');
var querystring = require('querystring');
var url = require('url');
var config = require('./config');
var util = require('util');

exports.find = function(req,res,thost,tport) {
    var output = '';
    var bodyQueryStr = req.body;
    console.log(bodyQueryStr);

    var contentStr = querystring.stringify(bodyQueryStr);
    var contentLen = Buffer.byteLength(contentStr, 'utf8');
    console.log(util.format('post data: %s, with length: %d', contentStr, contentLen));
    var httpModule = http;

    var opt = {
        host: thost,
        port: tport,
        path: '/api'+req.path,
        method: req.method,
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
            //res.send(wholeData);
        });
    }).on('error', function(err) {
        console.log('error ' + err);
        //res.send(JSON.stringify({ RET:500,status:"internal error" }));
    });

    req.write(contentStr);
    req.end();
}

exports.finds = function(req,res,thost,tport) {

    var bodyQueryStr = req.body;
    console.log(bodyQueryStr);

    var contentStr = querystring.stringify(bodyQueryStr);
    var contentLen = Buffer.byteLength(contentStr, 'utf8');
    console.log(util.format('post data: %s, with length: %d', contentStr, contentLen));
    var httpModule = http;

    var opt = {
        host: thost,
        port: tport,
        path: '/api'+req.path,
        method: req.method,
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
            res.send(wholeData);
            config.Partition();
        });
    }).on('error', function(err) {
        console.log('error ' + err);
        res.send(JSON.stringify({ RET:500,status:"internal error" }));
        config.Partition();
    });

    req.write(contentStr);
    req.end();
}
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
            if (dataObj.length == 1)
                dataObj.id=idObj;
            else
                dataObj[0].id = idObj;
            success(dataObj);
        });
    }).on('error', function(err) {
        console.log('error ' + err);
        //res.send(JSON.stringify({ RET:500,status:"internal error" }));
    });

    req.write(contentStr);
    req.end();
}