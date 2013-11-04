// var should = require("should");
var Schema = require("js-schema")


var jsonpTranser = function(body){
	var matches = body.match(/^.*\((.*)\);?$/);
    return JSON.parse(matches[1]);
}

const XHR = 0;
const JSONP = 1;
/**
 * response validator
 */
var resvalidator = module.exports = function(resschema,body,type){
	var result,schema;

	if(!resschema){
		return {ok:false,msg:"no response schema"};
	}

	if(!body){
		return {ok:false,msg:"no body"};
	}

	// logic for type
	// type: 0 -> xhr 1:jsonp

	if(type==JSONP){
		try{
			body = jsonpTranser(body);
		}catch(e){
			return {ok:false,msg:"[body parse error]"+e}
		}
	}else{
		try{
			body = JSON.parse(body);
		}catch(e){
			return {ok:false,msg:"[body parse error]"+e}
		}
	}

	try{
		schema = eval("("+resschema+")");
	}catch(e){
		return {ok:false,msg:"[schema parse error]"+e}
	}

	return Schema(schema)(body) ? {ok:true,msg:"tada!"} : {ok:false,msg:"body doesn't match schema"};
	
}