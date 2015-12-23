var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/user'); // main router
var app = express();
var AWS = require('aws-sdk');
var sign = require('./sign');
var config = require('./config');
AWS.config.loadFromPath('./config/awsconfig.json');
var sqs = new AWS.SQS();


/*var collectionName = 'serverlist';
var obj = {
      "category": "students",
      "server": "localhost",
      "port": 3004,
      "start": "A",
      "end": "H"
    };
var obj2 = {
      "category": "students",
      "server": "localhost",
      "port": 3005,
      "start": "I",
      "end": "P"
    };
var obj3 = {
      "category": "students",
      "server": "localhost",
      "port": 3006,
      "start": "Q",
      "end": "Z"
    };
var obj4 = {
      "category": "courses",
      "server": "localhost",
      "port": 3001,
      "start": "A",
      "end": "H"
    };
var obj5 = {
      "category": "courses",
      "server": "localhost",
      "port": 3002,
      "start": "I",
      "end": "P"
    };
var obj6 = {
      "category": "courses",
      "server": "localhost",
      "port": 3003,
      "start": "Q",
      "end": "Z"
    };
db.collection(collectionName).insert(obj, function (err, result) {})
db.collection(collectionName).insert(obj2, function (err, result) {})
db.collection(collectionName).insert(obj3, function (err, result) {})
db.collection(collectionName).insert(obj4, function (err, result) {})
db.collection(collectionName).insert(obj5, function (err, result) {})
db.collection(collectionName).insert(obj6, function (err, result) {})*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
//app.use(express.static(path.join(__dirname, 'public')));

//import database
app.use(function(req,res,next){
    req.db = db;
    console.log("here");
    next();
});

//middleware, distribute 192.168.1.1:3000/api/ to router 'users'
app.use('/', routes);
app.use('/api', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});






//receieve messages
var getMessageFromSQS = function () {
    var sqsRecieveParams = {
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/315360975270/microservice"
    };
    //receive message from SQS
    sqs.receiveMessage(sqsRecieveParams, function (err, data) {
        if (data && data.Messages && data.Messages.length > 0) {
            var len = data.Messages.length;
            for (var i = 0; i < len; i++) {
                console.log('receive message');
                var message = data.Messages[i];
                var obj = JSON.parse(message.Body);
                deleteMessageFromSQS(message);
                var servers = config.getServerList(obj.type);
                var serverlist = servers.split(':');
                sign.findSpecific(serverlist[0],serverlist[1], obj.method, obj.url, obj.body, obj.id, function(data){
                    sendMessage(data);
                });
                
            }
        }
    });
};

setInterval(getMessageFromSQS, 10);

//delete message from SQS
var deleteMessageFromSQS = function (message) {
    console.log("message");
    var sqsDeleteParams = {
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/315360975270/microservice",
        ReceiptHandle: message.ReceiptHandle
    };
    sqs.deleteMessage(sqsDeleteParams, function (err, data) {
        if (err) console.log(err);
    });
};




//send Messages
var sqsSendParams = {
    QueueUrl: "https://sqs.us-east-1.amazonaws.com/315360975270/microservice2",
    MessageAttributes: {
        someKey: { DataType: 'String', StringValue: "string"}
    }
};

var sendMessage = function (obj) {
    sqsSendParams.MessageBody = JSON.stringify(obj);
    //send message to SQS
    console.log('send message');
    console.log(obj);
    sqs.sendMessage(sqsSendParams, function (err, data) {
        if (err) console.log(err, err.stack);
    });
};










module.exports = app;
