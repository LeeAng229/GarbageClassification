import data from '../../common/getData'
cc.Class({
    extends: cc.Component,

    properties: {
        coinLabel:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //获取当前的金币数量
        let coinNum = data.getCoinNum();
        this.coinLabel.string = coinNum;
    },

    start () {

    },

    // update (dt) {},
});
