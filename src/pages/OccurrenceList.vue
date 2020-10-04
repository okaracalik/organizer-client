<template>
  <q-page padding>
    <q-banner class="bg-teal-11 text-black" rounded>
      <strong>
        <q-icon name="las la-info-circle" />Features:
      </strong>
      <ul>
        <li>An overview of your task occurrences.</li>
        <li>Click on a task title to edit the info or status.</li>
      </ul>
    </q-banner>
    <!-- content -->
    <q-table
      class="q-mt-xs"
      title="Occurrences"
      :data="occurrenceList.success.data"
      :columns="columns"
      :row-key="uniqueKey"
      :filter="filter"
      :pagination.sync="pagination"
      @request="onRequest"
    >
      <!-- search -->
      <!-- <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template> -->
      <!-- grid-body -->
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-2">
          <q-card
            class="cursor-pointer"
            @click="$router.push(`/occurrences/${props.row.pk_occurrences}`)"
          >
            <q-card-section class="text-center">
              <div>{{ format(parseISO(props.row.begins), 'MMM do, yyyy HH:mm') }}</div>
              <div>{{ format(parseISO(props.row.ends), 'MMM do, yyyy HH:mm') }}</div>
              <div>{{ props.row.frequency }}</div>
              <div>{{ props.row.weekdays.join(', ') }}</div>
              <div>{{ props.row.next.length }} | {{ props.row.done.length }} | {{ props.row.failed.length }} | {{ props.row.skipped.length }}</div>
            </q-card-section>
          </q-card>
        </div>
      </template>

      <template v-slot:body-cell-task="props">
        <q-td :props="props" class="text-left cursor-pointer" @click="$router.push(`/occurrences/${props.row.pk_occurrences}`)">
          <q-icon name="las la-arrow-right"/> {{props.value}}
        </q-td>
      </template>

      <template v-slot:body-cell-next="props">
        <q-td :props="props">
          <q-badge color="blue-10" :label="props.value.length" />
        </q-td>
      </template>
      <template v-slot:body-cell-done="props">
        <q-td :props="props">
          <q-badge color="green-10" :label="props.value.length" />
        </q-td>
      </template>
      <template v-slot:body-cell-skipped="props">
        <q-td :props="props">
          <q-badge color="deep-orange-10" :label="props.value.length" />
        </q-td>
      </template>
      <template v-slot:body-cell-failed="props">
        <q-td :props="props">
          <q-badge color="red-10" :label="props.value.length" />
        </q-td>
      </template>
    </q-table>
    <!-- fab -->
    <floating-action-button next="/occurrences/new" />
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { format, parseISO } from 'date-fns'
import FloatingActionButton from '../components/FloatingActionButton'

const { mapState, mapActions } = createNamespacedHelpers('occurrence')

// TODO: table design
export default {
  name: 'OccurrenceList',
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
      uniqueKey: 'pk_occurrences',
      columns: [
        { name: 'task', field: (row) => row.tasks[0] ? row.tasks[0].title : null, label: 'Task Title' },
        { name: 'begins', field: 'begins', label: 'Begins', format: (val, row) => format(parseISO(val), 'MMM do, yyyy HH:mm') },
        { name: 'ends', field: 'ends', label: 'Ends', format: (val, row) => format(parseISO(val), 'MMM do, yyyy HH:mm') },
        { name: 'frequency', field: 'frequency', label: 'Frequency' },
        { name: 'weekdays', field: 'weekdays', label: 'Weekdays', format: (val, row) => val.join(', ') },
        { name: 'next', field: 'next', label: 'Next' },
        { name: 'done', field: 'done', label: 'Done' },
        { name: 'failed', field: 'failed', label: 'Failed' },
        { name: 'skipped', field: 'skipped', label: 'Skipped' }
      ]
    }
  },
  computed: {
    ...mapState({
      occurrenceList: state => state.list
    })
  },
  methods: {
    ...mapActions({
      findOccurrences: 'find'
    }),
    onRequest (props) {
      const search = props.filter === '' ? null : props.filter
      const { page, rowsPerPage } = props.pagination
      this.findOccurrences({ params: { $skip: (page - 1) * rowsPerPage, $limit: rowsPerPage, search } })
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.filter = search
    },
    format,
    parseISO
  },
  mounted () {
    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    })
  },
  watch: {
    'occurrenceList.success' (newValue) {
      this.pagination.rowsNumber = newValue.total
    }
  }
}
</script>
