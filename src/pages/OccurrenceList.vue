<template>
  <q-page padding>
    <!-- content -->
    <div class="row" v-if="occurrenceList.success">
      <q-list>
        <q-item v-for="item in occurrenceList.success" v-bind:key="item.id" @click.native="$router.push(`/occurrences/${item._id}`)">
          {{ item._id }} | {{ item.begins }} | {{ item.ends }} | {{ item.repeats }} | {{ item.frequency }} | {{ item.isOnLastDayOfMonth }} | {{ item.weekdays }} | {{ item.next.length }} | {{ item.succeeded.length }} | {{ item.failed.length }} | {{ item.skipped.length }}
        </q-item>
      </q-list>
    </div>
    <pre>
      {{occurrenceList.success}}
    </pre>
    <!-- fab -->
    <q-btn
      fab
      round
      color="primary"
      class="fixed"
      style="right: 18px; bottom: 18px"
      @click="$router.push('/occurrences/new')"
      icon="fas fa-plus"
    />
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('occurrence')

export default {
  name: 'OccurrenceList',
  computed: {
    ...mapState({
      occurrenceList: state => state.list
    })
  },
  methods: {
    ...mapActions({
      findOccurrences: 'find'
    })
  },
  created () {
    this.findOccurrences()
  }
}
</script>
