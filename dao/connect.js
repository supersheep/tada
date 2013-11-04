var dbConfig = require('./config').getDBConfig(),
    mysql = require('mysql');


var query = function (query,obj, cb) {
    var connection = mysql.createConnection(dbConfig);
    connection.connect();
   	var sql = connection.query.apply(connection, arguments);
    connection.end();
    return sql;
}

exports.query = query;
exports.parse_type = function (value){
	var parser;

	switch(value.constructor.name){
		case "Number":parser=function(v){return v;};break;
		case "Boolean":parser=function(v){return v?1:0;};break;
		case "String":;
		default:parser=function(v){return "\""+v+"\""};
	}
	return parser(value);
}