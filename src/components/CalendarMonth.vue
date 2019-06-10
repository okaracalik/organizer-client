<template>
  <div>
    <q-btn-group class="col-md-12 full-width" outline>
      <q-btn class="col-md-1" outline icon="fas fa-chevron-left" @click="changeMonths(-1)"/>
      <q-btn class="col-md-10" outline :label="getMonth(day)"/>
      <q-btn class="col-md-1" outline icon="fas fa-chevron-right" @click="changeMonths(1)"/>
    </q-btn-group>
    <calendar-week
      class="row"
      v-for="(item, index) in monthDaysInEachWeek"
      :key="index"
      :day="item"
      :showWeekdays="index < 1"
    />
  </div>
</template>

<script>
import CalendarWeek from './CalendarWeek'
import { startOfMonth, addDays, format, addMonths } from 'date-fns'
import _ from 'lodash'

// get min date for monthly view
// get max date for monthly view
// search occurrences where min date
// TODO: show tasks in calendar
export default {
  name: 'CalendarMonth',
  components: {
    CalendarWeek
  },
  data () {
    return {
      day: new Date()
    }
  },
  computed: {
    monthDaysInEachWeek () {
      let d = startOfMonth(this.day)
      return _.range(5).map(i => addDays(d, i * 7))
    }
  },
  methods: {
    getMonth (date) {
      return format(date, 'MMMM, YYYY')
    },
    changeMonths (amount) {
      this.day = addMonths(this.day, amount)
    }
  }
}
</script>
