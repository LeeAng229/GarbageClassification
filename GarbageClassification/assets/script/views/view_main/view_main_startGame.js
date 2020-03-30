cc.Class({
    extends: cc.Component,

    properties: {
        startGameOpenPre: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.pauseGameState = 0;
    },

    //触发btn按钮，实例化需要弹出的按钮
    btnOpen() {
        let view_main_startGame = this.node.parent;
        //if (!view_main_startGame.startGameOpen) {
            view_main_startGame.startGameOpen = cc.instantiate(this.startGameOpenPre);
            view_main_startGame.startGameOpen.parent = view_main_startGame;
            view_main_startGame.startGameOpen.position = cc.v2(0, 0);
            cc.log('实例化了');
            view_main_startGame.startGameOpen.getChildByName('Mask').on(cc.Node.EventType.TOUCH_END, (event) => {
                view_main_startGame.startGameOpen.children.forEach((child) => {
                    if (child.name !== 'Mask') {
                        child.runAction(
                            cc.sequence(
                                cc.moveTo(0.1, cc.v2(0,0)),
                                cc.callFunc(() => {
                                    cc.log(child.position);
                                }),
                            )
                        )
                    }
                })
                view_main_startGame.startGameOpen.destroy();
            })
        // }else{
        //     view_main_startGame.startGameOpen.active = true;
        // }
        if(GS.KVStorage.loadObj("GameLevelInfo")){
            let gameLevelInfo = GS.KVStorage.loadObj('GameLevelInfo');
            for(let i in gameLevelInfo){
                if(gameLevelInfo[i].starNum > 0){
                    this.pauseGameState = 1;
                }
            }
        }

        for (let i = 0; i < view_main_startGame.startGameOpen.children.length; i++) {
            let child = view_main_startGame.startGameOpen.children[i];
            if(child.name == 'view_main_startGame_pauseGame' && this.pauseGameState == 0){
                child.active = false;
            }

            if (child.name !== 'Mask') {
                child.runAction(
                    cc.moveTo(0.1, cc.v2(0, 150 * i))
                )
                cc.log(child.position);
            }
            if(child.name === 'view_main_startGame_newGame'){
                child.on(cc.Node.EventType.TOUCH_END,(event)=>{
                    cc.loader.loadRes('JSON/GameLevelInfo',(err,data)=>{
                        if(err){
                            cc.error('gameLevelInfo加载失败，请检查路径是否正确');
                            return;
                        }
                        let gameConfig = data.json;
                        GS.KVStorage.saveObj('GameLevelInfo',gameConfig);
                    })
                    cc.director.loadScene('GameScene');
                })
            }
        }
    },

    start() {

    },

    //update (dt) {},
});
