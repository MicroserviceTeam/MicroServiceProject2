var fs=require('fs');
var sign = require('./sign');

var configFile = './config.json';


exports.getServerList = function(category) {
    data = fs.readFileSync(configFile);
    console.log(data);
    var jsonObj=JSON.parse(data);
    for(var i=0,size=jsonObj.length;i<size;i++){
        var record=jsonObj[i];
        if (category == record['category'] ) {
            return record['server'];
        }
    }
    return "Not found";
};
