cc.Class({
    extends: cc.Component,

    properties: {
        level1:cc.Node,
        level2:cc.Node,
        level3:cc.Node,
        level1Stars:cc.Node,
        level2Stars:cc.Node,
        level3Stars:cc.Node

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //为三个关卡选项添加点击事件
        this.level1.on(cc.Node.EventType.TOUCH_END,(event)=>{
            let gameLevelInfo = GS.KVStorage.loadObj('GameLevelInfo');
            if(gameLevelInfo['level1'].isUnlock){
                let levelConfig = GS.KVStorage.loadObj('GameLevelInfo')['level1'];
                GS.Constants.currentLevel = 1;
                GS.Constants.levelConfig = levelConfig;
                GS.Constants.gameLevelInfo = GS.KVStorage.loadObj('GameLevelInfo');
                cc.director.loadScene('GameScene');
            }
        })
        this.level2.on(cc.Node.EventType.TOUCH_END,(event)=>{
            let gameLevelInfo = GS.KVStorage.loadObj('GameLevelInfo');
            if(gameLevelInfo['level2'].isUnlock){
                let levelConfig = GS.KVStorage.loadObj('GameLevelInfo')['level2'];
                GS.Constants.currentLevel = 2;
                GS.Constants.levelConfig = levelConfig;
                GS.Constants.gameLevelInfo = GS.KVStorage.loadObj('GameLevelInfo');
                cc.director.loadScene('GameScene');
            }
        })
        this.level3.on(cc.Node.EventType.TOUCH_END,(event)=>{
            let gameLevelInfo = GS.KVStorage.loadObj('GameLevelInfo');
            if(gameLevelInfo['level3'].isUnlock){
                let levelConfig = GS.KVStorage.loadObj('GameLevelInfo')['level3'];
                GS.Constants.currentLevel = 3;
                GS.Constants.levelConfig = levelConfig;
                GS.Constants.gameLevelInfo = GS.KVStorage.loadObj('GameLevelInfo');
                cc.director.loadScene('GameScene');
            }
        })

        //显示三个关卡的星星数量
        let gameLevelInfo = GS.KVStorage.loadObj('GameLevelInfo');
        //关卡一
        let level1 = gameLevelInfo.level1;
        let level1StarNum = level1.starNum;
        for(let i = 0;i < this.level1Stars.children.length;i++){
            this.level1Stars.children[i].getChildByName('star').active = false;
        }
        for(let i = 0;i<level1StarNum;i++){
            this.level1Stars.children[i].getChildByName('star').active = true;
        }
        //关卡二
        let level2 = gameLevelInfo.level2;
        let level2StarNum = level2.starNum;
        for(let i = 0;i < this.level2Stars.children.length;i++){
            this.level2Stars.children[i].getChildByName('star').active = false;
        }
        for(let i = 0;i<level2StarNum;i++){
            this.level2Stars.children[i].getChildByName('star').active = true;
        }
        //关卡三
        let level3 = gameLevelInfo.level3;
        let level3StarNum = level3.starNum;
        for(let i = 0;i < this.level3Stars.children.length;i++){
            this.level3Stars.children[i].getChildByName('star').active = false;
        }
        for(let i = 0;i<level3StarNum;i++){
            this.level3Stars.children[i].getChildByName('star').active = true;
        }

        this.node.getChildByName('back').on(cc.Node.EventType.TOUCH_END,(event)=>{
            this.node.active = false;
        })
    },

    start () {

    },

    // update (dt) {},
});
