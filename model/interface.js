var ModelBase = require("./modelbase");

module.exports = new ModelBase({
	table:"Interface",
	getPassList:function(where,cb){
		if(where){
			where["type"] = 2;
		}else{
			where = {type:2}
		}
		var sql = "select Interface.id,count(TestCase.alpha_ok) as case_count,sum(TestCase.alpha_ok) as alpha_pass,sum(TestCase.beta_ok) as beta_pass from Interface JOIN TestCase ON Interface.id=TestCase.aid JOIN App ON Interface.app = App.id JOIN Biz on Biz.id = App.bizid "+ this.parse_where(where) +" GROUP BY Interface.id";
		
		this.db.query(sql,function(err,rows){
			if(err){
				err.sql = sql;
				cb(err);
			}else{
				cb(null,rows);
			}
		});
	},
	getCases:function(interfaceId,cb){
		var sql = "select * from TestCase where aid="+interfaceId;
		this.db.query(sql,cb);
	},
	getAllBy:function(where,cb){
		var sql = "select Interface.*,Biz.name as biz_name,App.name as app_name from " + this.table + " JOIN App ON Interface.app = App.id JOIN Biz ON Biz.id = App.bizid " + this.parse_where(where) + " GROUP BY Interface.id ";

		this.db.query(sql,cb);
	},

	getByCase:function(kase,cb){
		var sql = "select * from Interface join TestCase on TestCase.aid = Interface.id where TestCase.id = "+kase.id;
		this.db.query(sql,function(err,rows){
			if(err){cb(err);return;}
			if(!rows.length){cb("no entry found");return;}
			
			cb(null,rows[0]);
			
		});
	}
});