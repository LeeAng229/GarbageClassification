import loadAudio from '../common/loadMusics';

const loadSound = loadAudio.loadSoundByPath;

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    loadSoundByPath(event,path){
        cc.log('触发了',this.node.name);
        let sound_config = [{BUTTON_CONFIG:path}];
        loadSound(sound_config,path);
    },

    start () {

    },

    // update (dt) {},
});
