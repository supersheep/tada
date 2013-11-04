var url_mod = require("url"),
	fakeMatch = require("../reqfakematch");

function withAjaxHeader(req){
	return req.get("X-Requested-With") == "XMLHttpRequest";
}

function withJSONPParam(query){
	return !!query.callback;
}



function isAppRequest(req){
	return req.url.indexOf('__ajax__') !== -1;
}

module.exports = function (req, res, next) {
	var query = url_mod.parse(req.url,true).query,
		isAjax = withAjaxHeader(req),
		isJSONP = withJSONPParam(query);

    if (!isAppRequest(req) && ( isAjax || isJSONP)) {
        // is ajax request
        fakeMatch.matchFake(req,res,function(data){
        	if(isAjax){
            	res.send(data);
        	}else if(isJSONP){        		
            	res.send(query.callback.toString()+"("+data+");");
        	}
        });
    }else{
        next();
    }
}
