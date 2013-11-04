var InterfaceModel = require('../model/interface');
var AppModel = require('../model/app');
var BizModel = require('../model/biz');
var Route = require('./route');
var EventProxy = require('eventproxy').EventProxy;



Route.add({
    path:"/interface/:id/edit",
    method:"post",
    async:true,
    handler:function(req,res,render){
        var body = req.body;
        InterfaceModel.update(body,function(err,info){
            if(err){res.send(500,err);return;}
            res.redirect("/interface/"+body.id);
        });
    }
});


Route.add({
    path:"/interface/:id/edit",
    template:"interface_edit",
    async:"true",
    handler:function (req, res, render) {
        var id = req.params.id;
        var iface = null;
        var proxy = new EventProxy();

        proxy.assign("iface","allapp","allbiz","currentapp", function(iface,apps,bizs,app){
            render({
                id:id,
                url:iface.url,
                appid:app.id,
                bizid:app.bizid,
                title:"编辑测试地址",
                bizs:bizs,
                apps:JSON.stringify(apps)
            });
        });

        InterfaceModel.getById(id, function (err, row) {
            if (err) {res.send(500, err);return;}
            if(!row){res.send(404, {error:"interface not found"});}
            proxy.trigger("iface",row);

            AppModel.getById(row.app,function(err,row){
                if (err) {res.send(500, err);return;}
                proxy.trigger("currentapp",row);
            });
        });

        BizModel.getAll(function(err,rows){
            if (err) {res.send(500, err);return;}
            proxy.trigger("allbiz",rows);
        });

        AppModel.getAll(function(err,rows){
            if (err) {res.send(500, err);return;}
            proxy.trigger("allapp",rows);
        });
    }
});