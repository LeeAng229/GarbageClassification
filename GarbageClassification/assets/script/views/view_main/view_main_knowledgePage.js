const trashConfig = {
    HAZARDOUSWASTE:'view_trash_hazardousWaste',
    RECYCLABLEWASTE:'view_trash_recyclableWaste',
    HOUSEHOLDFOODWASTE:'view_trash_householdFoodWaste',
    RESIDUALWASTE:'view_trash_residualWaste'
}

const trashArr = [
    trashConfig.HAZARDOUSWASTE,
    trashConfig.RESIDUALWASTE,
    trashConfig.HOUSEHOLDFOODWASTE,
    trashConfig.RESIDUALWASTE
]

const trashValue = {
    view_trash_hazardousWaste:1,
    view_trash_recyclableWaste:2,
    view_trash_householdFoodWaste:3,
    view_trash_residualWaste:4
}

cc.Class({
    extends: cc.Component,

    properties: {
        trashNodes:[cc.Node]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //创建一个garbageSel数组
        this.garbageSelArr = [];
        this.trashContentArr = [];

        //遍历垃圾箱节点
        this.trashNodes.forEach(trashNode=>{
           this.showGarbageSelected(trashNode);
           this.showGarbageContent(trashNode);
            //获取所有垃圾箱节点的内容子节点，
        });

        //初始化垃圾桶选中为第一个
        this.trashNodes[0].getChildByName('garbageSel').active = true;
        this.trashNodes[0].getChildByName(`${this.trashNodes[0].name}`+'_Content').active = true;
    },

    showGarbageSelected(trashNode){
         //初始化所有的垃圾桶选中状态为未选中状态
         let garbageSel = trashNode.getChildByName('garbageSel');
         garbageSel.active = false;
         //将garbageSel节点放入garbageSel数组中
         this.garbageSelArr.push(garbageSel);
         //给所有的垃圾箱节点添加点击事件
         trashNode.on(cc.Node.EventType.TOUCH_END,(event)=>{
             //遍历garbageSelArr数组，在每次点击一个垃圾箱之前对所有的垃圾箱选中状态改变为未选中状态
             this.garbageSelArr.forEach(garbageSel=>{
                 garbageSel.active = false;
             });
             trashNode.getChildByName('garbageSel').active = true;
         });
    },

    showGarbageContent(trashNode){
        //初始化所有的垃圾桶分类只是内容均为未显示状态
        let trashContent = trashNode.getChildByName(`${trashNode.name}`+'_Content');
        trashContent.active = false;
        //将garbageSel节点放入garbageSel数组中
        this.trashContentArr.push(trashContent);
        //给所有的垃圾箱节点添加点击事件
        trashNode.on(cc.Node.EventType.TOUCH_END,(event)=>{
            //遍历garbageSelArr数组，在每次点击一个垃圾箱之前对所有的垃圾箱选中状态改变为未选中状态
            this.trashContentArr.forEach(trashContent=>{
                trashContent.active = false;
            });
            trashNode.getChildByName(`${trashNode.name}`+'_Content').active = true;
        });
    },

    start () {

    },

    // update (dt) {},
});
