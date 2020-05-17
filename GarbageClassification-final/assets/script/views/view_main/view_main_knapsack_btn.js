cc.Class({
    extends: cc.Component,

    properties: {
        knapsackPre:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    knapsack_btn(){
        let knapsacks = [];
        if(knapsacks.length <= 0){
            let knapsack = cc.instantiate(this.knapsackPre);
            knapsack.parent = this.node.parent.parent;
            knapsack.position = cc.v2(0,0);
            knapsacks.push(this.knapsack);
        }else{
            knapsacks[0].active = true;
            knapsacks[0].getComponent('view_main_knapsack').setProps();
        }
    },

    start () {

    },

    // update (dt) {},
});
