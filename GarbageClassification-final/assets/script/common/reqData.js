import data from './getData'

let reqData = {};
function buy(id){
    let goods = data.getGoods();
    let knapsack = GS.KVStorage.loadObj('knapsack');
    //遍历props，查看是否存在指定道具，有的话数量+1，没有的话，在背包道具数组中添加上指定道具
    let props = knapsack.props;
    cc.log(id);
    for(let j = 0;j<props.length;j++){
        if(props[j].id === id){
            props[j].num += 1;
            GS.KVStorage.saveObj('knapsack',knapsack);
            return;
        }
    }
    //获取当前点击购买按钮的道具ID，并根据道具ID获取该道具对象，向背包中添加道具对象信息
    for(let i = 0;i<goods.length;i++){
        if(goods[i].id === id){
            //把goods[i]字符串化
            let str = JSON.stringify(goods[i]);
            //再把字符串化的goods[i]对象化，添加到背包数据中
            let good = JSON.parse(str);
            good.num = 1;
            props.push(good);
            GS.KVStorage.saveObj('knapsack',knapsack);
        }
    }
}

function isBuy(price){
    //判断金币是否够用,够用返回1，不够用返回0
    //获取缓存中的金币数量,改变金币数量
    if(GS.KVStorage.loadStr('coinNum')){
        let coinNum = Number(GS.KVStorage.loadStr('coinNum'));
        if(coinNum >= price){
            coinNum -= price;
            GS.KVStorage.saveStr('coinNum',coinNum);
            return 1;
        }else{
            return 0;
        }
    }
}

//使用道具
function useProp(id){
    //获取背包中的道具
    let props = data.getProps();
    let used = 0;
    for(let i = 0;i<props.length;i++){
        if(props[i].id == id){
            if(props[i].num > 0){
                props[i].num -= 1;
                used = 1;
            }
            //判断一下num是否大于0
            if(props[i].num <= 0){
                props.splice(i,1);
            }
        }
    }
    //存储一下背包信息
    let knapsack = GS.KVStorage.loadObj('knapsack');
    knapsack.props = props;
    GS.KVStorage.saveObj('knapsack',knapsack);
    return used;
}

function addCoin(num){
    let coinNum = Number(GS.KVStorage.loadStr('coinNum'));
    cc.log(GS.KVStorage.loadStr('coinNum'));
    coinNum += num;
    GS.KVStorage.saveStr('coinNum',coinNum);
    cc.log(GS.KVStorage.loadStr('coinNum'));
    return GS.KVStorage.loadStr('coinNum');
}

module.exports = {
    buy,
    isBuy,
    useProp,
    addCoin
}