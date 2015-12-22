var express = require('express');
var router = express.Router();
var sign = require('../sign');
var config = require('../config');
var mongo = require('mongoskin');
var APIGatewayHost = 'localhost';
var APIGatewayPort = '3007';
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/awsconfig.json');

//initialize AWS SQS
var sqs = new AWS.SQS();
var sqsSetParams = {
    QueueUrl: "https://sqs.us-east-1.amazonaws.com/315360975270/microservice",
    Attributes: {
        'Policy': JSON.stringify({})
    }
};

//set SQS attribute
sqs.setQueueAttributes(sqsSetParams, function(err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
});

var sqsSendParams = {
    QueueUrl: "https://sqs.us-east-1.amazonaws.com/315360975270/microservice",
    MessageAttributes: {
        someKey: { DataType: 'String', StringValue: "string"}
    }
};

var sendMessage = function (obj) {
    sqsSendParams.MessageBody = JSON.stringify(obj);
    //send message to SQS
    console.log('send message');
    sqs.sendMessage(sqsSendParams, function (err, data) {
        if (err) console.log(err, err.stack);
    });
};

router.post('/students', function (req, res, next) {
    var obj = {
        type: "students",
        method: "post",
        url: req.url,
        body: req.body
    };
    sendMessage(obj);
    
    res.contentType('json');
    res.send(JSON.stringify({RET: 500, status: "internal error"}));
});

router.get('/students/:sid', function (req, res, next) {
    var obj = {
        type: "students",
        method: "get",
        url: req.url
    };
    sendMessage(obj);
});

router.put('/students/:sid', function (req, res, next) {
    var obj = {
        type: "students",
        method: "put",
        url: req.url,
        body: req.body
    };
    sendMessage(obj);
});

router.delete('/students/:sid', function (req, res, next) {
    var obj = {
        type: "students",
        method: "delete",
        url: req.url,
        body: req.body
    };
    sendMessage(obj);
});

router.post('/finance', function (req, res, next) {
    var obj = {
        type: "finance",
        method: "post",
        url: req.url,
        body: req.body
    };
    sendMessage(obj);
});

router.get('/finance/:sid', function (req, res, next) {
    var obj = {
        type: "finance",
        method: "get",
        url: req.url
    };
    sendMessage(obj);
});

router.put('/finance/:sid', function (req, res, next) {
    var obj = {
        type: "finance",
        method: "put",
        url: req.url,
        body: req.body
    };
    sendMessage(obj);
});

router.delete('/finance/:sid', function (req, res, next) {
    var obj = {
        type: "finance",
        method: "delete",
        url: req.url,
        body: req.body
    };
    sendMessage(obj);
});




//router.get('/courses', function(req, res, next) {
//    sign.finds(req, res, APIGatewayHost, APIGatewayPort);
//});
//
//router.get('/courses/:id', function(req, res, next) {
//    sign.finds(req, res, APIGatewayHost, APIGatewayPort);
//});
//
//router.put('/courses/:id', function(req, res, next) {
//    sign.finds(req, res, APIGatewayHost, APIGatewayPort);
//});
//
///*router.post('/findCourses', function(req, res, next) {
//    var server = config.find('courses', req.body.name[0]);
//    var serverlist = server.split(':');
//    sign.finds(req,res,serverlist[0],serverlist[1]);
//});*/
//
//router.post('/courses', function(req, res, next) {
//    sign.finds(req, res, APIGatewayHost, APIGatewayPort);
//});
//
//router.post('/courses/:cid/students/:sid', function(req, res, next) {
//    sign.finds(req, res, APIGatewayHost, APIGatewayPort);
//});
//
//router.delete('/courses/:id', function(req, res, next) {
//    sign.finds(req, res, APIGatewayHost, APIGatewayPort);
//});
//
//router.delete('/courses/:cid/students/:sid', function(req, res, next) {
//    sign.finds(req, res, APIGatewayHost, APIGatewayPort);
//});
//
//router.post('/servers', function(req, res, next) {
//    sign.finds(req, res, APIGatewayHost, APIGatewayPort);
//});
//
//router.get('/students', function(req, res, next) {
//    sign.finds(req, res, APIGatewayHost, APIGatewayPort);
//});
//
//
//router.get('/students/:id', function(req, res, next) {
//    sign.finds(req, res, APIGatewayHost, APIGatewayPort);
//});
//
//router.post('/students', function(req, res, next) {
//    sign.finds(req, res, APIGatewayHost, APIGatewayPort);
//});
//
//router.put('/students/:id', function(req, res, next) {
//    sign.finds(req, res, APIGatewayHost, APIGatewayPort);
//});
//
//router.delete('/students/:id/', function(req, res, next) {
//    sign.finds(req, res, APIGatewayHost, APIGatewayPort);
//});

