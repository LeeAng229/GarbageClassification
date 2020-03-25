let TAG = '[GSAudioManager]';
class AudioManager{
    static getInstance(){
        if(!_instance) _instance = new AudioManager();
        return _instance;
    }
    /**
     * sound_config: [{SOUND_KEY:"sound_path"},{SOUND_KEY:"sound_path"}]
     * music_config: [{MUSIC_KEY}:"music_path",{MUSIC_KEY:"music_path"}]
     */
    init(sound_config, music_config){
        this.bgMusicCache = new Map();
        this.soundCache = new Map();
        this.isMute = false;
        this.soundConfig = sound_config;
        this.musicConfig = music_config;
        this.currentPlayMusicPath = '';
        // 读取本地配置 mute
        let mute_str = GS.KVStorage.loadStr(GS.Constants.AUDIO_MUTE_KEY, '0');
        this.isMute = mute_str === '0' ? false : true;
        this.log = GS.Log.create({TAG: TAG});
    }
    loadRes(){
        let sound_keys = Reflect.ownKeys(this.soundConfig); 
        let bg_keys = Reflect.ownKeys(this.musicConfig);
        sound_keys.forEach(key=>{
            !this.soundCache.has(key) && this.addSoundByPath(this.soundConfig[key]);
        });
        bg_keys.forEach(key=>{
            !this.bgMusicCache.has(key) && this.addMusicByPath(this.musicConfig[key]);
        });
    }
    addSoundByPath(path, is_play_after_load = false){
        try {
            if (!this.soundCache.has(path)) {
                cc.loader.loadRes(path.split('.')[0], (err, res) => {
                    if(!err){
                        this.soundCache.set(path, res);
                        is_play_after_load && this.playSound(path);
                    }
                    else{
                        this.log.error('addSoundByPath', path);
                    }
                });
            } else {
                is_play_after_load && this.playSound(path);
            }
        } catch (e) {
            this.log.error('addSoundByPath', path);
        }
    }
    addMusicByPath(path, is_play_after_load = false){
        try {
            if (!this.bgMusicCache.has(path)) {
                cc.loader.loadRes(path, (err, data) => {
                    if (!err) {
                        this.bgMusicCache.set(path, data);
                        is_play_after_load && this.playMusic(path);
                    } else {
                        this.log.error('addMusicByPath', path);
                    }
                });
            } else {
                is_play && this.playMusic(url);
            }
        } catch (e) {
            this.log.error('addMusicByPath', path);
        }
    }
    playMusic(path, is_loop = true, volume = 1.0){
        this.currentPlayMusicPath = path;
        this.stopMusic();
        if(this.isMute) return;
        if(this.bgMusicCache.has(path)) cc.audioEngine.play(this.bgMusicCache.get(path), is_loop, volume);
        else{
            this.addMusicByPath(path, true);
        }
    
    }
    stopMusic(){
        cc.audioEngine.stopAll();
    }
    playSound(path){
        if(this.isMute) return;
        if(this.soundCache.has(path)) cc.audioEngine.play(this.soundCache.get(path), false, 1);
        else{
            this.addSoundByPath(path, true);
        }
    }
    setMute(is_mute){
        this.isMute = is_mute;
        // 保存静音配置
        let value = this.isMute ? '1' : '0';
        GS.KVStorage.saveStr(GS.Constants.AUDIO_MUTE_KEY, value);
    }

}
let _instance = null;
module.exprots = AudioManager.getInstance();
