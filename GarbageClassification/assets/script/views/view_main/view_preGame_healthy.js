cc.Class({
    extends: cc.Component,

    properties: {
        view_healthy_prefab:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //实例化健康提示
        let view_healthy = cc.instantiate(this.view_healthy_prefab);
        let root = this.node;
        view_healthy.parent = root.getChildByName('View_Healthy');
        //给健康提示加一个显示消失的动作
        view_healthy.runAction(
            cc.sequence(
                cc.delayTime(1),
                cc.fadeOut(0.5),
                cc.delayTime(1)
            )
        );
        
    },

    start () {

    },

    // update (dt) {},
});
