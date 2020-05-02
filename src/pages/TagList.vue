<template>
  <q-page padding>
    <!-- content -->
    <q-table
      grid
      title="Tags"
      :data="tagList.success.data"
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
            :style="{ backgroundColor: props.row.colors[0], color: props.row.colors[1]}"
            class="cursor-pointer"
            @click="$router.push(`/tags/${props.row.pk_tags}`)"
          >
            <q-card-section class="text-center">
              <strong>{{ props.row.title }}</strong>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
    <!-- fab -->
    <floating-action-button next="/tags/new" />
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import FloatingActionButton from '../components/FloatingActionButton'

const { mapState, mapActions } = createNamespacedHelpers('tag')

export default {
  name: 'TagList',
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
      uniqueKey: 'pk_tags',
      columns: [
        { name: 'title', field: 'title', label: 'Title' },
        { name: 'colors', field: 'colors', label: 'Colors' }
      ]
    }
  },
  computed: {
    ...mapState({
      tagList: state => state.list
    })
  },
  methods: {
    ...mapActions({
      findTags: 'find'
    }),
    onRequest (props) {
      const search = props.filter === '' ? null : props.filter
      const { page, rowsPerPage } = props.pagination
      this.findTags({ params: { $skip: (page - 1) * rowsPerPage, $limit: rowsPerPage, search } })
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
    'tagList.success' (newValue) {
      this.pagination.rowsNumber = newValue.total
    }
  }
}
</script>
