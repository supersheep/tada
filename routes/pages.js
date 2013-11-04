var Route = require('./route'),
    PageModel = require("../model/pages"),
    BizModel = require("../model/biz"),
    AppModel = require("../model/app"),
    EventProxy = require("eventproxy").EventProxy,
    Path = require("path"),
    Url = require("url"),
    fs = require("fs");


Route.add({
    path:"/pages/add",
    method:"post",
    async:true,
    handler:function(req,res,render){
        var param = req.body || {},
            file_url,
            files = req.files || "",
			source = param.source || "", 
            html_file = files.html || "";

        if(!html_file && !source) return ;

		if(html_file)  file_url = "./pages/"+Path.basename(html_file.path);
		
		PageModel.insert({
			name:param.name,
			zujiid:param.zujiid,
			app:param.app
		},function(err,info){
			if(err){res.send(500,err);return;}
			var id = info.insertId;
			if(html_file.size){
				fs.rename(file_url,"./pages/"+id+".html",function(err){
					res.redirect("/pages");
				});
			}else if(!html_file.size && source){
				fs.writeFile("./pages/"+id+".html",source,'utf8',function(err){
					res.redirect("/pages");
				});	
			}
		});
		
    }
});

Route.add({
    path:"/pages",
    template:"page_cases",
    async:true,
    handler:function (req,res,cb) {
            PageModel.getAllUnion(function(err,rows){

				if(err){res.send(500,err);return;}
				//if(!rows[0]){res.render("error",{error:"page not found"});}
				var sortInfo ={};
				var	appName = {};
				var bizName ={};
				for(var len = rows.length; len--;){
					
					var data =	rows[len],
						biz_index = data['biz'],
						app_index = data['app'];
				 	if(!sortInfo[biz_index]){
						sortInfo[biz_index] = {};
						bizName["biz_"+biz_index] = data['biz_name'];
						sortInfo[biz_index][app_index] = [data];
						appName['app_'+app_index] = data['app_name'];
					}
					else{
						if(!sortInfo[biz_index][app_index]){
							sortInfo[biz_index][app_index] = [data];
							appName['app_'+app_index] = data['app_name'];
						}
						else{
							sortInfo[biz_index][app_index].push(data); 
						}
					}
				}
				cb({title:"静态页面展示",pages:sortInfo,appName:appName,bizName:bizName});
        });
    }
});


Route.add({
    path:"/pages/add",
    template:"page_add",
    async:true,
    handler:function (req,res,render) {
		var proxy = new EventProxy();
        proxy.assign("bizs","apps",function(bizs,apps){
            render({
                title:"静态页面添加",
                bizs:bizs,
                apps:JSON.stringify(apps)
            });
        });
        BizModel.getAll(function(err,rows){
            if(err){res.send(500,err);return;}
            proxy.trigger("bizs",rows);
        });
    	AppModel.getAll(function(err,rows){
    		if(err){res.send(500,err);return;}
            proxy.trigger("apps",rows);
    		
    	});
    }
});

function makeRule(req,data){
    console.log(req.cookies);
    var debughost = req.cookies.debughost;

    var matches = data.match(/src=['"]([^'"]+)['"]/g).map(function(str){return str.match(/src=['"]([^'"]+)['"]/)[1]});
    var links = data.match(/href=['"]([^'"]+)['"]/g).map(function(str){return str.match(/href=['"]([^'"]+)['"]/)[1]});
    var rules = [];

    function pushMatch(match){
        rules.push({
            from:Url.parse(match).host,
            to:debughost
        });
    }

    links.forEach(pushMatch);
    matches.forEach(pushMatch);
    return rules;
}

Route.add({
    path:"/pages/:id.html",
    template:"",
    async:true,
    handler:function (req,res,render,next) {
	var linkReg = /<(script|link)[^>]+\/?>/g,	
	cookieHost = req.cookies.debughost || "",
	insertJs = "<script type='text/javascript' src='/js/tadapage.js'></script>",
	data,result;

	var position = "./pages/"+req.params.id+".html";

	fs.exists(position,function(exists){

		if(!exists){
			req.send(404,"not found");
			return;
		}

		fs.readFile(position,'utf8',function(err,data){
			if(err){
				req.send(500,err);
				return;
			}

			data = data.replace(linkReg,function(match){
				var url;
				if(!match.match(/src|href/)){
					return match;
				}

				url = match.match(/(?:href|src)=(?:\"|\')(.+)(?:\"|\')/)[1] || "";

				return match.replace(url,function(cMatch){
					var host = cMatch.match(/http:\/\/[^\/]+/);
					if(!host) return cMatch;
					return cookieHost ? cMatch.replace(host,"http://" + cookieHost) : cMatch;
				});
			});

			result = data.split("</head>");
			if(result[0]){
				data = result[0]+insertJs+"</head>"+result[1];
			}

			if(cookieHost){
				data = data.replace("i{n}.static.dp:1337",cookieHost);
			}
			res.send(data);
		});
	});
      }
});

Route.add({
    path:"/js/tadapage.js",
    template:"",
    async:true,
    handler:function (req,res,render) {
		try{
			var data = fs.readFileSync("./js/tadapage.js",'utf8');
			res.writeHead(200,{
                'Content-Type':'text/javascript'
            });
			res.write(data);
			res.end();
		}catch(e){
			res.writeHead(404);
			res.end();
		}
    }
});

Route.add({
    path:"/pages/:id/edit",
    template:"page_edit",
    async:true,
    handler:function (req,res,cb) {
			var data,
                path = "./pages/"+req.params.id+".html";
            if(fs.existsSync(path)){
                data = fs.readFileSync(path,'utf8');
            }else{
                data = "";
            }
            cb({title:"静态页面修改",info:data});
    }
});

Route.add({
    path:"/pages/:id/edit",
    method:"post",
    async:true,
    handler:function(req,res,render){
        var param = req.body || "",
			data = param.source || "",
            file_url,
			id = req.params.id,
            files = req.files || "",
            html_file = files.html || "";
			
			file_url = "./pages/"+Path.basename(html_file.path);
		if(!html_file.size){
			fs.unlink(file_url,function(err){});
			fs.writeFile("./pages/"+id+".html",data,'utf8',function(err){
				res.redirect("/pages");
			});	
		}else{
			fs.rename(file_url,"./pages/"+id+".html",function(err){
				res.redirect("/pages");
			});
		}


    }
});