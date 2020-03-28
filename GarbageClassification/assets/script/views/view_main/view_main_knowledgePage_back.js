import loadAudio from '../../common/loadMusics';

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    loadSound(event,path){
        this.node.parent.active = false;
        loadAudio.loadSoundByPath([{VIEW_KNOWLEDGEPAGE_BACK:path}],path);
    },

    start () {

    },

    // update (dt) {},
});
