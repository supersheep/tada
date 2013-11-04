var router = require('./route'),
    InterfaceModel = require('../model/interface'),
    TestCaseModel = require('../model/testcase'),
    runner = require('../runner'),
    reqsender = require('../reqsender'),
    fs = require('fs');

router.add({
    path:"/__ajax__/update_iwant",
    method:"post",
    async:true,
    handler:function(req,res){
        var body = req.body;
        var content = body.content;
        fs.writeFileSync("./iwant.txt",content,"utf8");
        res.json({content:content});
    }
});

router.add({
    path:"/__ajax__/update_interface",
    method:"post",
    async:true,
    handler:function(req,res){
        var data = {},
            body = req.body;
        if (body.id) {
            InterfaceModel.update(body, function (err, info) {
                if (err) {
                    res.send(500,err);
                } else {
                    res.json(body);
                }
            });
        }
    }
});

// testcase
router.add({
    path:"/__ajax__/add_testcase",
    method:"post",
    async:true,
    handler:function (req, res) {
        var data = {},
            body = req.body

        TestCaseModel.insert(body, function (err, info) {
            var interface_id = body.aid;
            if(!body.aid){
                data.code = 500;
                data.message = "缺少参数";
            }else if(err){
                data.code = 500;
                data.message = "添加TestCase失败";
            } else {
                data.code = 200;
                data.message = "添加TestCase成功";
                caseid = info.insertId
                data.msg = {
                    id:caseid
                }
                InterfaceModel.getCases(interface_id,function(err,rows){
                    if(err){return}
                    InterfaceModel.update({
                        id:interface_id,
                        case_count:rows.length
                    });
                });
            }
            res.json(data);
        });

    }
});


router.add({
    path:"/__ajax__/update_testcase",
    method:"post",
    async:true,
    handler:function (req, res) {
        var data = {},
            body = req.body;
        if (body.id) {
            TestCaseModel.update(body, function (err, info) {
                if (err) {
                    data.code = 500;
                    data.message = "更新失败";
                } else {
                    data.code = 200;
                    data.message = "更新成功";
                    res.json(body);
                }
            });
        }
    }
});


router.add({
    path:"/__ajax__/testcases_of_interface/:id",
    async:true,
    handler:function(req,res){
        TestCaseModel.getBackByAid(req.params.id,function(err,rows){
            if(err){res.send(500,err);return}

            res.json(rows);
        });
    }
})


router.add({
    path:"/__ajax__/run_testcase",
    async:true,
    method:"post",
    handler:function (req, res) {
        var id = req.body.id,
            type = req.body.type,
            env = req.body.env,
            host = req.body.host,
            direct = req.body.direct;

        TestCaseModel.getById(id,function(err,row){

            if(err){res.send(500,err);return;}
            runner.run({
                kase:row,
                interface:row,
                host:host,
                type:type,
                direct:direct
            },function(err,json){
                if(err){res.send(500,err);return;}
                var update_obj = {
                    id:id
                }
                
                if(env == "alpha"){
                    update_obj["alpha_ok"] = +json.result.ok
                }

                if(env == "beta"){
                    update_obj["beta_ok"] = +json.result.ok
                }

                InterfaceModel.getCases(row.aid,function(err,rows){
                    if(err){res.send(500,err);return;}
                    var alpha_ok = rows.filter(function(row){
                        return row.alpha_ok==1;
                    }).length;
                    var beta_ok = rows.filter(function(row){
                        return row.beta_ok==1;
                    }).length;

                    InterfaceModel.update({
                        id:row.aid,
                        alpha_ok:alpha_ok,
                        beta_ok:beta_ok
                    });
                });
                
                TestCaseModel.update(update_obj);
                res.json(json);
            });
        });

    }
});

router.add({
    path:"/__ajax__/update_interface",
    method:"post",
    async:true,
    handler:function (req, res) {
        var data = {
            },
            body = req.body;
        if (body.id) {
            InterfaceModel.update({id:body.id, url:body.url, biz:body.biz, param:body.param, app:body.app }, function (err, info) {
                if (err) {
                    data.code = 500;
                    data.message = "更新ajax失败";
                } else {
                    data.code = 200;
                    data.message = "更新ajax成功";
                    data.other = {
                        id:body.id
                    }
                    TestCaseModel.find(body.id, function (err, info) {
                        if (err || !info.length) {
                            res.send(500, {error:"更新ajax失败"});
                        } else {
                            data.code = 200;
                            data.message = "更新ajax成功";
                            data.msg = info;
                            res.json(data);
                        }

                    })

                }
            });
        }
    }
});

