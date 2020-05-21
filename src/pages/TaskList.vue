<template>
  <q-page padding>
    <!-- content -->
    <q-table
      grid
      title="Tasks"
      :data="taskList.success.data"
      :columns="columns"
      :row-key="uniqueKey"
      :filter="filter"
      :pagination.sync="pagination"
      @request="onRequest"
    >
      <!-- search -->
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <!-- body -->
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-2">
          <q-card class="cursor-pointer" @click="$router.push(`/tasks/${props.row.pk_tasks}`)">
            <q-card-section class="text-center">
              <strong>{{ props.row.title }}</strong>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
    <!-- fab -->
    <floating-action-button next="/tasks/new" />
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import FloatingActionButton from '../components/FloatingActionButton'

const { mapState, mapActions } = createNamespacedHelpers('task')

export default {
  name: 'TaskList',
  mixins: [],
  props: {},
  components: {
    FloatingActionButton
  },
  data () {
    return {
      filter: '',
      pagination: {
        page: 1,
        rowsPerPage: 30,
        rowsNumber: 1
      },
      uniqueKey: 'pk_tasks',
      columns: [
        { name: 'title', field: 'title', label: 'Title' },
        { name: 'colors', field: 'colors', label: 'Colors' }
      ]
    }
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
    onRequest (props) {
      const search = props.filter === '' ? null : props.filter
      const { page, rowsPerPage } = props.pagination
      this.findTasks({ params: { $skip: (page - 1) * rowsPerPage, $limit: rowsPerPage, search } })
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.filter = search
    }
  },
  mounted () {
    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    })
  },
  watch: {
    'taskList.success' (newValue) {
      this.pagination.rowsNumber = newValue.total
    }
  }
}
</script>
