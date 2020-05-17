import data from '../../common/getData'
let shopping = data.getGoods();

cc.Class({
    extends: cc.Component,

    properties: {
        content:cc.Node,
        shoppingPropPrefab:cc.Prefab
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
        let props = shopping;
        //遍历props数组，根据配置信息实例化道具
        for(let i = 0;i<props.length;i++){
            let name = props[i].name;
            let url = props[i].url;
            let price = props[i].price;
            let introduce  = props[i].introduce;
            let id = props[i].id;
            cc.log(url,name,price,introduce);
            cc.loader.loadRes(url,cc.SpriteFrame,(err,result)=>{
                if(err){
                    cc.error('加载道具图片有误，检查路径是否有误！',err);
                    return;
                }
                let shoppingProp = cc.instantiate(this.shoppingPropPrefab);
                shoppingProp.getComponent('view_main_shopping_prop').initByData(id,name,price,introduce,result);
                shoppingProp.parent = this.content;
                shoppingProp.y -= (50+150*i);
            })

        }
    },

    start () {

    },

    // update (dt) {},
});
