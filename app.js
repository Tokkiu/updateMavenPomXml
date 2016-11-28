
var parser = require("xml2json");
var fs = require("fs");
var file = fs.readFileSync("pom.xml","utf-8");

var data = parser.toJson(file,{object:true});
var versions = data.project.properties;
for( key in versions){
    console.log(key.slice(0,-8)+":"+versions[key]);
}

