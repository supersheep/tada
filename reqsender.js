var request = require("request");
var InterfaceModel = require("./model/interface");


function stringifyCookie(cookie){
	var ret = [];
	for(var key in cookie){
		ret.push(key + "=" + cookie[key]);
	}
	return ret.join(";");
}

/**
 * [reqsender description]
 * @param  {Object} case [as the object defined in table testcase]
 */
var reqsender = exports.send = function(obj,cb){
	var kase = obj.kase
		,host = obj.host
		,direct = obj.direct == "true";

	/**
	 * id
	 * aid
	 * testcase
	 * reqdata
	 * type 2
	 */
	InterfaceModel.getByCase(kase,function(err,inter_face){

		if(err){cb(err);}
		try{
		var reqdata = JSON.parse(kase.reqdata);
		}catch(e){cb("fail to parse reqdata "+kase.reqdata);return;}

		var	cookie = reqdata ? reqdata.cookie :"",
			post = reqdata ? reqdata.post : {},
			get = reqdata ? reqdata.get : {},
			headers = {},
			method;

		var url = 'http://'+ (direct ? host : (host + inter_face.url));
		if(!post || JSON.stringify(post)==="{}"){
			method = "get";
		}else{
			method = "post";
		}

		form = method === "post" ? post : null
		headers = {
			"user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1",
			"X-Requested-With":"XMLHttpRequest",
			"cookie":stringifyCookie(cookie)
		}

		request({
			uri:url, 
			method:method,
			headers:headers,
			qs:get,
			form:form
		},function (err, res, body) {
			var code=res && res.statusCode;;
			if(err){cb(url+" "+err);return;}
			else if(code!==200){
				body=body.replace(/</g,"&lt;").replace(/>/,"&gt;");
				cb("code: "+code+"\nbody: "+body);
				return;
			}
			else{
				cb(null,body);
			}
		});
	});
}


/* example

reqsender({
	aid:2,
	testcase:"blah",
	reqdata:'{"cookie":"de","get":{"c":3}}',
	type:"2"
},"cidi.lc",function(err,body){
	console.log(body);
});

*/
