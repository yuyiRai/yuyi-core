export function jsGetAge(strBirthday) {
    var returnAge;
    var strBirthdayArr = strBirthday.split("-");
    var birthYear = strBirthdayArr[0];
    var birthMonth = strBirthdayArr[1];
    var birthDay = strBirthdayArr[2];
    var d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();
    if (nowYear + '' === birthYear) {
        returnAge = 0; // 同年 则为0岁
    }
    else {
        // tslint:disable-next-line: radix
        var ageDiff = nowYear - parseInt(birthYear); // 年之差
        if (ageDiff > 0) {
            if (nowMonth + '' === birthMonth) {
                // tslint:disable-next-line: radix
                var dayDiff = nowDay - parseInt(birthDay); // 日之差
                if (dayDiff < 0) {
                    returnAge = ageDiff - 1;
                }
                else {
                    returnAge = ageDiff;
                }
            }
            else {
                // tslint:disable-next-line: radix
                var monthDiff = nowMonth - parseInt(birthMonth); // 月之差
                if (monthDiff < 0) {
                    returnAge = ageDiff - 1;
                }
                else {
                    returnAge = ageDiff;
                }
            }
        }
        else {
            returnAge = -1; // 返回-1 表示出生日期输入错误 晚于今天
        }
    }
    return returnAge; // 返回周岁年龄
}
//# sourceMappingURL=jsGetAge.js.map