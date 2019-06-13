<template>
  <div class="demo">
    <Calendar defaultDate1="2019-05-06">
      <template #week="date">
        {{date.weekNum}}周数据
      </template>
      <template #day="date">
        {{date.chooseDay}}
      </template>
    </Calendar>
  </div>
</template>
<script>
import Calendar from '../src';

export default {
  name: 'App',
  components: { Calendar },

  data() {
    return {};
  }
};
</script>
<style>
.demo {
  padding: 50px;
  background: green;
}
</style>
