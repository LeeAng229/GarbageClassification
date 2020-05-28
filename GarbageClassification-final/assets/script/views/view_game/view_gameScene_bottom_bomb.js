import loadAudio from '../../common/loadMusics';

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.currentPathPointCount = 0;
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
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            let path = 'musics/boom'
            let sound_config = [{Boom:path}];
            loadAudio.loadSoundByPath(sound_config,path);
            this.node.parent.getComponent(this.bottom).isSuccess();
        })
    },

    setPathNodes(pathNodes,speed){
        this.pathNodes = pathNodes;
        this.speed = speed;
        if(!this.pathDirection)
            this.pathDirection = this.pathNodes[0].position.sub(this.node.position).normalize();
    },

    move(){
        if(this.node.id === 1)
            cc.log(this.currentPathPointCount);
        let distance = this.pathNodes[this.currentPathPointCount].position.sub(this.node.position).mag();
        if(distance < 10){
            this.currentPathPointCount ++;
            //到达了最后一个路径节点
            if(this.currentPathPointCount === this.pathNodes.length){
                return;
            }
            this.pathDirection = this.pathNodes[this.currentPathPointCount].position.sub(this.node.position).normalize();
        }else{
            if(this.pathDirection){
                this.node.position = this.node.position.add(this.pathDirection.mul(this.speed));
            }
        }
    },

    start () {

    },

    // update (dt) {},
});
