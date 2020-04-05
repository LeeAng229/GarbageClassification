cc.Class({
    extends: cc.Component,

    properties: {
        levelPre : cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let level = cc.instantiate(this.levelPre);
        level.parent = this.node;
        level.position = cc.v2(0,0);
    },

    start () {

    },

    // update (dt) {},
});
