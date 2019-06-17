<template>
  <div class="demo">
    <Calendar defaultDate="2019-05-06">
      <template #headerExt>
        计划日期：2019-08-08~2019-12-08
      </template>
      <template #week="date">
        <div class="demo-week">{{date.weekNum}}</div>
      </template>
      <template #day="date">
        <div class="demo-day"> 12<em>.</em></div>
      </template>
    </Calendar>
  </div>
</template>
<script>
import Calendar from '../src';
import { returnStatement } from 'babel-types';

export default {
  name: 'App',
  components: { Calendar },

  data() {
    return {};
  },
  methods: {
    formatWeek(weekNum) {
      return `${weekNum}`;
    }
  }
};
</script>
<style>
.demo {
  padding: 50px;
  background: rgb(31, 32, 31);
}
.demo .calendar {
  padding: 10px;
}

.demo-week {
  line-height: 50px;
}
.demo-day {
  line-height: 50px;
}
.demo-day em {
  width: 12px;
  display: inline-block;
  line-height: 4px;
  vertical-align: text-top;
  font-size: 24px;
  color: #3674d3;
}
</style>
