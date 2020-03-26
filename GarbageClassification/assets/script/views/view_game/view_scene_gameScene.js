const TAG = "VIEW_SCENE_GAMESCENE";
const LOG = GS.Log.create(TAG);
const ViewMap = new Map();
import loadAudio from '../../common/loadMusics'

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
        LoadViewsOnEnter.forEach(viewname=>{
            cc.loader.loadRes(`prefabs/${viewname}`,(err,prefab)=>{
                if(err){
                    cc.log('路径有误！');
                    return;
                }
                let viewNameNode = cc.instantiate(prefab);
                viewNameNode.parent = this.node.getChildByName('content').getChildByName(`${viewname}`);

                //判断viewname是否为view_gameScene_top
                if(viewname === 'view_gameScene_top'){
                    //如果是的话，初始化进度条和星星
                    viewNameNode.getChildByName('view_top_progressBar').width = 744*0;
                    viewNameNode.getChildByName('view_top_stars').children.forEach(child=>{
                        child.active = false;
                    })
                }
            })
        })
    },
    start () {

    },

    // update (dt) {},
});
