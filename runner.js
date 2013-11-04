var TestCaseModel = require("./model/testcase"),
	InterfaceModel = require('./model/interface'),
	reqsender = require("./reqsender"),
	async = require("async"),
	moment = require("moment"),
	colorize = require("./colorize"),
	resvalidator = require("./resvalidator");


function isok(result){
	if(!result) return false;
	return result.ok;
}

function geturl(kase,env){
	return new Interface(kase).getHost(env);
}

function wraptask(kase,env){
	return function(done){
		var url = kase[env];
		var ok;
		var data = [];
		if(url instanceof Error){done(url);}
		run({
			kase:kase,
			host:host,
			direct:false
		},function(err,info){
			if(err){done(err);return;}
			var result = info.result;
			data.id = kase.id;
			ok = isok(result);
			data[env+"_ok"] = ok;
			TestCaseModel.update(data,function(err,info){
				if(err){done(err);return;}
				console.log.call(null,[
					"case:"+kase.id,
					moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
					env,
					ok?"ok".green:"fail".red,
					kase.url].join("\t"));

				done(null,result);
			});
		});
	}
}

var run = exports.run = function (obj,cb){
	
	reqsender.send({
		kase:obj.kase,
		host:obj.host,
		direct:obj.direct
	},function(err,body){
		if(err){
			cb(null,{
				result:{
					ok:false,
					msg:err
				}
			});
			return;
		};

		cb(null,{
			result:resvalidator(obj.kase.resschema,body,obj.type),
			body:body
		});
	});
}

var runall = exports.runall = function (cb){
	TestCaseModel.getAll(function(err,rows){
		if(err){cb(err);}
		
		var tasks = [];

		rows.forEach(function(kase){
			tasks.push(wraptask(kase,"alpha"));
			tasks.push(wraptask(kase,"beta"));
		});

		async.series(tasks,function(err, result){
			if(err){cb(err);}
			console.log("done a loop, update interface status.");
			update(function(err){
				if(err){cb(err);return;}
				console.log("all updated, take a rest.");
				setTimeout(function(){
					runall(cb);
				},1000);
			});
		});
	});
}

function update(cb){
	var tasks = [];
	InterfaceModel.getPassList(null,function(err,rows){
		if(err){return;}

		rows.forEach(function(row,i){
			tasks.push(function(done){
				InterfaceModel.update(row,function(err){
					if(err){done(err);return;}
					done(null);
				});
			});
		});

		async.series(tasks,function(err){
			if(err){cb(err);return;}
			cb(null);
		});
	});
}

