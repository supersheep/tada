var TestCaseModel = require("../model/testcase");
var Util = require("../util");

var Route = require('./route');

Route.add({
    "method":"post",
    "path":"/interface/:interface_id/case/:id/edit",
    "template":"case_edit",
    "async":true,
    "handler":function(req,res){
        var body = req.body,
            id = body.id,
            resdata = body["res-data"],
            resschema = body["res-schema"],
            reqdata = body["req-data"],
            reqschema = body["req-schema"];

        TestCaseModel.update({
            id:id,
            reqschema:reqschema,
            reqdata:reqdata,
            resschema:resschema,
            resdata:resdata
        },function(err,info){
            if(err){res.send(500,err);return;}
            res.redirect("/interface/"+req.params.interface_id+"/case/"+req.params.id+"/run");
        });
    }
});

Route.add({
    "method":"get",
    "path":"/interface/:interface_id/case/:id/edit",
    "template":"case_edit",
    "async":true,
    "handler":function (req,res,cb) {
    	var kase = TestCaseModel.getFull(req.params.id,function(err,rows){
    		if(err){res.send(500,err);return;}
    		if(!rows[0]){res.render("error",{error:"case not found"});}
    		var kase = rows[0];

    		var fakejson,get,post,cookie;
    		if(kase.type == 2){
    			fakejson = kase.fakedatajson = Util.parseFakeData(kase.fakedata);
    		}
    		kase.get = kase.fakedatajson 
    		console.log(kase.fakedatajson);
    		cb({title:"编辑测试用例",testcase:kase});
    	});
    }
});