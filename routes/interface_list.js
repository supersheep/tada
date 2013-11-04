/*
 * GET home page.
 */
var InterfaceModel = require("../model/interface"),
    AppModel = require("../model/app"),
    BizModel = require("../model/biz");

var EventProxy = require("eventproxy").EventProxy;
var Route = require("../routes/route");


Route.add({
    "path":"/",
    "template":"interface_list",
    "async":true,
    "handler":function (req,res,render) {
    	var host = "host";

        var appid = req.query["app"];
        var bizid = req.query["biz"];
        var where = {
    		app:appid,
            bizid:bizid
    	};



        var proxy = new EventProxy();
        proxy.assign("apps","bizs","list",function(apps,bizs,list){

            var current_app = apps.filter(function(app){
                return app.id == appid;
            });
            // 遍历apps按bizid归类放到一个对象里
            apps = apps.reduce(function(obj,app){
                if(!obj[app.bizid]){
                    obj[app.bizid] = [];
                }

                obj[app.bizid].push(app);
                return obj;
            },{});

            bizs.forEach(function(biz){
                biz.apps = apps[biz.id] || []
            });

            current_app = current_app.length ? current_app[0] : {};

            render({
                title:"TADA - 接口列表",
                items:list,
                appid:current_app.id,
                appname:current_app.name,
                bizid:bizid || current_app.bizid,
                bizs:bizs
            });
        });

        AppModel.getAll(function(err,rows){
            if(err){res.send(500,err);return;}
            proxy.trigger("apps",rows);
        });

        BizModel.getAll(function(err,rows){
            if(err){res.send(500,err);return;}
            proxy.trigger("bizs",rows);
        });

    	InterfaceModel.getAllBy(where,function(err,rows){
    		if(err){res.send(500,err);return;}
            proxy.trigger("list",rows.sort(function(a,b){
                return b.app-a.app;
            }));
    	});

    }
});