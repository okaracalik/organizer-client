<template>
  <q-page class="vertically-expanding" padding>
    <!-- content -->
    <calendar-month :day="day" @change-month="(date) => { day = date }" :events="events" />
  </q-page>
</template>

<script>
import { flatten } from 'lodash'
import { createNamespacedHelpers } from 'vuex'

import CalendarMonth from '../components/CalendarMonth'

const { mapState, mapActions } = createNamespacedHelpers('task')

// TODO: edit task on calendar
// TODO: make tasks w/ original colors
export default {
  name: 'Calendar',
  components: {
    CalendarMonth
  },
  data () {
    return {
      day: new Date()
    }
  },
  computed: {
    ...mapState({
      taskList: state => state.list
    }),
    events () {
      return this.taskList.success && this.taskList.success.data.length > 0 ? this.__merge__(flatten(this.taskList.success.data.map(
        t => [
          ...t.occurrences.map(o => ({ title: t.title, dates: o.next, status: 'next', colors: t.colors })).filter(o => o.dates.length > 0),
          ...t.occurrences.map(o => ({ title: t.title, dates: o.done, status: 'done', colors: t.colors })).filter(o => o.dates.length > 0),
          ...t.occurrences.map(o => ({ title: t.title, dates: o.skipped, status: 'skipped', colors: t.colors })).filter(o => o.dates.length > 0),
          ...t.occurrences.map(o => ({ title: t.title, dates: o.failed, status: 'failed', colors: t.colors })).filter(o => o.dates.length > 0)
        ])
      )) : []
    }
  },
  methods: {
    ...mapActions({
      findTasks: 'find'
    }),
    __merge__ (events) {
      return flatten(events.reduce((acc, item) => [...acc, item.dates.map(d => ({ title: item.title, date: d, status: item.status, colors: item.colors }))], []))
    }
  },
  mounted () {
    this.findTasks()
  }
}
</script>
