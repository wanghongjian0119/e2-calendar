
<template>
  <div class="calendar">
    <!-- begin: 日历头部 -->
    <div class="calendar-header">
      <div class="calendar-header-ext">
        <slot name="headerExt" />
      </div>
      <a-select :value="curYear"
        @change="handleChangeYear"
        class="calendar-year-select">
        <a-select-option v-for="(value,index) in yearOptions"
          :key="index"
          :value="value">{{value}}年</a-select-option>
      </a-select>
      <a-select :value="curMonth"
        @change="handleChangeMonth"
        class="calendar-month-select">
        <a-select-option v-for="(value,index) in monthOptions"
          :key="index"
          :value="value">{{value}}月</a-select-option>
      </a-select>
    </div>
    <!-- end: 日历头部 -->

    <!-- begin: 日历当前信息 -->
    <!-- <ul class="calendar-info">
      <li @click="PreMonth(myDate,false)">
        <div class="calendar_icon_left">
          <a-icon type="left" />
        </div>

      </li>
      <li class="wh_content_li">{{dateTop}}</li>
      <li @click="NextMonth(myDate,false)">
        <div class="calendar_icon_right">
          <a-icon type="right" />
        </div>
      </li>
    </ul> -->
    <!-- end: 日历当前信息 -->

    <!-- begin: 日历单元格 -->
    <table class="calendar-table">
      <thead>
        <tr>
          <th v-for="(tag,index) in columnheader"
            :key="index"
            class="calendar-column-header">
            <span class="calendar-column-header-inner">{{tag}}</span>
          </th>
        </tr>
      </thead>
      <tbody class="calendar-tbody">
        <tr v-for="(row,rx) in rows"
          :key="rx">
          <td v-for="(col,cx) in cols"
            :key="cx"
            :class="cellClassName(row,col)"
            :title="cellTitle(row,col)">
            <div class="calendar-date"
              @click="clickDay(curNode(row,col))">
              <!-- being: 日期数据 -->
              <div class="calendar-value">
                <template v-if="curNode(row,col).isWeek">
                  {{formatWeek(curNode(row,col).weekNum)}}
                </template>
                <template v-else>
                  {{curNode(row,col).dayNum}}
                </template>
              </div>
              <!-- end: 日期数据 -->
              <!-- being: 额外数据 -->
              <div class="calendar-content"
                :style="{height:cellHeight}">
                <!-- 插槽: 周单元格和日单元格，并且对外提供当前节点 -->
                <slot v-if="curNode(row,col).isWeek"
                  name="week"
                  v-bind="curNode(row,col)" />
                <slot v-else
                  name="day"
                  v-bind="curNode(row,col)" />
              </div>
              <!-- end: 额外数据 -->
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- end: 日历单元格 -->
  </div>
</template>
<script>
import { Select } from 'ant-design-vue';
import timeUtil from './calendar';
// 下拉框 option
const SelectOption = Select.Option;

