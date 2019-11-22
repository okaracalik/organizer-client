<template>
  <q-card class="q-pa-lg" v-if="item">
    <!-- description -->
    <q-input label="Description" v-model.trim="item.description">
      <template v-slot:before>
        <q-icon name="fas fa-font" />
      </template>
    </q-input>
    <!-- tags -->
    <tag-property-form
      :tags="item.tags"
      @add-tag="({ id, data }) => {item.tags = [...item.tags, data]}"
      @remove-tag="(index) => {item.tags.splice(index, 1)}"
      :new-tags="item.new_tags"
      @add-new-tag="(data) => {item.new_tags = [...item.new_tags, data]}"
      @remove-new-tag="(index) => {item.new_tags.splice(index, 1)}"
    />
    <!-- buttons -->
    <form-action-buttons
      :isModal="true"
      :isEdit="isEdit"
      @form-save="save"
      @form-erase="erase"
    />
  </q-card>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import TagPropertyForm from './TagPropertyForm'
import FormActionButtons from './FormActionButtons'

const { mapState, mapActions } = createNamespacedHelpers('item')

export default {
  name: 'ListItemForm',
  components: {
    FormActionButtons,
    TagPropertyForm
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    isEdit: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapState({
      itemForm: state => state.form
    })
  },
  methods: {
    ...mapActions({
      setItem: 'set'
    }),
    save () {
      if (this.isEdit) {
        this.$emit('close-item', this.item)
      }
      else {
        this.$emit('add-new-item', this.item)
      }
    },
    erase () {
      this.$emit('remove-item', this.item)
    }
  },
  watch: {
    item (newValue) {
      console.log(newValue)
      this.setItem(newValue)
    }
  }
}
</script>
