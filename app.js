
var parser = require("xml2json");
var fs = require("fs");
var file = fs.readFileSync("pom.xml","utf-8");
var search = require("./src/service.js");
var fliter = require("./src/fliter.js");
var json2xml = require("json2xml");

// memory vars 
var data = parser.toJson(file,{object: true});
var versions = data.project.properties;
var Management_dependencies = data.project.dependencyManagement.dependencies.dependency;
var dependencies = data.project.dependencies.dependency;
var build = data.project.build;
var reporting = data.project.reporting.plugins.plugin;
var allUpdated = false;


// for( key in versions){
//     console.log(key.slice(0,-8)+":"+versions[key]);
// }
console.log("begin:*******************************************************");


// do next update 
function doNext(){
    if(allUpdated){
        console.log("into allUpdated")
        // var updatedXml = parser.toXml(data);
        var updatedXml = json2xml(data,{header:true});
        fs.writeFile('./t.xml',updatedXml,function(err){
            if(err) throw err;
            console.log("finished");
        })
        return;
    }else
    var nextInfo = getNextInfo();
    var a = nextInfo.a;
    var g = nextInfo.g;
    var v = nextInfo.v;
    var newV = v;
     if(v !== undefined){
        search.search({
            dependencyName : a,
            groupId : g,
        },function(res){
            newV = res;
            var tmp = newV;
            res!=="none"?newV = fliter.fliter(newV,v,1):newV = v;
            // update the version
            data.project.properties[a+".version"] = newV;
            console.log("name: "+a)
            console.log("P : "+v+"| N : "+tmp+" | F : "+newV);
            doNext();
        });
    }else{
        console.log("name: "+a)
        console.log("no version found");
        doNext();
    }
    
}


//get next info to update
function getNextInfo(){
    var len = statusList.length;
    var info = {};
    while(len-- !== 0){
        if(!statusList[len].status){
            switch (statusList[len].name){
                case "Management_dependencies":
                    info.g = Management_dependencies[statusList[len].index].groupId;
                    info.a = Management_dependencies[statusList[len].index].artifactId;
                    info.v = versions[Management_dependencies[statusList[len].index].version.slice(2,-1)];
                    break;
                case "dependencies":
                    info.g = dependencies.groupId;
                    info.a = dependencies.artifactId;
                    info.v = versions[dependencies.version.slice(2,-1)];
                    break;
                case "build_extensions":
                    info.g = build.extensions.extension.groupId;
                    info.a = build.extensions.extension.artifactId;
                    info.v = versions[build.extensions.extension.version.slice(2,-1)];
                    break;
                case "build_pluginManagement":
                    info.g = build.pluginManagement.plugins.plugin[statusList[len].index].groupId;
                    info.a = build.pluginManagement.plugins.plugin[statusList[len].index].artifactId;
                    info.v = versions[build.pluginManagement.plugins.plugin[statusList[len].index].version.slice(2,-1)];
                    break;
                case "build_plugins":
                    info.g = build.plugins.plugin[statusList[len].index].groupId;
                    info.a = build.plugins.plugin[statusList[len].index].artifactId;
                    info.v = versions[build.plugins.plugin[statusList[len].index].version.slice(2,-1)];
                    break;
                case "reporting":
                    info.g = reporting[statusList[len].index].groupId;
                    info.a = reporting[statusList[len].index].artifactId;
                    info.v = versions[reporting[statusList[len].index].version.slice(2,-1)];
                    break;
            }
            statusList[len].index++;
            // console.log("index:"+statusList[len].index+" | max:"+statusList[len].max+" | len:"+len);
            statusList[len].max === statusList[len].index ? statusList[len].status = true:1;
            statusList[len].status && len === 0 ? allUpdated = true:1; 
            break;
        }
    }
    return info;
}


//store status for update
var statusList = [
    {
        name : "Management_dependencies",
        status : false,
        index : 0,
        max : Management_dependencies.length,
    },
    {
        name : "dependencies",
        status : false,
        index : 0,
        max : 1,
    },{
        name : "build_extensions",
        status : false,
        index : 0,
        max : 1,
    },{
        name : "build_pluginManagement",
        status : false,
        index : 0,
        max : build.pluginManagement.plugins.plugin.length,
    },{
        name : "build_plugins",
        status : false,
        index : 0,
        max : build.plugins.plugin.length,
    },{
        name : "reporting",
        status : false,
        index : 0,
        max : reporting.length,
    }
    ];
doNext();
    