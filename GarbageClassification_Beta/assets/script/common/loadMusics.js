const loadAudio = {};

loadAudio.loadMusicByPath = function(music_config,path){
    GS.AudioManager.init(music_config);
    GS.AudioManager.loadRes();
    GS.AudioManager.playMusic(path,true,1);
}

loadAudio.loadSoundByPath = function(sound_config,path){
    GS.AudioManager.init(sound_config);
    GS.AudioManager.loadRes();
    GS.AudioManager.playSound(path);
}

module.exports = loadAudio;