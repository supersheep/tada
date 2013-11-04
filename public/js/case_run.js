$(function(){
    $(".select-evn").html($(".option-evn").eq(0).html()+"<span class='caret'></span>");
    $.data(document, "host", $(".option-evn").eq(0).html());
    $("#custom-evn-field").popover({
        title:"提示",
        content:"请输入正确的测试环境！"
    });
    var result_container = $("#runtestcase-result"),
        body_container = $("#runtestcase-body"),
        addr_wrap = $("#addr"),
        addr_bar = $("#addr-bar"),
        direct = false,
        custom_addr = $("#custom-addr");

    function fetchResult(host){
        host = host || fetchResult.host;
        fetchResult.host = host;
        $.ajax({
            url:"/__ajax__/run_testcase",
            dataType:"json",
            type:"post",
            data:{
                id:$.data(document,"id"),
                type:$.data(document,"type"),
                host:host,
                env:$(".nav-pills .active").text(),
                direct:direct
            },
            success:function(json){
                var result = json.result;
                var html = '<pre class="alert alert-'+(result.ok?"success":"error")+'">'+result.msg+'</pre>';
                var body = ""
                result_container.html(html);
                if(json.body){
                    body = json.body;
                    try{
                        body = JSON.stringify(JSON.parse(body),null,4);
                    }catch(e){}
                    body = body.replace(/</g,"&lt;").replace(/>/g,"&gt;");
                }
                body_container.html(body);
            },
            error:function(err){
                console.log(err);
            }
        });
    }

    function paint(el){
        el.parent().find(".active").removeClass("active");
        el.addClass("active");
    }

    $(".hosts .host:not(.other)").click(function(){
        var el = $(this),
            url = el.attr("data-url") || $.data(document,"url"),
            host = el.attr("data-host"),
            addr = "http://"+host+url;

        direct = false;
        paint(el);
        addr_wrap.removeClass("hide");
        addr_bar.addClass("hide");
        addr_wrap.html(addr);
        fetchResult(host);
        return false;
    });

    $(".hosts .other").click(function(){
        var url = custom_addr.val();
        direct = true;
        addr_wrap.addClass("hide");
        addr_bar.removeClass("hide");
        paint($(this));
        url && fetchResult(url);
        return false;
    });

    $("#go").click(function(){
        var url = custom_addr.val();
        fetchResult(url);
        return false;
    });

    $(".option-evn").click(function(){
        $(".select-evn").html($(this).html()+"<span class='caret'></span>");
        $.data(document, "host", $(this).html());
        if(!$(this).hasClass("custom-evn")){
            $("#custom-evn-wrapper").slideUp();
        }
    });

    $("#custom-evn").click(function(){
        $("#custom-evn-wrapper").slideDown();
    });


    var reqschema = null;
    $(".editable").editable("/__ajax__/update_testcase",{
        adddata:function(data,val){
            var json;
            try{
                json = JSON.parse(val);
            }catch(e){
                return false;
            }
            if(this.attr("id")=="reqdata"){
                reqschema = window.schema.generate(json);
                data["reqschema"] = reqschema;
            }
        }
    },function(){
        if(this.attr("id")=="reqdata"){
            $("#reqschema").html(reqschema);
        }
        fetchResult();

    });

    fetchResult($.data(document, "host"));
});