<template>
  <component :is="isEmbedded ? 'div' : 'q-page'" :padding="!isEmbedded">
    <!-- content -->
    <calendar-month @change-month="changeMonth" :day="day" :taskList="taskList.success ? taskList.success.data : []" />
  </component>
</template>

<script>
import CalendarMonth from '../components/CalendarMonth'
import { createNamespacedHelpers } from 'vuex'

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
      day: new Date()
    }
  },
  components: {
    CalendarMonth
  },
  computed: {
    ...mapState({
      taskList: state => state.list
    })
  },
  methods: {
    ...mapActions({
      findTasks: 'find'
    }),
    changeMonth (date) {
      this.day = date
    }
  },
  created () {
    this.findTasks()
  }
}
</script>
