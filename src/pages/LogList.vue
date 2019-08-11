<template>
  <q-page padding>
    <!-- content -->
    <q-list v-if="logList.success" bordered separator>
      <q-item
        v-for="(item, index) in logList.success.data"
        :key="index"
        @click.native="$router.push(`/logs/${item.id}`)"
        tag="a"
        clickable
      >
        <q-item-section>
          <q-item-label>
            {{ item.id }} | {{ item.when }} | {{ item.action }} | {{ item.what }} | {{ item.where }} | {{ item.how.length }} | {{ item.with.length }} |
            <tag-property-list :tagIds="item.tags" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <pre>
      {{logList.success}}
    </pre>
    <!-- fab -->
    <floating-action-button next="/logs/new" />
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('log')

import FloatingActionButton from '../components/FloatingActionButton'
import TagPropertyList from '../components/TagPropertyList'

export default {
  name: 'LogList',
  components: {
    FloatingActionButton,
    TagPropertyList
  },
  computed: {
    ...mapState({
      logList: state => state.list
    })
  },
  methods: {
    ...mapActions({
      findLogs: 'find'
    })
  },
  created () {
    this.findLogs()
  }
}
</script>
