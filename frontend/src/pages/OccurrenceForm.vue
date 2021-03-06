<template>
  <component
    :is="componentId"
    :padding="componentId === 'q-page'"
    :class="(isEmbedded || isModal) ? 'div' : 'q-page'"
  >
    <!-- content -->
    <div :class="{'q-mt-lg': !(isEmbedded || isModal)}" v-if="occurrenceForm.data">
      <q-banner class="bg-teal-11 text-black" rounded>
      <strong> <q-icon name="las la-info-circle" /> Features:</strong>
        <ul>
          <li>A form to create or update an occurrence.</li>
          <li>You can specify various features: interval(start, end), frequency, recurrence time, and based on frequency, there may be other things to specify such as weekdays.</li>
          <li>You are able to see them on the calendar, and quickly change their states in the lists below. You cannot change the status of the upcoming dates.</li>
        </ul>
    </q-banner>
      <div class="row q-mt-lg">
        <!-- begins -->
        <q-input class="col" :value="format(occurrenceForm.data.begins, 'MMM do, yyyy HH:mm')">
          <template v-slot:before>
            <q-icon name="las la-hourglass-start" />
          </template>
          <template v-slot:prepend>
            <q-btn icon="las la-calendar-day" flat>
              <q-popup-proxy
                @before-show="() => { proxy.begins = format(occurrenceForm.data.begins, 'yyyy/MM/dd') }"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="proxy.begins">
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Cancel" color="primary" flat v-close-popup />
                    <q-btn
                      label="OK"
                      color="primary"
                      flat
                      @click="() => {
                        temp =  parse(proxy.begins, 'yyyy/MM/dd', occurrenceForm.data.begins)
                        begins = set(occurrenceForm.data.begins, {year: temp.getFullYear(), month: temp.getMonth(), date: temp.getDate()})
                        occurrenceForm.data.begins = begins
                      }"
                      v-close-popup
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
          </template>
          <template v-slot:append>
            <q-btn icon="las la-clock" flat>
              <q-popup-proxy
                @before-show="() => { proxy.begins = format(occurrenceForm.data.begins, 'HH:mm') }"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="proxy.begins" format24h>
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Cancel" color="primary" flat v-close-popup />
                    <q-btn
                      label="OK"
                      color="primary"
                      flat
                      @click="() => {
                        let temp =  parse(proxy.begins, 'HH:mm', occurrenceForm.data.begins)
                        begins = set(occurrenceForm.data.begins, {hours: temp.getHours(), minutes: temp.getMinutes()})
                        occurrenceForm.data.begins = begins
                      }"
                      v-close-popup
                    />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-btn>
          </template>
        </q-input>
        <!-- ends -->
        <q-input class="col" :value="format(occurrenceForm.data.ends, 'MMM do, yyyy HH:mm')">
          <template v-slot:before>
            <q-icon name="las la-hourglass-end" />
          </template>
          <template v-slot:prepend>
            <q-btn icon="las la-calendar-day" flat>
              <q-popup-proxy
                @before-show="() => { proxy.ends = format(occurrenceForm.data.ends, 'yyyy/MM/dd') }"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="proxy.ends">
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Cancel" color="primary" flat v-close-popup />
                    <q-btn
                      label="OK"
                      color="primary"
                      flat
                      @click="() => {
                        temp =  parse(proxy.ends, 'yyyy/MM/dd', occurrenceForm.data.ends)
                        ends = set(occurrenceForm.data.ends, {year: temp.getFullYear(), month: temp.getMonth(), date: temp.getDate()})
                        occurrenceForm.data.ends = ends
                      }"
                      v-close-popup
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
          </template>
          <template v-slot:append>
            <q-btn icon="las la-clock" flat>
              <q-popup-proxy
                @before-show="() => { proxy.ends = format(occurrenceForm.data.ends, 'HH:mm') }"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="proxy.ends" format24h>
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Cancel" color="primary" flat v-close-popup />
                    <q-btn
                      label="OK"
                      color="primary"
                      flat
                      @click="() => {
                        let temp =  parse(proxy.ends, 'HH:mm', occurrenceForm.data.ends)
                        ends = set(occurrenceForm.data.ends, {hours: temp.getHours(), minutes: temp.getMinutes()})
                        occurrenceForm.data.ends = ends
                      }"
                      v-close-popup
                    />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-btn>
          </template>
        </q-input>
      </div>
      <div class="row">
        <!-- frequency -->
        <q-select
          class="col-md-4 col-xs-12 q-pr-lg text-capitalize"
          label="Frequency"
          v-model="occurrenceForm.data.frequency"
          :options="['once', 'day', 'week', 'month', 'year', 'custom']"
        >
          <template v-slot:before>
            <q-icon name="las la-sync" />
          </template>
        </q-select>
        <!-- n -->
        <q-input
          class="col-md-2 col-xs-12 q-pr-lg"
          input-class="text-center"
          type="number"
          float-label="N"
          v-model="occurrenceForm.data.n"
          min="1"
          align="center"
          :disable="['once', 'custom'].includes(occurrenceForm.data.frequency)"
        >
          <template v-slot:before>
            <q-icon name="las la-hashtag" />
          </template>
        </q-input>
        <!-- nonWorkingDay -->
        <q-select
          class="text-capitalize"
          style="width: 180px"
          label="If On Working Day"
          v-model="occurrenceForm.data.if_on_working_day"
          :options="[null, 'previous', 'closest', 'next']"
          emit-value
          map-options
          v-show="['day', 'month', 'year'].includes(occurrenceForm.data.frequency)"
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
          v-show="['month', 'year'].includes(occurrenceForm.data.frequency)"
        />
        <!-- days -->
        <q-checkbox
          class="col items-end text-capitalize"
          v-model="occurrenceForm.data.weekdays"
          v-for="(item, index) in ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']"
          :key="index"
          :val="item"
          :label="item"
          v-show="['week'].includes(occurrenceForm.data.frequency)"
        />
      </div>
      <!-- calendar -->
      <calendar-month
        class="q-my-md"
        :day="day"
        @change-month="(date) => { day = date }"
        :events="[...occurrenceForm.data['done'].map(d => ({title: 'done', date: d, colors: ['green', 'white']})),
                  ...occurrenceForm.data['skipped'].map(d => ({title: 'skipped', date: d, colors: ['orange', 'white']})),
                  ...occurrenceForm.data['failed'].map(d => ({title: 'failed', date: d, colors: ['red', 'white']})),
                  ...occurrenceForm.data['next'].map(d => ({title: 'next', date: d, colors: ['blue', 'white']}))]"
      />
      <!-- occurrences -->
      <div v-if="!isModal" class="row q-mt-lg">
        <occurrences
          class="col-md-3 col-xs-3"
          v-for="(type, index) in ['done', 'skipped', 'failed', 'next']"
          :key="index"
          :type="type"
          :items="occurrenceForm.data[type]"
          @occurrence-do="(item) => occurrenceForm.data['done'].push(item)"
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
import { parse, format, set, compareAsc } from 'date-fns'

