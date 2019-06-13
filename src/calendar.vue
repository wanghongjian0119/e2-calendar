
<template>
  <div class="calendar">
    <!-- <div class="wh_top_changge">
        <li @click="PreMonth(myDate,false)">
          <div class="wh_jiantou1">11</div>
        </li>
        <li class="wh_content_li">{{dateTop}}</li>
        <li @click="NextMonth(myDate,false)">
          <div class="wh_jiantou2">22</div>
        </li>
      </div> -->

    <div class="calendar-header">
      年-月-日
    </div>

    <table class="calendar-table">
      <thead>
        <tr>
          <th
            v-for="(tag,index) in columnheader"
            :key="index"
            class="calendar-column-header"
          ><span class="calendar-column-header-inner">{{tag}}</span></th>
        </tr>
      </thead>
      <tbody class="calendar-tbody">
        <tr
          v-for="(row,rx) in rows"
          :key="rx"
        >
          <td
            v-for="(col,cx) in cols"
            :key="cx"
            :class="cellClassName(row,col)"
          >

            <div
              class="calendar-date"
              @click="clickDay(curNode(row,col))"
            >
              <!-- 日期数据 -->
              <div class="calendar-value">
                <template v-if="curNode(row,col).isWeek">
                  {{curNode(row,col).weekNum}}
                </template>
                <template v-else>
                  {{curNode(row,col).id}}
                </template>
              </div>
              <!-- 额外数据 -->
              <div class="calendar-content">
                <slot
                  v-if="curNode(row,col).isWeek"
                  name="week"
                  v-bind="curNode(row,col)"
                />
                <slot
                  v-else
                  name="day"
                  v-bind="curNode(row,col)"
                />
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
/* eslint-disable */
import timeUtil from './calendar';
export default {
  data() {
    return {
      cols: [1, 2, 3, 4, 5, 6, 7, 8],
      myDate: [],
      list: [],
      historyChose: [],
      dateTop: ''
    };
  },

  props: {
    markDate: {
      type: Array,
      default: () => []
    },
    markDateMore: {
      type: Array,
      default: () => []
    },
    columnheader: {
      type: Array,
      default: () => ['周数', '一', '二', '三', '四', '五', '六', '日']
    },
    sundayStart: {
      type: Boolean,
      default: () => false
    },
    agoDayHide: {
      type: String,
      default: `0`
    },
    futureDayHide: {
      type: String,
      default: `2554387200`
    }
  },
  computed: {
    rows() {
      let len = this.list.length / 8;
      let arr = [];
      for (let i = 0; i < len; i++) {
        arr.push(i);
      }
      return arr;
    }
  },
  created() {
    this.intStart();
    this.myDate = new Date();
  },
  methods: {
    // 去除索引数据
    curNode(row, col) {
      const i = row * 8 + col - 1;
      if (this.list.length > 0) {
        return this.list[i];
        x;
      }
      return {};
    },
    cellClassName(row, col) {
      let node = this.curNode(row, col);
      if (node.isWeek) {
        return 'calendar-week-cell';
      } else {
        if (node.otherMonth === 'preMonth') {
          return 'calendar-cell calendar-last-month-cell';
        } else if (node.otherMonth === 'nextMonth') {
          return 'calendar-cell calendar-next-month-cell';
        }
        return 'calendar-cell';
      }
    },
    className(row, col) {
      if (this.curNode(row, col).isWeek) {
        return 'week-cell';
      }
      return 'day-cell';
    },
    intStart() {
      timeUtil.sundayStart = this.sundayStart;
    },
    setClass(data) {
      let obj = {};
      obj[data.markClassName] = data.markClassName;
      return obj;
    },
    clickDay: function(item, index) {
      if (item.otherMonth === 'nowMonth' && !item.dayHide) {
        this.getList(this.myDate, item.date);
      }
      if (item.otherMonth !== 'nowMonth') {
        item.otherMonth === 'preMonth'
          ? this.PreMonth(item.date)
          : this.NextMonth(item.date);
      }
    },
    ChoseMonth: function(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = new Date(date);
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    PreMonth: function(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = timeUtil.getOtherMonth(this.myDate, 'preMonth');
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    NextMonth: function(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = timeUtil.getOtherMonth(this.myDate, 'nextMonth');
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    forMatArgs: function() {
      let markDate = this.markDate;
      let markDateMore = this.markDateMore;
      markDate = markDate.map(k => {
        return timeUtil.dateFormat(k);
      });
      markDateMore = markDateMore.map(k => {
        k.date = timeUtil.dateFormat(k.date);
        return k;
      });
      return [markDate, markDateMore];
    },
    getList: function(date, chooseDay, isChosedDay = true) {
      const [markDate, markDateMore] = this.forMatArgs();
      this.dateTop = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      let arr = timeUtil.getMonthList(this.myDate);
      console.log(arr);
      for (let i = 0; i < arr.length; i++) {
        let markClassName = '';
        let k = arr[i];
        k.chooseDay = false;
        const nowTime = k.date;
        const t = new Date(nowTime).getTime() / 1000;
        //看每一天的class
        for (const c of markDateMore) {
          if (c.date === nowTime) {
            markClassName = c.className || '';
          }
        }
        //标记选中某些天 设置class
        k.markClassName = markClassName;
        k.isMark = markDate.indexOf(nowTime) > -1;
        //无法选中某天
        k.dayHide = t < this.agoDayHide || t > this.futureDayHide;
        if (k.isToday) {
          this.$emit('isToday', nowTime);
        }
        let flag = !k.dayHide && k.otherMonth === 'nowMonth';
        if (chooseDay && chooseDay === nowTime && flag) {
          this.$emit('choseDay', nowTime);
          this.historyChose.push(nowTime);
          k.chooseDay = true;
        } else if (
          this.historyChose[this.historyChose.length - 1] === nowTime &&
          !chooseDay &&
          flag
        ) {
          k.chooseDay = true;
        }
      }
      this.list = arr;
    }
  },
  mounted() {
    this.getList(this.myDate);
  },
  watch: {
    markDate: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    markDateMore: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    agoDayHide: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    futureDayHide: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    sundayStart: {
      handler(val, oldVal) {
        this.intStart();
        this.getList(this.myDate);
      },
      deep: true
    }
  }
};
</script>

<style scoped>
/* @media screen and (min-width: 460px) {
  .wh_item_date:hover {
    background: #fff;
    cursor: pointer;
  }
} */

.calendar {
  width: 100%;
  margin: auto;
}

.calendar-table {
  table-layout: fixed;
  border-collapse: collapse;
  max-width: 100%;
  background-color: transparent;
  width: 100%;
  height: 256px;
}
.calendar-column-header {
  text-align: right;
  padding-right: 12px;
  padding-bottom: 5px;
}
.calendar-column-header-inner {
  font-weight: normal;
}
.calendar-cell {
  color: rgba(0, 0, 0, 0.65);
}
.calendar-cell.calendar-last-month-cell,
.calendar-cell.calendar-next-month-cell {
  color: rgba(0, 0, 0, 0.25);
}
.calendar-date {
  text-align: left;
  margin: 0 4px;
  display: block;

  height: 116px;
  padding: 4px 8px;
  border-top: 2px solid #e8e8e8;
  border-top-width: 2px;
  border-top-style: solid;
  border-top-color: rgb(232, 232, 232);
  transition: background 0.3s;
}

.today .calendar-date {
  border-top-color: #1890ff;
}
.calendar-date:hover {
  background: #e6f7ff;
  cursor: pointer;
}
.week-cell {
  background: #03a9f4;
}
.calendar-week-cell .calendar-date {
  background: #03a9f4;
}

.calendar-value {
  text-align: right;
}
.calendar-content {
  height: 88px;
  overflow-y: auto;
  width: auto;
  left: auto;
  bottom: auto;
}
</style>