
var merge = exports.merge = function (a,b,overwrite){
	for(var key in b){
		if(overwrite || !a[key]){
			a[key] = b[key];
		}
	}
	return a;
}

exports.parseFakeData = function(data){
    var default_ret = {get:{},post:{},cookie:{}};
    var arr = [];
    try{
        ret = JSON.parse(data);
    }catch(e){}

    return merge(default_ret,ret,true);
}
