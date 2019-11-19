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
      <div class="row reverse">
        <q-toggle
          color="deep-purple"
          false-value="PREPEND"
          true-value="APPEND"
          unchecked-icon="fas fa-reply"
          checked-icon="fas fa-share"
          v-model="listForm.data.mode"
        />
      </div>
      <!-- items -->
      <item-property-form
        :items="listForm.data.items"
        :new-items="listForm.data.items"
        :us="unchecked"
        :cs="checked"
        @add-item="addItem"
        @add-new-item="addNewItem"
        @remove-item="(index) => {listForm.data.items.splice(index, 1)}"
        @move-item="moveItem"
        @check-item="checkItem"
        @enable-item="enableItem"
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

// TODO: remove item
// TODO: enable item
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
    }),
    unchecked () {
      const temp = [...this.listForm.data.items, ...this.listForm.data.new_items]
      return _.sortBy(temp.filter(i => !i.list_items.checked), o => o.list_items.order)
    },
    checked () {
      const temp = [...this.listForm.data.items, ...this.listForm.data.new_items]
      return _.sortBy(temp.filter(i => i.list_items.checked), o => o.list_items.order)
    }
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
    addItem ({ data }) {
      if (this.listForm.data.mode === 'APPEND') {
        const order = this.unchecked.length > 0 ? this.unchecked[this.unchecked.length - 1].order + 1 : 1
        data.list_items = { ...data.list_items, order }
      }
      else {
        data.list_items = { ...data.list_items, order: -1 }
      }
      this.listForm.data.items.push(data)
      this.sortItems()
    },
    addNewItem ({ data }) {
      if (this.listForm.data.mode === 'APPEND') {
        const order = this.unchecked.length > 0 ? this.unchecked[this.unchecked.length - 1].order + 1 : 1
        data.list_items = { ...data.list_items, order }
      }
      else {
        data.list_items = { ...data.list_items, order: -1 }
      }
      this.listForm.data.new_items.push(data)
      this.sortItems()
    },
    moveItem (items) {
      let i, itemType
      items.forEach(it => {
        if (it.pk_items) {
          itemType = 'items'
          i = _.findIndex(this.listForm.data[itemType], o => o.pk_items === it.pk_items)
        }
        else {
          itemType = 'new_items'
          i = _.findIndex(this.listForm.data[itemType], o => o.description === it.description)
        }
        this.listForm.data[itemType][i] = it
      })
      this.sortItems()
    },
    checkItem ({ data, checked }) {
      let i, itemType, order
      // find item
      if (data.pk_items) {
        itemType = 'items'
        i = _.findIndex(this.listForm.data[itemType], o => o.pk_items === data.pk_items)
      }
      else {
        itemType = 'new_items'
        i = _.findIndex(this.listForm.data[itemType], o => o.description === data.description)
      }
      // adding logic
      if (this.listForm.data.mode === 'APPEND') {
        const group = (checked ? this.checked : this.unchecked)
        order = group.length > 0 ? group[group.length - 1].order + 1 : 1
      }
      else {
        order = -1
      }
      data.list_items = { ...data.list_items, order, checked }
      this.listForm.data[itemType][i] = data
      this.sortItems()
    },
    enableItem (data) {
      let i, itemType
      // find item
      if (data.pk_items) {
        itemType = 'items'
        i = _.findIndex(this.listForm.data[itemType], o => o.pk_items === data.pk_items)
      }
      else {
        itemType = 'new_items'
        i = _.findIndex(this.listForm.data[itemType], o => o.description === data.description)
      }
      data.list_items = { ...data.list_items, enabled: true }
      console.log(data.list_items)
      this.listForm.data[itemType][i] = data
    },
    sortItems () {
      let us = [...this.listForm.data.items.filter(i => !i.list_items.checked), ...this.listForm.data.new_items.filter(i => !i.list_items.checked)]
      let cs = [...this.listForm.data.items.filter(i => i.list_items.checked), ...this.listForm.data.new_items.filter(i => i.list_items.checked)]
      us = _
        .sortBy(us, o => o.list_items.order)
        .map((item, index) => {
          return { ...item, list_items: { ...item.list_items, order: index } }
        })
      cs = _
        .sortBy(cs, o => o.list_items.order)
        .map((item, index) => {
          return { ...item, list_items: { ...item.list_items, order: index } }
        })
      this.listForm.data.items = [...us.filter(i => i.pk_items), ...cs.filter(i => i.pk_items)]
      this.listForm.data.new_items = [...us.filter(i => !i.pk_items), ...cs.filter(i => !i.pk_items)]
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
