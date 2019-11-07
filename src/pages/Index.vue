<template>
  <q-page class="parent" padding>
    <div class="child content parent">
      <week
        class="child content"
        v-for="(week, wIndex) in periods"
        :key="wIndex"
        :starts="week[0]"
        :ends="week[1]"
      >
        <template v-slot:day="week">
          <day
            class="col"
            v-for="(d, index) in eachDay(week.props.starts, week.props.ends)"
            :key="index"
            :day="d"
            :show-weekdays="wIndex < 1"
            :events="logList.success ? logList.success.data.filter(l => l.when === format(d, 'YYYY-MM-DD')) : []"
          >
            <template v-slot:title>{{ isSameMonth(day, d) ? format(d, 'Do') : format(d, 'MMM Do') }}</template>
            <template v-slot:content="day">
              <q-badge
                class="full-width text-bold cursor-pointer"
                v-for="(log, lIndex) in day.props.events"
                :key="lIndex"
              >{{ log.action }} {{ log.what }}</q-badge>
            </template>
          </day>
        </template>
      </week>
    </div>
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { eachDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, format, isSameDay, parse, isSameMonth } from 'date-fns'

import Week from '../components/Week'
import Day from '../components/Day'

const { mapState, mapActions } = createNamespacedHelpers('log')

export default {
  name: 'PageIndex',
  components: {
    Week,
    Day
  },
  data () {
    return {
      day: new Date()
    }
  },
  computed: {
    ...mapState({
      logList: state => state.list
    }),
    periods () {
      const start = startOfWeek(startOfMonth(this.day), { weekStartsOn: 1 })
      const end = endOfWeek(endOfMonth(this.day), { weekStartsOn: 1 })
      let ranges = [[start, endOfWeek(start, { weekStartsOn: 1 })]]
      while (addDays(ranges[ranges.length - 1][0], 7) < end) {
        let s = addDays(ranges[ranges.length - 1][0], 7)
        let e = endOfWeek(s, { weekStartsOn: 1 })
        ranges.push([s, e])
      }
      return ranges
    }
  },
  methods: {
    ...mapActions({
      findLogs: 'find'
    }),
    format,
    eachDay,
    isSameDay,
    parse,
    isSameMonth
  },
  mounted () {
    this.findLogs()
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
