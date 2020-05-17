import data from '../../common/getData';

cc.Class({
    extends: cc.Component,

    properties: {
        content:cc.Node,
        knapsackPropPrefab:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //调用返回主菜单方法，给返回按钮绑定一个点击事件
        this.backHome();
        //调用道具实例化方法
        this.setProps();
        
        let children = this.content.children;
        let num = children.length;
        this.content.height = num * 150 + 50;
    },

    backHome(){
        this.node.getChildByName('view_back').on(cc.Node.EventType.TOUCH_END,(event)=>{
            this.node.active = false;
        })
    },

    setProps(){
        //遍历props数组，根据配置信息实例化道具
        let props = data.getProps();
        if(props){
            for(let i = 0;i<props.length;i++){
                let name = props[i].name;
                let url = props[i].url;
                let introduce  = props[i].introduce;
                cc.loader.loadRes(url,cc.SpriteFrame,(err,result)=>{
                    if(err){
                        cc.error('加载道具图片有误，检查路径是否有误！',err);
                        return;
                    }
                    let shoppingProp = cc.instantiate(this.knapsackPropPrefab);
                    shoppingProp.getChildByName('view_prop_logo').getComponent(cc.Sprite).spriteFrame = result;
                    shoppingProp.getChildByName('view_prop_name').getComponent(cc.Label).string = name;
                    //shoppingProp.getChildByName('view_prop_price').getChildByName('view_prop_price_label').getComponent(cc.Label).string = price;
                    shoppingProp.getChildByName('view_prop_introduce').getComponent(cc.Label).string = introduce;
                    shoppingProp.parent = this.content;
                    shoppingProp.y -= (50+150*i);
                    //为商店中道具设置数量
                    let num = data.getNum(props[i].id);
                    if(!num){
                        num = 0;
                    }
                    shoppingProp.getChildByName('view_prop_number').getComponent(cc.Label).string = 'X' + num;
                })
    
            }
        }
    },

    start () {

    },

    // update (dt) {},
});
