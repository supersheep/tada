var AppModel = require("../model/app");
var BizModel = require("../model/biz");
var InterfaceModel = require("../model/interface");
var EventProxy = require("eventproxy").EventProxy;
var Route = require('./route');

Route.add({
    path:"/interface/add",
    method:"post",
    async:true,
    handler:function(req,res,render){
    	var body = req.body;
        InterfaceModel.getOne(body,function(err,row){
            
            if(err){res.send(500,err);return;}

            if(row){res.redirect("/interface/"+row.id);return}

            if(body.url[0] !== "/"){
                body.url = "/" + body.url;
            }
            InterfaceModel.insert(body,function(err,info){
                if(err){res.send(500,err);return;}
                res.redirect("/interface/"+info.insertId);
            });
        });
    }
});

Route.add({
    path:"/interface/add",
    template:"interface_add",
    async:true,
    handler:function (req,res,render) {
        var proxy = new EventProxy();
        proxy.assign("bizs","apps",function(bizs,apps){
            render({
                title:"TADA - 添加接口",
                bizs:bizs,
                apps:JSON.stringify(apps)
            });
        });
        BizModel.getAll(function(err,rows){
            if(err){res.send(500,err);return;}
            proxy.trigger("bizs",rows);
        });
    	AppModel.getAll(function(err,rows){
    		if(err){res.send(500,err);return;}
            proxy.trigger("apps",rows);
    		
    	});

    }
});
