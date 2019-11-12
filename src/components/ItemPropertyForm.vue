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
    <item-property-list
      class="q-my-md"
      :items="items"
      :new-items="newItems"
      :editable="true"
      @remove-item="(index) => $emit('remove-item', index)"
    />
  </div>
</template>

<script>
import _ from 'lodash'

import Search from '../services/search'
import ItemPropertyList from './ItemPropertyList'

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
      isModalOpen: false
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
    }
  },
  watch: {
    terms (newValue) {
      if (_.has(newValue, 'pk_items')) {
        this.$emit('add-item', { id: newValue.id, data: newValue })
        this.terms = ''
      }
    }
  }
}
</script>