/*router.post('/findStudents', function(req, res, next) {
    var server = config.find('students', req.body.name[0]);
    var serverlist = server.split(':');
    sign.finds(req,res,serverlist[0],serverlist[1]);
});*/
//DataModel change & Partition
//router.post('/students/models', function(req, res, next) {
//    sign.finds(req, res, APIGatewayHost, APIGatewayPort);
//});

/*router.delete('/students/models', function(req, res, next) {
    config.Partition();
	var servers = config.getServerList('students');
    for(var index = 0; index < servers.length; index++) {
        var serverlist = servers[index].split(':');
        sign.findforDataModel(req, res, serverlist[0], serverlist[1], '/students/models');
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});*/
//router.post('/courses/models', function(req, res, next) {
//    sign.finds(req, res, APIGatewayHost, APIGatewayPort);
//});

/*router.delete('/courses/models', function(req, res, next) {
    config.Partition();
    var servers = config.getServerList('courses');
    for(var index = 0; index < servers.length; index++) {
        var serverlist = servers[index].split(':');
        sign.findforDataModel(req, res, serverlist[0], serverlist[1], '/courses/models');
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});*/


/*router.post('/studentsPartition/:splitChars', function(req, res, next) {
	var servers = config.getServerParitition('students');
    var splitChars = req.params.splitChars;
    var num = servers.length;
    if (splitChars.length/2.0 > num)
        res.send(JSON.stringify({ RET:400,status:"bad request",info:"The length should be twice as the number of available servers." }));
    else if (splitChars.length/2.0 < num)
        res.send(JSON.stringify({ RET:400,status:"bad request",info:"The length should be twice as the number of available servers." }));
    else if (splitChars[0] != '0' || splitChars[splitChars.length-1] != '9')
        res.send(JSON.stringify({ RET:400,status:"bad request",info:"The first should be 0 and the last should be 9." }));
    else {
        var list = new Array();
        var studentservers = config.getServerList('students');
        config.setPartition('students',splitChars);
        
        for(var index = 0; index < studentservers.length; index++) {
            var serverlist = studentservers[index].split(':');
            sign.findforPartition(req, res, serverlist[0], serverlist[1],
                '/students/repartition',
                splitChars[index*2],splitChars[index*2+1],function(data){
                    var jsonObj=JSON.parse(data);
                    console.log(JSON.stringify(jsonObj));
                    for(var i=0,size=jsonObj.length;i<size;i++){
                        var record=jsonObj[i];
                        var server = config.find('students', record.id[1]);
                        var serverlist2 = server.split(':');
                        sign.findforResendData(req, res, serverlist2[0], serverlist2[1],'/students',record);
                    }
                });
        }
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});

router.get('/coursesPartition', function(req, res, next) {
	var servers = config.getServerParitition('courses');
    res.send(servers);
});

router.post('/coursesPartition/:splitChars', function(req, res, next) {
	var servers = config.getServerParitition('courses');
    var splitChars = req.params.splitChars;
    var num = servers.length;
    if (splitChars.length/2.0 > num)
        res.send(JSON.stringify({ RET:400,status:"bad request",info:"The length should be twice as the number of available servers." }));
    else if (splitChars.length/2.0 < num)
        res.send(JSON.stringify({ RET:400,status:"bad request",info:"The length should be twice as the number of available servers." }));
    else if (splitChars[0] != '0' || splitChars[splitChars.length-1] != '9')
        res.send(JSON.stringify({ RET:400,status:"bad request",info:"The first should be 0 and the last should be 9." }));
    else {
        var list = new Array();
        var courseservers = config.getServerList('courses');

        config.setPartition('courses',splitChars);
        
        for(var index = 0; index <courseservers.length; index++) {
            var serverlist = courseservers[index].split(':');
            sign.findforPartition(req, res, serverlist[0], serverlist[1],
                '/courses/repartition',
                splitChars[index*2],splitChars[index*2+1],function(data){
                var jsonObj=JSON.parse(data);
                for(var i=0,size=jsonObj.length;i<size;i++){
                    var record=jsonObj[i];
                    var server = config.find('courses', record.id[1]);
                    console.log(record);
                    var serverlist2 = server.split(':');                   
                    sign.findforResendData(req, res, serverlist2[0], serverlist2[1],'/s',record);
                }
            });
        }
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});*/
module.exports = router;

