cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log(GS.KVStorage.loadStr('coinNum'));
        //获取当前关卡是否到前三关全部通关
        let gameLevelInfo = GS.KVStorage.loadObj('GameLevelInfo');
        let index = 0;
        for(let key in gameLevelInfo){
            if(key == 'level3'){
                if(gameLevelInfo[key].starNum >= 2)
                    index = 4;
            }
        }
        cc.log(index);

        //如果到第四关了，就展示button按钮为可用状态，否则展示为禁用状态
        if(index == 4){
            gameLevelInfo['level4'].isUnlock = true;
            GS.KVStorage.saveObj('GameLevelInfo',gameLevelInfo);
            this.node.getComponent(cc.Button).interactable = true;
            this.node.off(cc.Node.EventType.TOUCH_END,(event)=>{
                cc.log('现在是可选中状态');
            })
        }else{
            this.node.getComponent(cc.Button).interactable = false;
            this.node.on(cc.Node.EventType.TOUCH_END,(event)=>{
                cc.log('现在是不可选中状态');
            })
        }
    },

    start () {
    },

    //当按钮为可用状态时，点击按钮，进入第四关无尽模式
    enterLimitGame(){
        let levelConfig = GS.KVStorage.loadObj('GameLevelInfo')['level4'];
        GS.Constants.levelConfig = levelConfig;
        GS.Constants.currentLevel = 4;
        cc.log(levelConfig);
        GS.Constants.gameLevelInfo = GS.KVStorage.loadObj('GameLevelInfo');
        cc.director.loadScene('GameScene');
    }

    // update (dt) {},
});
