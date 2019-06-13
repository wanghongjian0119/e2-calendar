<template>
  <div>
    <Calendar>
      <template #week="date">
        {{date.weekNum}}周数据
      </template>
      <template #day="date">
        {{date.id}}号数据
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