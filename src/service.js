var config = require("./config.js");
var http = require("http");

function getResult(param,callback){
    var dependencyName = param.dependencyName;
    var groupId = param.groupId;
    var url = config.URL+dependencyName+config.param;
    http.get(url,function(res){
        var data="";
        res.on("data",function(chunk){
            data += chunk.toString();
        });
        res.on("end",function(){
            var finalData = JSON.parse(data).response;
            var flag = false;
            // console.log(JSON.parse(data).response);
            for(var i = 0;i<finalData.docs.length;i++){
                if(finalData.docs[i].g === groupId){
                    // console.log(finalData.docs[i]);
                    flag = true;
                    callback(finalData.docs[i].latestVersion);
                    break;
                }
            }
            if(!flag){
                callback("none");
            }
        });
    });
}
// getResult("junit","junit");
exports.search = getResult;