
<template>
  <div class="row">
    <calendar-day class="col" v-for="(item, index) in weekdays" :key="index" :day="item" :showWeekdays="showWeekdays"/>
  </div>
</template>

<script>
import CalendarDay from './CalendarDay'
import { startOfWeek, endOfWeek, eachDay } from 'date-fns'

export default {
  name: 'CalendarWeek',
  components: {
    CalendarDay
  },
  props: {
    day: {
      type: Date,
      default: new Date()
    },
    showWeekdays: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    weekdays () {
      return eachDay(startOfWeek(this.day, { weekStartsOn: 1 }), endOfWeek(this.day, { weekStartsOn: 1 }))
    }
  }
}
</script>
