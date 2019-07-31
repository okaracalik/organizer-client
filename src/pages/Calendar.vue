<template>
  <component
    :class="{'parent': !isEmbedded}"
    :is="isEmbedded ? 'div' : 'q-page'"
    :padding="!isEmbedded"
  >
    <div class="child header q-mb-md">
      <!-- today button -->
      <q-btn
        class="q-mb-xs q-mr-md"
        outline
        color="grey-8"
        label="Today"
        @click.native="() => day =  new Date()"
      />
      <!-- change date -->
      <q-btn-group class="q-mb-xs q-mr-xs" size="lg" outline>
        <q-btn outline icon="fas fa-chevron-left" @click.native="changeDate(-1)" color="grey-8" />
        <q-btn outline icon="fas fa-chevron-right" @click.native="changeDate(1)" color="grey-8" />
      </q-btn-group>
      <!-- current month -->
      <span class="text-h5 text-grey-9">{{ format(day, 'MMMM, YYYY') }}</span>
      <!-- overview chips -->
      <span class="text-h6 text-grey-9 q-ml-md">
        <q-chip
          v-for="(chipItem, chipIndex) in ['next', 'succeeded', 'failed', 'skipped']"
          :key="chipIndex"
          :color="getTaskColorDarker(chipItem)"
          :icon="getTaskIcon(chipItem)"
          text-color="white"
          :label="filteredTasks.reduce((acc, i) => acc + i.occurrences[chipItem].length, 0).toString()"
        />
      </span>
      <!-- tags -->
      <span >
        <q-select
          style="width: 200px; height:24px"
          v-model="tags.selected"
          :options="tags.options"
          multiple
          emit-value
          use-chips
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-tag" />
          </template>
          <template v-slot:selected>{{tags.selected.length}} Tags</template>
        </q-select>
      </span>
      <!-- view options -->
      <q-btn-dropdown class="float-right" outline color="grey-8" :label="view.selection.toString()">
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
    <!-- month/week -->
    <div class="child content parent">
      <calendar-week
        class="child content"
        v-for="(item, index) in dateRanges"
        :key="index"
        :starts="item[0]"
        :ends="item[1]"
        :tasks="filterTasksByTags(filterTasksByDate(tasks, item[0], item[1]), tags.selected)"
        :showWeekdays="index < 1"
        @pick-task="(item) => dialog = {isOpen: true, item: { ...item, to: item.from }}"
      />
    </div>
    <!-- custom -->
    <!-- fab -->
    <floating-action-button next="/tasks/new" />
    <!-- dialog -->
    <q-dialog v-model="dialog.isOpen">
      <q-card class="q-pa-md">
        <q-card-section>
          <div v-if="pickedTask" class="text-h5 text-center">{{ pickedTask.title }}</div>
        </q-card-section>

        <q-card-section v-if="dialog.item">
          <div class="text-h6 text-center">{{ format(dialog.item.day, 'DD MMM YY, dd') }}</div>

          <q-btn-toggle
            v-model="dialog.item.to"
            :toggle-color="getTaskColor(dialog.item.to)"
            :options="[
              {value: 'succeeded', slot: 'one'},
              {value: 'skipped', slot: 'two'},
              {value: 'failed', slot: 'three'},
              {value: 'next', slot: 'four'}
            ]"
          >
            <template v-slot:one>
              <div class="row items-center no-wrap">
                <q-icon
                  :color="dialog.item.to === 'succeeded' ? 'white': 'green-6'"
                  name="mdi-check-bold"
                />
              </div>
            </template>
            <template v-slot:two>
              <div class="row items-center no-wrap">
                <q-icon
                  :color="dialog.item.to === 'skipped' ? 'white': 'deep-orange-6'"
                  name="mdi-skip-forward"
                />
              </div>
            </template>
            <template v-slot:three>
              <div class="row items-center no-wrap">
                <q-icon
                  :color="dialog.item.to === 'failed' ? 'white': 'red-6'"
                  name="mdi-close-circle"
                />
              </div>
            </template>
            <template v-slot:four>
              <div class="row items-center no-wrap">
                <q-icon
                  :color="dialog.item.to === 'next' ? 'white': 'blue-6'"
                  name="mdi-arrow-right-circle-outline"
                />
              </div>
            </template>
          </q-btn-toggle>
        </q-card-section>

        <q-card-section>
          <q-btn
            class="float-right"
            icon="mdi-content-save"
            color="positive"
            v-close-popup
            @click="updateOccurrence({ id: occurrenceForm.data.id, data: occurrenceForm.data })"
          />
          <q-btn class="float-left" icon="mdi-undo" color="warning" v-close-popup />
        </q-card-section>
      </q-card>
    </q-dialog>
  </component>
</template>

<script>
import _ from 'lodash'
import { createNamespacedHelpers } from 'vuex'
import { format, addMonths, isWithinRange, startOfWeek, isSameDay, endOfWeek, addWeeks, startOfMonth, endOfMonth, addDays, compareAsc, parse } from 'date-fns'

import CalendarWeek from '../components/CalendarWeek'
import FloatingActionButton from '../components/FloatingActionButton'
import { uniqDates, getTaskColor, getTaskIcon, getTaskColorDarker } from '../services/utils'

