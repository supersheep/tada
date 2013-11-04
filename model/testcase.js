var ModelBase = require("./modelbase");

module.exports = new ModelBase({
    table:"TestCase",
    getFull:function (id, cb) {
        var qs = 'select * from tada.Interface i JOIN tada.TestCase t ON t.aid = i.id where t.id=' + id;
        this.db.query(qs, cb);
    },
    findByUrl:function (url, cb) {
        var qs = "select * from tada.Interface t1 , tada.TestCase t2 where t1.id=t2.aid and t1.url=\"" + url+"\"";
        this.db.query(qs, cb);
    },
    getAllByAid:function(aid,cb){
        var sql = "select * from TestCase where aid = " + aid;
        this.db.query(sql,cb);
    },
    getAll:function(cb){
        var sql = "select TestCase.*,Biz.alpha,Biz.beta FROM TestCase JOIN Interface ON Interface.id=TestCase.aid JOIN App ON Interface.app = App.id JOIN Biz on Biz.id = App.bizid";
        
        this.db.query(sql,cb);
    },
    getFullById:function(id,cb){
        this.db.query("select TestCase.*,Interface.url,Biz.alpha,Biz.beta from TestCase join Interface on Interface.id = TestCase.aid join App on Interface.app = App.id join Biz on Biz.id = App.bizid where TestCase.id="+id,function(err,rows){
            if(err){cb(err);}
            else if(!rows.length){cb("no case found");return;}
            else{
                cb(null,rows[0]);
            }
        });
    }
});
