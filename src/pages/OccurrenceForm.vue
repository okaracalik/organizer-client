<template>
  <component :is="componentId" :padding="componentId === 'q-page'" :class="componentClass">
    <div :class="{'q-mt-lg': !(isEmbedded || isModal)}" v-if="occurrenceForm.data">
      <div class="row q-mt-lg">
        <!-- begins -->
        <q-input class="col-md-6 col-xs-12 q-pr-lg" v-model="occurrenceForm.data.begins">
          <template v-slot:before>
            <q-icon name="fas fa-hourglass-start" />
          </template>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="occurrenceForm.data.begins"
                  mask="YYYY-MM-DD HH:mm"
                  :first-day-of-week="1"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="occurrenceForm.data.begins" mask="YYYY-MM-DD HH:mm" format24h />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <!-- ends -->
        <q-input class="col-md-6 col-xs-12 q-pr-lg" v-model="occurrenceForm.data.ends">
          <template v-slot:before>
            <q-icon name="fas fa-hourglass-end" />
          </template>
          <template v-slot:before>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="occurrenceForm.data.ends"
                  mask="YYYY-MM-DD HH:mm"
                  :first-day-of-week="1"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="occurrenceForm.data.ends" mask="YYYY-MM-DD HH:mm" format24h />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="row">
        <!-- frequency -->
        <q-select
          class="col-md-5 col-xs-12 q-pr-lg"
          label="Frequency"
          v-model="occurrenceForm.data.frequency"
          :options="frequencies"
          emit-value
          map-options
        >
          <template v-slot:before>
            <q-icon name="fas fa-sync" />
          </template>
        </q-select>
        <!-- n -->
        <q-input
          class="col-md-1 col-xs-12 q-pr-lg"
          input-class="text-center"
          type="number"
          float-label="N"
          v-model="occurrenceForm.data.n"
          min="1"
          align="center"
          :disable="!showN"
        >
          <template v-slot:before>
            <q-icon name="fas fa-hashtag" />
          </template>
        </q-input>
        <!-- nonWorkingDay -->
        <q-select
          style="width: 180px"
          label="If On Working Day"
          v-model="occurrenceForm.data.if_on_working_day"
          :options="nonWorkingDayOptions"
          emit-value
          map-options
          v-show="showWorkingDayOption"
        >
          <template v-slot:before>
            <q-icon name="mdi-calendar-search" />
          </template>
        </q-select>
        <!-- isLastDayOfMonth -->
        <q-toggle
          class="items-end"
          label="Last Day of Month"
          v-model="occurrenceForm.data.is_on_last_day_of_month"
          v-show="showIsOnLastDayOfMonth"
        />
        <!-- days -->
        <q-checkbox
          class="col items-end"
          v-model="occurrenceForm.data.weekdays"
          v-for="(item, index) in days"
          :key="index"
          :val="item.value"
          :label="item.label"
          :disable="!showDays"
          v-show="showDays"
        />
      </div>
      <!-- calendar -->
      <calendar-month
        class="q-my-md"
        @change-month="changeMonth"
        :day="day"
        :taskList="[{ title: 'Event', occurrences: [occurrenceForm.data]}]"
      />
      <!-- occurrences -->
      <div class="row q-mt-lg">
        <occurrences
          class="col-md-3"
          v-for="(type, index) in ['succeeded', 'skipped', 'failed', 'next']"
          :key="index"
          :type="type"
          :items="occurrenceForm.data[type]"
          @occurrence-succeed="(item) => occurrenceForm.data['succeeded'].push(item)"
          @occurrence-skip="(item) => occurrenceForm.data['skipped'].push(item)"
          @occurrence-fail="(item) => occurrenceForm.data['failed'].push(item)"
          @add-custom-date="addCustomDate"
        />
      </div>
      <!-- buttons -->
      <form-action-buttons
        :isModal="isModal"
        :isEmbedded="isEmbedded"
        :isEdit="isEdit"
        @form-save="save"
        @form-cancel="cancel"
        @form-erase="erase"
      />
    </div>
  </component>
</template>

<script>
import _ from 'lodash'
import { createNamespacedHelpers } from 'vuex'
import { isLastDayOfMonth, startOfToday, getDay, compareAsc } from 'date-fns'
import Occurrences from '../components/Occurrences'
import CalendarMonth from '../components/CalendarMonth'
import form from '../mixins/form'

const { mapState, mapActions } = createNamespacedHelpers('occurrence')

