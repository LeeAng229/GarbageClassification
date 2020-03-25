// 引擎相关当工具方法
let GSCCUtils = {};

GSCCUtils.currentScene = ()=>{
    let cur_scene = cc.director.getScene();
    return cur_scene;
};
GSCCUtils.currentCanvas = ()=>{
    let cur_scene = GSCCUtils.currentScene();
    let canvas = null;
    if(cur_scene){
        canvas = cur_scene.getChildByName('Canvas');
    }
    return canvas;
};
GSCCUtils.getComponent = (node, component)=>{
    if(node && component){
        return node.getComponent(component); 
    }
    return null;
};
GSCCUtils.positionConvert = (node_form, node_to)=>{
    let pos = null;
    if(node_form && node_to){
        let world_pos = node_form.parent.convertToWorldSpaceAR(node_form.position);
        pos = node_to.convertToNodeSpaceAR(world_pos);
    }
    return pos;
};
module.exports = GSCCUtils;