import form from '../mixins/form'
import Occurrences from '../components/Occurrences'
import CalendarMonth from '../components/CalendarMonth'

const { mapState, mapActions } = createNamespacedHelpers('occurrence')

export default {
  name: 'OccurrenceForm',
  mixins: [form],
  props: {
    occurrencePropertyData: {
      type: Object,
      default: null
    }
  },
  components: {
    Occurrences,
    CalendarMonth
  },
  data () {
    return {
      formName: 'occurrenceForm',
      proxy: {
        begins: new Date(),
        ends: new Date()
      },
      day: new Date()
    }
  },
  computed: {
    ...mapState({
      occurrenceItem: state => state.item,
      occurrenceForm: state => state.form
    }),
    isEdit () {
      return !_.isNull(this.id) || !_.isNull(this.occurrencePropertyData)
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
    parse,
    format,
    set,
    init () {
      if (this.isModal) {
        this.setOccurrence(this.occurrencePropertyData)
      } else if (this.isEdit) {
        this.getOccurrence(this.id)
      } else {
        this.setOccurrence(null)
      }
    },
    save () {
      if (this.$v.occurrenceForm.$invalid) {
        this.$q.notify({
          message: 'Please fill the form correctly.',
          color: 'warning'
        })
      } else {
        if (this.isModal) {
          this.mode = this.isEdit ? this.$emitter.modes.UPDATE : this.$emitter.modes.CREATE
          this.$emit(this.$emitter.constructEmitMessage(this.mode, 'occurrence'), { ...this.occurrenceForm.data })
          this.setOccurrence(null)
          this.$v.occurrenceForm.$reset()
        } else if (this.isEdit) {
          this.mode = this.$emitter.modes.UPDATE
          this.updateOccurrence({ id: this.id, data: this.occurrenceForm.data })
        } else {
          this.mode = this.$emitter.modes.CREATE
          this.createOccurrence(this.occurrenceForm.data)
        }
      }
    },
    erase () {
      this.mode = this.$emitter.modes.REMOVE
      if (this.isModal) {
        this.$emit(this.$emitter.constructEmitMessage(this.mode, 'occurrence'), { ...this.occurrenceForm.data })
      } else {
        this.removeOccurrence(this.id)
      }
    },
    changeMonth (date) {
      this.day = date
    },
    addCustomDate ({ type, item }) {
      this.occurrenceForm.data[type] = [
        ...this.occurrenceForm.data[type] ? this.occurrenceForm.data[type] : [],
        item
      ].sort(compareAsc)
    }
  },
  mounted () {
    this.init()
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
        } else {
          this.$router.push('/occurrences')
        }
        this.$q.notify({
          message: this.$emitter.constructNotifyMessage(this.mode, 'Occurrence'),
          color: 'positive',
          icon: 'mdi-check-circle-outline'
        })
      }
    },
    'occurrenceForm.data.frequency' (newValue, oldValue) {
      let weekdays = []
      if (newValue === 'week') {
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
        weekdays = [days[this.occurrenceForm.data.begins.getDay() - 1]]
      }
      this.setOccurrence({
        ...this.occurrenceForm.data,
        repeats: 1,
        is_on_last_day_of_month: false,
        is_on_business_day: false,
        weekdays
      })
    }
  }
}
</script>
