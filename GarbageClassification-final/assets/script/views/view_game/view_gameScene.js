import loadAudio from '../../common/loadMusics';
import data from '../../common/getData';
import setData from '../../common/reqData';

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
        view_gameScene_pause_prefab:cc.Prefab,
        view_gameScene_prop_broom_prefab:cc.Prefab
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
        //获取当前关卡信息
        let level = GS.Constants.levelConfig.level;
        //距离扫把在180范围以内的垃圾的数组
        this.garbageArr = [];
        this.beforeTime = GS.GSDate.timeStamp();
        this.rightNum = 0;
        this.starNum = 0;
        this.wave = 0;
        this.view_gameScene_top = undefined;


        LoadViewsOnEnter.forEach(viewname=>{
            if(viewname == 'view_gameScene_center'){
                viewname = `view_gameScene_center_${level}`;
                cc.log(viewname);
            }
            cc.loader.loadRes(`prefabs/${viewname}`,(err,prefab)=>{
                if(err){
                    cc.log('路径有误！');
                    return;
                }
                let viewNameNode = cc.instantiate(prefab);
                if(viewname == `view_gameScene_center_${level}`){
                    viewname = 'view_gameScene_center';
                }
                viewNameNode.parent = this.node.getChildByName(`${viewname}`);

                //判断viewname是否为view_gameScene_top
                if(viewname === 'view_gameScene_top'){
                    this.view_gameScene_top = viewNameNode;
                    //如果是的话，初始化进度条和星星
                    viewNameNode.getChildByName('view_top_progressBar').width = GS.Constants.progressBarWidth*Math.floor(this.rightNum/10);
                    viewNameNode.getChildByName('view_top_stars').children.forEach(child=>{
                        child.active = false;
                    })
                    viewNameNode.getChildByName('view_top_time').getComponent(cc.Label).string = GS.Constants.levelConfig.time;

                    let view_top_pause = viewNameNode.getChildByName('view_top_pause');
                    this.gameState = GS.Constants.gameState;
                    let url = null;
                    if(this.gameState == 'play'){
                        url = 'images/gameView/zanTing';
                    }else if(this.gameState == 'pause'){
                        url = 'images/gameView/jiXu';
                    }
                    
                    cc.loader.loadRes(url,cc.SpriteFrame,(err,data)=>{
                        if(err){
                            cc.error('暂停键资源加载有误，请检查路径是否正确');
                            return;
                        }
                        view_top_pause.getComponent(cc.Sprite).spriteFrame = data;
                    });
                    view_top_pause.on(cc.Node.EventType.TOUCH_END,(event)=>{
                        if(GS.Constants.gameState == 'play'){
                            GS.Constants.gameState = 'pause';
                            this.unschedule(this.updateTime,1);
                            if(!this.view_gameScene_pause){
                                this.view_gameScene_pause = cc.instantiate(this.view_gameScene_pause_prefab);
                                this.view_gameScene_pause.parent = this.node;
                                this.view_gameScene_pause.position = cc.v2(0,0);
                            }else
                                this.view_gameScene_pause.active = true;
                        }else{
                            GS.Constants.gameState = 'play';
                            this.schedule(this.updateTime,1);
                        }
                    })
                }
            })
        })

        //调用道具的点击事件函数
        this.propTouch();
        
        //设置道具的数量
        this.setPropNum();

        //加载背景音乐
        let path = 'musics/gameBg';
        let music_config = [{GAME_BGM:path}];
        loadAudio.loadMusicByPath(music_config,path);
    },

    setPropNum(){
        //先把所有的道具节点设置为不可见
        this.node.getChildByName('view_gameScene_prop_robot').active = false;
        this.node.getChildByName('view_gameScene_prop_broom').active = false;
        let props = data.getProps();
        for(let i = 0;i<props.length;i++){
            //自动分拣机的
            if(props[i].id == 1){
                if(props[i].num > 0){
                    this.node.getChildByName('view_gameScene_prop_robot').active = true;
                    this.node.getChildByName('view_gameScene_prop_robot').children[1].getComponent(cc.Label).string = props[i].num;
                }
                //扫把的
            }else if(props[i].id == 2){
                if(props[i].num > 0){
                    this.node.getChildByName('view_gameScene_prop_broom').active = true;
                    this.node.getChildByName('view_gameScene_prop_broom').children[1].getComponent(cc.Label).string = props[i].num;
                }
            }
        }
    },

    setRightAndStarNum(rightNum,starNum,wave){
        cc.log('wave:',wave,'  starNum:',starNum,'   rightNum:',rightNum);
        this.rightNum = rightNum;
        this.starNum = starNum;
        this.wave = wave;
    },

    setScore(score){
        let scoreLabel = this.view_gameScene_top.getChildByName('view_top_score').getComponent(cc.Label);
        let scoreLabelStr = scoreLabel.string;
        scoreLabelStr = Number(scoreLabelStr) + score;
        if(scoreLabelStr < 0){
            scoreLabelStr = 0;
        }
        scoreLabel.string = scoreLabelStr;
        return scoreLabelStr;
    },

    start () {
    },

    updateTime(){
        let label = this.view_gameScene_top.getChildByName('view_top_time').getComponent(cc.Label);
        let labelStr = label.string;
        label.string = String(Number(labelStr.slice(0,labelStr.length-1)) - 1) + 'S';
    },

    propTouch(){
        this.node.getChildByName('view_gameScene_prop_robot').on(cc.Node.EventType.TOUCH_END,(event)=>{
            let result = setData.useProp(1);
            if(result === 0){
                cc.log('您没有该道具');
            }else{
                //获取当前屏幕内的所有垃圾
                cc.log(this.bottom);
                let garbages = this.node.getChildByName('view_gameScene_bottom').getComponent(this.bottom).getCurrentGarbages();
                //获取所有的垃圾桶
                let dustbins = this.node.getChildByName('view_gameScene_bottom').getComponent(this.bottom).getDustbins();
                //遍历垃圾桶数组
                for(let i = 0;i<dustbins.length;i++){
                    //获取垃圾桶的类型
                    let type = dustbins[i].type;
                    //遍历垃圾信息
                    for(let j = 0; j<garbages.length; j++){
                        if(garbages[j].type === type){
                            garbages[j].getComponent('view_gameScene_garbage').setState('auto',dustbins[i]);
                        }
                    }
                }
            }
            this.setPropNum();
        });
        this.node.getChildByName('view_gameScene_prop_broom').on(cc.Node.EventType.TOUCH_END,(event)=>{
            let result = setData.useProp(2);
            if(result === 0){
                cc.log("您没有该道具");
            }else{
                //实例化扫把道具的预制体
                if(!this.broom)
                    this.broom = cc.instantiate(this.view_gameScene_prop_broom_prefab);
                else
                    this.broom.active = true;
                this.broom.parent = this.node;
                this.broom.runAction(
                    cc.scaleTo(0.1,3)
                )
            }

            if(this.broom){
                this.broom.on(cc.Node.EventType.TOUCH_END,(event)=>{
                    this.garbageArr = [];
                    this.broom.runAction(
                        cc.sequence(
                            cc.rotateTo(0.3,-30),
                            cc.rotateTo(0.3,30),
                            cc.rotateTo(0.3,-10),
                            cc.callFunc(()=>{
                                this.broom.active = false;
                            })
                        )
                    )
                    //判断扫把周围180范围内的垃圾，并把他们自动归类
                    //获取当前屏幕内的所有垃圾
                    let garbages = this.node.getChildByName('view_gameScene_bottom').getComponent(this.bottom).getCurrentGarbages();
                    //获取所有的垃圾桶
                    let dustbins = this.node.getChildByName('view_gameScene_bottom').getComponent(this.bottom).getDustbins();
                    //遍历garbages数组，获取距离扫把180以内的垃圾
                    for(let i = 0;i<garbages.length;i++){
                        let garbagePos = garbages[i].position;
                        //判断垃圾和扫把的距离
                        let distance = garbagePos.sub(this.broom.position).mag();
                        if(distance <= 300){
                            this.garbageArr.push(garbages[i]);
                        }
                    }
    
                    //遍历垃圾桶数组
                    for(let i = 0;i<dustbins.length;i++){
                        //获取垃圾桶的类型
                        let type = dustbins[i].type;
                        //遍历垃圾信息
                        for(let j = 0; j<this.garbageArr.length; j++){
                            if(this.garbageArr[j].type === type){
                                this.garbageArr[j].getComponent('view_gameScene_garbage').setState('auto',dustbins[i]);
                            }
                        }
                    }
                    this.setPropNum();
                });
            }
        });
    },

    update (dt) {
        // let afterTime = GS.GSDate.timeStamp();
        // if(afterTime - this.beforeTime >= 1000){
            
        //     this.beforeTime = afterTime;
        // }
        if(this.view_gameScene_top && this.starNum <= 3){
            if(this.rightNum*GS.Constants.levelConfig.waves[this.wave].width <= 1){
                this.view_gameScene_top.getChildByName('view_top_progressBar').width = GS.Constants.progressBarWidth*(this.rightNum*GS.Constants.levelConfig.waves[this.starNum].width);
            }
            let stars = this.view_gameScene_top.getChildByName('view_top_stars').children;
            for(let i = 0;i < stars.length; i++){
                stars[i].active = false;
            }
            for(let i = 0;i < this.starNum; i++){
                stars[i].active = true;
            }
        }

        if(this.gameState !== GS.Constants.gameState && this.view_gameScene_top){
            let view_top_pause = this.view_gameScene_top.getChildByName('view_top_pause');
            this.gameState = GS.Constants.gameState;
            let url = null;
            if(this.gameState == 'play'){
                url = 'images/gameView/zanTing';
            }else if(this.gameState == 'pause'){
                url = 'images/gameView/jiXu';
            }
            
            cc.loader.loadRes(url,cc.SpriteFrame,(err,data)=>{
                if(err){
                    cc.error('暂停键资源加载有误，请检查路径是否正确');
                    return;
                }
                view_top_pause.getComponent(cc.Sprite).spriteFrame = data;
            });
        }

        if(this.broom && this.broom.active == true){
            //获取当前的鼠标位置
            this.node.on(cc.Node.EventType.MOUSE_MOVE,(event)=>{
                let pos = event.getLocation();
                let worldPos = this.node.convertToNodeSpaceAR(pos);
                this.broom.x = worldPos.x;
                this.broom.y = worldPos.y;
            });
            this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
                
            })
        }
    },
});
