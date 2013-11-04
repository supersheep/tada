var TestcaseModel = require('../model/testcase'),
    InterfaceModel = require('../model/interface'),
    BizModel = require('../model/biz');

/**
 * [parseFakeData description]
 * @param  {String} data string of reqdata
 * @return {object}      json
 */
function parseFakeData(data){
    var ret = {get:{},post:{},cookie:{}};
    var arr = [];
    try{
        ret = JSON.parse(data);
    }catch(e){}

    return ret;
}

require('./route').add({
    "path":"/interface/:interface_id/case/:id/run",
    "template":"case_run",
    async:true,
    "handler":function (req,res,render) {
        var id = req.params.id;
        var interface_id = req.params.inferface_id;   
        var render_obj = {};
        var resintro;

        function assign(obj){for(var k in obj){render_obj[k]=obj[k];}}
        function done(){done.ok=done.ok||0;done.ok++;if(done.ok==2){console.log(render_obj);render(render_obj);}}

        InterfaceModel.getById(interface_id,function(err,row){
            if(err){res.send(500,err);return;}
            assign({interface:row});
            done();
        });

        TestcaseModel.getFullById(req.params.id, function(err,kase){
            if(err){res.send(500,err);return;}
            if(kase.type == 1){
                res.redirect("/interface/"+interface_id);
            }

            kase.reqdatajson = parseFakeData(kase.reqdata);

            var bizs = {
                alpha:kase.alpha,
                beta:kase.beta,
                tada:req.headers.host
            }

            assign({
                title:kase.name || "未命名",
                kase:kase,
                bizs:bizs
            });
            done();
        });
    }
});