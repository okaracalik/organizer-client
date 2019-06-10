<template>
  <q-page padding v-if="this.occurrenceForm.data">
    <div class="row">
      <!-- begins -->
      <!-- <q-field class="col-md-6 col-xs-12 q-pr-lg" icon="fas fa-hourglass-start">
        <q-date
          type="date"
          float-label="Begins"
          v-model="occurrenceForm.data.begins"
          format="MMM DD, YYYY"
          :first-day-of-week="1"
          :max="occurrenceForm.data.ends"
        />
      </q-field>-->
      <!-- ends -->
      <!-- <q-field class="col-md-6 col-xs-12 q-pr-lg" icon="fas fa-hourglass-end">
        <q-date
          type="date"
          float-label="Ends"
          v-model="occurrenceForm.data.ends"
          format="MMM DD, YYYY"
          :first-day-of-week="1"
          :min="occurrenceForm.data.begins"
        />
      </q-field>-->
    </div>
    <div class="row">
      <!-- repeats -->
      <q-input
        type="number"
        float-label="Repeats"
        v-model="occurrenceForm.data.repeats"
        min="1"
        align="center"
        :disable="!showRepeats"
      >
        <template v-slot:before>
          <q-icon name="fas fa-hashtag"/>
        </template>
      </q-input>
      <!-- frequency -->
      <q-select
        float-label="Frequency"
        v-model="occurrenceForm.data.frequency"
        :options="frequencies"
      >
        <template v-slot:before>
          <q-icon name="fas fa-sync"/>
        </template>
      </q-select>
      <!-- isLastDayOfMonth -->
      <q-field class="items-end">
        <q-toggle
          label="Last Day of Month"
          v-model="occurrenceForm.data.isOnLastDayOfMonth"
          v-show="showIsOnLastDayOfMonth"
        />
      </q-field>
      <!-- days -->
      <q-field class="items-end">
        <q-checkbox
          class="col"
          v-model="occurrenceForm.data.weekdays"
          v-for="(item, index) in days"
          :key="index"
          :val="item.value"
          :label="item.label"
          :disable="!showDays"
          v-show="showDays"
        />
      </q-field>
    </div>
    <!-- occurrences -->
    <!-- <occurrences
      class="q-my-lg"
      :succeeded="occurrenceForm.data.succeeded"
      :skipped="occurrenceForm.data.skipped"
      :next="occurrenceForm.data.next"
    /> -->
  </q-page>
</template>

<script>
/* eslint-disable */
import _ from 'lodash'
import { createNamespacedHelpers } from 'vuex'
import { isLastDayOfMonth, startOfToday, getDay } from 'date-fns'
import Occurrences from '../components/Occurrences'
import form from '../mixins/form'

const { mapState, mapActions } = createNamespacedHelpers('occurrence')

// TODO: (1) date-inputs
// TODO: occurrence view
// TODO: endless
export default {
  name: 'OccurrenceForm',
  mixins: [form],
  components: {
    Occurrences
  },
  data () {
    return {
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
        { label: 'Monday', value: 'mon' },
        { label: 'Tuesday', value: 'tue' },
        { label: 'Wednesday', value: 'wed' },
        { label: 'Thursday', value: 'thu' },
        { label: 'Friday', value: 'fri' },
        { label: 'Saturday', value: 'sat' },
        { label: 'Sunday', value: 'sun' }
      ]
    }
  },
  computed: {
    ...mapState({
      occurrenceItem: state => state.item,
      occurrenceForm: state => state.form
    }),
    showRepeats () {
      return this.occurrenceForm.data && !_.includes(['once'], this.occurrenceForm.data.frequency)
    },
    showIsOnLastDayOfMonth () {
      return this.occurrenceForm.data && _.includes(['month', 'year'], this.occurrenceForm.data.frequency) && isLastDayOfMonth(this.occurrenceForm.data.begins)
    },
    showDays () {
      return this.occurrenceForm.data && _.includes(['week'], this.occurrenceForm.data.frequency)
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
          type: 'warning'
        })
      }
      else {
        if (this.isEdit) {
          this.mode = this.$emitter.modes.UPDATE
          this.updateOccurrence({ id: this.id, data: this.occurrenceForm.data })
        }
        else {
          this.mode = this.$emitter.modes.CREATE
          this.occurrenceForm.data.parent = this.parentId
          this.createOccurrence(this.occurrenceForm.data)
        }
      }
    },
    erase () {
      this.mode = this.$emitter.modes.REMOVE
      this.removeOccurrence(this.id)
    }
  },
  watch: {
    'occurrenceItem.success' (newValue) {
      if (!_.isNull(newValue)) {
        this.setOccurrence(newValue)
      }
    },
    'occurrenceForm.success' (newValue) {
      if (!_.isNull(newValue)) {
        if (this.isModal) {
          this.$emit(this.$emitter.constructEmitMessage(this.mode, 'occurrence'), newValue)
          this.setOccurrence(null)
          this.$v.occurrenceForm.$reset()
        }
        else {
          this.$router.push('/occurrences')
        }
        this.$q.notify({
          message: this.$emitter.constructNotifyMessage(this.mode, 'Occurrence'),
          type: 'positive'
        })
      }
    },
    'showRepeats' (newValue) {
      if (!newValue) {
        this.occurrenceForm.data.repeats = 1
      }
    },
    'showDays' (newValue) {
      if (!newValue) {
        this.occurrenceForm.data.days = []
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
    }
  }
}
</script>
