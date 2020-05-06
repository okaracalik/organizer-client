<template>
  <div class="container-col">
    <div class="row container-item">
      <calendar-day
        class="col"
        v-for="(day, dIndex) in eachDayOfInterval({start, end})"
        :key="dIndex"
        :day="day"
        :events="events.filter(o => isSameDay(o.date, day))"
      >
        <template v-slot:title>
          {{ isSameMonth(today, day) ? format(day, 'do') : format(day, 'MMM do') }}
        </template>
        <template v-slot:content="day">
          <q-badge
            :color="event.color"
            class="full-width text-bold cursor-pointer text-capitalize"
            v-for="(event, eIndex) in day.props.events"
            :key="eIndex"
          >{{ event.title }}</q-badge>
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
    }
  },
  data () {
    return {
      today: new Date()
    }
  },
  methods: {
    eachDayOfInterval,
    isSameMonth,
    format,
    isSameDay
  }
}
</script>
