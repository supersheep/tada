$('#new-case-submit').on('click', function (e) {
	var reqdata=reqschema=JSON.stringify({get:{},post:{},cookie:{}},null,4);
	var resdata=resschema=JSON.stringify({code:200,msg:{}},null,4);
	var name=$("#new-case-name").val()||"未命名";
	$.post("/__ajax__/add_testcase",{
		aid:interface_id,
		name:name,
		reqschema:reqschema,
		reqdata:reqdata,
		resschema:resschema,
		resdata:resdata,
		alpha_ok:0,
		beta_ok:0
	},function(json){
		var caseid=json.msg.id;
		location.href="/interface/"+interface_id+"/case/"+caseid+"/run";
	},"json");

	$("#modal-add").modal('hide');
})