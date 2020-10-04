<template>
  <q-page class="vertically-expanding" padding>
    <calendar-month :day="day"  @change-month="(date) => { day = date }" />
  </q-page>
</template>

<script>
/* eslint-disable */
import CalendarMonth from '../components/CalendarMonth'
import CalendarWeek from '../components/CalendarWeek'

export default {
  name: 'PageIndex',
  components: {
    CalendarMonth,
    CalendarWeek
  },
  data () {
    return {
      day: new Date()
    }
  },
  computed: { },
  methods: { }
}
</script>

<style>
.vertically-expanding {
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  height: 100%;
}

.container-item {
  flex: 1 1 auto;
}
</style>
