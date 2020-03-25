let Utils = {};

Utils.mergeJson = (jsonOrig, jsonToMerge)=>{
    GS.assert(GS.isObject(jsonOrig) && GS.isObject(jsonToMerge));
    
};

Utils.createUUID = ()=>{
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "";

    return s.join("");
};
Utils.createArray = (length, element)=>{
    let ret = [];
    for(let i = 0; i < length; i++){
        if(GS.isFunction(element)){
            ret.push(element[i]);
        }
        else{
            ret.push(element);
        }
    }
    return ret;
};
Utils.create2DArray = (rows, cols, element)=>{
    let ret = [];
    for(let r = 0; r < rows; ++r){
        ret[r] = [];
        for(let c = 0; c < cols; ++c){
            if(GS.isFunction(element)){
                ret[r].push(element(r, c));
            }
            else{
                ret[r].push(element);
            }
        }
    }
    return ret;
};

module.exports = Utils;
