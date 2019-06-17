/* eslint-disable */
export default {
  // 当某月的天数
  getDaysInOneMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const d = new Date(year, month, 0);
    return d.getDate();
  },
  // 向前空几个
  getMonthweek(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dateFirstOne = new Date(year + '/' + month + '/1');
    return this.sundayStart ? (dateFirstOne.getDay() == 0 ? 7 : dateFirstOne.getDay()) : dateFirstOne.getDay() == 0 ? 6 : dateFirstOne.getDay() - 1;
  },
  /**
   * 获取当前日期上个月或者下个月
   */
  getOtherMonth(date, str = 'nextMonth') {
    const timeArray = this.dateFormat(date).split('/');
    const year = timeArray[0];
    const month = timeArray[1];
    const day = timeArray[2];
    let year2 = year;
    let month2;
    if (str === 'nextMonth') {
      month2 = parseInt(month) + 1;
      if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
      }
    } else {
      month2 = parseInt(month) - 1;
      if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
      }
    }
    let day2 = day;
    const days2 = new Date(year2, month2, 0).getDate();
    if (day2 > days2) {
      day2 = days2;
    }
    if (month2 < 10) {
      month2 = '0' + month2;
    }
    if (day2 < 10) {
      day2 = '0' + day2;
    }
    const t2 = year2 + '/' + month2 + '/' + day2;
    return new Date(t2);
  },
  // 上个月末尾的一些日期
  getLeftArr(date) {
    const arr = [];
    const leftNum = this.getMonthweek(date);
    const num = this.getDaysInOneMonth(this.getOtherMonth(date, 'preMonth')) - leftNum + 1;
    const preDate = this.getOtherMonth(date, 'preMonth');
    // 上个月多少开始
    for (let i = 0; i < leftNum; i++) {
      const nowTime = preDate.getFullYear() + '/' + (preDate.getMonth() + 1) + '/' + (num + i);
      arr.push({
        year: preDate.getFullYear(),
        month: preDate.getMonth() + 1,
        dayNum: num + i,
        date: nowTime,
        isToday: false,
        otherMonth: 'preMonth',
      });
    }
    return arr;
  },
  // 下个月末尾的一些日期
  getRightArr(date) {
    const arr = [];
    const nextDate = this.getOtherMonth(date, 'nextMonth');
    const leftLength = this.getDaysInOneMonth(date) + this.getMonthweek(date);
    const _length = 7 - (leftLength % 7);
    for (let i = 0; i < _length; i++) {
      const nowTime = nextDate.getFullYear() + '/' + (nextDate.getMonth() + 1) + '/' + (i + 1);
      arr.push({
        year: nextDate.getFullYear(),
        month: nextDate.getMonth() + 1,
        dayNum: i + 1,
        date: nowTime,
        isToday: false,
        otherMonth: 'nextMonth',
      });
    }
    return arr;
  },
  // format日期
  dateFormat(date) {
    date = typeof date === 'string' ? new Date(date.replace(/\-/g, '/')) : date;
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
  },
  // 获取某月的列表不包括上月和下月
  getMonthListNoOther(date) {
    const arr = [];
    const num = this.getDaysInOneMonth(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const toDay = this.dateFormat(new Date());

    for (let i = 0; i < num; i++) {
      const nowTime = year + '/' + month + '/' + (i + 1);
      arr.push({
        year: year,
        month: month,
        dayNum: i + 1,
        date: nowTime,
        isToday: toDay === nowTime,
        otherMonth: 'nowMonth',
      });
    }
    return arr;
  },

  getYearWeek(dateStr) {
    // const today = new Date(dateStr);
    // let firstDay = new Date(today.getFullYear(), 0, 1);
    // const dayOfWeek = firstDay.getDay();
    // let spendDay = 1;
    // if (dayOfWeek != 0) {
    //   spendDay = 7 - dayOfWeek + 1;
    // }
    // firstDay = new Date(today.getFullYear(), 0, 1 + spendDay);
    // const d = Math.round((today.valueOf() - firstDay.valueOf()) / 86400000);
    // return Math.ceil((d + firstDay.getDay()) / 7);

    const thisDay = new Date(dateStr);
    const firstDay = new Date(thisDay.getFullYear(), 0, 1); //本年的第一天,Js月份从0开始记！0就是1月啦。
    let dayWeek = thisDay.getDay(); //今天周几
    if (dayWeek == 0) {
      dayWeek = 7;
    }
    let startWeek = firstDay.getDay(); //本年第一天周几
    if (startWeek == 0) {
      startWeek = 7;
    }
    const weekNum = ((thisDay.getTime() - firstDay.getTime()) / 86400000 + startWeek - dayWeek) / 7 + 1;
    return weekNum;
  },

  // 获取某月的列表 用于渲染
  getMonthList(date) {
    const year = date.getFullYear();
    // 每月第一天
    const firstDay = `${year}/${date.getMonth() + 1}/1`;
    // 计算第一天是那一周
    const week = this.getYearWeek(firstDay);
    // 存储本月周列表,最多显示6周
    const monthWeeks = [];
    monthWeeks.push(week);
    monthWeeks.push(week + 1);
    monthWeeks.push(week + 2);
    monthWeeks.push(week + 3);
    monthWeeks.push(week + 4);
    monthWeeks.push(week + 5);

    const days = [...this.getLeftArr(date), ...this.getMonthListNoOther(date), ...this.getRightArr(date)];
    const { length } = days;
    const weekDays = [];
    let k = 0;
    for (let i = 0; i < length; i += 1) {
      if (i % 7 === 0) {
        // let weekNum = this.getYearWeek(days[i].date);
        // let w = Object.assign({}, days[i], { isWeek: true, weekNum: weekNum });
        // weekDays.push(w);
        // 那一年，第几周
        weekDays.push({
          year: year,
          isWeek: true,
          weekNum: monthWeeks[k],
        });
        k += 1;
      }
      days[i].isDay = true;
      weekDays.push(days[i]);
    }
    return weekDays;
    // return days
  },
  // 默认是周一开始
  sundayStart: false,
};
