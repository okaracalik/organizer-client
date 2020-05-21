<template>
  <q-page padding>
    <!-- content -->
    <q-table
      grid
      title="Occurrences"
      :data="occurrenceList.success.data"
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
        { name: 'begins', field: 'begins', label: 'begins' },
        { name: 'ends', field: 'ends', label: 'ends' },
        { name: 'frequency', field: 'frequency', label: 'frequency' },
        { name: 'weekdays', field: 'weekdays', label: 'weekdays' },
        { name: 'next', field: 'next', label: 'next' },
        { name: 'done', field: 'next', label: 'next' },
        { name: 'failed', field: 'failed', label: 'failed' },
        { name: 'skipped', field: 'skipped', label: 'skipped' }
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
