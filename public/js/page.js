$(function(){

	$("#appIndex").on('change',function(e){	
		var info = $(this).val(),
			value = findIndex(this,info);
		$(".pagesIndex").hide();
		if(info == "all"){
			$(".pageContainer").show();
			return ;
		}
		$(".app_"+value).show();
		$(".app_"+value).find("option:eq(0)").attr("selected","true");
		$(".pageContainer").hide();
		$('.app_'+value).show();
	});
	
	$(".pagesIndex").on('change',function(){
		var info = $(this).val(),
			value = findIndex(this,info),
			parentValue = findIndex($("#appIndex"),$("#appIndex").val());

		$(".pageContainer").hide();
		if(info == "all"){
			$('.app_'+parentValue).show();
			return ;
		}

		$('.app_'+parentValue+"_"+value).show();
	});
	function findIndex(dom,data){
		var child = $(dom).find("option");
		for(var len = child.length;len--;){
			if($(child[len]).val() == data){
				return $(dom).find("option:eq("+len+")").attr("data-type");
			}
		}
	}
});