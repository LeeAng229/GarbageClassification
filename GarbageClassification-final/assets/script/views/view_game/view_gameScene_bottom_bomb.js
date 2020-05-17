import loadAudio from '../../common/loadMusics';

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
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

    start () {

    },

    // update (dt) {},
});
