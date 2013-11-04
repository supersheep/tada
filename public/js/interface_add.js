$(function(){
    var bizel = $("#biz"),
        appel = $("#app");

    bizel.on("change",function(){
        var bizid = $(this).val();
        var _apps = apps.filter(function(item){
            return item.bizid == bizid;
        });
        appel.empty();
        _apps.forEach(function(item){
            var option = $("<option />").html(item.name).val(item.id);
            if(item.id == window.appid){
                option.attr("selected",true);
            }
            option.appendTo(appel);
        });
        appid = null;
    });
    bizel.trigger("change");
});
/* 
$(function () {
    var thisId = "",
        addBtn = $("#ajax_add"),
        addTestCaseBtn = $("#testcase_add"),
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
        processBar,
        layer ,
        ajaxForm = $("#form_add_ajax"),
        testCaseForm = $("#form_add_testcase"),
        testCaseList = $("#testcase_list"),
        successAlert,
        errorAlert,
        success = function (msg) {
            successAlert = $('<div class="alert alert-success fade in">\
                            <button type="button" class="close" data-dismiss="alert">×</button>\
                            ' + msg + '\
                        </div>').prependTo($(".container"));
            successAlert.alert();
            setTimeout(function () {
                successAlert.alert("close");
            }, 2000);
        },
        error = function (msg) {
            errorAlert = $('<div class="alert alert-error fade in">\
                            <button type="button" class="close" data-dismiss="alert">×</button>\
                            ' + msg + '\
                        </div>').prependTo($(".container"));
            errorAlert.alert();
            setTimeout(function () {
                errorAlert.alert("close");
            }, 2000);
        },
        showProcess = function () {
            processBar || (processBar = $('<div class="progress progress-striped active"><div class="bar"></div></div>')).css({
                position:'fixed',
                width:600,
                left:'50%',
                top:'50%',
                'margin-left':-300,
                'z-index':'10000'
            }).appendTo(document.body);
            layer || (layer = $('<div></div>').css({
                position:'fixed',
                width:'100%',
                height:'100%',
                left:0,
                top:0,
                backgroundColor:'#000',
                opacity:0.1,
                'z-index':9999
            }).appendTo(document.body));
            processBar.show();
            layer.show();
            processBar.find('.bar').width('70%');
        },
        hideProcess = function () {
            processBar.find('.bar').width('100%');
            setTimeout(function () {
                processBar.hide();
                layer.hide();
            }, 500);
        };

    addBtn.click(function () {
        if (!formControls.url.val()) {
            formControls.url.parents('.control-group').addClass('error').find('.help-inline').removeClass('hide');
            return;
        }
        formControls.url.parents('.control-group').removeClass('error').find('.help-inline').addClass('hide');
        showProcess();
        $.ajax({
            url:"/__ajax__/addajax",
            data:{
                url:formControls.url.val(),
                biz:formControls.biz.val(),
                param:formControls.param.val(),
                app:formControls.app.val()
            },
            dataType:"json",
            type:'post',
            success:function (data) {
                hideProcess();
                if (data) {
                    if (data.code == 200) {
                        success(data.msg.message);
                        thisId = data.msg.id;
                        ajaxForm.hide();
                        testCaseForm.show();
                    } else if (data.code == 500) {
                        error(data.msg.message);
                    }
                }
            },
            error:function () {
                hideProcess();
                error("网络错误，请稍后重试；");
            }
        });
    });

    addTestCaseBtn.click(function () {
        var type = testCaseFormControls.type.val(),
            testcase = testCaseFormControls.testcase.val(),
            fakedata = testCaseFormControls.fake.val();

        showProcess();
        $.ajax({
            url:"__ajax__/addtestcase",
            data:{
                type:type,
                testcase:testcase,
                fakedata:fakedata,
                id:thisId
            },
            dataType:"json",
            type:"post",
            success:function (data) {
                hideProcess();
                if (data) {
                    if (data.code == 200) {
                        success(data.msg.message);
                        testCaseList.append('<tr><td>' + type + '</td><td>' + testcase.replace(/\n+/, "<br/>") + '</td><td>' + fakedata.replace(/\n+/, "<br/>") + '</td></tr>').show();
                        testCaseForm.find('legend').html("再添加一条TestCase");
                        testCaseForm.find('textarea').val('');
                    } else {
                        error(data.msg.message);
                    }
                }
            },
            error:function () {
                hideProcess();
                error("网络出错，请稍后重试");
            }
        })
    });

});
*/