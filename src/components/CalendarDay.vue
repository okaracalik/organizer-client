<template>
  <q-card flat class="day-card">
    <q-card-section class="text-center">
      <span class="weekday" v-if="showWeekdays">{{ format(day, 'dddd') }}</span>
      <div>{{ format(day, 'Do') }}</div>
      <div v-if="showSums" class="row justify-between" style="margin-bottom: 2px">
        <q-badge
          v-for="(occurrence, occurrenceIndex) in ['next', 'succeeded', 'failed', 'skipped']"
          :key="occurrenceIndex"
          :color="getColor(occurrence)"
        >{{ tasks[occurrence].length }}</q-badge>
      </div>
      <span
        v-for="(occurrence, occurrenceIndex) in ['next', 'succeeded', 'failed', 'skipped']"
        :key="occurrenceIndex"
      >
        <q-badge
          class="full-width text-bold"
          style="margin-bottom: 2px"
          v-for="(nextItem, nextIndex) in tasks[occurrence]"
          :key="nextIndex"
          :color="getColor(occurrence)"
        >
        <q-icon :name="getIcon(occurrence)"/>
        {{ nextItem.title }}</q-badge>
      </span>
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
    },
    tasks: {
      type: Object,
      required: true
    },
    showSums: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    format,
    getWeekday (date) {
      return format(date, 'dddd')
    },
    getDayInMonth (date) {
      return format(date, 'Do')
    },
    getColor (occurrence) {
      switch (occurrence) {
        case 'succeeded':
          return 'green-10'
        case 'skipped':
          return 'deep-orange-10'
        case 'failed':
          return 'red-10'
        case 'next':
          return 'blue-10'
        default:
          return 'gray'
      }
    },
    getIcon (occurrence) {
      switch (occurrence) {
        case 'succeeded':
          return 'mdi-checkbox-marked-outline'
        case 'failed':
          return 'mdi-close-circle-outline'
        case 'skipped':
          return 'mdi-cancel'
        case 'next':
          return 'mdi-checkbox-blank-outline'
        default:
          return 'gray'
      }
    }
  }
}
</script>

<style scoped>
.weekday {
  color: grey;
}

.day-card {
  border-bottom: 1px solid gray;
  border-left: 1px solid gray;
  border-radius: 0;
}
</style>
