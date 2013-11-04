var TestCaseModel = require('./model/testcase'),
    Schema = require("js-schema"),
    urlmod = require("url");

// 由于请求里的都是String，我们将其转为js的格式
function parseType(val){
    if(typeof val=="object"){
        for(var i in val){
            val[i] = parseType(val[i]);
        }
        return val
    }else{
        if(val=="true"){
            return true;
        }
        if(val=="false"){
            return false;
        }
        if(+val || +val===0){
            return +val
        }

        return val;
    }

    
}

var matchFake = function (req, res, render) {
    var url = urlmod.parse(req.url).pathname,
        reqdata = {
            get : parseType(req.query)
        };

    if(Object.keys(req.body).length){
        reqdata.post = parseType(req.body)
    }

    if(Object.keys(req.body).length){
        reqdata.cookie = parseType(req.cookies)
    }

    TestCaseModel.findByUrl(url, function (err, rows) {
        if(err){res.send(500,err);return;}
	    if(!rows){res.send(404,"no reqschema match");return;}

        rows.forEach(function (row) {
            var schema;
            try{
                schema = eval("(" + row.reqschema + ")");
            }catch(e){
                res.send(500,e+row.reqschema);
            }

            if(Schema(schema)(reqdata)){
                res.send(row.resdata);
            }
        });
        res.send(404,"no reqschema match\n"+JSON.stringify(reqdata,null,4)+"\n");
    });
};

exports.matchFake = matchFake;
