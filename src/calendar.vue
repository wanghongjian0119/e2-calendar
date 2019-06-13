
<template>
  <div class="calendar">
    <ul class="calendar-info">
      <li @click="PreMonth(myDate,false)">
        <div class="wh_jiantou1">11</div>
      </li>
      <li class="wh_content_li">{{dateTop}}</li>
      <li @click="NextMonth(myDate,false)">
        <div class="wh_jiantou2">22</div>
      </li>
    </ul>

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
              <div
                class="calendar-content"
                :style="{height:cellHeight}"
              >
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
      dateTop: ''
    };
  },

  props: {
    columnheader: {
      type: Array,
      default: () => ['周数', '一', '二', '三', '四', '五', '六', '日']
    },
    sundayStart: {
      type: Boolean,
      default: () => false
    },
    cellHeight: {
      type: String,
      default: '60px'
    },
    defaultDate: {
      type: String,
      default: ''
    },
    defaultSelected: {
      type: Boolean,
      default: () => true
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
    if (this.defaultDate) {
      this.myDate = new Date(this.defaultDate);
    } else {
      this.myDate = new Date();
    }
  },
  methods: {
    // 检索某行某列单元格日期
    curNode(row, col) {
      // 数字8 是 cols.length
      const i = row * 8 + col - 1;
      if (this.list.length > 0) {
        return this.list[i];
      }
      return {};
    },
    // 每个单元格样式
    cellClassName(row, col) {
      let node = this.curNode(row, col);
      const className = [];
      if (node.isWeek) {
        className.push('calendar-week-cell');
        return className;
      } else {
        if (node.otherMonth === 'preMonth') {
          className.push('calendar-day-cell');
          className.push('calendar-last-month-cell');
          return className;
        } else if (node.otherMonth === 'nextMonth') {
          className.push('calendar-day-cell');
          className.push('calendar-next-month-cell');
          return className;
        }
        className.push('calendar-day-cell');
        if (node.isToday) {
          className.push('calendar-today');
        }
        if (node.chooseDay) {
          className.push('calendar-selected');
        }
        return className;
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
      if (item.otherMonth === 'nowMonth') {
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
      this.dateTop = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      let arr = timeUtil.getMonthList(this.myDate);

      for (let i = 0; i < arr.length; i++) {
        let k = arr[i];
        if (k.isDay && k.otherMonth === 'nowMonth') {
          k.chooseDay = false;
          if (chooseDay === k.date) {
            k.chooseDay = true;
          }
        }
      }
      this.list = arr;
    }
  },
  mounted() {
    if (this.defaultDate) {
      this.getList(this.myDate, timeUtil.dateFormat(this.defaultDate));
    } else {
      this.getList(this.myDate, timeUtil.dateFormat(new Date()));
    }
  },
  watch: {
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
  background: #fff;
}
.calendar-info {
  display: flex;
}
.calendar-info li {
  cursor: pointer;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}
.wh_jiantou1 {
  width: 12px;
  height: 12px;
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  transform: rotate(-45deg);
}

.calendar-info .wh_content_li {
  cursor: auto;
  flex: 2.5;
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
.calendar-day-cell {
  color: rgba(0, 0, 0, 0.65);
}
.calendar-day-cell.calendar-today .calendar-date {
  border-top-color: #1890ff;
}

.calendar-day-cell.calendar-selected .calendar-date {
  background: #e6f7ff;
}

.calendar-day-cell.calendar-last-month-cell,
.calendar-day-cell.calendar-next-month-cell {
  color: rgba(0, 0, 0, 0.25);
}
.calendar-date {
  text-align: left;
  margin: 0 4px;
  display: block;
  padding: 4px 8px;
  border-top: 2px solid #e8e8e8;
  border-top-width: 2px;
  border-top-style: solid;
  border-top-color: rgb(232, 232, 232);
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
  overflow-y: auto;
  width: auto;
  left: auto;
  bottom: auto;
}
</style>