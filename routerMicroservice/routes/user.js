var express = require('express');
var router = express.Router();
var sign = require('../sign');
var config = require('../config');
var mongo = require('mongoskin');
var APIGatewayHost = 'localhost';
var APIGatewayPort = '3007';
var AWS = require('aws-sdk');
var uuid = require('node-uuid');

//initialize AWS SQ
AWS.config.loadFromPath('./config/awsconfig.json');

var sqs = new AWS.SQS();



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
        if (err) {
            console.log(err, err.stack);
        }
    });
};



//receive messages
var getMessageFromSQS = function (res, id) {
    var sqsRecieveParams = {
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/315360975270/microservice2"
    };
    sqs.receiveMessage(sqsRecieveParams, function (err, data) {
        if (data && data.Messages && data.Messages.length > 0) {
            var len = data.Messages.length;
            for (var i = 0; i < len; i++) {
                console.log('receive message');
                var message = data.Messages[i];
                console.log('aaaaaaaaa');
                console.log(JSON.parse(message.Body).id);
                if  (JSON.parse(message.Body).id == id) {
                    console.log('d');
                    res.send(message.Body);
                    deleteMessageFromSQS(message);
                }
            }
        }
    });
};

//delete message from SQS
var deleteMessageFromSQS = function (message) {
    var sqsDeleteParams = {
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/315360975270/microservice2",
        ReceiptHandle: message.ReceiptHandle
    };
    sqs.deleteMessage(sqsDeleteParams, function (err, data) {
        if (err) {
            console.log(err);
        }
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
    console.log("asdsadasdad");
    console.log(obj.id);
    setInterval(function() {getMessageFromSQS(res, obj.id);}, 10);
    //getMessageFromSQS(res, obj.id);
});

router.get('/students/:sid', function (req, res, next) {
    var obj = {
        id: uuid.v1(),
        type: "students",
        method: "get",
        url: req.url
    };
    sendMessage(obj);
    setInterval(function() {getMessageFromSQS(res, obj.id);}, 10);
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
    setInterval(function() {getMessageFromSQS(res, obj.id);}, 10);
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
    setInterval(function() {getMessageFromSQS(res, obj.id);}, 10);
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
    setInterval(function() {getMessageFromSQS(res, obj.id);}, 10);
});

router.get('/finance/:sid', function (req, res, next) {
    var obj = {
        id: uuid.v1(),
        type: "finance",
        method: "get",
        url: req.url
    };
    sendMessage(obj);
    setInterval(function() {getMessageFromSQS(res, obj.id);}, 10);
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
    setInterval(function() {getMessageFromSQS(res, obj.id);}, 10);
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
    setInterval(function() {getMessageFromSQS(res, obj.id);}, 10);
});

module.exports = router;

