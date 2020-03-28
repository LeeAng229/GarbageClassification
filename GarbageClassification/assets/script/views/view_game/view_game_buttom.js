import { loadSoundByPath } from "../../common/loadMusics";

const TAG = 'view_gameScene_garbage';
const LOG = GS.Log.create({TAG});

cc.Class({
    extends: cc.Component,

    properties: {
        scrollBarPre:cc.Prefab,
        garbagePre:cc.Prefab,
        resultPre:cc.Prefab,
        view_gameScene:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //设置成功的个数 和 星星的数量
        this.rightTimes = 0;
        this.starNum = 0;
        //生成一个时间戳
        this.beforeTime = GS.GSDate.timeStamp();
        //根据星星的数量设置一个速度,初始值为0
        this.setSpeed(0);
        //定义一个存放这些传送带条的数组
        this.scrollBars = [];
        //定义一个存放这些垃圾节点的数组
        this.unUsedGarbages = [];
        this.usedGarbages = [];
        //初始化出十个传动带的斜杠
        for(let i = 0;i<9;i++){
            let scrollBar = cc.instantiate(this.scrollBarPre);
            scrollBar.x = -560 + 160*i;
            scrollBar.parent = this.node;
            this.scrollBars.push(scrollBar);
        }
        //初始化出20个垃圾的预制体
        for(let i = 0; i < 20; i++){
            let garbage = cc.instantiate(this.garbagePre);
            garbage.parent = this.node;
            
            let boundY = GS.Random.getRandom(-324,-124);
            garbage.y = boundY;
            garbage.x = 900;
            garbage.id = i;

            this.unUsedGarbages.push(garbage);

            //获取四个垃圾桶的节点信息
            GS.event.on('setDustbins',this.setDustbins.bind(this));
        }
    },

    setSpeed(starNum){ 
        cc.loader.loadRes('JSON/gameConfig',(err,data)=>{
            if(err){
                cc.error('gameConfig解析有误，请检查路径是否正确');
                return;
            }
            this.speed = (data.json.level1.star[starNum].speed);
        });
    },

    setDustbins(arr){
        this.dustbins = arr;
    },

    //生成垃圾，并让它随着传送带一起运动
    genGarbage(){
        cc.loader.loadRes('JSON/garbage_config',(err,data)=>{
            if(err){
                cc.error('garbage_config加载错误，请检查路径是否正确');
                return;
            }
            let random = GS.Random.getRandom(0,20);
            let garbageUrl = data.json.garbages[random].url;
            let type = data.json.garbages[random].type;
            let garbageName = data.json.garbages[random].name;
            //cc.log(garbageUrl,random);
            cc.loader.loadRes(garbageUrl,cc.SpriteFrame,(err,data)=>{
                if(err){
                    cc.error('garbage配置信息读取有误，请检查路径是否正确');
                    return;
                }
                let garbage = this.unUsedGarbages[0];
                garbage.type = type;
                garbage.garbageName = garbageName;
                garbage.getChildByName('view_garbage').getComponent(cc.Sprite).spriteFrame = data;
                this.unUsedGarbages.shift();
                this.usedGarbages.push(garbage);
            })
        })
    },

    start () {

    },

    update (dt) {
        //遍历存放传送带条的数组，对每个传送条的x值加一个数实现移动功能
        for(let i in this.scrollBars){
            if(this.speed){
                this.scrollBars[i].x -= this.speed;
                if(this.scrollBars[i].x <= -720){
                    this.scrollBars[i].x = 720;
                }
            }
        }
        let afterTime = GS.GSDate.timeStamp();
        if(afterTime - this.beforeTime >= 1000){
            if(this.unUsedGarbages.length <= 10){
                let garbage = cc.instantiate(this.garbagePre);
                let boundY = GS.Random.getRandom(-324,-124);
                garbage.position = cc.v2(900,boundY);
                garbage.parent = this.node;
                let maxId = -10000;
                let tempArr = [];
                for(let i in this.usedGarbages){
                    tempArr.push(this.usedGarbages[i]);
                }
                for(let i in this.unUsedGarbages){
                    tempArr.push(this.unUsedGarbages[i]);
                }
                for(let i in tempArr){
                    if(tempArr[i].id > maxId){
                        maxId = tempArr[i].id;
                    }
                }
                garbage.id = maxId + 1;
                this.unUsedGarbages.push(garbage);
                LOG.debug('实例化了好多！');
            }
            if(this.unUsedGarbages.length > 0)
                this.genGarbage();
            this.beforeTime = afterTime;
        }
        for(let i in this.usedGarbages){
            if(this.speed){
                if(this.usedGarbages[i].state === 'moving'){
                    this.usedGarbages[i].x -= this.speed;
                    if(this.usedGarbages[i].x <= -900){
                        this.usedGarbages[i].x = 900;
                        this.unUsedGarbages.push(this.usedGarbages[i]);
                        this.usedGarbages.splice(i,1);
                    }
                }
            }
        }
    },
    garbageTouchStart(target){
        this.startPos = target.node.position;
        this.scortZoder(target);
    },

    garbageTouchEnd(target){
        let targetPos = target.node.position;
        let minDis = 10000;
        let targetBustbin = undefined;
        for(let i = 0;i<this.dustbins.length;i++){
            let dis = targetPos.sub(this.dustbins[i].position).mag();
            if(dis < minDis){
                minDis = dis;
                if(minDis <= 180)
                    targetBustbin = this.dustbins[i];
            }
        }
        if(targetBustbin && targetBustbin.type === target.node.type){
            let rightPos = target.node.position;
            let boundY = GS.Random.getRandom(-324,-124);
            target.node.position = cc.v2(900,boundY);
            let targetId = target.node.id;
            for(let i in this.usedGarbages){
                if(targetId === this.usedGarbages[i].id){
                    this.unUsedGarbages.push(this.usedGarbages[i]);
                    this.usedGarbages.splice(i,1);
                }
            }
            this.showResult('right',rightPos);
            //加载并播放正确的音效
            loadSoundByPath([{clearWin:'musics/clearWin'}],'musics/clearWin');
            //通过正确的数量改变进度条的长度和星星的个数
            this.rightTimes += 1;
            if(this.rightTimes >= 10 && this.rightTimes%10 == 0){
                this.rightTimes = 0;
                this.starNum += 1;
                this.setSpeed(this.starNum);
            }
            this.view_gameScene.getComponent('view_gameScene').setRightAndStarNum(this.rightTimes,this.starNum);
            //改变分数
            this.view_gameScene.getComponent('view_gameScene').setScore(10);
        }else if(targetBustbin && targetBustbin.type !== target.node.type){
            let wrongPos = target.node.position;
            this.showResult('wrong',wrongPos);
            target.node.runAction(
                cc.moveTo(0.5,cc.v2(wrongPos.x,this.startPos.y))
            )
            //加载并播放错误的音效
            loadSoundByPath([{clearWin:'musics/clearFail'}],'musics/clearFail');
            this.rightTimes = this.starNum * 10 + this.rightTimes;
            if(this.rightTimes > 0){
                this.rightTimes -= 2;
                if(this.rightTimes < 0){
                    this.rightTimes = 0;
                }
            }
            this.starNum = Math.floor(this.rightTimes/10);
            this.rightTimes = this.rightTimes%10;
            this.setSpeed(this.starNum);
            this.view_gameScene.getComponent('view_gameScene').setRightAndStarNum(this.rightTimes,this.starNum);
            //改变分数
            this.view_gameScene.getComponent('view_gameScene').setScore(-20);
        }else if(!targetBustbin){
            target.node.runAction(
                cc.moveTo(0.5,cc.v2(target.node.x,this.startPos.y))
            )
        }
    },

    showResult(result,resultPos){
        //实例化一个正确的结果回馈
        if(!this.result)
            this.result = cc.instantiate(this.resultPre);
        cc.loader.loadRes(`images/gameView/${result}`,cc.SpriteFrame,(err,data)=>{
            if(err){
                LOG.error('资源加载有误，请检查路径是否正确');
                return;
            }
            this.result.getComponent(cc.Sprite).spriteFrame = data;
            this.result.parent = this.node;
            this.result.position = resultPos;
            if(this.result.active === false){
                this.result.active = true;
            }
            this.result.runAction(
                cc.sequence(
                    cc.scaleTo(0.5,1),
                    cc.scaleTo(0.1,0)
                )
            );
        });
    },

    //为目标节点提升显示等级
    scortZoder(target){
        target.node.zIndex = 100;
    }
});
