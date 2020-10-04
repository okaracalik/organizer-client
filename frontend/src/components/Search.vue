<template>
  <div>
    <q-select
      v-model="terms"
      clearable
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      :options="options"
      :option-label="config.optionLabel"
      hide-dropdown-icon
      @filter="search"
      hint="Please type at least 2 characters to search."
    >
      <template v-slot:before>
        <q-icon :name="config.icon" />
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">No results</q-item-section>
        </q-item>
      </template>
      <template v-if="hasNoResult" v-slot:append>
        <q-icon
          name="add"
          @click.stop="terms = null; $emit('open-tag-modal')"
          class="cursor-pointer"
        />
      </template>
    </q-select>
  </div>
</template>

<script>
import { isNull } from 'lodash'
import Search from '../services/search'

export default {
  name: 'Search',
  props: {
    module: {
      type: String,
      required: true
    },
    config: {
      type: Object,
      required: true
    },
    item: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      terms: null,
      options: [],
      hasNoResult: false
    }
  },
  methods: {
    search (terms, update, abort) {
      if (terms.length < 2) {
        abort()
        return
      }
      update(() => {
        Search.apply(this.module, terms)
          .then(res => {
            this.hasNoResult = res.data.total === 0
            this.options = res.data.data
          })
          .catch(err => {
            this.$q.notify({
              message: `${err.response.errors[0].message}.`,
              color: 'negative',
              icon: 'mdi-close-circle',
              timeout: 0,
              closeBtn: true
            })
          })
      })
    },
    reset () {
      this.terms = null
      this.options = []
      this.hasNoResult = false
    }
  },
  watch: {
    item (newValue) {
      this.terms = newValue
    },
    terms (newValue) {
      if (!isNull(newValue)) {
        this.$emit('change', newValue)
      }
    }
  }
}
</script>
