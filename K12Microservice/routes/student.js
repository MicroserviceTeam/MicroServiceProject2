/**
 * Created by jingxiaogu on 11/01/15.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var AWS = require('aws-sdk');
var table = "K12StudentInfo";
AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});
var dynamodb = new AWS.DynamoDB();
var dynamodbDoc = new AWS.DynamoDB.DocumentClient();

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return hour + ":" + min + ":" + sec + " " + month + "/" + day + "/" + year;
}

//Add a new course
router.post('/students', function (req, res, next) {
    var studentID = req.body.studentID;
    var studentName = req.body.studentName;
    if (studentID == null || studentName == null) {
        res.send(JSON.stringify({ RET:402,status:"wrong JSON format" }));
    }
    var elementary_school = req.body.elementary_school;
    var elementary_school_enrolling_date = req.body.elementary_school_enrolling_date;
    var elementary_school_graduate_date = req.body.elementary_school_graduate_date;
    var middle_school = req.body.middle_school;
    var middle_school_enrolling_date = req.body.middle_school_enrolling_date;
    var middle_school_graduate_date = req.body.middle_school_graduate_date;
    var high_school = req.body.high_school;
    var high_school_enrolling_date = req.body.high_school_enrolling_date;
    var high_school_graduate_date = req.body.high_school_graduate_date;
    var college = req.body.college;
    var college_enrolling_date = req.body.college_enrolling_date;
    var college_graduate_date = req.body.college_graduate_date;
    var params = {
        TableName:table,
        Item:{
            "studentID": studentID,
            "studentName": studentName,
            "elementary_school": elementary_school,
            "elementary_school_enrolling_date": elementary_school_enrolling_date,
            "elementary_school_graduate_date": elementary_school_graduate_date,
            "middle_school": middle_school,
            "middle_school_enrolling_date": middle_school_enrolling_date,
            "middle_school_graduate_date": middle_school_graduate_date,
            "high_school": high_school,
            "high_school_enrolling_date": high_school_enrolling_date,
            "high_school_graduate_date": high_school_graduate_date,
            "college": college,
            "college_enrolling_date": college_enrolling_date,
            "college_graduate_date": college_graduate_date,
            "last_modified_time": getDateTime()
        },
        ConditionExpression: "#id <> :stuID",
        ExpressionAttributeNames:{"#id":"studentID"},
        ExpressionAttributeValues:{
            ":stuID": studentID
        }
    };
    console.log(params);          
    
    dynamodbDoc.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            res.contentType('json');
            res.send(JSON.stringify({ RET:500,status: "internal error"}));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            res.contentType('json');
            res.send(JSON.stringify({ RET:200,status:"success"}));
        }
    });
});

function updateAttr(path, id, value, res){
    var params = {
        TableName:table,
        Key:{
            "studentID": id
        },
        UpdateExpression: path,
        ExpressionAttributeValues:{
            ":r":value
        },
        ReturnValues:"UPDATED_NEW"
    };
    dynamodbDoc.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            res.contentType('json');
            res.send(JSON.stringify({RET: 500, status: "internal error"}));
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            
        }
    });
}
//modify a course's information
router.put('/students/:sid', function (req, res, next) {
    var id = req.params.sid;
    if(req.body.studentName!=null){
        updateAttr("set studentName = :r", id, req.body.studentName, res);
    }
    if(req.body.elementary_school!=null){
        updateAttr("set elementary_school = :r", id, req.body.elementary_school, res);
    }
    if(req.body.elementary_school_enrolling_date!=null){
        updateAttr("set elementary_school_enrolling_date = :r", id, req.body.elementary_school_enrolling_date, res);
    }
    if(req.body.elementary_school_graduate_date!=null){
        updateAttr("set elementary_school_graduate_date = :r", id, req.body.elementary_school_graduate_date, res);
    }
    if(req.body.middle_school!=null){
        updateAttr("set middle_school = :r", id, req.body.middle_school, res);
    }
    if(req.body.middle_school_enrolling_date!=null){
        updateAttr("set middle_school_enrolling_date = :r", id, req.body.middle_school_enrolling_date, res);
    }
    if(req.body.middle_school_graduate_date!=null){
        updateAttr("set middle_school_graduate_date = :r", id, req.body.middle_school_graduate_date, res);
    }
    if(req.body.high_school!=null){
        updateAttr("set high_school = :r", id, req.body.high_school, res);
    }
    if(req.body.high_school_enrolling_date!=null){
        updateAttr("set high_school_enrolling_date = :r", id, req.body.high_school_enrolling_date, res);
    }
    if(req.body.high_school_graduate_date!=null){
        updateAttr("set high_school_graduate_date = :r", id, req.body.high_school_graduate_date, res);
    }
    if(req.body.college!=null){
        updateAttr("set college = :r", id, req.body.college, res);
    }
    if(req.body.college_enrolling_date!=null){
        updateAttr("set college_enrolling_date = :r", id, req.body.college_enrolling_date, res);
    }
    if(req.body.college_graduate_date!=null){
        updateAttr("set college_graduate_date = :r", id, req.body.college_graduate_date, res);
    }
    updateAttr("set last_modified_time = :r", id, getDateTime(), res);
    res.contentType('json');
    res.send(JSON.stringify({RET: 200, status: "success"}));
});


//get a course's information by id
router.get('/students/:sid', function(req, res, next) {
    var params = {
        TableName : table,
        KeyConditionExpression: "#id = :stuID",
        ExpressionAttributeNames:{
            "#id": "studentID"
        },
        ExpressionAttributeValues: {
            ":stuID":req.params.sid
        }
    };

    dynamodbDoc.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            res.contentType('json');
            res.send(JSON.stringify({RET: 500, status: "internal error"}));
        } else if (data.Items.length == 0) {
            res.contentType('json');
            res.send(JSON.stringify({RET: 400, status: "student not found"}));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                console.log(item);
            });
            res.json(data.Items[0]);
        }
    });
});

//get all courses
router.get('/students', function(req, res, next) {
    
    var params = {
        TableName : table,
        FilterExpression : 'studentID <> :validID',
        ExpressionAttributeValues : {
            ':validID' : 'S'
        }
    };

    dynamodbDoc.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            res.contentType('json');
            res.send(JSON.stringify({RET: 500, status: "internal error"}));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                console.log(item);
            });
            res.json(data.Items);
        }
    });
});

//delete a course
router.delete('/students/:sid', function (req, res, next) {
    if(req.params.sid=='attributes'){
        var params = {
            TableName : table,
            FilterExpression : 'studentID <> :validID',
            ExpressionAttributeValues: {
                ":validID":'S'
            }
        };

        dynamodbDoc.scan(params, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                res.contentType('json');
                res.send(JSON.stringify({RET: 500, status: "internal error"}));
            } else {
                console.log("Query succeeded.");
                data.Items.forEach(function(item) {
                    var param = {
                        TableName : table,
                        Key : {
                            "studentID": item.studentID
                        },
                        UpdateExpression : "DELETE #attrName ",
                        ExpressionAttributeNames : {
                            "#attrName" : req.body.attributeName
                        },
                        ReturnValues : "UPDATED_NEW"
                    };
                    console.log("Updating the item...");
                    dynamodbDoc.update(param, function(err, data) {
                        if (err) {
                            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                        } else {
                            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                        }
                    });
                });
                res.contentType('json');
                res.send(JSON.stringify({RET: 200, status: "success"}));
            }
        });
    }else{
        var params = {
            TableName : table,
            Key:{
                "studentID":req.params.sid
            }
        };
        dynamodbDoc.delete(params, function(err, data) {
            if (err) {
                console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
                res.contentType('json');
                res.send(JSON.stringify({RET: 500, status: "internal error"}));
            } else {
                console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
                res.contentType('json');
                res.send(JSON.stringify({RET: 200, status: "success"}));
            }
        });
    }
    
});

router.post('/students/attributes', function (req, res, next) {
    var params = {
        TableName : table,
        FilterExpression : 'studentID <> :validID',
        ExpressionAttributeValues: {
            ":validID":'S'
        }
    };

    dynamodbDoc.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            res.contentType('json');
            res.send(JSON.stringify({RET: 500, status: "internal error"}));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                var param = {
                    TableName : table,
                    Key : {
                        "studentID": item.studentID
                    },
                    UpdateExpression : "set "+req.body.attributeName+" = :val2",
                    ExpressionAttributeValues : {
                        ":val2":req.body.attributeValue
                    },
                    ReturnValues : "UPDATED_NEW"
                };
                console.log("Updating the item...");
                dynamodbDoc.update(param, function(err, data) {
                    if (err) {
                        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                    } else {
                        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                    }
                });
            });
        }
        res.contentType('json');
        res.send(JSON.stringify({RET: 200, status: "success"}));
    });
});

module.exports = router;