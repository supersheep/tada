$(function(){

	var param_tables = $(".J_param-table");

	param_tables.each(function(i,e){
		var param_table = $(e);
		param_table.on("click",".J_add",function(){
			var ul = $('<tr><td><input type="text" class="span1 key"></td><td><input type="text" class="span5 value"></td><td><a class="btn btn-danger btn-small J_remove"><i class="icon-minus icon-white icon-align-center"></i></a></td></tr>');
			ul.appendTo(param_table);
		});
		param_table.on("click",".J_remove",function(){
			$(this).parent().parent().remove();
		});
	});

	$("form").on("submit",function(){
		var obj_all = {};
		if(type == 1){
			return true;
		}
		param_tables.each(function(i,table){
			table = $(table);
			var obj = {};
			table.find("tbody tr").each(function(j,tr){
				tr = $(tr);
				var key = tr.find(".key").val();
				key && (obj[tr.find(".key").val()] = tr.find(".value").val());
			});
			obj_all[table.attr("data-param-name")] = obj;
		});
		$("#fakedata").val(JSON.stringify(obj_all));
		return true;
	})
});