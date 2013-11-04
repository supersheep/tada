var TestCaseModel = require("../model/testcase");
var InterfaceModel = require("../model/interface");
var Is = require("is-js");
var EventProxy = require("eventproxy").EventProxy;
var Route = require('./route');

Route.add({
    path:"/interface/:id",
    template:"interface_cases",
    async:true,
    handler:function (req,res,render,next) {
        var id = req.params.id;
        var proxy = new EventProxy();
        

        if(!Is.numeric(id)){next();return;}

        proxy.assign("cases","interface",function(cases,inter){
        	if(!inter){
        		res.send(404,"interface not found");
        	}
			render({
				title:"接口相关用例",
				testcase:cases,
				inter:inter,
				id:id
			});
        });

        InterfaceModel.getById(id,function(err,row){
			if(err){res.send(500,err);return;}
			proxy.trigger("interface",row);
        });

		TestCaseModel.getAllByAid(id,function(err,rows){
			if(err){res.send(500,err);return;}
			var sortResult = {'front':[],'back':[]},
				typename = "";
			for(var i=0,row;row = rows[i];i++){
				typename = row.type == 1 ? "front":"back";
				sortResult[typename].push(row);
			}

			proxy.trigger("cases",sortResult);
		});
    }
});
