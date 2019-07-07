<template>
  <q-page padding>
    <!-- content -->
    <q-list v-if="occurrenceList.success" bordered separator>
      <q-item
        v-for="(item, index) in occurrenceList.success.data"
        :key="index"
        @click.native="$router.push(`/occurrences/${item.id}`)"
        tag="a"
        clickable
      >
        <q-item-section>
          <q-item-label>{{ item.id }} | {{ item.begins }} | {{ item.ends }} | {{ item.n }} | {{ item.frequency }} | {{ item.next.length }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <pre>
      {{occurrenceList.success}}
    </pre>
    <!-- fab -->
    <floating-action-button next="/occurrences/new" />
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('occurrence')

import FloatingActionButton from '../components/FloatingActionButton'

export default {
  name: 'OccurrenceList',
  components: {
    FloatingActionButton
  },
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
