<template>
  <div>
    <q-select
      class="q-mb-xs"
      label="Tag"
      v-model="terms"
      use-input
      hide-selected
      fill-input
      input-debounce="1"
      :options="options"
      @filter="searchTag"
      hide-dropdown-icon
      hint="Please type at least 2 characters to search "
    >
      <template v-slot:before>
        <q-icon name="fas fa-tag" />
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
    <tag-property-list
      class="q-my-md"
      :tagIds="tags"
      :editable="true"
      @remove-tag="(index) => $emit('remove-tag', index)"
    />
  </div>
</template>

<script>
import _ from 'lodash'

import Search from '../services/search'
import TagPropertyList from './TagPropertyList'

export default {
  name: 'TagPropertyForm',
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  components: {
    TagPropertyList
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
    searchTag (terms, update, abort) {
      if (terms.length < 2) {
        abort()
        return
      }
      update(() => {
        Search.apply('tags', terms).then((res) => {
          this.isListEmpty = _.isEqual(res.data.total, 0)
          this.options = Search.prepareSearchResult(res, ['colors', 'enabled'])
        }).catch((err) => {
          this.$q.notify({
            message: `${err}.`,
            color: 'negative',
            icon: 'mdi-close-circle',
            timeout: 0,
            closeBtn: true
          })
        })
      })
    }
  },
  watch: {
    terms (newValue) {
      if (_.has(newValue, 'id')) {
        this.$emit('add-tag', newValue.id)
        this.terms = ''
      }
    }
  }
}
</script>