const task = createNamespacedHelpers('task')
const occurrence = createNamespacedHelpers('occurrence')
const tag = createNamespacedHelpers('tag')

export default {
  name: 'Calendar',
  props: {
    isEmbedded: {
      type: Boolean,
      default: false
    }
  },
  components: {
    CalendarWeek,
    FloatingActionButton
  },
  data () {
    return {
      day: new Date(),
      view: {
        selection: 'month',
        options: ['week', 'month']
      },
      dialog: {
        isOpen: false,
        item: null
      },
      tags: {
        selected: [],
        options: []
      }
    }
  },
  computed: {
    ...task.mapState({
      taskList: state => state.list
    }),
    ...tag.mapState({
      tagList: state => state.list
    }),
    ...occurrence.mapState({
      occurrenceForm: state => state.form
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
          return this.filterTasksByDate(this.tasks, startOfMonth(this.day), endOfMonth(this.day))
        case 'week':
          return this.filterTasksByDate(this.tasks, startOfWeek(this.day, { weekStartsOn: 1 }), endOfWeek(this.day, { weekStartsOn: 1 }))
        default:
          return []
      }
    },
    visibleTags () {
      return [...new Set(this.visibleTasks.reduce((acc, t) => t.tags ? [...acc, ...t.tags] : acc, []).filter(i => !_.isNull(i)))].sort()
    },
    filteredTasks () {
      return this.visibleTasks.filter(t => _.intersection(t.tags, this.tags.selected).length > 0)
    },
    pickedTask () {
      return this.dialog.item ? this.taskList.success.data.filter(t => t.id === this.dialog.item.taskId)[0] : null
    },
    valid () {
      return this.occurrence !== null ? true : this.occurrence[this.dialog.item.from].includes(this.dialog.item.day)
    }
  },
  methods: {
    ...task.mapActions({
      findTasks: 'find'
    }),
    ...tag.mapActions({
      findTags: 'find'
    }),
    ...occurrence.mapActions({
      setOccurrence: 'set',
      updateOccurrence: 'update'
    }),
    format,
    addMonths,
    getTaskColor,
    getTaskColorDarker,
    getTaskIcon,
    filterTasksByDate (tasks, start, end) {
      return tasks.map(t => ({
        ...t,
        occurrences: {
          next: t.occurrences.next.filter(d => isWithinRange(d, start, end)),
          succeeded: t.occurrences.succeeded.filter(d => isWithinRange(d, start, end)),
          failed: t.occurrences.failed.filter(d => isWithinRange(d, start, end)),
          skipped: t.occurrences.skipped.filter(d => isWithinRange(d, start, end))
        }
      }))
    },
    filterTasksByTags (tasks, tags) {
      return tasks.filter(t => _.intersection(t.tags, tags).length > 0)
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
  },
  watch: {
    visibleTags (newValue) {
      if (newValue.length > 0) {
        this.findTags({ params: { 'id[$in]': newValue } })
      }
    },
    'tagList.success' (newValue) {
      if (!_.isNull(newValue.data)) {
        this.tags.selected = newValue.data.map(t => t.id)
        this.tags.options = newValue.data.map(t => ({
          ...t,
          label: t.name,
          value: t.id
        }))
      }
    },
    'dialog.item' (newValue, oldValue) {
      if (newValue) {
        const occurrences = this.taskList.success.data.filter(t => t.id === newValue.taskId)[0].occurrences
        if (occurrences.length === 0) {
          this.occurrenceForm.data = null
        }
        else if (occurrences.length === 1) {
          this.occurrenceForm.data = occurrences[0]
        }
        else {
          this.occurrenceForm.data = occurrences.filter(o => isWithinRange(newValue.day, o.begins, o.ends))[0]
        }
      }
      else {
        this.occurrenceForm.data = null
      }
    },
    'dialog.item.to' (newValue, oldValue) {
      if (oldValue !== undefined || newValue === oldValue) {
        this.occurrenceForm.data[oldValue] = this.occurrenceForm.data[oldValue].filter(d => !isSameDay(d, this.dialog.item.day))
        this.occurrenceForm.data[newValue].push(this.dialog.item.day)
        this.occurrenceForm.data[newValue] = uniqDates(this.occurrenceForm.data[newValue].map(parse)).sort(compareAsc)
      }
    },
    'occurrenceForm.success' (newValue) {
      if (!_.isNull(newValue)) {
        this.setOccurrence(null)
        this.$q.notify({
          message: `${this.pickedTask.title} updated.`,
          color: getTaskColor(this.dialog.item.to),
          icon: getTaskIcon(this.dialog.item.to)
        })
      }
    },
    'occurrenceForm.error' (newValue) {
      if (!_.isNull(newValue)) {
        this.$q.notify({
          message: `Error during ${this.pickedTask.title} update!`,
          color: 'negative',
          icon: getTaskIcon(null)
        })
      }
    }
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
.child.header {
  display: flex;
  flex-flow: row;
  height: 36px;
}

.parent .child.content {
  flex: 1 1 auto;
}
</style>
