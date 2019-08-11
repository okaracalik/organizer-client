<template>
  <span v-if="tagIds.length > 0 && tags.list">
    <q-chip
      v-for="(item, index) in tags.list.data"
      :key="index"
      :removable="editable"
      :class="[!item.enabled ? 'lower-opacity' : '', 'tag-props']"
      :style="getStyleColors(item.colors)"
      :text-color="item.colors && item.colors.length > 1 ? item.colors[1] : 'white'"
      :label="item.name"
      @click="() => editable ? item.enabled = !item.enabled : ''"
      @remove="$emit('remove-tag', index)"
    />
  </span>
</template>

<script>
import Search from '../services/search'
import { getStyleColors } from '../services/utils'

export default {
  name: 'TagPropertyList',
  props: {
    tagIds: {
      type: Array,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data  () {
    return {
      tags: {
        list: null,
        err: null
      }
    }
  },
  methods: {
    getStyleColors,
    searchTag (tags) {
      console.log('searchTag')
      Search.find('tags', {
        'id[$in]': tags
      }).then(res => {
        this.tags.list = res.data
      }).catch(err => {
        this.tags.err = err.response.data
      })
    }
  },
  created () {
    if (this.tagIds.length > 0) {
      this.searchTag(this.tagIds)
    }
  },
  watch: {
    tagIds (newValue) {
      if (newValue.length > 0) {
        this.searchTag(newValue)
      }
    }
  }
}
</script>
