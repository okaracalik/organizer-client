<template>
  <q-card
    flat
    :class="['day-card', isWeekend(day) ? 'bg-grey-3' : 'bg-grey-1', isPast(day) && !isToday(day) && tasks.next.length < 1 ? 'light-dimmed' : '']"
  >
    <q-card-section class="text-center">
      <span class="weekday" v-if="showWeekdays">{{ format(day, 'dddd') }}</span>
      <div>
        <component
          :is="isToday(day) ? 'q-badge' : 'span'"
          :color="isToday(day) ? 'primary' : ''"
        >{{ format(day, 'Do') }}</component>
      </div>
      <div v-if="showSums" class="row justify-between" style="margin-bottom: 2px">
        <q-badge
          v-for="(occurrence, occurrenceIndex) in ['next', 'succeeded', 'failed', 'skipped']"
          :key="occurrenceIndex"
          :color="getColor(occurrence)"
          :label="tasks[occurrence].length"
        />
      </div>
      <span
        v-for="(occurrence, occurrenceIndex) in ['next', 'succeeded', 'failed', 'skipped']"
        :key="occurrenceIndex"
      >
        <q-badge
          class="full-width text-bold cursor-pointer"
          style="margin-bottom: 2px"
          v-for="(nextItem, nextIndex) in tasks[occurrence]"
          :key="nextIndex"
          :color="getColor(nextItem.colors, occurrence)"
          :style="{backgroundColor: getColor(nextItem.colors, occurrence), color: nextItem.colors && nextItem.colors.length > 1 ? nextItem.colors[1] : 'white'}"
          @click="() => $emit('pick-task', { from: occurrence, taskId: nextItem.id })"
        >
          <q-icon :name="getTaskIcon(occurrence)" />
          {{ nextItem.title }}
        </q-badge>
      </span>
    </q-card-section>
  </q-card>
</template>

<script>
import { format, isWeekend, isToday, isPast } from 'date-fns'
import { getTaskIcon, getTaskColor } from '../services/utils'

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
    isWeekend,
    isToday,
    isPast,
    getTaskIcon,
    getWeekday (date) {
      return format(date, 'dddd')
    },
    getDayInMonth (date) {
      return format(date, 'Do')
    },
    getColor (colors, occurrence) {
      if (colors && colors.length > 0) {
        return colors[0]
      }
      else {
        return getTaskColor(occurrence)
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
  border-bottom: 1px solid lightgray;
  border-left: 1px solid lightgray;
  border-radius: 0;
}
</style>
