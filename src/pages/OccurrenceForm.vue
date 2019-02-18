<template>
  <q-page padding>
    <div class="q-mb-md row justify-between">
      <q-btn color="positive" @click="save()" icon="fas fa-save"/>
      <q-btn v-if="id" color="negative" @click="erase()" icon="fas fa-trash"/>
    </div>
    <hr>
    <div class="row">
      <!-- begins -->
      <q-field class="col-md-6 col-xs-12 q-pr-lg" icon="fas fa-hourglass-start">
        <q-datetime
          type="date"
          float-label="Begins"
          v-model="occurrenceForm.data.begins"
          format="MMM DD, YYYY"
          :first-day-of-week="1"
          :max="occurrenceForm.data.ends"
        />
      </q-field>
      <!-- ends -->
      <q-field class="col-md-6 col-xs-12 q-pr-lg" icon="fas fa-hourglass-end">
        <q-datetime
          type="date"
          float-label="Ends"
          v-model="occurrenceForm.data.ends"
          format="MMM DD, YYYY"
          :first-day-of-week="1"
          :min="occurrenceForm.data.begins"
        />
      </q-field>
    </div>
    <div class="row">
      <!-- repeats -->
      <q-field class="col-md-1 col-xs-12 q-pr-lg" icon="fas fa-hashtag">
        <q-input
          type="number"
          float-label="Repeats"
          v-model="occurrenceForm.data.repeats"
          min="1"
          align="center"
          :disable="!showRepeats"
        />
      </q-field>
      <!-- frequency -->
      <q-field class="col-md-5 col-xs-12 q-pr-lg" icon="fas fa-sync-alt">
        <q-select
          float-label="Frequency"
          v-model="occurrenceForm.data.frequency"
          :options="frequencies"
        />
      </q-field>
      <!-- isLastDayOfMonth -->
      <q-field class="items-center">
        <q-toggle
          label="Last Day of Month"
          v-model="occurrenceForm.data.isOnLastDayOfMonth"
          v-show="showIsOnLastDayOfMonth"
        />
      </q-field>
    </div>
    <!-- days -->
    <q-field class="col-md-12 col-xs-12 q-my-lg">
      <q-select
        chips
        multiple
        v-model="occurrenceForm.data.weekdays"
        :options="days"
        :disable="!showDays"
        v-show="showDays"
      />
    </q-field>
    <!-- occurrences -->
    <occurrences
      :succeeded="occurrenceForm.data.succeeded"
      :skipped="occurrenceForm.data.skipped"
      :next="occurrenceForm.data.next"
    />
  </q-page>
</template>

<script>
import _ from 'lodash'
import { createNamespacedHelpers } from 'vuex'
import { isLastDayOfMonth } from 'date-fns'
import Occurrences from '../components/Occurrences'
import form from '../mixins/form'

const { mapState, mapActions } = createNamespacedHelpers('occurrence')

// TODO: endless
// TODO: custom date
// TODO: occurrence on edit
// TODO: better day selection
// TODO: occurrence views
export default {
  name: 'OccurrenceForm',
  mixins: [form],
  components: {
    Occurrences
  },
  data () {
    return {
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
      return !_.includes(['once'], this.occurrenceForm.data.frequency)
    },
    showIsOnLastDayOfMonth () {
      return _.includes(['month', 'year'], this.occurrenceForm.data.frequency) && isLastDayOfMonth(this.occurrenceForm.data.begins)
    },
    showDays () {
      return _.includes(['week'], this.occurrenceForm.data.frequency)
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
    }
  },
  created () {
    this.init()
  },
  validations: {
    occurrenceForm: {
      data: {
        begins: { },
        ends: { },
        repeats: { },
        frequency: { },
        isOnLastDayOfMonth: { },
        weekdays: { },
        next: { },
        succeeded: { },
        failed: { },
        skipped: { }
      }
    }
  }
}
</script>
