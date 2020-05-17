cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log(`prefabs/${GS.Constants.levelConfig.level}`);
        cc.loader.loadRes(`prefabs/${GS.Constants.levelConfig.level}`,(err,data)=>{
            if(err){
                cc.error('level预制体加载失误，请检查路径是否正确',err);
                return;
            }
            let level = cc.instantiate(data);
            level.parent = this.node;
            level.position = cc.v2(0,0);
        });
    },

    start () {

    },

    // update (dt) {},
});
