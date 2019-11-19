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
    <div class="row" v-if="items.length > 0">
      <item-property-list
        title="Unchecked"
        :items="us"
        @move-item="(data) => $emit('move-item', data)"
        @check-item="(data) => $emit('check-item', { data, checked: true })"
        @enable-item="(data) => $emit('enable-item', data)"
      />
      <item-property-list
        title="Checked"
        :items="cs"
        @move-item="(data) => $emit('move-item', data)"
        @check-item="(data) => $emit('check-item', { data, checked: false })"
        @enable-item="(data) => $emit('enable-item', data)"
      />
    </div>
    <q-dialog v-model="isModalOpen" transition-show="slide-up" transition-hide="slide-down">
      <item-form :is-modal="true" :is-property="true" @add-item="addItem" />
    </q-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

import Search from '../services/search'
import ItemPropertyList from './ItemPropertyList'
import ItemForm from './../pages/ItemForm'

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
    },
    us: {
      type: Array,
      default: () => []
    },
    cs: {
      type: Array,
      default: () => []
    }
  },
  components: {
    ItemPropertyList,
    ItemForm
  },
  data () {
    return {
      terms: null,
      options: [],
      isListEmpty: false,
      isModalOpen: false
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
          this.options = Search.prepareSearchResult(res, ['pk_items', 'tags'])
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
    getNewListItem () {
      return {
        path: null,
        checked: false,
        order: null,
        enabled: true
      }
    },
    addItem (data) {
      this.$emit('add-new-item', { data: { ...data, list_items: this.getNewListItem() } })
      this.isModalOpen = false
    }
  },
  watch: {
    terms (newValue) {
      if (_.has(newValue, 'pk_items')) {
        this.$emit('add-item', { data: { ...newValue, list_items: this.getNewListItem() } })
        this.terms = ''
      }
    }
  }
}
</script>
