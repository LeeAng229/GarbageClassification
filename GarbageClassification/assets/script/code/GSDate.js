let GSDate = {};
function _add0(m) {
    return m < 10 ? '0' + m : m;
}

// 获取时间戳
GSDate.timeStamp = ()=>{
    return new Date().getTime();
};
GSDate.formatTime = (ms)=>{
    let time = new Date(ms);
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    let s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d);
};
GSDate.dateDifference = (d1, d2)=>{
    let s1 = GSDate.formatTime(ts1);
    let s2 = GSDate.formatTime(ts2);
    ts1 = new Date(s1.replace(/-/g, "/"));
    ts2 = new Date(s2.replace(/-/g, "/"));
    let times = ts1.getTime() - ts2.getTime();
    let days = parseInt(times / (1000 * 60 * 60 * 24));
    return days;
};
GSDate.formatCountDownTime = (time)=>{
    let arr = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
    let full_hour = 60 * 60 * 1000;
    let full_minite = 60 * 1000;
    let full_sceond = 1000;

    let hour = parseInt(time / full_hour);
    let minite = parseInt((time - hour * full_hour) / full_minite);
    let second = parseInt((time - hour * full_hour - minite * full_minite) / full_sceond);

    hour = hour < 10 ? arr[hour] : hour + '';
    minite = minite < 10 ? arr[minite] : minite + '';
    second = second < 10 ? arr[second] : second + '';

    return `${hour}:${minite}:${second}`;
};

GSDate.getTodayDayTag = ()=>{
    return GSDate.formatTime(new Date().getTime());
};
GSDate.getTimeByDateTag = (tag)=>{
    let tags = tag.split('-');
    let y = parseInt(tags[0]);
    let m = parseInt(tags[1]);
    let d = parseInt(tags[2]);
    let date = new Date();
    date.setFullYear(y);
    date.setMonth(m - 1);
    date.setDate(d);
    return date.getTime();
};
module.exports = GSDate;
