<template>
  <q-page padding>
    <calendar-month />
  </q-page>
</template>

<script>
import CalendarMonth from '../components/CalendarMonth'

export default {
  name: 'PageIndex',
  components: {
    CalendarMonth
  }
}
</script>
