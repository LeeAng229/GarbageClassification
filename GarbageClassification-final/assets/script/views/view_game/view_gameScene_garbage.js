cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.state = 'moving';
        let self = this;
        this.bottom = 'view_game_buttom';
        if(GS.Constants.currentLevel == 1){
            this.bottom = 'view_game_buttom';
        }else if(GS.Constants.currentLevel == 2){
            this.bottom = 'view_game_buttom_level2';
        }else if(GS.Constants.currentLevel == 3){
            this.bottom = 'view_game_buttom_level3';
        }else{
            this.bottom = 'view_game_buttom_level4';
        }
        const touchStart = function(){
            self.node.state = 'touching';
            self.node.parent.getComponent(`${self.bottom}`).garbageTouchStart(self);
        }
        const touchMove = function(event){
            let touchPos = event.getLocation();
            let touchWorldPos = self.node.parent.parent.convertToNodeSpaceAR(touchPos);
            self.node.position = touchWorldPos;
        }
        const touchEnd = function(){
            self.node.state = 'moving';
            self.node.parent.getComponent(`${self.bottom}`).garbageTouchEnd(self);
        }
        this.node.getChildByName('view_garbage').on(cc.Node.EventType.TOUCH_START,touchStart);
        this.node.getChildByName('view_garbage').on(cc.Node.EventType.TOUCH_MOVE,touchMove);
        this.node.getChildByName('view_garbage').on(cc.Node.EventType.TOUCH_END,touchEnd);
        this.node.getChildByName('view_garbage').on(cc.Node.EventType.TOUCH_CANCEL,touchEnd);
    },

    start () {

    },

    setState(state,dustbin){
        this.dustbin = dustbin;
        this.state = state;
    },

    update (dt) {
        if(this.state === 'auto'){
            let distance = this.dustbin.position.sub(this.node.position).mag();
            this.direction = this.dustbin.position.sub(this.node.position).normalize();
            if(distance >= 10){
                this.node.position = this.node.position.add(this.direction.mul(1000*dt));
            }else{
                this.node.parent.parent.getChildByName('view_gameScene_bottom').getComponent(`${this.bottom}`).robotAddScore(this.node);
                this.state = null;
            }
        }
    },
});
