<template>
  <q-page padding>
    <!-- content -->
    <q-list v-if="taskList.success" bordered separator>
      <q-item-label header>Tasks</q-item-label>
      <q-item v-for="(item, index) in taskList.success.data" :key="index">
        <q-item-section>
          <q-item-label>{{ item.title }}</q-item-label>
          <q-item-label caption>{{ item.description }}</q-item-label>
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
    <pre>
    {{ taskList.success }}
    </pre>
    <!-- fab -->
    <floating-action-button next="/tasks/new" />
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

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
