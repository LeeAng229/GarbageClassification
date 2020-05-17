cc.Class({
    extends: cc.Component,

    properties: {
        stars:[cc.Node],
        buttons:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        //获取当前星星的数量
        let starNum = GS.Constants.starNum;
        if(this.starNum !== starNum){
            this.starNum = starNum;
            //遍历星星节点数组
            for(let i = 0;i<this.stars.length;i++){
                this.stars[i].active = false;
            }
            for(let i = 0;i<this.starNum;i++){
                this.stars[i].active = true;
            }
        }
        //为buttons中的继续按钮添加点击事件
        let continueNode = this.buttons.getChildByName('next');
            continueNode.on(cc.Node.EventType.TOUCH_END,(event)=>{
                GS.Constants.starNum = 0;
                let gameLevelInfo = GS.KVStorage.loadObj('GameLevelInfo');
                let index = 0;
                for(let key in gameLevelInfo){
                    if(gameLevelInfo[key].starNum >= 2 && gameLevelInfo[key].isUnlock){
                        index += 1;
                    }else if(gameLevelInfo[key].starNum <2 && gameLevelInfo[key].isUnlock){
                        index += 1;
                        cc.log(index);
                        //获取此时这个键的值
                        let levelConfig = GS.KVStorage.loadObj('GameLevelInfo')[key];
                        GS.Constants.currentLevel = index;
                        GS.Constants.levelConfig = levelConfig;
                        GS.Constants.gameLevelInfo = GS.KVStorage.loadObj('GameLevelInfo');
                        cc.director.loadScene('GameScene');
                        break; 
                    }
                    cc.log(index);
                }
            })
            if(GS.Constants.currentLevel === 3 || GS.Constants.currentLevel === 4)
                continueNode.active = false;

        //为buttons中的返回游戏主界面添加点击事件
        let backhome = this.buttons.getChildByName('backhome');
        backhome.on(cc.Node.EventType.TOUCH_END,(event)=>{
            //由于游戏主界面的静音按钮每次加载都相当于点击了一次，所以要为当前静音反向取值一次
            if(GS.KVStorage.loadStr(GS.Constants.AUDIO_MUTE_KEY) == 0){
                GS.KVStorage.saveStr(GS.Constants.AUDIO_MUTE_KEY,1);
            }else{
                GS.KVStorage.saveStr(GS.Constants.AUDIO_MUTE_KEY,0);
            }
            GS.Constants.starNum = 0;
            cc.director.loadScene('StartGame');
        });

        //为buttons中的重新游戏添加点击事件
        let restart = this.buttons.getChildByName('restart');
        restart.on(cc.Node.EventType.TOUCH_END,(event)=>{
            //获取此时这个键的值
            let levelConfig = GS.KVStorage.loadObj('GameLevelInfo')[GS.Constants.levelConfig.level];
            cc.log(levelConfig);
            GS.Constants.levelConfig = levelConfig;
            GS.Constants.gameLevelInfo = GS.KVStorage.loadObj('GameLevelInfo');
            cc.log(GS.Constants.gameLevelInfo);
            cc.director.loadScene('GameScene');
        })
    },

    start () {

    },

    update (dt) {
    },
});
