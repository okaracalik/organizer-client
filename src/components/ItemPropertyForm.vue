<template>
  <div>
    <q-select
      class="q-mb-xs"
      label="Item"
      v-model="terms"
      use-input
      hide-selected
      fill-input
      input-debounce="1"
      :options="options"
      @filter="searchItem"
      hide-dropdown-icon
      hint="Please type at least 2 characters to search "
    >
      <template v-slot:before>
        <q-icon name="mdi-playlist-plus" />
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">No results</q-item-section>
        </q-item>
      </template>
      <template v-slot:append>
        <q-icon
          v-if="isListEmpty"
          class="cursor-pointer"
          name="add"
          @click.stop="isModalOpen = true"
        />
        <q-icon
          v-if="terms !== null"
          class="cursor-pointer"
          name="clear"
          @click.stop="terms = null"
        />
      </template>
    </q-select>
    <div class="row reverse">
      <q-toggle
        :label="mode"
        color="deep-purple"
        false-value="Prepend"
        true-value="Append"
        unchecked-icon="fas fa-reply"
        checked-icon="fas fa-share"
        v-model="mode"
      />
    </div>
    <div class="row" v-if="items.length > 0">
      <item-property-list
        title="Unchecked"
        :items="unchecked"
        @move-item="(data) => $emit('move-item', data)"
        @check-item="(data) => $emit('check-item', { data, mode, checked: true })"
      />
      <item-property-list
        title="Checked"
        :items="checked"
        @move-item="(data) => $emit('move-item', data)"
        @check-item="(data) => $emit('check-item', { data, mode, checked: false })"
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

import Search from '../services/search'
import ItemPropertyList from './ItemPropertyList'

// TODO: fix search/add
export default {
  name: 'ItemPropertyForm',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    newItems: {
      type: Array,
      default: () => []
    }
  },
  components: {
    ItemPropertyList
  },
  data () {
    return {
      terms: null,
      options: [],
      isListEmpty: false,
      isModalOpen: false,
      mode: 'Append'
    }
  },
  computed: {
    unchecked () {
      return _.sortBy(this.items.filter(i => !i.list_items.checked), o => o.list_items.order)
    },
    checked () {
      return _.sortBy(this.items.filter(i => i.list_items.checked), o => o.list_items.order)
    }
  },
  methods: {
    searchItem (terms, update, abort) {
      if (terms.length < 2) {
        abort()
        return
      }
      update(() => {
        Search.apply('items', terms).then((res) => {
          this.isListEmpty = _.isEqual(res.data.total, 0)
          this.options = Search.prepareSearchResult(res, ['pk_items', 's'])
        }).catch((err) => {
          this.$q.notify({
            message: `${err}.`,
            color: 'negative',
            icon: 'mdi-close-circle',
            timeout: 0,
            closeBtn: 'Close me'
          })
        })
      })
    },
    log (evt) {
      this.$emit('move-item', evt.relatedContext.list.map((item, index) => {
        return { ...item, list_items: { ...item.list_items, order: index } }
      }))
      return true
    }
  },
  watch: {
    terms (newValue) {
      if (_.has(newValue, 'pk_items')) {
        /* eslint-disable camelcase */
        const list_items = {
          path: null,
          checked: false,
          order: 0
        }
        this.$emit('add-item', { id: newValue.id, data: { ...newValue, list_items } })
        this.terms = ''
      }
    }
  }
}
</script>
