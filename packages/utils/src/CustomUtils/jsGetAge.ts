/**
 * @module CustomUtils
 */
/**
 * 
 * 比较生日和当前日期取得年龄
 * @param strBirthday - 生日字符串 格式参考：yyyy-MM-dd
 */
export function jsGetAge(strBirthday: string) {
  let returnAge;
  let strBirthdayArr = strBirthday.split("-");
  let birthYear = strBirthdayArr[0];
  let birthMonth = strBirthdayArr[1];
  let birthDay = strBirthdayArr[2];
  let d = new Date();
  let nowYear = d.getFullYear();
  let nowMonth = d.getMonth() + 1;
  let nowDay = d.getDate();
  if (nowYear + '' === birthYear) {
    returnAge = 0; // 同年 则为0岁
  }
  else {
    // tslint:disable-next-line: radix
    let ageDiff = nowYear - parseInt(birthYear); // 年之差
    if (ageDiff > 0) {
      if (nowMonth + '' === birthMonth) {
        // tslint:disable-next-line: radix
        let dayDiff = nowDay - parseInt(birthDay); // 日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1;
        }
        else {
          returnAge = ageDiff;
        }
      }
      else {
        // tslint:disable-next-line: radix
        let monthDiff = nowMonth - parseInt(birthMonth); // 月之差
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
