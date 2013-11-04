$(function(){
	$(".btn-primary").bind("click",function(e){

		var file = $("#file")|| "",
			source = $("#source")|| "";

		if(!file.val() && !source.val()){
			$('span.alert-error').remove();
			$('<span class="alert alert-error">需上传html文件或者粘贴源代码</span>').appendTo($(file).parent("div.controls"));
			return false;
		}		
		if(file.val() && !/(.html)$/.test(file.val())){
			$('span.alert-error').remove();
			$('<span class="alert alert-error">需上传html格式文件</span>').appendTo($(file).parent("div.controls"));
			return false;
		}
		
	})
	
});