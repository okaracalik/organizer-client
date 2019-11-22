<template>
  <component :is="componentId" :padding="componentId === 'q-page'" :class="componentClass">
    <!-- form -->
    <div class="q-mt-lg" v-if="itemForm.data">
      <!-- description -->
      <q-input label="Description" v-model.trim="itemForm.data.description">
        <template v-slot:before>
          <q-icon name="fas fa-font" />
        </template>
      </q-input>
      <!-- tags -->
      <tag-property-form
        :tags="itemForm.data.tags"
        @add-tag="({ id, data }) => {itemForm.data.tags = [...itemForm.data.tags, data]}"
        @remove-tag="(index) => {itemForm.data.tags.splice(index, 1)}"
        :new-tags="itemForm.data.new_tags"
        @add-new-tag="(data) => {itemForm.data.new_tags = [...itemForm.data.new_tags, data]}"
        @remove-new-tag="(index) => {itemForm.data.new_tags.splice(index, 1)}"
      />
      <!-- buttons -->
      <form-action-buttons
        :isModal="isModal"
        :isEdit="isEdit"
        @form-save="save"
        @form-cancel="cancel"
        @form-erase="erase"
      />
    </div>
  </component>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { isNull } from 'lodash'
import form from '../mixins/form'
import TagPropertyForm from '../components/TagPropertyForm'

const { mapState, mapActions } = createNamespacedHelpers('item')

export default {
  name: 'ItemForm',
  mixins: [form],
  components: {
    TagPropertyForm
  },
  data () {
    return {
      formName: 'itemForm'
    }
  },
  computed: {
    ...mapState({
      itemItem: state => state.item,
      itemForm: state => state.form
    })
  },
  methods: {
    ...mapActions({
      getItem: 'get',
      createItem: 'create',
      updateItem: 'update',
      removeItem: 'remove',
      setItem: 'set'
    }),
    init () {
      if (this.isEdit) {
        this.getItem(this.id)
      }
      else {
        this.setItem(null)
      }
    },
    save () {
      if (this.$v.itemForm.$invalid) {
        this.$q.notify({
          message: 'Please fill the form correctly.',
          color: 'warning'
        })
      }
      else {
        if (this.isEdit) {
          this.mode = this.$emitter.modes.UPDATE
          this.updateItem({ id: this.id, data: this.itemForm.data })
        }
        else {
          this.mode = this.$emitter.modes.CREATE
          this.createItem(this.itemForm.data)
        }
      }
    },
    erase () {
      this.mode = this.$emitter.modes.REMOVE
      this.removeItem(this.id)
    }
  },
  watch: {
    'itemItem.success' (newValue) {
      if (!isNull(newValue)) {
        this.setItem(newValue)
      }
    },
    'itemForm.success' (newValue) {
      if (!isNull(newValue)) {
        if (this.isModal) {
          this.$emit(this.$emitter.constructEmitMessage(this.mode, 'item'), newValue)
          this.setItem(null)
          this.$v.itemForm.$reset()
        }
        else {
          this.$router.push('/items')
        }
        this.$q.notify({
          message: this.$emitter.constructNotifyMessage(this.mode, 'Item'),
          color: 'positive'
        })
      }
    }
  }
}
</script>
