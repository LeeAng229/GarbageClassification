cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        GS.KVStorage.saveStr(GS.Constants.AUDIO_MUTE_KEY,1);
        this._isMute();
        this.node.on(cc.Node.EventType.TOUCH_END,(event)=>{
            this._isMute();
        })
    },

    _isMute(){
        let path = '';
        if(GS.KVStorage.loadStr(GS.Constants.AUDIO_MUTE_KEY) == 0){
            GS.AudioManager.setMute(true);
            path = 'images/gameView/voiceClose'
            GS.AudioManager.stopMusic();
        }else{
            GS.AudioManager.setMute(false);
            path = 'images/gameView/voiceOpen';
            GS.AudioManager.playMusic('musics/bg');
        }
        cc.loader.loadRes(path,cc.SpriteFrame,(err,data)=>{
            if(err){
                cc.error('voiceClose加载失败，请检查路径');
                return;
            }
            this.node.getComponent(cc.Sprite).spriteFrame = data;
        })
    },

    start () {

    },

    // update (dt) {},
});
