var db = require("../dao/connect");

function extend(constructor,proto){
	constructor.fn = constructor.prototype;
	for(var i in proto){
		constructor.fn[i] = proto[i];
	}
}

function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}

function ModelBase(prop){
	for(var i in prop){
		this[i] = prop[i];
	}
}

extend(ModelBase,{
	db:db,
	getById:function(id,cb){
		this.getOne({id:id},cb);
	},
	getOne:function(where,cb){
		var sql = "select * from " + this.table + " " + this.parse_where(where);
		db.query(sql,function(err,rows){
			if(err){cb(err);return}
			cb(null,rows[0]);
		});
	},
	getAll:function(cb){
		db.query("select * from " + this.table,cb);
	},
	getAllBy:function(where,cb){
		db.query("select * from " + this.table + " " + this.parse_where(where),cb);
	},
	insert:function(entry,cb){
	    db.query("INSERT " + this.table + " SET ? ",entry,cb);
	},
	update:function (entry, cb) {
	    db.query("UPDATE " + this.table + " SET "+ this.parse_set(entry) +" where id="+entry.id,cb);
	},
	parse_set:function(entry){
		var ret = [];
		for(var key in entry){
			if(typeof entry[key] !== "function"){
				ret.push( "`"+key+"`" + "=" + this.parse_type(entry[key]));
			}
		}

		return ret.join(",");
	},
	/**
	 * str -> "str"
	 * 1 -> 1
	 * true -> 1
	 * false -> 0
	 */
	parse_type:function (value){
		var parser;

		switch(value.constructor.name){
			case "Number":parser=function(v){return v;};break;
			case "Boolean":parser=function(v){return v?1:0;};break;
			case "String":;
			default:parser=function(v){return '"'+ mysql_real_escape_string(v) + '"' };
		}
		return parser(value);
	},

	/**
	 * {a:1,b:"str"}
	 * ->
	 * a=1 and b="str"
	 */
	parse_where:function (obj){
		var ret = [],
			v;

		for(var k in obj){
			v = obj[k];
			v && ret.push(k + "=" + this.parse_type(v));
		}

		ret = ret.length ? ("where " + ret.join(" and ")):"";
		return ret;
	}
});


module.exports = ModelBase;