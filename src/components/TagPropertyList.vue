<template>
  <span v-if="tags.length > 0">
    <q-chip
      v-for="(item, index) in tags"
      :key="index"
      :removable="editable"
      :class="[!item.enabled ? 'lower-opacity' : '', 'cursor-pointer tag-props']"
      :style="getStyleColors(item.colors)"
      :text-color="item.colors && item.colors.length > 1 ? item.colors[1] : 'white'"
      :label="item.name"
      @click.native="editable ? item.enabled = !item.enabled : ''"
      @remove="$emit('remove-tag', index)"
    />
    <q-chip
      v-for="(item, index) in newTags"
      :key="index"
      :removable="editable"
      :class="[!item.enabled ? 'lower-opacity' : '', 'tag-props']"
      :style="getStyleColors(item.colors)"
      :text-color="item.colors && item.colors.length > 1 ? item.colors[1] : 'white'"
      :label="item.name"
      @click.native="editable ? item.enabled = !item.enabled : ''"
      @remove="$emit('remove-new-tag', index)"
    />
  </span>
</template>

<script>
import { getStyleColors } from '../services/utils'

// TODO: disable tag
export default {
  name: 'TagPropertyList',
  props: {
    tags: {
      type: Array,
      required: true
    },
    newTags: {
      type: Array,
      default: () => []
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getStyleColors
  }
}
</script>
