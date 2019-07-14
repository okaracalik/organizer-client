<template>
  <q-page padding>
    <!-- content -->
    <q-list v-if="taskList.success" bordered separator>
      <q-item-label header>Tasks</q-item-label>
      <q-item v-for="(item, index) in sortedTasks" :key="index">
        <q-item-section>
          <q-item-label>{{ item.title }}</q-item-label>
          <q-item-label caption>{{ item.description }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ format(item.next[0], 'DD.MM.YYYY') }}</q-item-label>
          <q-item-label
            caption
          >{{ distanceInWords(item.next[0], new Date()) }} {{ getDueSituation(item.next[0]) }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-chip color="blue-10" text-color="white">{{ item.next.length }}</q-chip>
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-chip color="green-10" text-color="white">{{ item.succeeded.length }}</q-chip>
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-chip color="red-10" text-color="white">{{ item.failed.length }}</q-chip>
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-chip color="deep-orange-10" text-color="white">{{ item.skipped.length }}</q-chip>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div>
            <q-btn
              icon="mdi-subdirectory-arrow-left"
              @click="$router.push(`/tasks/new?parent_id=${item.id}&path=${item.path}`)"
            />
            <q-btn icon="mdi-pencil" @click="$router.push(`/tasks/${item.id}`)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <!-- fab -->
    <floating-action-button next="/tasks/new" />
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { sortBy, union } from 'lodash'
import { distanceInWords, format, isAfter } from 'date-fns'

const { mapState, mapActions } = createNamespacedHelpers('task')

import FloatingActionButton from '../components/FloatingActionButton'

export default {
  name: 'TaskList',
  components: {
    FloatingActionButton
  },
  computed: {
    ...mapState({
      taskList: state => state.list
    }),
    sortedTasks () {
      const temp = this.taskList.success.data.map(t => ({
        ...t,
        next: union(...t.occurrences.map(o => o.next)),
        succeeded: union(...t.occurrences.map(o => o.succeeded)),
        skipped: union(...t.occurrences.map(o => o.skipped)),
        failed: union(...t.occurrences.map(o => o.failed))
      }))
      return sortBy(temp, [(o) => o.next[0]])
    }
  },
  methods: {
    ...mapActions({
      findTasks: 'find'
    }),
    getDueSituation (d) {
      return isAfter(d, new Date()) ? 'left.' : 'passed.'
    },
    distanceInWords,
    format
  },
  created () {
    this.findTasks()
  }
}
</script>
