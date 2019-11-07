
<template>
  <div class="row">
    <calendar-day
      class="col"
      v-for="(item, index) in eachDay(starts, ends)"
      :key="index"
      :day="item"
      :showWeekdays="showWeekdays"
      :tasks="filterTasks(item)"
      @pick-task="({from, taskId}) => $emit('pick-task', {from, taskId, day: endOfDay(item)})"
    />
  </div>
</template>

<script>
import CalendarDay from './CalendarDay'
import { eachDay, isSameDay, endOfDay } from 'date-fns'
import { omit } from 'lodash'

// TODO: make it slotted
// TODO: generalize tasks
export default {
  name: 'CalendarWeek',
  components: {
    CalendarDay
  },
  props: {
    starts: {
      type: Date,
      required: true
    },
    ends: {
      type: Date,
      required: true
    },
    showWeekdays: {
      type: Boolean,
      default: true
    },
    tasks: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    eachDay,
    endOfDay,
    filterTasks (day) {
      return this.tasks.reduce((acc, t) => ({
        next: [...acc.next, ...t.occurrences.next.reduce((a, i) => isSameDay(i, day) ? [...a, omit(t, 'occurrences')] : a, [])],
        succeeded: [...acc.succeeded, ...t.occurrences.succeeded.reduce((a, i) => isSameDay(i, day) ? [...a, omit(t, 'occurrences')] : a, [])],
        failed: [...acc.failed, ...t.occurrences.failed.reduce((a, i) => isSameDay(i, day) ? [...a, omit(t, 'occurrences')] : a, [])],
        skipped: [...acc.skipped, ...t.occurrences.skipped.reduce((a, i) => isSameDay(i, day) ? [...a, omit(t, 'occurrences')] : a, [])]
      }), { next: [], succeeded: [], failed: [], skipped: [] })
    }
  }
}
</script>
