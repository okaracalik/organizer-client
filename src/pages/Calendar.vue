<template>
  <component :is="isEmbedded ? 'div' : 'q-page'" :padding="!isEmbedded">
    <!-- content -->
    <calendar-month :taskList="taskList.success ? taskList.success.data : []" />
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
    })
  },
  created () {
    this.findTasks()
  }
}
</script>
