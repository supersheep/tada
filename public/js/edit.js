$(function () {
    var updateBtn = $("#ajax_update"),
        updateTestCaseBtn = $(".testcase_update"),
        formControls = {
            url:$("#url"),
            biz:$("#biz"),
            param:$("#param"),
            app:$("#app")
        },
        testCaseFormControls = {
            type:$("#type"),
            testcase:$("#testcase"),
            fake:$("#fake")
        },
        ajaxForm = $("#form_add_ajax"),
        testCaseForm = $("#form_add_testcase"),
        successAlert,
        errorAlert,
        success = function (msg) {
            successAlert || (successAlert = $('<div class="alert alert-success fade in">\
                            <button type="button" class="close" data-dismiss="alert">×</button>\
                            ' + msg + '\
                        </div>').prependTo($(".container")));
            successAlert.alert();
            setTimeout(function () {
                successAlert.alert("close");
            }, 2000);
        },
        error = function (msg) {
            errorAlert || (errorAlert = $('<div class="alert alert-error fade in">\
                            <button type="button" class="close" data-dismiss="alert">×</button>\
                            ' + msg + '\
                        </div>').prependTo($(".container")));
            errorAlert.alert();
            setTimeout(function () {
                errorAlert.alert("close");
            }, 2000);
        }

    updateBtn.click(function () {
        if (!formControls.url.val()) {
            alert('请填写url');
            return;
        }

		 $.ajax({
            url:"/__ajax__/update_interface",
            data:{
                url:formControls.url.val(),
                biz:formControls.biz.val(),
                param:formControls.param.val(),
                app:formControls.app.val(),
				id:updateBtn.attr("_id")
            },
            dataType:"json",
            type:'post',
            success:function (data) {
                if (data) {
                    if (data.code == 200) {
                        success(data.message);
                        ajaxForm.hide();
                        testCaseForm.show();
					
						if(!data.msg.length) return ;
						
						var msg = data.msg,
							html = "";
						
						for(var len = msg.length;len--;){
							html += '<div class="test-case">'+
									'<div class="control-group">'+
										'<label class="control-label">Type</label>'+
										'<div class="controls">'+
											'<select id="type">'+
												'<option value="1" '+ (msg[len].type==1?" selected ":"")+'>'+'前端</option>'+
												'<option value="2" '+ (msg[len].type==2 ? " selected ":"")+'>后端</option>'+
											'</select>'+
										'</div>'+
									'</div>'+
									'<div class="control-group">'+
										'<label class="control-label">TestCase Code</label>'+
										'<div class="controls">'+
											'<textarea class="span8 testcase" rows="8" >'+msg[len]['testcase']+'</textarea>'+
										'</div>'+
									'</div>'+
									'<div class="control-group">'+
										'<label class="control-label">Fake Data</label>'+
										'<div class="controls">'+
											'<textarea class="span8 fake" rows="8" >'+msg[len]['fakedata']+'</textarea>'+
										'</div>'+
									'</div>'+
									'<div class="control-group">'+
										'<div class="controls">'+
											'<button class="btn testcase_update J-testcase-'+msg[len]['id']+'">更新</button>'+
										'</div>'+
									'</div>'+
									'</div>';		
						} 
						testCaseForm.html(html);
						
					}else if (data.code == 500) {
                        error(data.message);
                    }
                }
            },
            error:function () {
                error("网络错误，请稍后重试；");
            }
        }); 
    });
	
	
	updateTestCaseBtn.live('click',function (e) {
		var parent = $(this).parents(".test-case");
		 $.ajax({
            url:"/__ajax__/update_testcase",
            data:{
                testcase:parent.find(".testcase").val(),
                fakedata:parent.find(".fake").val(),
				id:$(this).attr("class").match(/J-testcase-(.)+/)[1]
            },
            dataType:"json",
            type:'post',
            success:function (data) {
                if (data) {
                    if (data.code == 200) {
						success(data.msg.message);
              
                    } else if (data.code == 500) {
                        error(data.msg.message);
                    }
                }
            },
            error:function () {
                error("网络错误，请稍后重试；");
            }
        }); 
    });
});