import loadAudio from '../../common/loadMusics'

const TAG = "VIEW_SCENE_GAMESCENE";
const LOG = GS.Log.create(TAG);
const ViewMap = new Map();

const ViewNames = {
    VIEW_GAMESCENE_TOP:'view_gameScene_top',
    VIEW_GAMESCENE_CENTER:'view_gameScene_center'
    //VIEW_GAMESCENE_BOTTOM:'view_gameScene_bottom'
}

const LoadViewsOnEnter = [
    ViewNames.VIEW_GAMESCENE_TOP,
    ViewNames.VIEW_GAMESCENE_CENTER
    //ViewNames.VIEW_GAMESCENE_BOTTOM
]

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.beforeTime = GS.GSDate.timeStamp();
        this.rightNum = 0;
        this.starNum = 0;
        this.view_gameScene_top = undefined;


        LoadViewsOnEnter.forEach(viewname=>{
            cc.loader.loadRes(`prefabs/${viewname}`,(err,prefab)=>{
                if(err){
                    cc.log('路径有误！');
                    return;
                }
                let viewNameNode = cc.instantiate(prefab);
                viewNameNode.parent = this.node.getChildByName(`${viewname}`);

                //判断viewname是否为view_gameScene_top
                if(viewname === 'view_gameScene_top'){
                    this.view_gameScene_top = viewNameNode;
                    //如果是的话，初始化进度条和星星
                    viewNameNode.getChildByName('view_top_progressBar').width = GS.Constants.progressBarWidth*Math.floor(this.rightNum/10);
                    viewNameNode.getChildByName('view_top_stars').children.forEach(child=>{
                        child.active = false;
                    })
                }
            })
        })

        //加载背景音乐
        let path = 'musics/gameBg';
        let music_config = [{GAME_BGM:path}];
        loadAudio.loadMusicByPath(music_config,path);
    },

    setRightAndStarNum(rightNum,starNum){
        this.rightNum = rightNum;
        this.starNum = starNum;
    },

    setScore(score){
        let scoreLabel = this.view_gameScene_top.getChildByName('view_top_score').getComponent(cc.Label);
        let scoreLabelStr = scoreLabel.string;
        scoreLabelStr = Number(scoreLabelStr) + score;
        scoreLabel.string = scoreLabelStr;
    },

    start () {

    },

    update (dt) {
        let afterTime = GS.GSDate.timeStamp();
        if(afterTime - this.beforeTime >= 1000){
            let label = this.view_gameScene_top.getChildByName('view_top_time').getComponent(cc.Label);
            let labelStr = label.string;
            label.string = String(Number(labelStr.slice(0,labelStr.length-1)) - 1) + 'S';
            this.beforeTime = afterTime;
        }
        if(this.view_gameScene_top && this.starNum <= 3){
            this.view_gameScene_top.getChildByName('view_top_progressBar').width = GS.Constants.progressBarWidth*(this.rightNum/10);
            let stars = this.view_gameScene_top.getChildByName('view_top_stars').children;
            for(let i = 0;i < stars.length; i++){
                stars[i].active = false;
            }
            for(let i = 0;i < this.starNum; i++){
                stars[i].active = true;
            }
        }
    },
});
