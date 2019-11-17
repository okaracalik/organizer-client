<template>
  <q-page padding>
    <!-- content -->
    <q-list v-if="itemList.success" bordered separator>
      <q-item
        v-for="(item, index) in itemList.success.data"
        :key="index"
        @click.native="$router.push(`/items/${item.pk_items}`)"
        tag="a"
        clickable
      >
        <q-item-section>
          <q-item-label>{{ item.pk_items }} | {{ item.description }} <tag-property-list :tags="item.tags" /></q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <!-- fab -->
    <floating-action-button next="/items/new" />
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('item')

import FloatingActionButton from '../components/FloatingActionButton'
import TagPropertyList from '../components/TagPropertyList'

export default {
  name: 'ItemList',
  components: {
    FloatingActionButton,
    TagPropertyList
  },
  computed: {
    ...mapState({
      itemList: state => state.list
    })
  },
  methods: {
    ...mapActions({
      findItems: 'find'
    })
  },
  created () {
    this.findItems({ params: { '$sort[pk_items]': -1 } })
  }
}
</script>
