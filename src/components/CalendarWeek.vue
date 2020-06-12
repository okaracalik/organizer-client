<template>
  <div class="vertically-expanding">
    <div class="row container-item">
      <calendar-day
        class="col"
        v-for="(day, dIndex) in eachDayOfInterval({start, end})"
        :key="dIndex"
        :day="day"
        :show-weekdays="index < 1"
        :events="events.filter(o => isSameDay(o.date, day))"
      >
        <template
          v-slot:title
        >{{ isSameMonth(today, day) ? format(day, 'do') : format(day, 'MMM do') }}</template>
        <template v-slot:content="day">
          <q-badge
            :style="{backgroundColor: event.colors[0], color: event.colors[1]}"
            class="full-width text-bold cursor-pointer text-capitalize"
            v-for="(event, eIndex) in day.props.events"
            :key="eIndex"
          >
            <q-icon :name="getIcon(event.status)" :color="event.colors[1]" />
            {{ event.title }}
          </q-badge>
        </template>
      </calendar-day>
    </div>
  </div>
</template>

<script>
import { eachDayOfInterval, isSameMonth, format, isSameDay } from 'date-fns'

import CalendarDay from './CalendarDay'

export default {
  name: 'CalendarWeek',
  components: {
    CalendarDay
  },
  props: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    },
    events: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number,
      required: true
    },
    today: {
      type: Date,
      default: () => new Date()
    }
  },
  methods: {
    getIcon (status) {
      switch (status) {
        case 'next':
          return 'las la-stop'
        case 'done':
          return 'las la-check-square'
        case 'failed':
          return 'las la-times-circle'
        case 'skipped':
          return 'las la-fast-forward'
        case 'removed':
          return 'las la-trash'
        default:
          return 'las la-question'
      }
    },
    eachDayOfInterval,
    isSameMonth,
    format,
    isSameDay
  }
}
</script>
