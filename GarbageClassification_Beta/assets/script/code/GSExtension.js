GS.isUndefined = (obj)=>{
    return typeof obj === 'undefined';
};
GS.isArray = (obj)=>{
    if(Array.isArray(obj)) return true;
    return (typeof obj === 'object' && Object.prototype.toString.call(obj) == '[object Array]');
};
GS.isString = function (str) {
    return typeof str == 'string' || Object.prototype.toString.call(str) == '[object String]';
};
GS.isNumber = function (obj) {
    return typeof obj == 'number' || Object.prototype.toString.call(obj) == '[object Number]';
};
GS.isFunction = function (obj) {
    return typeof obj === 'function';
};
GS.isObject = function (obj) {
    return typeof obj === "object" && Object.prototype.toString.call(obj) === '[object Object]';
};
GS.assert = function(is_error, msg){
    if(is_error){
        console.log("GS Assert===>", msg);
    }
};

//=====String
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};
String.format = function () {
    if (arguments.length == 0)
        return null;

    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};
//String end


//====Array
Array.prototype.random = function(){
    var idx = parseInt(Math.random() * this.length);
    return this[idx];
};
Array.prototype.remove = function(idx){
    if(idx >= this.length) return;
    return this.splice(idx, 1)[0];
};
Array.prototype.removeObj = function(obj){
    let idx = this.indexOf(obj);
    if(idx >= -1) return this.splice(idx, 1)[0];
};
Array.prototype.last = function(){
    return this[this.length - 1];
};
Array.prototype.lastIndex = function(){
    return this.length - 1;
};
Array.prototype.removeLast = function(){
    let idx = this.lastIndex();
    return this.splice(idx, 1)[0];
};
Array.prototype.removeFirst = function(){
    return this.splice(0, 1)[0];
};
Array.prototype.deepCopy = function(){
    let new_arr = [];
};
//Array end
