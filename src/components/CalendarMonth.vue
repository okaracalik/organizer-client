<template>
  <div>
    <q-btn-group class="col-md-12 full-width q-mb-xs" outline>
      <q-btn
        class="col-md-1"
        outline
        icon="fas fa-chevron-left"
        @click="changeMonths(-1)"
        color="grey-8"
      />
      <q-btn class="col-md-10" outline :label="format(day, 'MMMM, YYYY')" color="grey-8" />
      <q-btn
        class="col-md-1"
        outline
        icon="fas fa-chevron-right"
        @click="changeMonths(1)"
        color="grey-8"
      />
    </q-btn-group>
    <div class="weeks">
      <calendar-week
        class="row"
        v-for="(item, index) in monthlyViewWeekBeginnings"
        :key="index"
        :starts="item[0]"
        :ends="item[1]"
        :tasks="filterTasks(item[0], item[1])"
        :showWeekdays="index < 1"
      />
    </div>
  </div>
</template>

<script>
import CalendarWeek from './CalendarWeek'
import { startOfMonth, addDays, format, addMonths, endOfMonth, startOfWeek, endOfWeek, isWithinRange } from 'date-fns'
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('task')
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
    ...mapState({
      taskList: state => state.list
    }),
    monthlyViewWeekBeginnings () {
      const firstViewDate = startOfWeek(startOfMonth(this.day), { weekStartsOn: 1 })
      const lastViewDate = endOfWeek(endOfMonth(this.day), { weekStartsOn: 1 })
      let beginnings = [[firstViewDate, endOfWeek(firstViewDate, { weekStartsOn: 1 })]]
      while (addDays(beginnings[beginnings.length - 1][0], 7) < lastViewDate) {
        let s = addDays(beginnings[beginnings.length - 1][0], 7)
        let e = endOfWeek(s, { weekStartsOn: 1 })
        beginnings.push([s, e])
      }
      return beginnings
    },
    tasks () {
      return this.taskList.success ? this.taskList.success.data.map(t => ({
        ...t,
        occurrences: {
          next: t.occurrences.reduce((acc, i) => [...acc, ...i.next], []),
          succeeded: t.occurrences.reduce((acc, i) => [...acc, ...(i.succeeded || [])], []),
          failed: t.occurrences.reduce((acc, i) => [...acc, ...(i.failed || [])], []),
          skipped: t.occurrences.reduce((acc, i) => [...acc, ...(i.skipped || [])], [])
        }
      })) : []
    }
  },
  methods: {
    ...mapActions({
      findTasks: 'find'
    }),
    format,
    changeMonths (amount) {
      this.day = addMonths(this.day, amount)
    },
    filterTasks (start, end) {
      return this.tasks.map(t => ({
        ...t,
        occurrences: {
          next: t.occurrences.next.filter(d => isWithinRange(d, start, end)),
          succeeded: t.occurrences.succeeded.filter(d => isWithinRange(d, start, end)),
          failed: t.occurrences.failed.filter(d => isWithinRange(d, start, end)),
          skipped: t.occurrences.skipped.filter(d => isWithinRange(d, start, end))
        }
      }))
    }
  },
  created () {
    this.findTasks()
    // const firstViewDate = startOfWeek(startOfMonth(new Date()), { weekStartsOn: 1 })
    // const lastViewDate = endOfWeek(endOfMonth(new Date()), { weekStartsOn: 1 })
    // console.log(firstViewDate)
    // console.log(lastViewDate)
  }
}
</script>

<style scoped>
.weeks {
  border-top: 1px solid gray;
  border-right: 1px solid gray;
}
</style>
