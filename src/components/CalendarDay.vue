<template>
  <q-card>
    <q-card-section class="text-center">
      <span class="weekday" v-if="showWeekdays">{{ getWeekday(day) }}</span>
      <span slot="subtitle">{{ getDayInMonth(day) }}</span>
    </q-card-section>
  </q-card>
</template>

<script>
import { format } from 'date-fns'

export default {
  name: 'CalendarDay',
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
  methods: {
    getWeekday (date) {
      return format(date, 'dddd')
    },
    getDayInMonth (date) {
      return format(date, 'DD')
    }
  }
}
</script>

<style scoped>
.weekday {
  color: grey;
}
</style>
