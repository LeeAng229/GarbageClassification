const EventListener = function(obj){
    let Register = {};
    obj.on = function(name,method){
        if(!Register.hasOwnProperty(name)){
            Register[name] = [];
        }
        Register[name].push(method);
    }
    obj.fire = function(name){
        if(Register.hasOwnProperty(name)){
            let handlerList = Register[name];
            for(let i = 0; i < handlerList.length; i ++){
                let handler = handlerList[i];
                let args = [];
                for(let i = 1; i < arguments.length; i ++){
                    args.push(arguments[i]);
                }
                handler.apply(this,args);
            }
        }else{
            cc.log('调用的方法不存在',name);
        }
    }
    obj.off = function(name,method){
        if(Register.hasOwnProperty(name)){
            let handlerList = Register[name];
            for(let i = 0; i<handlerList.length; i++){
                let handler = handlerList[i];
                if(handler === method){
                    handlerList.splice(i,1);
                }
            }
        }
    }
    return obj;
}
module.exports = EventListener;