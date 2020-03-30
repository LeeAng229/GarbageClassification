const TAG = "VIEW_SCENE_STARTGAME";
const LOG = GS.Log.create(TAG);
const ViewMap = new Map();
import loadAudio from '../../common/loadMusics'

const ViewNames = {
    VIEW_MAIN_BG:'view_main_bg',
    VIEW_MAIN_KNOWLEDGE:'view_main_knowledge',
    VIEW_MAIN_STARTGAME:'view_main_startGame',
    VIEW_MAIN_MUTE:'view_main_mute'
}

const LoadViewsOnEnter = [
    ViewNames.VIEW_MAIN_BG,
    ViewNames.VIEW_MAIN_KNOWLEDGE,
    ViewNames.VIEW_MAIN_STARTGAME,
    ViewNames.VIEW_MAIN_MUTE
]

cc.Class({
    extends: cc.Component,

    properties: {
        view_healthy_prefab:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //加载等级信息
        if(!GS.KVStorage.loadObj('GameLevelInfo')){
            cc.loader.loadRes('JSON/GameLevelInfo',(err,data)=>{
                if(err){
                    cc.error('gameLevelInfo加载失败，请检查路径是否正确');
                    return;
                }
                let gameConfig = data.json;
                GS.KVStorage.saveObj('GameLevelInfo',gameConfig);
            })
        }

        this.garbageKnowledgeArr = [];
        this.garbageKnowledgePageArr = [];
        this.root = this.node.getChildByName('root');
        //实例化健康提示
        let view_healthy = cc.instantiate(this.view_healthy_prefab);
        let root = this.node;
        view_healthy.parent = root.getChildByName('View_Healthy');
        //给健康提示加一个显示消失的动作
        view_healthy.runAction(
            cc.sequence(
                cc.delayTime(0.5),
                cc.fadeOut(0.4),
                cc.delayTime(1),
                cc.callFunc(()=>{
                    this.loadViews();
                    view_healthy.destroy();
                    let path = 'musics/bg';
                    let music_config = [{MUSIC_KEY:'musics/bg'}];
                    loadAudio.loadMusicByPath(music_config,path);
                })
            )
        );
        //this.loadViews();
    },

    loadViews(){
        LoadViewsOnEnter.forEach(viewName=>this._loadViewByViewName(viewName));
    },

    getViewByName(viewName){
        if(!ViewMap.has(viewName)) return null;
        return ViewMap.get(viewName);
    },

    _loadViewByViewName(viewName){
        cc.loader.loadRes(`prefabs/${viewName}`,(err,prefab)=>{
            let rootNode = this._getViewNodeByName(viewName);
            let viewNameNode = cc.instantiate(prefab);
            viewNameNode.parent = rootNode;

            //判断当viewName是view_main_knowledge的时候，进行相应的处理
            if(viewName == 'view_main_knowledge'){
                viewNameNode.on(cc.Node.EventType.TOUCH_END,(event)=>{
                    if(this.garbageKnowledgePageArr.length < 1){
                        this.garbageKnowledgePage();
                        this.garbageKnowledgePageArr.push(viewNameNode);
                    }else{
                        let view_garbageKnowledgePage = this.getViewByName('view_main_knowledgePage');
                        view_garbageKnowledgePage.active = true;
                    }
                })
            }

            // //判断当viewName是view_main_startGame的时候，进行相应的处理
            // if(viewName == 'view_main_startGame'){
            //     viewNameNode.on(cc.Node.EventType.TOUCH_END,(event)=>{
            //         // //做一个场景的跳转
            //         // cc.director.loadScene('GameScene');

            //         //把所有子节点弹出来
            //         let children = viewNameNode.children;
            //         for(let i = 0;i<children.length;i++){
            //             let child = children[i];
            //             let childPos = child.position;
            //             if(child.name !== 'Background' && child.name !== 'Mask'){
            //                 child.active = true;
            //                 child.runAction(
            //                     cc.moveTo(0.1,cc.v2(0,301*i)),
            //                     cc.delayTime(0.5)
            //                 )
            //             }
            //         }
            //     })
            // }
            ViewMap.set(viewName,viewNameNode);
        });
    },

    //根据名称获取应该放置的节点位置，确定父节点
    _getViewNodeByName(viewName){
        let viewNode = this.root.getChildByName('content').getChildByName(viewName);
        if(!viewNode) return null;
        return viewNode;
    },

    //实例化并显示垃圾分类小知识页面
    garbageKnowledgePage(){
        let viewName = 'view_main_knowledgePage';
        this._loadViewByViewName(viewName);
    },

    start () {

    },

    // update (dt) {},
});
