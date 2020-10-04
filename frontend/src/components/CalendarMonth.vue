<template>
  <div class="vertically-expanding">
    <div class="row q-pa-xs">
      <!-- today button -->
      <q-btn
        outline
        color="grey-7"
        label="today"
        @click="() => { $emit('change-month', new Date()) }"
      />
      <!-- month change button -->
      <q-btn-group outline class="q-px-xs">
        <q-btn
          outline
          icon="las la-chevron-left"
          @click.native="() => { $emit('change-month', addMonths(day, -1)) }"
          color="grey-8"
        />
        <q-btn
          outline
          icon="las la-chevron-right"
          @click.native="() => { $emit('change-month', addMonths(day, 1)) }"
          color="grey-8"
        />
      </q-btn-group>
      <!-- current month -->
      <span class="text-h6 text-grey-8">{{ format(day, 'MMMM, yyyy') }}</span>
    </div>
    <div class="vertically-expanding">
      <calendar-week
        class="week"
        v-for="(week, wIndex) in weeks"
        :key="wIndex"
        :index="wIndex"
        :today="day"
        :start="week[0]"
        :end="week[1]"
        :events="events.filter(o => isWithinInterval(o.date, {start: week[0], end: week[1]}))"
      />
    </div>
  </div>
</template>

<script>
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, addMonths, format, isWithinInterval } from 'date-fns'

import CalendarWeek from './CalendarWeek'

export default {
  name: 'CalendarMonth',
  props: {
    day: {
      type: Date,
      default: () => new Date()
    },
    events: {
      type: Array,
      default: () => []
    }
  },
  components: {
    CalendarWeek
  },
  computed: {
    weeks () {
      const start = startOfWeek(startOfMonth(this.day), { weekStartsOn: 1 })
      const end = endOfWeek(endOfMonth(this.day), { weekStartsOn: 1 })
      const ranges = [[start, endOfWeek(start, { weekStartsOn: 1 })]]
      while (addDays(ranges[ranges.length - 1][0], 7) < end) {
        const s = addDays(ranges[ranges.length - 1][0], 7)
        const e = endOfWeek(s, { weekStartsOn: 1 })
        ranges.push([s, e])
      }
      return ranges
    }
  },
  methods: {
    addMonths,
    format,
    isWithinInterval
  }
}
</script>
