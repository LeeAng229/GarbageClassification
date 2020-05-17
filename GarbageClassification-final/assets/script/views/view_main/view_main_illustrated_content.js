cc.Class({
    extends: cc.Component,

    properties: {
        view_main_illustrated_content_pre : cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    touchEnd(){
        if(!this.view_main_illustrated_content){
            this.view_main_illustrated_content = cc.instantiate(this.view_main_illustrated_content_pre);
            this.view_main_illustrated_content.parent = this.node.parent.parent;
            this.view_main_illustrated_content.position = cc.v2(0,0);
        }else{
            this.view_main_illustrated_content.active = true;
        }
    }

    // update (dt) {},
});
