class GSKVStorage{
    static getInstance(){
        if(!_instance) _instance = new GSKVStorage();
        return _instance;
    }

    saveStr(key, str){
        cc.sys.localStorage.setItem(key, str);
    }
    loadStr(key, default_value = ''){
        return cc.sys.localStorage.getItem(key) || default_value;
    }
    saveObj(key, obj){
        let str = JSON.stringify(obj);
        this.saveStr(key, str);
    }
    loadObj(key, default_value = null){
        let str = this.loadStr(key, default_value);
        if(str === null) return str;
        return JSON.parse(str);
    }
    remove(key){
        cc.sys.localStorage.removeItem(key);
    }

}

let _instance = null;
module.exprots = GSKVStorage.getInstance();
