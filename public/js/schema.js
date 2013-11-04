(function(){

    function generateSchema(json){
        var ret = "(";
        ret += parseObject(json,0);
        ret += ")";
        return ret;
    }

    function parseValue(key,val,level){
        var ret = "";
        if(/action|do|type/.test(key)){
            ret += "\"" + val + "\"";
        }else if(val.constructor == Array){
            ret += "Array.of("+parseValue(null,val[0],level)+")";
        }else if(val.constructor == Object){
            ret += parseObject(val,level);
        }else{
            ret += val.constructor.name;
        }
        return ret;
    }

    function empty(level){
        level = level || 0;
        var ret="";
        for(var i = 0; i < level+1; i++){
            ret+="    ";
        }
        return ret;
    }

    function parseObject(obj,level){
        var keys = Object.keys(obj);
        var ret = "{\n";

        keys.forEach(function(key,i){
            if(obj[key]){
                ret += empty(level) + "\""+key+"\":";
                ret += parseValue(key,obj[key],level+1);
                if(keys[i+1]){
                    ret +=","
                }
                ret+="\n";
            }
        });
        ret += (level==0 ? "" : empty(level-1)) + "}";
        return ret;
    }

    var i = window;

    window.schema = window.schema || {};
    window.schema.generate = generateSchema;


})();