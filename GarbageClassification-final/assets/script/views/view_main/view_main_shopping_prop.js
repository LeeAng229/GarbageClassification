import reqData from '../../common/reqData';
import data from '../../common/getData';

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initByData(id,name,price,introduce,result){
        this.node.getChildByName('view_prop_logo').getComponent(cc.Sprite).spriteFrame = result;
        this.node.getChildByName('view_prop_name').getComponent(cc.Label).string = name;
        this.node.getChildByName('view_prop_price').getChildByName('view_prop_price_label').getComponent(cc.Label).string = price;
        this.node.getChildByName('view_prop_introduce').getComponent(cc.Label).string = introduce;
        //为商店中道具设置数量
        this.num = data.getNum(id);
        if(!this.num){
            this.num = 0;
        }
        this.refreshPropNum(this.num);
        this.node.id = id;
        this.node.price = price;
    },

    buyBtn(){
        //获取当前道具的价格
        let price = this.node.price;
        //获取当前道具的id
        let id = this.node.id;
        //先判断金币是否够用
        let result = reqData.isBuy(price);
        //调用购买道具的接口
        if(result == 1){
            reqData.buy(id);
            this.num += 1;
            this.refreshPropNum(this.num);
            this.refreshCoinNum();
        }else{
            cc.log('抱歉金币不够');
        }
    },

    //刷新道具的数量
    refreshPropNum(num){
        this.node.getChildByName('view_prop_number').getComponent(cc.Label).string = 'X' + num;
    },
    refreshCoinNum(){
        this.node.parent.parent.parent.parent.getChildByName('view_main_coinNum').getComponent('view_main_coinNum').onLoad();
    },

    start () {

    },

    // update (dt) {},
});
