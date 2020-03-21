cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let self = this;
        const touchStart = function(){
            self.node.parent.getComponent('view_game_buttom').garbageTouchStart(self);
        }
        const touchMove = function(event){
            let touchPos = event.getLocation();
            let touchWorldPos = self.node.parent.convertToNodeSpaceAR(touchPos);
            self.node.position = touchWorldPos;
        }
        const touchEnd = function(){
            self.node.parent.getComponent('view_game_buttom').garbageTouchEnd(self);
        }
        this.node.on(cc.Node.EventType.TOUCH_START,touchStart);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,touchMove);
        this.node.on(cc.Node.EventType.TOUCH_END,touchEnd);
    },

    start () {

    },

    // update (dt) {},
});
