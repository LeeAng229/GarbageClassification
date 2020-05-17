cc.Class({
    extends: cc.Component,

    properties: {
        view_main_shopping_pre:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    shopping_btn(){
        let shoppings = [];
        if(shoppings.length <= 0){
            this.shopping = cc.instantiate(this.view_main_shopping_pre);
            this.shopping.parent = this.node.parent.parent;
            this.shopping.position = cc.v2(0,0);
            shoppings.push(this.shopping);
        }else{
            shoppings[0].active = true;
        }
    },

    start () {

    },

    // update (dt) {},
});
