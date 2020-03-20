cc.Class({
    extends: cc.Component,

    properties: {
        dustbinParents:[cc.Node]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //根据json配置信息动态加载垃圾桶
        //this.getDustbinsBuConfig();
        GS.event.fire('getDustins',this.dustbins);
    },

    getDustbinsBuConfig(){
        cc.loader.loadRes('JSON/dustbinsConfig',(err,data)=>{
            if(err){
                cc.error('垃圾桶信息加载有误，请检查路径是否正确！');
                return;
            }
            let dustbins = data.json.dustbins;
            //遍历获取的数组，把他们按照配置信息实例化出来
            for(let i = 0; i<dustbins.length; i++){
                let dustbin = cc.instantiate(this.dustbinPre);
                cc.loader.loadRes(dustbins[i].url,cc.SpriteFrame,(err,data)=>{
                    if(err){
                        cc.log(dustbins[i]);
                        cc.error('垃圾桶spriteFrame获取失败');
                        return;
                    }
                    dustbin.spriteFrame = data;
                    dustbin.type = dustbins[i].type;
                    dustbin.parent = this.dustbinParents[i];
                })
            }
        })
    },

    start () {

    },

    // update (dt) {},
});
