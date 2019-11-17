<template>
  <q-page padding>
    <!-- content -->
    <div class="q-mt-lg" v-if="listForm.data">
      <!-- title -->
      <q-input class="col-md-10" type="text" label="Title" v-model.trim="listForm.data.title">
        <template v-slot:before>
          <q-icon name="fas fa-font" />
        </template>
      </q-input>
      <!-- tags -->
      <tag-property-form
        :tags="listForm.data.tags"
        @add-tag="({ id, data }) => {listForm.data.tags = [...listForm.data.tags, data]}"
        @remove-tag="(index) => {listForm.data.tags.splice(index, 1)}"
        :new-tags="listForm.data.new_tags"
        @add-new-tag="(data) => {listForm.data.new_tags = [...listForm.data.new_tags, data]}"
        @remove-new-tag="(index) => {listForm.data.new_tags.splice(index, 1)}"
      />
      <!-- tags -->
      <item-property-form
        :items="listForm.data.items"
        :new-items="listForm.data.items"
        @add-item="({ id, data }) => {listForm.data.items = [...listForm.data.items, data]}"
        @remove-item="(index) => {listForm.data.items.splice(index, 1)}"
        @move-item="moveItem"
        @check-item="checkItem"
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
  </q-page>
</template>

<script>
import _ from 'lodash'
import { createNamespacedHelpers } from 'vuex'
import form from '../mixins/form'
import TagPropertyForm from '../components/TagPropertyForm'
import ItemPropertyForm from '../components/ItemPropertyForm'

const { mapState, mapActions } = createNamespacedHelpers('list')

export default {
  name: 'ListForm',
  mixins: [form],
  components: {
    TagPropertyForm,
    ItemPropertyForm
  },
  data () {
    return {
      formName: 'listForm'
    }
  },
  computed: {
    ...mapState({
      listItem: state => state.item,
      listForm: state => state.form
    })
  },
  methods: {
    ...mapActions({
      getList: 'get',
      createList: 'create',
      updateList: 'update',
      removeList: 'remove',
      setList: 'set'
    }),
    init () {
      if (this.isEdit) {
        this.getList(this.id)
      }
      else {
        this.setList(null)
      }
    },
    save () {
      if (this.$v.listForm.$invalid) {
        this.$q.notify({
          message: 'Please fill the form correctly.',
          color: 'warning'
        })
      }
      else {
        if (this.isEdit) {
          this.mode = this.$emitter.modes.UPDATE
          this.updateList({ id: this.id, data: this.listForm.data })
        }
        else {
          this.mode = this.$emitter.modes.CREATE
          this.createList(this.listForm.data)
        }
      }
    },
    erase () {
      this.mode = this.$emitter.modes.REMOVE
      this.removeList(this.id)
    },
    moveItem (data) {
      console.log(data)
      data.forEach(it => {
        let i = _.findIndex(this.listForm.data.items, o => o.pk_items === it.pk_items)
        this.listForm.data.items[i] = it
      })
      console.log(this.listForm.data.items.map(i => ({ d: i.description, i: i.list_items.order, l: i.list_items.checked })))
    },
    checkItem ({ data, mode, checked }) {
      console.log(data)
      let i = _.findIndex(this.listForm.data.items, o => o.pk_items === data.pk_items)
      data.list_items.checked = checked
      if (mode === 'Append') {
        data.list_items.order = _.maxBy(this.listForm.data.items.filter(i => i.list_items.checked === checked), o => o.list_items.order).list_items.order + 1
      }
      else {
        data.list_items.order = _.minBy(this.listForm.data.items.filter(i => i.list_items.checked === checked), o => o.list_items.order).list_items.order - 1
      }
      this.listForm.data.items[i] = data
      const c = _.sortBy(this.listForm.data.items.filter(i => i.list_items.checked === checked), o => o.list_items.order).map((item, index) => {
        return { ...item, list_items: { ...item.list_items, order: index } }
      })
      const u = _.sortBy(this.listForm.data.items.filter(i => i.list_items.checked !== checked), o => o.list_items.order).map((item, index) => {
        return { ...item, list_items: { ...item.list_items, order: index } }
      })
      this.listForm.data.items = [...u, ...c]
    }
  },
  watch: {
    'listItem.success' (newValue) {
      if (!_.isNull(newValue)) {
        this.setList(newValue)
      }
    },
    'listForm.success' (newValue) {
      if (!_.isNull(newValue)) {
        if (this.isModal) {
          this.$emit(this.$emitter.constructEmitMessage(this.mode, 'list'), newValue)
          this.setList(null)
          this.$v.listForm.$reset()
        }
        else {
          this.$router.push('/lists')
        }
        this.$q.notify({
          message: this.$emitter.constructNotifyMessage(this.mode, newValue.title),
          color: 'positive'
        })
      }
    }
  }
}
</script>
