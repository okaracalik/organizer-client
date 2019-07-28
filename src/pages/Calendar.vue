<template>
  <component
    :class="{'parent': !isEmbedded}"
    :is="isEmbedded ? 'div' : 'q-page'"
    :padding="!isEmbedded"
  >
    <div class="child header q-mb-xs">
      <q-btn
        class="q-mb-xs q-mr-md"
        outline
        color="grey-8"
        label="Today"
        @click.native="() => day =  new Date()"
      />
      <q-btn-group class="q-mb-xs q-mr-xs" size="lg" outline>
        <q-btn outline icon="fas fa-chevron-left" @click.native="changeDate(-1)" color="grey-8" />
        <q-btn outline icon="fas fa-chevron-right" @click.native="changeDate(1)" color="grey-8" />
      </q-btn-group>
      <span class="text-h5 text-grey-9">{{ format(day, 'MMMM, YYYY') }}</span>
      <span class="text-h6 text-grey-9 q-ml-md">
        <q-chip
          color="blue-10"
          text-color="white"
          icon="mdi-checkbox-blank-outline"
          :label="visibleTasks.reduce((acc, i) => acc + i.occurrences.next.length, 0)"
        />
        <q-chip
          color="green-10"
          text-color="white"
          icon="mdi-checkbox-marked-outline"
          :label="visibleTasks.reduce((acc, i) => acc + i.occurrences.succeeded.length, 0)"
        />
        <q-chip
          color="red-10"
          text-color="white"
          icon="mdi-close-circle-outline"
          :label="visibleTasks.reduce((acc, i) => acc + i.occurrences.failed.length, 0)"
        />
        <q-chip
          color="deep-orange-10"
          text-color="white"
          icon="mdi-chevron-double-right"
          :label="visibleTasks.reduce((acc, i) => acc + i.occurrences.skipped.length, 0)"
        />
      </span>
      <q-btn-dropdown class="float-right" outline color="grey-8" :label="view.selection">
        <q-list>
          <q-item
            v-for="(item, index) in view.options"
            :key="index"
            clickable
            v-close-popup
            @click="view.selection = item"
          >
            <q-item-section>
              <q-item-label class="text-capitalize">{{ item }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <!-- month -->
    <div class="child content parent">
      <calendar-week
        class="child content"
        v-for="(item, index) in dateRanges"
        :key="index"
        :starts="item[0]"
        :ends="item[1]"
        :tasks="filterTasks(item[0], item[1])"
        :showWeekdays="index < 1"
      />
    </div>
    <!-- week -->
    <!-- custom -->
  </component>
</template>

<script>
import CalendarWeek from '../components/CalendarWeek'
import { createNamespacedHelpers } from 'vuex'
import { format, addMonths, isWithinRange, startOfWeek, endOfWeek, addWeeks, startOfMonth, endOfMonth, addDays } from 'date-fns'

const { mapState, mapActions } = createNamespacedHelpers('task')

export default {
  name: 'Calendar',
  props: {
    isEmbedded: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      day: new Date(),
      view: {
        selection: 'month',
        options: ['week', 'month']
      }
    }
  },
  components: {
    CalendarWeek
  },
  computed: {
    ...mapState({
      taskList: state => state.list
    }),
    tasks () {
      return this.taskList.success && this.taskList.success.data.length > 0 ? this.taskList.success.data.map(t => ({
        ...t,
        occurrences: {
          next: t.occurrences.reduce((acc, i) => [...acc, ...i.next], []),
          succeeded: t.occurrences.reduce((acc, i) => [...acc, ...(i.succeeded || [])], []),
          failed: t.occurrences.reduce((acc, i) => [...acc, ...(i.failed || [])], []),
          skipped: t.occurrences.reduce((acc, i) => [...acc, ...(i.skipped || [])], [])
        }
      })) : []
    },
    dateRanges () {
      switch (this.view.selection) {
        case 'month':
          const start = startOfWeek(startOfMonth(this.day), { weekStartsOn: 1 })
          const end = endOfWeek(endOfMonth(this.day), { weekStartsOn: 1 })
          let ranges = [[start, endOfWeek(start, { weekStartsOn: 1 })]]
          while (addDays(ranges[ranges.length - 1][0], 7) < end) {
            let s = addDays(ranges[ranges.length - 1][0], 7)
            let e = endOfWeek(s, { weekStartsOn: 1 })
            ranges.push([s, e])
          }
          return ranges
        case 'week':
          return [[startOfWeek(this.day, { weekStartsOn: 1 }), endOfWeek(this.day, { weekStartsOn: 1 })]]
        default:
          return []
      }
    },
    visibleTasks () {
      switch (this.view.selection) {
        case 'month':
          return this.filterTasks(startOfMonth(this.day), endOfMonth(this.day))
        case 'week':
          return this.filterTasks(startOfWeek(this.day, { weekStartsOn: 1 }), endOfWeek(this.day, { weekStartsOn: 1 }))
        default:
          return []
      }
    }
  },
  methods: {
    ...mapActions({
      findTasks: 'find'
    }),
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
    },
    changeDate (amount) {
      switch (this.view.selection) {
        case 'week':
          this.day = addWeeks(this.day, amount)
          break
        case 'month':
          this.day = addMonths(this.day, amount)
          break
        default:
          break
      }
    }
  },
  mounted () {
    this.findTasks()
  }
}
</script>

<style scoped>
.parent {
  display: flex;
  flex-flow: column;
  height: 100%;
  border-top: 1px solid lightgray;
  border-right: 1px solid lightgray;
}

/* .parent .child {
  border: 1px dotted grey;
} */
/* .child.header {
  display: flex;
  flex-flow: row;
  height: 36px;
} */

.parent .child.content {
  flex: 1 1 auto;
}
</style>
