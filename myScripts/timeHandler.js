///使用方法getDifftime(time)/time可为string(yyyy-mm-dd hh:MM:ss.xxx)也可为object(Date);
/// <summary>
/// 时间格式化 
/// </summary>
///<author>杨一飞</author>
///<param type="object">time</param>
///<param type="string">time:至少给出年月日</param>
///<return type="string">格式化后的时间：n秒前、n分钟前、n小时前、昨天、前天、mm-dd hh-MM、yy-mm-dd hh-MM。。。</return>
function getDifftime(time) {
    var time1, time2;
    if (typeof (time) == 'string') {
        var timeArray = time.replace(/[ -.:\/]/g, '/').split('/');
        time1 = new Date(timeArray[0], timeArray[1] - 1, timeArray[2], timeArray[3] ? timeArray[3] : "00", timeArray[4] ? timeArray[4] : "00", timeArray[5] ? timeArray[5] : "00", timeArray[6] ? timeArray[6] : "000");
    } else if (typeof (time) == 'object') {
        time1 = time;
    } else {
        return "未知时间";
    }
    var time2 = new Date();
    var timecha = (time2 - time1) / 1000;
    if (timecha <= 0) {
        return '0秒前';
    }
    if (0 < timecha && timecha < 60) {
        return Math.ceil(timecha) + '秒前';
    }
    if (60 <= timecha && timecha < 3600) {
        return Math.floor(timecha / 60) + '分钟前';
    }
    if (3600 <= timecha && timecha < 3600 * 24 && time1.getDate() == time2.getDate()) {
        return Math.floor(timecha / 3600) + '小时前';
    }
    if (3600 <= timecha && timecha < 3600 * 48 && time2.getDate() - time1.getDate() == 1) {
        var hour = time1.getHours();
        var minute = time1.getMinutes() < 10 ? '0' + time1.getMinutes() : time1.getMinutes();
        return '昨天 ' + hour + ':' + minute;
    }
    if (3600 <= timecha && timecha < 3600 * 72 && time2.getDate() - time1.getDate() == 2) {
        var hour = time1.getHours();
        var minute = time1.getMinutes() < 10 ? '0' + time1.getMinutes() : time1.getMinutes();
        return '前天 ' + hour + ':' + minute;
    }
    if (time2.getFullYear() == time1.getFullYear()) {
        var mouth = time1.getMonth() + 1;
        var day = time1.getDate();
        var hour = time1.getHours();
        var minute = time1.getMinutes() < 10 ? '0' + time1.getMinutes() : time1.getMinutes();
        return mouth + '-' + day + ' ' + hour + ':' + minute;
    } else {
        var year = time1.getFullYear().toString().substring(2)
        var mouth = time1.getMonth() + 1;
        var day = time1.getDate();
        return year + '-' + mouth + '-' + day;
    }
}
