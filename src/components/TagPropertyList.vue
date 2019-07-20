<template>
  <div v-if="tags.length > 0 && tagList.success">
    <q-chip
      v-for="(item, index) in tagList.success.data"
      :key="index"
      :removable="editable"
      :class="[!item.enabled ? 'lower-opacity' : '', 'tag-props']"
      :style="getStyleColors(item.colors)"
      :text-color="item.colors && item.colors.length > 1 ? item.colors[1] : 'white'"
      :label="item.name"
      @click="() => editable ? item.enabled = !item.enabled : ''"
      @remove="$emit('remove-tag', index)"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import { getStyleColors } from '../services/utils'

const { mapState, mapActions } = createNamespacedHelpers('tag')

export default {
  name: 'TagPropertyList',
  props: {
    tags: {
      type: Array,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      tagList: state => state.list
    })
  },
  methods: {
    ...mapActions({
      findTags: 'find'
    }),
    getStyleColors
  },
  created () {
    if (this.tags.length > 0) {
      this.findTags({ params: { 'id[$in]': this.tags } })
    }
  },
  watch: {
    tags (newValue) {
      if (newValue.length > 0) {
        this.findTags({ params: { 'id[$in]': newValue } })
      }
    }
  }
}
</script>
