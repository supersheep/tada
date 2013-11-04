$(function(){
	$(".stat-list .item").on("click",function(){
		var el = $(this);
		var id = $(this).attr("data-id");
		$.ajax({
			dataType:"json",
			url:"/__ajax__/testcases_of_interface/"+id,
			success:function(kases){
				var tpl = $("#J_case-item").html().replace(/\$/g,"#");
				var ulhtml = jade.compile(tpl)({items:kases,id:id});
				el.find(".cases").remove();
				el.append($(ulhtml));
			}
		})
	});
});