<template>
  <q-card
    flat
    :class="['day-card', isWeekend(day) ? 'bg-grey-3' : 'bg-grey-1', isPast(day) && !isToday(day) ? 'light-dimmed' : '']"
  >
    <q-card-section class="text-center">
      <span class="weekday" v-if="showWeekdays">{{ format(day, 'eeee') }}</span>
      <div>
        <component :is="isToday(day) ? 'q-badge' : 'span'" :color="isToday(day) ? 'primary' : ''">
          <slot name="title"></slot>
        </component>
      </div>
      <slot name="content" :props="{ events }"></slot>
    </q-card-section>
  </q-card>
</template>

<script>
import { format, isWeekend, isToday, isPast } from 'date-fns'

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
    events: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    format,
    isWeekend,
    isToday,
    isPast
  }
}
</script>

<style scoped>
.weekday {
  color: grey;
}

.day-card {
  border-bottom: 1px solid lightgray;
  border-left: 1px solid lightgray;
  border-radius: 0;
}

.row > .day-card:last-child {
  border-right: 1px solid lightgray;
}

.container-col.week:first-child > .row > .day-card {
  border-top: 1px solid lightgray;
}

.container-col.week:first-child > .row > .day-card:first-child {
  border-top-left-radius: 20px;
}

.container-col.week:first-child > .row > .day-card:last-child {
  border-top-right-radius: 20px;
}

.container-col.week:last-child > .row > .day-card:first-child {
  border-bottom-left-radius: 20px;
}

.container-col.week:last-child > .row > .day-card:last-child {
  border-bottom-right-radius: 20px;
}

</style>
