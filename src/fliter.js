function fliter(newDa,preDa,option){
    var index = 3;
    if(typeof(option)=="number"){
        index = option;
    }
    newData = newDa.split(".",3);
    preData = preDa.split(".",3);
    var flag = true;
    for(var i = 0;i<index;i++){
        var newd = parseInt(newData[i]);
        var pred = parseInt(preData[i]);
        if(newd != pred ){
            flag = false;
            break;
        }
    }
    return flag?newDa:preDa;
}

exports.fliter = fliter;


