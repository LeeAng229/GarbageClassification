import { loadSoundByPath } from "../../common/loadMusics";
import reqData from '../../common/reqData';
import data from '../../common/getData';


const TAG = 'view_gameScene_garbage';
const LOG = GS.Log.create({TAG});

cc.Class({
    extends: cc.Component,

    properties: {
        scrollBarPre:cc.Prefab,
        garbagePre:cc.Prefab,
        resultPre:cc.Prefab,
        view_gameScene:cc.Node,
        success_pre:cc.Prefab,
        defeat_pre:cc.Prefab,
        bombPre:cc.Prefab,
        illustratedPre:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //初始化游戏状态为暂停
        GS.Constants.gameState = 'pause';
        //初始化错误次数
        this.errorNum = 0;
        cc.log(GS.KVStorage.loadStr(GS.Constants.AUDIO_MUTE_KEY));
        //初始化一个波次间隔时间
        this.currentWavesDt = 0;
        //初始化一个生成的垃圾数量
        this.currentGenGarbageNum = 0;
        //初始化一个已经使用或错过垃圾的数量
        this.usedGarbageNum = 0;
        this.speed = 2;
        this.state = GS.Constants.gameState;
        //获取游戏垃圾生成配置
        this.levelConfig = GS.Constants.levelConfig;
        cc.log(this.levelConfig);
        this.wavesDt = this.levelConfig.waves.wavesDt;
        this.wave = 0;
        this.setLevelWave(this.wave);
        this.number = this.levelConfig.waves[this.wave].number;
        //设置成功的个数 和 星星的数量
        this.rightTimes = 0;
        this.starNum = 0;
        //生成一个时间戳
        this.beforeTime = GS.GSDate.timeStamp();
        this.obstacleBeforeTime = GS.GSDate.timeStamp();

        // //根据星星的数量设置一个速度,初始值为0
        // this.setSpeed(0);

        //定义一个存放这些传送带条的数组
        this.scrollBars = [];
        //定义一个存放这些垃圾节点的数组
        this.unUsedGarbages = [];
        this.usedGarbages = [];

        //定义一个存放障碍物节点的数组
        this.unUsedObstacles = [];
        this.usedObstacles = [];
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
        }

        //获取四个垃圾桶的节点信息
        GS.event.on('setDustbins',this.setDustbins.bind(this));

        //游戏开始之前先实例化本关卡垃圾的图鉴
        let illustrated = cc.instantiate(this.illustratedPre);
        illustrated.parent = this.node;
        illustrated.position = cc.v2(0,0);
        //给垃圾图鉴上的完成按钮注册一个点击事件
        illustrated.getChildByName('view_next').on(cc.Node.EventType.TOUCH_END,(event)=>{
            illustrated.active = false;
            //游戏开始  开始一个倒计时
            this.parseCountDownNum(5);
        })

        //给gameScene中的暂停按钮添加一个点击事件
        // let self = this;
        // let pause = this.view_gameScene.getChildByName('view_gameScene_top').getChildByName('view_gameScene_top').getChildByName('view_top_pause');
        // pause.on(cc.Node.EventType.TOUCH_END,(event)=>{

        // })
        //初始调用错误次数的显示函数
        this.setErrorNum();
    },

    //为view_countDown设计一个倒计时的函数
    parseCountDownNum(num){
        if(GS.Constants.gameState == 'play'){
            GS.Constants.gameState = 'pause';
        }
        this.gameState(GS.Constants.gameState);
        this.node.getChildByName('view_countDown').getComponent(cc.Label).string = '   ';
        this.node.getChildByName('view_countDown').active = true;
        this.node.getChildByName('view_countDown').getChildByName('Mask').on(cc.Node.EventType.TOUCH_END,(event)=>{
        });
        this.node.getChildByName('view_countDown').scale = 1;
        this.countDownNumArr = [];
        for(let i = num; i >= 0; i--){
            this.countDownNumArr.push(i);
        }
        this.index = 0;
        this.schedule(this.countDown,1);
    },

    countDown(){
        this.node.getChildByName('view_countDown').scale = 1;
        if(this.index > this.countDownNumArr.length - 1){
            this.unschedule(this.countDown,1);
            this.node.getChildByName('view_countDown').active = false;
            GS.Constants.gameState = 'play';
            this.gameState(GS.Constants.gameState);
        }
        //获取label节点
        let color = undefined;
        let str = '';
        if((this.index == 0 || this.index == 1) && this.wave == 0){
            color = new cc.Color(255,0,0,255);
            str = '准备！';
        }else if((this.index == 0 || this.index == 1) && this.wave == 1){
            color = new cc.Color(255,0,0,255);
            str = '干的漂亮！第一波垃圾已经清除！继续努力！！！';
        }else if((this.index == 0 || this.index == 1) && this.wave == 2){
            color = new cc.Color(255,0,0,255);
            str = '一大波垃圾正在赶来，等待分拣！';
        }else if((this.index == 0 || this.index == 1) && this.wave == 3){
            color = new cc.Color(255,0,0,255);
            str = 'W A R N I N G ! !';
        }else if(this.index == this.countDownNumArr.length - 1){
            color = new cc.Color(255,0,0,255);
            str = '开始！';
        }else{
            color = new cc.Color(255,245,0,255);
            str = this.countDownNumArr[this.index];
        }
        this.node.getChildByName('view_countDown').color = color;
        this.node.getChildByName('view_countDown').getComponent(cc.Label).string =  str;
        if(this.index != 0 && this.index != 1){
            this.node.getChildByName('view_countDown').runAction(
                cc.scaleTo(0.1,0.7)
            );
        }
        this.index += 1;
    },

    gameState(state){
        let view_gameScene = this.view_gameScene.getComponent('view_gameScene');
        if(state == 'pause'){
            //停止时间计时器
            view_gameScene.unschedule(view_gameScene.updateTime,1);
            //获取当前速度
            this.speed = 0;
        }else if(state == 'play'){
            view_gameScene.schedule(view_gameScene.updateTime,1);
            this.speed = this.setSpeed(this.starNum);
        }
    },

    setSpeed(starNum){ 
        if(starNum > 3)
            return;
        cc.loader.loadRes('JSON/gameConfig',(err,data)=>{
            if(err){
                cc.error('gameConfig解析有误，请检查路径是否正确');
                return;
            }
            this.speed = (data.json[GS.Constants.levelConfig.level].star[starNum].speed);
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
            let random = null;
            //当关卡为关卡1的时候，且垃圾类型为0 湿垃圾、2 有害垃圾的时候，进入while循环获取random的值
            while((random === null || (data.json.garbages[random].type !== 0 && data.json.garbages[random].type !== 2)) && this.levelConfig.level == 'level1'){
                random = GS.Random.getRandom(0,20);
            }
            //当关卡为关卡2的时候，且垃圾类型为0 湿垃圾、2 有害垃圾的时候、1 可回收垃圾，进入while循环获取random的值
            while((random === null || (data.json.garbages[random].type !== 0 && data.json.garbages[random].type !== 2 && data.json.garbages[random].type !== 1)) && this.levelConfig.level == 'level2'){
                random = GS.Random.getRandom(0,20);
            }
            //第三关和第四关会出现所有的垃圾
            if(this.levelConfig.level == 'level3' || this.levelConfig.level == 'level4'){
                random = GS.Random.getRandom(0,20);
            }
            let garbageUrl = data.json.garbages[random].url;
            let type = data.json.garbages[random].type;
            let garbageName = data.json.garbages[random].name;
            cc.log('type:',type);
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

    //获取当前屏幕内的所有垃圾
    getCurrentGarbages(){
        return this.usedGarbages;
    },
    //获取所有的垃圾桶
    getDustbins(){
        return this.dustbins;
    },

    start () {

    },

    update (dt) {
        if(GS.Constants.gameState == 'play'){
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
            //当时间间隔大于垃圾生成配置间隔时，生成垃圾
            if(afterTime - this.beforeTime >= this.levelConfig.waves[this.wave].dt && GS.Constants.gameState == 'play'){
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
                if(this.unUsedGarbages.length > 0 && this.currentGenGarbageNum < this.number){
                    this.genGarbage();
                    cc.log('运行了 genGarbage,并且speed为：',this.speed);
                    this.currentGenGarbageNum += 1;
                }else if(this.usedGarbageNum >= this.number){
                    for(let i in this.usedObstacles){
                        this.usedObstacles[i].x = 850;
                    }
                    //重置波次生成垃圾的数量、波次+1、重新根据波次获取本波次需要生成的垃圾数量
                    this.usedGarbageNum = 0;
                    this.currentGenGarbageNum = 0;
                    this.wave += 1;
                    cc.log(this.wave);
                    if(this.wave > 3){
                        //结束判断是否成功通关
                        if(this.starNum >= 2){
                            let gameLevelInfo = GS.Constants.gameLevelInfo;
                            if(this.starNum >= gameLevelInfo[`level${GS.Constants.currentLevel}`].starNum){
                                gameLevelInfo[`level${GS.Constants.currentLevel}`].starNum = this.starNum;
                            }
                            gameLevelInfo[`level${GS.Constants.currentLevel + 1}`].isUnlock = true;
                            GS.KVStorage.saveObj('GameLevelInfo',gameLevelInfo);
                            let success = cc.instantiate(this.success_pre);
                            success.parent = this.node;
                            success.position = cc.v2(0,0);
                            GS.Constants.gameState = 'pause';
                            let coinNum = reqData.addCoin(this.starNum);
                            let bestScore = GS.KVStorage.loadStr('bestScore');
                            if(!bestScore){
                                bestScore = 0;
                            }
                            success.getChildByName('view_coinNum').getComponent(cc.Label).string = '本局游戏奖励：' + this.starNum;
                            success.getChildByName('view_score').getComponent(cc.Label).string = '本局得分：'+this.currentScore;
                            success.getChildByName('view_bestScore').getComponent(cc.Label).string = '历史最高分：'+bestScore;
                            
                            //判断当前分数是否创新历史记录
                            if(this.currentScore > bestScore){
                                bestScore = this.currentScore;
                                GS.KVStorage.saveStr('bestScore',bestScore);
                            }
                        }else{
                            this.wave -= 1;
                            let gameLevelInfo = GS.Constants.gameLevelInfo;
                            if(this.starNum >= gameLevelInfo[`level${GS.Constants.currentLevel}`].starNum){
                                gameLevelInfo[`level${GS.Constants.currentLevel}`].starNum = this.starNum;
                            }
                            GS.KVStorage.saveObj('GameLevelInfo',gameLevelInfo);
                            let defeat = cc.instantiate(this.defeat_pre);
                            defeat.parent = this.node;
                            defeat.position = cc.v2(0,0);
                            GS.Constants.gameState = 'pause';
                        }
                    }
                    this.setLevelWave(this.wave);
                    this.number = this.levelConfig.waves[this.wave].number;
                    //在波次间隔内，显示倒计时
                    this.parseCountDownNum(this.wavesDt);
                }
                this.beforeTime = afterTime;
            }
            for(let i in this.usedGarbages){
                if(this.speed){
                    if(this.usedGarbages[i].state === 'moving'){
                        this.usedGarbages[i].x -= this.speed;
                        if(this.usedGarbages[i].x <= -800){
                            //加载并播放错误的音效
                            loadSoundByPath([{clearWin:'musics/clearFail'}],'musics/clearFail');
                            //当垃圾走出屏幕后，给使用过的垃圾数量+1
                            this.usedGarbageNum  += 1;
                            //错误次数+1
                            if(this.errorNum < 3){
                                this.errorNum += 1;
                                this.setErrorNum();
                            }
                            //根据当前正确个数和星值算出总的正确个数。
                            if(this.starNum == 0){
                                this.rightTimes = this.rightTimes;
                            }else if(this.starNum == 1){
                                this.rightTimes = this.rightTimes + 10;
                            }else if(this.starNum == 2){
                                this.rightTimes = this.rightTimes + 20;
                            }else if(this.starNum == 3){
                                this.rightTimes = this.rightTimes + 40;
                            }

                            //拖放垃圾错误，扣除两个正确值，判断是否可扣
                            if(this.rightTimes > 0){
                                this.rightTimes -= 2;
                                if(this.rightTimes < 0){
                                    this.rightTimes = 0;
                                }
                            }
                            let starNumTemp = this.starNum;
                            //this.starNum = Math.floor(this.rightTimes/10);
                            //把总正确数量解析成星值和正确数量
                            if(this.rightTimes < 10){
                                this.starNum = 0;
                            }else if(this.rightTimes >= 10 && this.rightTimes < 20){
                                this.starNum = 1;
                                this.rightTimes = this.rightTimes - 10;
                            }else if(this.rightTimes >= 20 && this.rightTimes < 40){
                                this.starNum = 2;
                                this.rightTimes = this.rightTimes - 20;
                            }else if(this.rightTimes >= 40){
                                this.starNum = 3;
                                this.rightTimes = this.rightTimes - 40;
                                if(this.rightTimes > 25){
                                    this.rightTimes = 25;
                                }
                            }
                            let starAfterNum  = this.starNum;
                            //this.rightTimes = this.rightTimes%10;
                            // if(starNumTemp > this.starNum && this.wave - 1 >= 1){
                            //     this.wave -= 1;
                            // }
                            GS.Constants.starNum = this.starNum;
                            this.setSpeed(this.starNum);
                            this.view_gameScene.getComponent('view_gameScene').setRightAndStarNum(this.rightTimes,this.starNum,this.wave);
                            //改变分数
                            this.currentScore = this.view_gameScene.getComponent('view_gameScene').setScore(-20);

                            this.usedGarbages[i].x = 900;
                            this.unUsedGarbages.push(this.usedGarbages[i]);
                            this.usedGarbages.splice(i,1);
                        }
                    }
                }
            }

            //按百分之十的概率随机生成障碍物
            //this.obstacleBeforeTime += dt;
            if(afterTime - this.obstacleBeforeTime >= 2000){
                let random = GS.Random.getRandom(0,10);
                cc.log('时间间隔为：',afterTime - this.obstacleBeforeTime,'    随机数为：',random);
                this.obstacleBeforeTime = afterTime;
                if(random <= 9 && random > 6){
                    if(this.unUsedObstacles.length <= 3){
                        let obstacle = cc.instantiate(this.bombPre);
                        let boundY = GS.Random.getRandom(-324,-124);
                        obstacle.position = cc.v2(900,boundY);
                        obstacle.parent = this.node;
                        for(let i = 0;i < this.usedObstacles.length;i++){
                            while(obstacle.position.sub(this.usedGarbages[i].position).mag() < 100){
                                obstacle.x += 50;
                            }
                        }
                        this.unUsedObstacles.push(obstacle);
                    }
                    if(this.unUsedObstacles.length > 0){
                        let obstacle = this.unUsedObstacles[0];
                        this.usedObstacles.push(obstacle);
                        this.unUsedObstacles.shift();
                    }
                }
            }
            if(GS.Constants.gameState == 'play'){
                //判断正在使用的障碍物中是否包含炸弹，如果包含则让它移动
                if(this.usedObstacles.length > 0){
                    for(let i = 0;i<this.usedObstacles.length;i++){
                        if(this.speed){
                            this.usedObstacles[i].x -= this.speed;
                            if(this.usedObstacles[i].x <= -800){
                                this.usedObstacles[i].x = 900;
                                this.unUsedObstacles.push(this.usedObstacles[i]);
                                this.usedObstacles.splice(i,1);
                            }
                        }
                    }
                }
            }

            //获取游戏状态，进行设置
            if(this.state !== GS.Constants.gameState){
                this.state = GS.Constants.gameState;
                this.gameState(this.state);
            }

            //当errorNum大于三次的是否做一次是否通关游戏的判断
            if(this.errorNum == 3){
                if(this.starNum >= 2){
                    let gameLevelInfo = GS.Constants.gameLevelInfo;
                    if(this.starNum >= gameLevelInfo[`level${GS.Constants.currentLevel}`].starNum){
                        gameLevelInfo[`level${GS.Constants.currentLevel}`].starNum = this.starNum;
                    }
                    gameLevelInfo[`level${GS.Constants.currentLevel + 1}`].isUnlock = true;
                    GS.KVStorage.saveObj('GameLevelInfo',gameLevelInfo);
                    this.wave -= 1;
                    let success = cc.instantiate(this.success_pre);
                    success.parent = this.node.parent;
                    success.position = cc.v2(0,0);
                    GS.Constants.gameState = 'pause';
                    let coinNum = reqData.addCoin(this.starNum);
                    let bestScore = GS.KVStorage.loadStr('bestScore');
                    if(!bestScore){
                        bestScore = 0;
                    }
                    success.getChildByName('view_coinNum').getComponent(cc.Label).string = '本局游戏奖励：' + this.starNum;
                    success.getChildByName('view_score').getComponent(cc.Label).string = '本局得分：'+this.currentScore;
                    success.getChildByName('view_bestScore').getComponent(cc.Label).string = '历史最高分：'+bestScore;
                    
                    //判断当前分数是否创新历史记录
                    if(this.currentScore > bestScore){
                        bestScore = this.currentScore;
                        GS.KVStorage.saveStr('bestScore',bestScore);
                    }
                }else{
                    this.wave -= 1;
                    let gameLevelInfo = GS.Constants.gameLevelInfo;
                    if(this.starNum >= gameLevelInfo[`level${GS.Constants.currentLevel}`].starNum){
                        gameLevelInfo[`level${GS.Constants.currentLevel}`].starNum = this.starNum;
                    }
                    GS.KVStorage.saveObj('GameLevelInfo',gameLevelInfo);
                    let defeat = cc.instantiate(this.defeat_pre);
                    defeat.parent = this.node.parent;
                    defeat.position = cc.v2(0,0);
                    GS.Constants.gameState = 'pause';
                }
            }
        }
    },

    //设置错误次数的显示
    setErrorNum(){
        //改变错误次数的显示
        let view_errorNum_noError = this.node.parent.getChildByName('view_gameScene_errorNum').getChildByName('view_errorNum_noError');
        for(let i = 0;i<3;i++){
            view_errorNum_noError.children[i].children[0].active = false;
        }
        for(let i = 0;i<this.errorNum;i++){
            //获取显示错误次数的节点
            view_errorNum_noError.children[i].children[0].active = true;
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
            if(this.rightTimes == 10 && (this.starNum == 0 || this.starNum == 1)){
                this.rightTimes = 0;
                this.starNum += 1;
                GS.Constants.starNum = this.starNum;
                this.setSpeed(this.starNum);
            }else if(this.rightTimes == 20 && this.starNum == 2){
                this.rightTimes = 0;
                this.starNum += 1;
                GS.Constants.starNum = this.starNum;
                this.setSpeed(this.starNum);
            }else if(this.rightTimes >= 25 && this.starNum == 3){
                this.rightTimes = 25;
                this.starNum = 3;
                GS.Constants.starNum = this.starNum;
                this.setSpeed(this.starNum);
            }
            this.view_gameScene.getComponent('view_gameScene').setRightAndStarNum(this.rightTimes,this.starNum,this.wave);
            this.usedGarbageNum += 1;
            //改变分数
            this.currentScore = this.view_gameScene.getComponent('view_gameScene').setScore(10);
        }else if(targetBustbin && targetBustbin.type !== target.node.type){
            let wrongPos = target.node.position;
            this.showResult('wrong',wrongPos);
            target.node.runAction(
                cc.moveTo(0.5,cc.v2(wrongPos.x,this.startPos.y))
            )
            //加载并播放错误的音效
            loadSoundByPath([{clearWin:'musics/clearFail'}],'musics/clearFail');
            
            let starStartNum = this.starNum;
            //根据当前正确个数和星值算出总的正确个数。
            if(this.starNum == 0){
                this.rightTimes = this.rightTimes;
            }else if(this.starNum == 1){
                this.rightTimes = this.rightTimes + 10;
            }else if(this.starNum == 2){
                this.rightTimes = this.rightTimes + 20;
            }else if(this.starNum == 3){
                this.rightTimes = this.rightTimes + 40;
            }

            //拖放垃圾错误，扣除两个正确值，判断是否可扣
            if(this.rightTimes > 0){
                this.rightTimes -= 2;
                if(this.rightTimes < 0){
                    this.rightTimes = 0;
                }
            }
            let starNumTemp = this.starNum;
            //this.starNum = Math.floor(this.rightTimes/10);
            //把总正确数量解析成星值和正确数量
            if(this.rightTimes < 10){
                this.starNum = 0;
            }else if(this.rightTimes >= 10 && this.rightTimes < 20){
                this.starNum = 1;
                this.rightTimes = this.rightTimes - 10;
            }else if(this.rightTimes >= 20 && this.rightTimes < 40){
                this.starNum = 2;
                this.rightTimes = this.rightTimes - 20;
            }else if(this.rightTimes >= 40){
                this.starNum = 3;
                this.rightTimes = this.rightTimes - 40;
                if(this.rightTimes > 25){
                    this.rightTimes = 25;
                }
            }
            let starAfterNum  = this.starNum;
            //this.rightTimes = this.rightTimes%10;
            // if(starNumTemp > this.starNum && this.wave - 1 >= 1){
            //     this.wave -= 1;
            // }
            GS.Constants.starNum = this.starNum;
            this.setSpeed(this.starNum);
            this.view_gameScene.getComponent('view_gameScene').setRightAndStarNum(this.rightTimes,this.starNum,this.wave);
            //改变分数
            this.currentScore = this.view_gameScene.getComponent('view_gameScene').setScore(-20);
            //错误次数+1
            if(this.errorNum < 3){
                this.errorNum += 1;
                this.setErrorNum();
            }
        }else if(!targetBustbin){
            target.node.runAction(
                cc.moveTo(0.5,cc.v2(target.node.x,this.startPos.y))
            )
        }
        if(this.starNum == 1){
            let gameLevelInfo = GS.KVStorage.loadObj('GameLevelInfo');
            gameLevelInfo[`level${GS.Constants.currentLevel}`]['starNum'] = 1;
            GS.KVStorage.saveObj('GameLevelInfo',gameLevelInfo);
        }
    },

    //使用道具对垃圾自动分拣成功后加分
    robotAddScore(target){
        let rightPos = target.position;
        let boundY = GS.Random.getRandom(-324,-124);
        target.position = cc.v2(900,boundY);
        let targetId = target.id;
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
        if(this.rightTimes == 10 && (this.starNum == 0 || this.starNum == 1)){
            this.rightTimes = 0;
            this.starNum += 1;
            GS.Constants.starNum = this.starNum;
            this.setSpeed(this.starNum);
        }else if(this.rightTimes == 20 && this.starNum == 2){
            this.rightTimes = 0;
            this.starNum += 1;
            GS.Constants.starNum = this.starNum;
            this.setSpeed(this.starNum);
        }else if(this.rightTimes >= 25 && this.starNum == 3){
            this.rightTimes = 25;
            this.starNum = 3;
            GS.Constants.starNum = this.starNum;
            this.setSpeed(this.starNum);
        }
        this.view_gameScene.getComponent('view_gameScene').setRightAndStarNum(this.rightTimes,this.starNum,this.wave);
        this.usedGarbageNum += 1;
        //改变分数
        this.currentScore = this.view_gameScene.getComponent('view_gameScene').setScore(10);
        if(this.starNum == 1){
            let gameLevelInfo = GS.KVStorage.loadObj('GameLevelInfo');
            gameLevelInfo[`level${GS.Constants.currentLevel}`]['starNum'] = 1;
            GS.KVStorage.saveObj('GameLevelInfo',gameLevelInfo);
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

    isSuccess(){
        if(this.starNum >= 2){
            let gameLevelInfo = GS.Constants.gameLevelInfo;
            if(this.starNum >= gameLevelInfo[`level${GS.Constants.currentLevel}`].starNum){
                gameLevelInfo[`level${GS.Constants.currentLevel}`].starNum = this.starNum;
            }
            gameLevelInfo[`level${GS.Constants.currentLevel + 1}`].isUnlock = true;
            GS.KVStorage.saveObj('GameLevelInfo',gameLevelInfo);
            this.wave -= 1;
            let success = cc.instantiate(this.success_pre);
            success.parent = this.node.parent;
            success.position = cc.v2(0,0);
            GS.Constants.gameState = 'pause';
            let coinNum = reqData.addCoin(this.starNum);
            let bestScore = GS.KVStorage.loadStr('bestScore');
            if(!bestScore){
                bestScore = 0;
            }
            success.getChildByName('view_coinNum').getComponent(cc.Label).string = '本局游戏奖励：' + this.starNum;
            success.getChildByName('view_score').getComponent(cc.Label).string = '本局得分：'+this.currentScore;
            success.getChildByName('view_bestScore').getComponent(cc.Label).string = '历史最高分：'+bestScore;
            
            //判断当前分数是否创新历史记录
            if(this.currentScore > bestScore){
                bestScore = this.currentScore;
                GS.KVStorage.saveStr('bestScore',bestScore);
            }
        }else{
            this.wave -= 1;
            let gameLevelInfo = GS.Constants.gameLevelInfo;
            if(this.starNum >= gameLevelInfo[`level${GS.Constants.currentLevel}`].starNum){
                gameLevelInfo[`level${GS.Constants.currentLevel}`].starNum = this.starNum;
            }
            GS.KVStorage.saveObj('GameLevelInfo',gameLevelInfo);
            let defeat = cc.instantiate(this.defeat_pre);
            defeat.parent = this.node.parent;
            defeat.position = cc.v2(0,0);
            GS.Constants.gameState = 'pause';
        }
    },

    //为view_level_wave设置当前关卡和波次
    setLevelWave(wave){
        let level = GS.Constants.currentLevel;
        let view_level_wave = this.node.parent.getChildByName('view_level_wave');
        switch(level){
            case 1:
                level = '关卡一';
                break;
            case 2:
                level = '关卡二';
                break;
            case 3:
                level = '关卡三';
                break;
            case 4:
                level = '无尽模式';
        }
        switch(wave){
            case 0:
                wave = '第一波垃圾';
                break;
            case 1:
                wave = '第二波垃圾';
                break;
            case 2:
                wave = '第三波垃圾';
                break;
            case 3:
                wave = '第四波垃圾';
        }
        view_level_wave.getChildByName('view_level').getComponent(cc.Label).string = level;
        view_level_wave.getChildByName('view_wave').getComponent(cc.Label).string = wave;
    },

    //为目标节点提升显示等级
    scortZoder(target){
        target.node.zIndex = 100;
    }
});
