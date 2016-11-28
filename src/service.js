var config = require("./config.js");
var http = require("http");

function getResult(dependencyName,groupId){
    var url = config.URL+dependencyName+config.param;
    http.get(url,function(res){
        var data="";
        res.on("data",function(chunk){
            data += chunk.toString();
        });
        res.on("end",function(){
            var finalData = JSON.parse(data).response;
            console.log(JSON.parse(data).response);
        });
    });
}
getResult("junit","junit");