<template>
  <div>
    <!-- FIXME -->
    <q-field :error="isNoResult" error-label="You can add new by clicking plus icon.">
      <q-search
        stack-label="Tag"
        v-model="term"
        placeholder="Please start typing tag name."
        :after="[{
            icon:'fas fa-plus-circle',
            handler () {
              isModalOpen = true
            }
          }, {
            icon:'fas fa-times-circle',
            content: true,
            handler () {
              term = ''
              isNoResult = false
            }
          }]"
        :error="isNoResult"
        :autofocus="focus"
      >
        <q-autocomplete
          separator
          :min-characters="2"
          :static-data="{field: 'name', list: tagOptions }"
          :filter="myFilter"
          @selected="selected"
        />
      </q-search>
    </q-field>
    <tag-property-list :tags="tags" :editable="true"/>
    <q-modal :content-css="{height: 'auto', width: 'auto'}" v-model="isModalOpen" minimized>
      <tag-form :is-modal="true" @close-tag-modal="selected"/>
    </q-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import { createNamespacedHelpers } from 'vuex'
import TagForm from '../pages/TagForm'
import TagPropertyList from './TagPropertyList'

const { mapState, mapActions } = createNamespacedHelpers('tag')

// TODO: autofocus
export default {
  name: 'TagPropertyForm',
  components: {
    TagForm,
    TagPropertyList
  },
  props: {
    tags: {
      type: Array,
      required: true
    },
    focus: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      term: '',
      isModalOpen: false
    }
  },
  computed: {
    ...mapState({
      tagList: state => state.list
    }),
    tagOptions () {
      return _.map(this.tagList.success, i => ({
        ...i,
        label: i.name,
        icon: 'fas fa-tag',
        leftColor: i.color
      }))
    },
    isNoResult () {
      return this.tagOptions.length < 1
    }
  },
  methods: {
    ...mapActions({
      findTags: 'find'
    }),
    selected (item, keyboard) {
      if (!keyboard && item) {
        this.tags.push({
          name: item.name,
          colors: item.colors,
          active: item.active
        })
        this.isModalOpen = false
        this.term = ''
      }
    },
    myFilter (terms, { field, list }) {
      const token = terms.toLowerCase()
      return list.filter(item => item.name.toLowerCase().search(new RegExp(token, 'g')) > -1)
    }
  },
  created () {
    this.findTags()
  }
}
</script>
