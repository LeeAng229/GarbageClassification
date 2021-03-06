cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.state = 'moving';
        let self = this;
        const touchStart = function(){
            self.node.state = 'touching';
            self.node.parent.getComponent('view_game_buttom').garbageTouchStart(self);
        }
        const touchMove = function(event){
            let touchPos = event.getLocation();
            let touchWorldPos = self.node.parent.convertToNodeSpaceAR(touchPos);
            self.node.position = touchWorldPos;
        }
        const touchEnd = function(){
            self.node.state = 'moving';
            self.node.parent.getComponent('view_game_buttom').garbageTouchEnd(self);
        }
        this.node.getChildByName('view_garbage').on(cc.Node.EventType.TOUCH_START,touchStart);
        this.node.getChildByName('view_garbage').on(cc.Node.EventType.TOUCH_MOVE,touchMove);
        this.node.getChildByName('view_garbage').on(cc.Node.EventType.TOUCH_END,touchEnd);
        this.node.getChildByName('view_garbage').on(cc.Node.EventType.TOUCH_CANCEL,touchEnd);
    },

    start () {

    },

    // update (dt) {},
});
