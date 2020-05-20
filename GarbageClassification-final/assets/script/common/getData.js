//let getData = {};

//获取商店道具配置文件
let getGoods = function(){
    //获取缓存中是否有json对象 
    if(!GS.KVStorage.loadObj('shopping')){
        //不存在的情况下，加载json文件中的数据到缓存对象中
        cc.loader.loadRes('JSON/shopping',(err,data)=>{
            if(err){
                cc.error("商店道具信息加载有误，请检查路径是否正确",err);
                return;
            }
            let shopping = data.json;
            GS.KVStorage.saveObj('shopping',shopping);
        });
    }
    let shopping = GS.KVStorage.loadObj('shopping');
    let goods = shopping.props;
    return goods;
}

//获取背包道具配置文件
let getProps = function(){
    //获取缓存中是否有json对象 
    if(!GS.KVStorage.loadObj('knapsack')){
        cc.log('使用的读取JSON文件的数据');
        //不存在的情况下，加载json文件中的数据到缓存对象中
        cc.loader.loadRes('JSON/knapsack',(err,data)=>{
            if(err){
                cc.error("商店道具信息加载有误，请检查路径是否正确",err);
                return;
            }
            let knapsack = data.json;
            GS.KVStorage.saveObj('knapsack',knapsack);
            let props = knapsack.props;
            return props;
        });
    }else{
        cc.log('使用的缓存数据',GS.KVStorage.loadObj('knapsack'));
        let knapsack = GS.KVStorage.loadObj('knapsack');
        let props = knapsack.props;
        return props;
    }
}

//获取道具数量
let getNum = function(id){
    //获取背包数据
    let knapsack = this.getProps();
    //遍历这个背包中的道具数组
    if(knapsack && knapsack.length > 0){
        let hasId = false;
        let num = 0;
        for(let i = 0;i<knapsack.length;i++){
            if(knapsack[i].id === id){
                num = knapsack[i].num;
                hasId = true;
            }
        }
        if(!hasId){
            return 0;
        }
        
        if(num && num > 0){
            return num;
        }
    }
}

//获取当前金币数量
let getCoinNum = function(){
    return GS.KVStorage.loadStr('coinNum');
}

module.exports = {
    getGoods,
    getProps,
    getNum,
    getCoinNum
}