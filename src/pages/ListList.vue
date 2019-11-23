<template>
  <q-page padding>
    <!-- content -->
    <q-list v-if="listList.success" bordered separator>
      <q-item
        v-for="(item, index) in listList.success.data"
        :key="index"
        @click.native="$router.push(`/lists/${item.pk_lists}`)"
        tag="a"
        clickable
      >
        <q-item-section>
          <q-item-label>
            {{ item.title }}
            <tag-property-list :tags="sortBy(item.tags, t => t.name)" />
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label>
            <q-chip
              icon="fa fa-times"
              color="red"
              text-color="white"
            >{{ item.items.filter(i => !i.list_items.checked && i.list_items.enabled).length }}</q-chip>
            <q-chip
              icon="fa fa-check"
              color="green"
              text-color="white"
            >{{ item.items.filter(i => i.list_items.checked && i.list_items.enabled).length }}</q-chip>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <!-- fab -->
    <floating-action-button next="/lists/new" />
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { sortBy } from 'lodash'
const { mapState, mapActions } = createNamespacedHelpers('list')

import FloatingActionButton from '../components/FloatingActionButton'
import TagPropertyList from '../components/TagPropertyList'

export default {
  name: 'ListList',
  components: {
    FloatingActionButton,
    TagPropertyList
  },
  computed: {
    ...mapState({
      listList: state => state.list
    })
  },
  methods: {
    ...mapActions({
      findLists: 'find'
    }),
    sortBy
  },
  created () {
    this.findLists({ params: { '$sort[pk_lists]': 1 } })
  }
}
</script>
