// 随机数相关封装
let GSRandom = {};

//获取一个bound内的随机数
GSRandom.getRandom = function(start,end){
    let bound = end - start;
    let num = start;
    let random = Math.floor(Math.random()*bound) + num;
    return random;
};

//获取n个，bound范围内的随机数
GSRandom.getRandoms = function(n,bound){
    let randoms = [];
    for(let i = 0;i<n;i++){
        randoms.push(Math.floor(Math.random()*bound));
    }
    return randoms;
};

//获取n个，不重复的bound范围内的随机数,且n不能大于bound
GSRandom.getDiffRandoms = function(n,bound){
    if(n <= bound){
        let randoms = [];
        for(let i = 0; i< n; i++){
            let random = Math.floor(Math.random()*bound);
            for(let j in randoms){
                if(randoms[j] == random){
                    random = null;
                    i--;
                }
            }
            if(random != null)
                randoms.push(random);
        }
        return randoms;
    }
}

module.exports = GSRandom;
