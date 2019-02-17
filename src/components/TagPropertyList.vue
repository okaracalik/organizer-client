<template>
  <draggable v-model="tags" :options="{handle: '.tag-props'}" @start="drag=true" @end="drag=false" element="span">
    <q-chip
      v-for="(tag, index) in tags"
      v-bind:key="tag.name"
      @click="() => editable ? tag.active = !tag.active : ''"
      :closable="editable"
      @hide="remove(index)"
      :class="[!tag.active ? 'lower-opacity' : '', 'tag-props']"
      :style="getColors(tag.colors)"
    >{{ tag.name }}</q-chip>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'TagPropertyList',
  components: {
    draggable
  },
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
  methods: {
    remove (index) {
      this.tags.splice(index, 1)
    },
    getColors (colors) {
      return {
        backgroundColor: colors && colors.length > 0 ? colors[0] : '#000',
        color: colors && colors.length > 1 ? colors[1] : '#FFF',
        cursor: 'grab'
      }
    }
  }
}
</script>
