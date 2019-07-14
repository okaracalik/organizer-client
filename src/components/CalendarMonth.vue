<template>
  <div>
    <q-btn
      class="q-mb-xs q-mr-md"
      outline
      color="grey-8"
      label="Today"
      @click.native="() => $emit('change-month', new Date())"
    />
    <q-btn-group class="q-mb-xs q-mr-xs" outline>
      <q-btn
        outline
        icon="fas fa-chevron-left"
        @click.native="() => $emit('change-month', addMonths(day, -1))"
        color="grey-8"
      />
      <q-btn
        outline
        icon="fas fa-chevron-right"
        @click.native="() => $emit('change-month', addMonths(day, 1))"
        color="grey-8"
      />
    </q-btn-group>
    <span class="text-h6 text-grey-9">{{ format(day, 'MMMM, YYYY') }}</span>
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

// get min date for monthly view
// get max date for monthly view
// search occurrences where min date
export default {
  name: 'CalendarMonth',
  props: {
    day: {
      type: Date,
      default: () => new Date()
    },
    taskList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    CalendarWeek
  },
  computed: {
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
      return this.taskList.length > 0 ? this.taskList.map(t => ({
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
    format,
    addMonths,
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
  }
}
</script>

<style scoped>
.weeks {
  border-top: 1px solid lightgray;
  border-right: 1px solid lightgray;
}
</style>
