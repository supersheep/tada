window.onload=function(){
	var HTML = '<div style="position:fixed;left:5px;top:#{top}px;background-color:#DFF0D8;width:170px;height:200px;border:1px solid #DDDDDD;z-index:9999;">'+
					'<header style="border-bottom:1px solid #DDDDDD;height:30px;width:100%;overflow:hidden;line-height:30px;">'+
						'#{title}'+
					'</header>'+
					'<aside style="margin-top:20px;width:100%;">'+
						'#{content}'+
					'</aside>'+
				'</div>';
	var clientH = document.documentElement.clientHeight;	
	var objReplace = {
		title:document.title || "无title",
		top:parseInt(clientH)-200,
		content:"无内容"
	};
	HTML = HTML.replace(/#{[^}]+}/g,function(match){
		index = match.match(/#{(.+)}/)[1] || "";
		return objReplace[index] || "";
	});
	console.log(HTML);
	var	floatB = document.createElement("div");
		floatB.innerHTML = HTML;
		 document.body.appendChild(floatB);	
};
