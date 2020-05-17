import data from '../../common/getData';
let goods = data.getGoods();

cc.Class({
    extends: cc.Component,

    properties: {
        borderPre:cc.Prefab,
        garbagePre:cc.Prefab,
        view_details_pre:cc.Prefab,
        view_garbage_illustrated:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.parent.parent.getChildByName('view_back').on(cc.Node.EventType.TOUCH_END,(event)=>{
            this.node.parent.parent.active = false;
        })
        this.view_details = null;
        //初始化一个数组存储本关卡使用到的垃圾
        this.currentGarbages = [];
        //获取垃圾配置信息
        cc.loader.loadRes('JSON/garbage_config',(err,data)=>{
            if(err){
                cc.error('加载垃圾配置信息错误，请检查了路径是否正确',err);
                return;
            }
            let garbages = data.json.garbages;
            for(let j = 0;j<garbages.length;j++){
                this.currentGarbages.push(garbages[j]);
            }
            for(let i = 0;i<goods.length;i++){
                this.currentGarbages.push(goods[i]);
            }
            this.currentGarbages.push(data.json.obstacle[0]);
            cc.log('用到的垃圾:',this.currentGarbages);
            //遍历获取到的本关卡要使用的垃圾的数组
            for(let i = 0;i<this.currentGarbages.length;i++){
                let url = this.currentGarbages[i].url;
                let introduce = this.currentGarbages[i].introduce;
                cc.loader.loadRes(url,cc.SpriteFrame,(err,data)=>{
                    if(err){
                        cc.error('本关卡使用的垃圾地址加载错误',err);
                        return;
                    }
                    let border = cc.instantiate(this.borderPre);
                    border.parent = this.node;
                    border.position = cc.v2(0,0);
                    let garbage = cc.instantiate(this.garbagePre);
                    garbage.getComponent(cc.Sprite).spriteFrame = data;
                    garbage.parent = border;
                    garbage.position = cc.v2(0,0);
                    garbage.introduce = introduce;

                    //给垃圾节点注册一个鼠标抬起和放下的事件
                    garbage.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
                        if(!this.view_details)
                            this.view_details = cc.instantiate(this.view_details_pre);
                        this.view_details.parent = this.view_garbage_illustrated;
                        this.view_details.getChildByName('view_details_label').getComponent(cc.Label).string = garbage.introduce;
                        this.view_details.getChildByName('view_details_label').getComponent(cc.Label)._updateRenderData(true);
                        let touchPos = this.view_garbage_illustrated.convertToNodeSpaceAR(event.getLocation());
                        //获取屏幕的大小
                        let windowsSize = cc.winSize;
                        let winHeight = windowsSize.height;
                        let winWidth = windowsSize.width;
                        //如果触摸位置距离窗口下方不足以放下view_details则改变这个生成的位置
                        let bottomDistance = touchPos.sub(cc.v2(touchPos.x,-winHeight/2)).mag();
                        let rightDistance = touchPos.sub(cc.v2(touchPos.y,winWidth/2)).mag();
                        let detailsHeight = this.view_details.children[0].height + 20;
                        let detailsWidth = this.view_details.children[0].width + 20;
                        if(bottomDistance < detailsHeight){
                            touchPos.y += (detailsHeight - bottomDistance);
                        }
                        if(rightDistance < detailsWidth){
                            touchPos.x -= (detailsWidth - rightDistance);
                        }
                        this.view_details.position = touchPos;
                        this.view_details.active = true;
                    });
                    garbage.on(cc.Node.EventType.MOUSE_UP,(event)=>{
                        this.view_details.active = false;
                    })
                })
            }
        })
    },

    start () {

    },

    // update (dt) {},
});
