cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_END,(event)=>{
            this.node.parent.active = false;
        })
    },

    start () {

    },

    // update (dt) {},
});