// TODO: problem on loading edit form
export default {
  name: 'OccurrenceForm',
  mixins: [form],
  components: {
    Occurrences,
    CalendarMonth
  },
  data () {
    return {
      day: new Date(),
      formName: 'occurrenceForm',
      frequencies: [
        { label: 'Once', value: 'once' },
        { label: 'Day', value: 'day' },
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
        { label: 'Year', value: 'year' },
        { label: 'Custom', value: 'custom' }
      ],
      days: [
        { label: 'Mon', value: 'mon' },
        { label: 'Tue', value: 'tue' },
        { label: 'Wed', value: 'wed' },
        { label: 'Thu', value: 'thu' },
        { label: 'Fri', value: 'fri' },
        { label: 'Sat', value: 'sat' },
        { label: 'Sun', value: 'sun' }
      ],
      nonWorkingDayOptions: [
        { label: 'None', value: null },
        { label: 'Previous', value: 'previous' },
        { label: 'Closest', value: 'closest' },
        { label: 'Next', value: 'next' }
      ]
    }
  },
  computed: {
    ...mapState({
      occurrenceItem: state => state.item,
      occurrenceForm: state => state.form
    }),
    showN () {
      return this.occurrenceForm.data && !_.includes(['once'], this.occurrenceForm.data.frequency)
    },
    showIsOnLastDayOfMonth () {
      return this.occurrenceForm.data && _.includes(['month', 'year'], this.occurrenceForm.data.frequency) && isLastDayOfMonth(this.occurrenceForm.data.begins)
    },
    showDays () {
      return this.occurrenceForm.data && _.includes(['week'], this.occurrenceForm.data.frequency)
    },
    showWorkingDayOption () {
      return this.occurrenceForm.data && _.includes(['day', 'month', 'year'], this.occurrenceForm.data.frequency)
    }
  },
  methods: {
    ...mapActions({
      getOccurrence: 'get',
      createOccurrence: 'create',
      updateOccurrence: 'update',
      removeOccurrence: 'remove',
      setOccurrence: 'set'
    }),
    init () {
      if (this.isEdit) {
        this.getOccurrence(this.id)
      }
      else {
        this.setOccurrence(null)
      }
    },
    save () {
      if (this.$v.occurrenceForm.$invalid) {
        this.$q.notify({
          message: 'Please fill the form correctly.',
          color: 'warning'
        })
      }
      else {
        if (this.isEdit) {
          this.mode = this.$emitter.modes.UPDATE
          this.updateOccurrence({ id: this.id, data: this.occurrenceForm.data })
        }
        else {
          this.mode = this.$emitter.modes.CREATE
          this.createOccurrence(this.occurrenceForm.data)
        }
      }
    },
    erase () {
      this.mode = this.$emitter.modes.REMOVE
      this.removeOccurrence(this.id)
    },
    changeMonth (date) {
      this.day = date
    },
    addCustomDate ({ type, item }) {
      this.occurrenceForm.data[type] = [
        ...this.occurrenceForm.data[type] ? this.occurrenceForm.data[type] : [],
        item
      ].sort(compareAsc)
    },
    compareAsc
  },
  watch: {
    'occurrenceItem.success' (newValue) {
      if (!_.isNull(newValue)) {
        const weekdays = !newValue.weekdays ? [] : newValue.weekdays
        const next = !newValue.next ? [] : newValue.next
        const skipped = !newValue.skipped ? [] : newValue.skipped
        const failed = !newValue.failed ? [] : newValue.failed
        const succeeded = !newValue.succeeded ? [] : newValue.succeeded
        this.setOccurrence({ ...newValue, weekdays, next, skipped, failed, succeeded })
      }
    },
    'occurrenceForm.success' (newValue) {
      if (!_.isNull(newValue)) {
        if (this.isModal || this.isEmbedded) {
          this.$emit(this.$emitter.constructEmitMessage(this.mode, 'occurrence'), newValue)
          this.setOccurrence(null)
          this.$v.occurrenceForm.$reset()
        }
        else {
          this.$router.push('/occurrences')
        }
        this.$q.notify({
          message: this.$emitter.constructNotifyMessage(this.mode, 'Occurrence'),
          color: 'positive',
          icon: 'mdi-check-circle-outline'
        })
      }
    },
    'showN' (newValue) {
      if (!newValue) {
        this.occurrenceForm.data.n = 1
      }
    },
    'showDays' (newValue) {
      if (!newValue) {
        this.occurrenceForm.data.weekdays = []
      }
    },
    'showIsOnLastDayOfMonth' (newValue) {
      if (!newValue) {
        this.occurrenceForm.data.showIsOnLastDayOfMonth = false
      }
    },
    'occurrenceForm.data.frequency' (newValue, oldValue) {
      if (oldValue === 'week') {
        this.occurrenceForm.data.weekdays = []
      }
      if (newValue === 'week') {
        this.occurrenceForm.data.weekdays = [this.days[getDay(startOfToday()) - 1].value]
      }
    },
    id (newValue, oldValue) {
      if (!_.isEqual(newValue, oldValue)) {
        this.init()
      }
    }
  }
}
</script>
