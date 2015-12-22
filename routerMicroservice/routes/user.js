var express = require('express');
var router = express.Router();
var sign = require('../sign');
var config = require('../config');
var mongo = require('mongoskin');
var APIGatewayHost = 'localhost';
var APIGatewayPort = '3007';
var AWS = require('aws-sdk');
var uuid = require('node-uuid');

AWS.config.loadFromPath('../config/awsconfig.json');

//initialize AWS SQS
var sqs = new AWS.SQS();
AWS.config.loadFromPath('./config/awsconfig.json');

//initialize AWS SQS
var sqs = new AWS.SQS();
var sqsSetParams = {
    QueueUrl: "https://sqs.us-east-1.amazonaws.com/315360975270/microservice",
    Attributes: {
        'Policy': JSON.stringify({})
    }
};


//send messages
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



//receive messages
var getMessageFromSQS = function (res, id) {
    var sqsRecieveParams = {
        QueueUrl: ""
    };
    sqs.receiveMessage(sqsRecieveParams, function (err, data) {
        if (data && data.Messages && data.Messages.length > 0) {
            var len = data.Messages.length;
            for (var i = 0; i < len; i++) {
                console.log('receive message');
                var message = data.Messages[i];
                if  (JSON.parse(message).Body.id == id)
                    res.send(message);
                deleteMessageFromSQS(message);
            }
        }
    });
};

//delete message from SQS
var deleteMessageFromSQS = function (message) {
    var sqsDeleteParams = {
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/880415752810/microservice",
        ReceiptHandle: message.ReceiptHandle
    };
    sqs.deleteMessage(sqsDeleteParams, function (err, data) {
        if (err) console.log(err);
    });
};




router.post('/students', function (req, res, next) {
    var obj = {
        id: uuid.v1(),
        type: "students",
        method: "post",
        url: req.url,
        body: req.body
    };
    sendMessage(obj);
    setInterval(getMessageFromSQS(res, id), 10);
});

router.get('/students/:sid', function (req, res, next) {
    var obj = {
        id: uuid.v1(),
        type: "students",
        method: "get",
        url: req.url
    };
    sendMessage(obj);
    setInterval(getMessageFromSQS(res, id), 10);
});

router.put('/students/:sid', function (req, res, next) {
    var obj = {
        id: uuid.v1(),
        type: "students",
        method: "put",
        url: req.url,
        body: req.body
    };
    sendMessage(obj);
    setInterval(getMessageFromSQS(res, id), 10);
});

router.delete('/students/:sid', function (req, res, next) {
    var obj = {
        id: uuid.v1(),
        type: "students",
        method: "delete",
        url: req.url,
        body: req.body
    };
    sendMessage(obj);
    setInterval(getMessageFromSQS(res, id), 10);
});

router.post('/finance', function (req, res, next) {
    var obj = {
        id: uuid.v1(),
        type: "finance",
        method: "post",
        url: req.url,
        body: req.body
    };
    sendMessage(obj);
    setInterval(getMessageFromSQS(res, id), 10);
});

router.get('/finance/:sid', function (req, res, next) {
    var obj = {
        id: uuid.v1(),
        type: "finance",
        method: "get",
        url: req.url
    };
    sendMessage(obj);
    setInterval(getMessageFromSQS(res, id), 10);
});

router.put('/finance/:sid', function (req, res, next) {
    var obj = {
        id: uuid.v1(),
        type: "finance",
        method: "put",
        url: req.url,
        body: req.body
    };
    sendMessage(obj);
    setInterval(getMessageFromSQS(res, id), 10);
});

router.delete('/finance/:sid', function (req, res, next) {
    var obj = {
        id: uuid.v1(),
        type: "finance",
        method: "delete",
        url: req.url,
        body: req.body
    };
    sendMessage(obj);
    setInterval(getMessageFromSQS(res, id), 10);
});

module.exports = router;

