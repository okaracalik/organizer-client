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
          @click.stop="modal = { isOpen: true, selectedItem: getNewItem(), isEdit: false }"
        />
        <q-icon
          v-if="terms !== null"
          class="cursor-pointer"
          name="clear"
          @click.stop="terms = null"
        />
      </template>
    </q-select>
    <div class="row">
      <item-property-list
        title="Unchecked"
        :items="unchecked"
        @move-item="(data) => $emit('move-item', data)"
        @check-item="(data) => $emit('check-item', { data, checked: true })"
        @enable-item="(data) => $emit('enable-item', data)"
        @pick-item="(data) => { modal = { isOpen: true, selectedItem: { ...getNewItem(), ...data }, isEdit: true } }"
      />
      <item-property-list
        title="Checked"
        :items="checked"
        @move-item="(data) => $emit('move-item', data)"
        @check-item="(data) => $emit('check-item', { data, checked: false })"
        @enable-item="(data) => $emit('enable-item', data)"
        @pick-item="(data) => { modal = { isOpen: true, selectedItem: { ...getNewItem(), ...data }, isEdit: true} }"
      />
    </div>
    <q-dialog v-model="modal.isOpen" transition-show="slide-up" transition-hide="slide-down">
      <list-item-form
        :item="modal.selectedItem"
        :is-edit="modal.isEdit"
        @add-new-item="addNewItem"
        @close-item="closeItem"
        @remove-item="removeItem"
      />
    </q-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

import Search from '../services/search'
import ItemPropertyList from './ItemPropertyList'
import ListItemForm from './ListItemForm'

export default {
  name: 'ItemPropertyForm',
  props: {
    unchecked: {
      type: Array,
      default: () => []
    },
    checked: {
      type: Array,
      default: () => []
    }
  },
  components: {
    ItemPropertyList,
    ListItemForm
  },
  data () {
    return {
      terms: null,
      options: [],
      isListEmpty: false,
      modal: {
        isOpen: false,
        isEdit: false,
        selectedItem: null
      }
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
    getNewItem () {
      return {
        description: '',
        tags: [],
        new_tags: []
      }
    },
    getNewListItem () {
      return {
        path: null,
        checked: false,
        order: null,
        enabled: true
      }
    },
    addNewItem (item) {
      this.$emit('add-new-item', { data: { ...item, list_items: this.getNewListItem() } })
      this.modal = {
        isOpen: false,
        isEdit: false,
        selectedItem: null
      }
    },
    closeItem (item) {
      console.log('CloseItem')
      this.$emit('edit-item', { data: item })
      this.modal = {
        isOpen: false,
        isEdit: false,
        selectedItem: null
      }
    },
    removeItem (item) {
      this.$emit('remove-item', { data: item })
      this.modal = {
        isOpen: false,
        isEdit: false,
        selectedItem: null
      }
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
