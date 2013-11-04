var Route = require('./route');
var TestCaseModel = require("../model/testcase");
var InterfaceModel = require("../model/interface");

Route.add({
	"path":"/interface/:id/addcase",
	"method":"post",
	"async":true,
	"handler":function(req,res){
		var interface_id = req.params.id,
			body = req.body,
            name = body.name||"未命名",
            resdata = body["res-data"],
            resschema = body["res-schema"],
			reqdata = body["req-data"],
			reqschema = body["req-schema"];

		TestCaseModel.insert({
            name:name,
			resdata:resdata,
			resschema:resschema,
			reqdata:reqdata,
			reqschema:reqschema,
			aid:interface_id
		},function(err,info){
			if(err){res.send(500,err);return;}
			InterfaceModel.getCases(interface_id,function(err,rows){
				if(err){return}
				InterfaceModel.update({
					id:interface_id,
					case_count:rows.length
				});
			});
            res.redirect("/interface/"+interface_id + "/case/" + info.insertId + "/run");
		});
	}
})


Route.add({
    "path":"/interface/:id/addcase",
    "template":"case_add",
    "async":true,
    "handler":function (req,res,render) {
        render({
            title:"添加用例",
            interface_id:req.params.id,
            casetype:1
        });
    }
});