export default {
  name: 'e2-calendar',
  data() {
    return {
      cols: [1, 2, 3, 4, 5, 6, 7, 8], // 日历列
      myDate: [],
      list: [],
      monthOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      yearOptions: [], // 月下拉框
      dateTop: '',
      curYear: 0, // 下拉框选择的年
      curMonth: 0, // 下拉框选择的月
    };
  },
  components: {
    [Select.name]: Select,
    [SelectOption.name]: SelectOption,
  },
  props: {
    columnheader: {
      type: Array,
      default: () => ['周数', '一', '二', '三', '四', '五', '六', '日'],
    },
    sundayStart: {
      type: Boolean,
      default: () => false,
    },
    cellHeight: {
      type: String,
      default: '44px',
    },
    defaultDate: {
      type: String,
      default: '',
    },
    // 格式化周显示格式
    formatWeek: {
      type: Function,
      default: weekNum => {
        return `第${weekNum}周`;
      },
    },
  },
  computed: {
    // 日历行
    rows() {
      const cols = this.cols.length;
      let len = this.list.length / cols;
      let arr = [];
      for (let i = 0; i < len; i += 1) {
        arr.push(i);
      }
      return arr;
    },
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
    // 计算年数组
    calYearOptions() {
      let nowDate;
      if (this.defaultDate) {
        nowDate = new Date(this.defaultDate);
      } else {
        nowDate = new Date();
      }
      const year = nowDate.getFullYear();
      const options = [];
      let i = year - 11;
      while (i < year + 9) {
        i += 1;
        options.push(i);
      }
      return options;
    },
    // 响应年下拉框
    handleChangeYear(value) {
      const date = `${value}/${this.curMonth}/1`;
      this.myDate = new Date(date);
      this.getList(this.myDate);
    },
    // 响应月下拉框
    handleChangeMonth(value) {
      const date = `${this.curYear}/${value}/1`;
      this.myDate = new Date(date);
      this.getList(this.myDate);
    },
    // 检索某行某列单元格日期
    curNode(row, col) {
      // 数字8 是 cols.length
      const cols = this.cols.length;
      const i = row * cols + col - 1;
      if (this.list.length > 0) {
        return this.list[i];
      }
      return {};
    },
    cellTitle(row, col) {
      let node = this.curNode(row, col);
      if (node.isWeek) {
        return `${node.year}年 第${node.weekNum}周`;
      }
      return `${node.year}年${node.month}月${node.dayNum}日`;
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

    intStart() {
      timeUtil.sundayStart = this.sundayStart;
      this.yearOptions = this.calYearOptions();
    },

    clickDay: function(item, index) {
      if (item.isWeek) {
        return;
      }
      if (item.otherMonth === 'nowMonth') {
        this.getList(this.myDate, item.date);
      }
      if (item.otherMonth !== 'nowMonth') {
        item.otherMonth === 'preMonth' ? this.PreMonth(item.date) : this.NextMonth(item.date);
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

    getList: function(date, chooseDay, isChosedDay = true) {
      this.curYear = date.getFullYear();
      this.curMonth = date.getMonth() + 1;
      this.dateTop = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      let arr = timeUtil.getMonthList(this.myDate);

      for (let i = 0; i < arr.length; i += 1) {
        let k = arr[i];
        if (k.isDay && k.otherMonth === 'nowMonth') {
          k.chooseDay = false;
          if (chooseDay === k.date) {
            k.chooseDay = true;
          }
        }
      }
      this.list = arr;
    },
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
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
.calendar {
  width: 100%;
  margin: auto;
  background: #fff;
}

.calendar-header {
  padding: 11px 0 11px 0;
  text-align: right;
}
.calendar-header-ext {
  float: left;
}
.calendar-month-select {
  margin-left: 10px;
}
.calendar-table {
  table-layout: fixed;
  border-collapse: collapse;
  max-width: 100%;
  background-color: transparent;
  width: 100%;
}
.calendar-column-header {
  text-align: right;
  padding-right: 12px;
  padding-bottom: 5px;
  &:first-child {
    text-align: center;
    width: 9%;
  }
}

.calendar-column-header-inner {
  font-weight: normal;
}

.calendar-day-cell {
  color: #222;
  &.calendar-today {
    .calendar-date {
      border-top-color: #1890ff;
    }
  }
  &.calendar-selected {
    .calendar-date {
      background: #e6f7ff;
    }
    .calendar-value {
      color: #1890ff;
    }
  }
  &.calendar-last-month-cell {
    color: rgba(0, 0, 0, 0.25);
  }
  &.calendar-next-month-cell {
    color: rgba(0, 0, 0, 0.25);
  }

  .calendar-date {
    text-align: left;
    margin: -1px 4px 0 4px;
    display: block;
    padding: 4px 8px;
    border-top: 2px solid #d9d9d9;
  }
  .calendar-value {
    text-align: right;
    height: 30px;
    line-height: 42px;
  }
  .calendar-content {
    text-align: right;
  }
}

.today .calendar-date {
  border-top-color: #1890ff;
}
.calendar-date:hover {
  background: #e6f7ff;
  cursor: pointer;
}

.calendar-week-cell,
.calendar-day-cell {
  vertical-align: top;
}

.calendar-week-cell {
  background: #e3f2ff;
  padding: 0;
  .calendar-date {
    text-align: left;
    display: block;
    border-top: 2px solid #d9d9d9;
  }
  .calendar-value {
    text-align: center;
    height: 30px;
    line-height: 42px;
  }
  .calendar-content {
    text-align: center;
  }
}

.calendar-content {
  overflow-y: auto;
  width: auto;
  left: auto;
  bottom: auto;
  color: #3272d3;
}
</style>