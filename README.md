# e2-calendar

> 日历

<div style="text-align:center">
  <img src="https://user-images.githubusercontent.com/6220088/64321952-29b1d180-cff4-11e9-931a-cb57e12e3015.png" alt="calendar" title="calendar"/>
</div>

> 安装

```bash
$npm install e2-calendar
```

### Development Setup

```bash
# install dependencies
$ npm install

# dev mode
$ npm run dev

# test
$ npm run test

# build
$ npm run build
```

**This project was generated with [yeoman](http://yeoman.io/) and [generator-vue-component](https://github.com/ianaya89/generator-vue-component) :heart:**

## doc

### props

- columnheader

列头文字数组

- cellHeight
  单元格高度，string 类型，默认 44px

- defaultDate
  默认选择日期 ，string 类型，默认 ``

- formatWeek
  格式化周文本函数，默认
  ```js
  (weekNum) => {
    return `第${weekNum}周`;
  };
  ```

### slot

- headerExt

头部扩展区域，可以显示说明文字

- week

显示周单元格额外内容

- day

显示日单元格额外内容

### demo

```html
<e2-calendar defaultDate="2019-05-06">
  <template #headerExt>
    计划日期：2019-08-08~2019-12-08
  </template>
  <template #week="date">
    <div class="demo-week">{{date.weekNum}}</div>
  </template>
  <template #day="date">
    <div class="demo-day">12<em>.</em></div>
  </template>
</e2-calendar>
```
