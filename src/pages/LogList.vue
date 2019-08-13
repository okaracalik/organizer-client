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
            <tag-property-list :tagIds="item.tags" />
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ format(item.when, 'DD.MM.YY') }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.action }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ item.what }}
            <span v-for="(h, hIndex) in item.how" :key="hIndex">{{ h }}</span>
            <span v-for="(w, wIndex) in item.with" :key="wIndex">{{ w }}</span>
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.where }}</q-item-label>
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
import { format } from 'date-fns'

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
    }),
    format
  },
  created () {
    this.findLogs()
  }
}
</script>
