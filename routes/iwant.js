var Route = require('./route'),
    fs = require("fs");


Route.add({
    path:"/iwant",
    method:"get",
    template:"iwant",
    async:true,
    handler:function(req,res,render){
		content = fs.readFileSync("./iwant.txt");
		render({content:content,title:"需求和吐槽"});
    }
});