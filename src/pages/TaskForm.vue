<template>
  <q-page padding>
    <!-- content -->
    <div class="q-mt-lg" v-if="taskForm.data">
      <!-- title -->
      <div class="row justify-between">
        <q-input class="col-md-10" type="text" label="Title" v-model.trim="taskForm.data.title">
          <template v-slot:before>
            <q-icon name="las la-font" />
          </template>
        </q-input>
        <q-toggle class="self-end" v-model="showNoteInput" label="Add note" />
      </div>
      <!-- note -->
      <q-input v-if="showNoteInput" type="textarea" label="Note" v-model.trim="taskForm.data.note">
        <template v-slot:before>
          <q-icon name="las la-paragraph" />
        </template>
      </q-input>
      <!-- colors -->
      <div class="row">
        <!-- color -->
        <q-input
          v-model="color"
          :rules="['anyColor']"
          class="text-center col-md-6"
          @keyup.enter="addColor"
        >
          <template v-slot:before>
            <q-icon name="las la-fill-drip" />
          </template>
          <template v-slot:append>
            <q-icon name="las la-paint-brush" class="cursor-pointer text-center">
              <q-popup-proxy
                class="text-center"
                transition-show="scale"
                transition-hide="scale"
                style="width:350px"
              >
                <q-color v-model="color" />
                <div class="text-center">
                  <q-btn
                    class="q-my-md"
                    icon="mdi-plus"
                    color="primary"
                    v-close-popup
                    @click="addColor"
                  />
                </div>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <!-- colors -->
        <div class="q-mt-md q-pl-md col-md-6">
          <q-chip
            v-for="(color, index) in taskForm.data.colors"
            :key="color"
            removable
            @remove="removeColor(index)"
            :style="{ backgroundColor: color, border: '0.5px solid black' }"
            :text-color="color === '#FFFFFF' ? 'black' : 'white'"
            :label="color"
          />
        </div>
      </div>
      <!-- tags -->
      <!-- <tag-property-form
        :tags="taskForm.data.tags"
        @add-tag="(id) => {taskForm.data.tags = [...taskForm.data.tags, id]}"
        @remove-tag="(index) => {taskForm.data.tags.splice(index, 1)}"
      />-->
      <!-- occurrences -->
      <q-table
        :data="occurrence.data"
        :columns="occurrence.columns"
        row-key="id"
        :visible-columns="occurrence.visible"
        :selected.sync="occurrence.selected"
        selection="single"
        hide-bottom
      >
        <template v-slot:top-left>
          <strong style="font-size: 1.25em">Occurrences</strong>
          <q-btn
            outline
            class="q-mx-xs"
            size="xs"
            icon="las la-plus"
            color="green"
            @click="occurrence.isModalOpen = true"
          />
        </template>
        <template v-slot:body-cell-begins="props">
          <q-td :props="props">{{ format(props.value, 'MMM do, yyyy HH:mm') }}</q-td>
        </template>
        <template v-slot:body-cell-ends="props">
          <q-td :props="props">{{ format(props.value, 'MMM do, yyyy HH:mm') }}</q-td>
        </template>
        <template v-slot:body-cell-next="props">
          <q-td :props="props">
            <q-badge>{{ props.value.length }}</q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-done="props">
          <q-td :props="props">
            <q-badge>{{ props.value.length }}</q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-failed="props">
          <q-td :props="props">
            <q-badge>{{ props.value.length }}</q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-skipped="props">
          <q-td :props="props">
            <q-badge>{{ props.value.length }}</q-badge>
          </q-td>
        </template>
      </q-table>
      <!-- occurrence-form -->
      <q-dialog
        v-model="occurrence.isModalOpen"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card class="q-pa-md" style="width: 700px; max-width: 80vw;">
          <occurrence-form
            class="modal"
            :is-modal="true"
            :occurrence-property-data="occurrence.propertyData"
            @create-occurrence="createOccurrence"
            @update-occurrence="updateOccurrence"
            @remove-occurrence="removeOccurrence"
          />
        </q-card>
      </q-dialog>
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
/* eslint-disable */
import _ from 'lodash'
import { createNamespacedHelpers } from 'vuex'
import { format, parseISO } from 'date-fns'

import form from '../mixins/form'
import OccurrenceForm from '../pages/OccurrenceForm'
import { findIndexById } from '../services/utils.js'
// import TagPropertyForm from '../components/TagPropertyForm'
const { mapState, mapActions } = createNamespacedHelpers('task')

// TODO: occurrence table
//        - selection
//        - new_occurrences, old_occurrences
// TODO: occurrence modal
//        - create
//        - update
//        - remove
export default {
  name: 'TaskForm',
  mixins: [form],
  components: {
    OccurrenceForm
  },
  data () {
    return {
      formName: 'taskForm',
      showNoteInput: false,
      occurrence: {
        selected: [],
        propertyData: null,
        isModalOpen: false,
        visible: ['begins', 'ends', 'frequency', 'next', 'done', 'failed', 'skipped'],
        columns: [
          { name: 'pk_occurrences', field: 'pk_occurrences', label: 'pk_occurrences' },
          { name: 'begins', field: 'begins', label: 'Begins' },
          { name: 'ends', field: 'ends', label: 'Ends' },
          { name: 'frequency', field: 'frequency', label: 'Frequency' },
          { name: 'n', field: 'n', label: 'N' },
          { name: 'weekdays', field: 'weekdays', label: 'Weekdays' },
          { name: 'next', field: 'next', label: 'Next' },
          { name: 'done', field: 'done', label: 'Done' },
          { name: 'failed', field: 'failed', label: 'Failed' },
          { name: 'skipped', field: 'skipped', label: 'Skipped' },
        ],
        data: []
      },
      color: '#FFFFFF'
    }
  },
  computed: {
    ...mapState({
      taskItem: state => state.item,
      taskForm: state => state.form
    })
  },
  methods: {
    ...mapActions({
      getTask: 'get',
      createTask: 'create',
      updateTask: 'update',
      removeTask: 'remove',
      setTask: 'set'
    }),
    init () {
      if (this.isEdit) {
        this.getTask(this.id)
      } else {
        this.setTask(null)
      }
    },
    save () {
      if (this.$v.taskForm.$invalid) {
        this.$q.notify({
          message: 'Please fill the form correctly.',
          color: 'warning'
        })
      } else {
        if (this.isEdit) {
          this.mode = this.$emitter.modes.UPDATE
          this.updateTask({ id: this.id, data: this.preSave(this.taskForm.data) })
        } else {
          this.mode = this.$emitter.modes.CREATE
          this.createTask(this.preSave(this.taskForm.data))
        }
      }
    },
    erase () {
      this.mode = this.$emitter.modes.REMOVE
      this.removeTask(this.id)
    },
    preSave (data) {
      const id = null
      return {
        ...data,
        occurrences: null,
        old_occurrences: this.occurrence.data.filter(o => o.pk_occurrences).map(o => ({ ...o, id })),
        new_occurrences: this.occurrence.data.filter(o => !o.pk_occurrences).map(o => ({ ...o, id })),
      }
    },
    createOccurrence (item) {
      const id = this.occurrence.data.length > 0 ? _.maxBy(this.occurrence.data, 'id').id + 1 : 1
      this.occurrence.data.push({ ...item, id })
      this.occurrence.isModalOpen = false
    },
    updateOccurrence (item) {
      this.occurrence.data = this.occurrence.data.filter(o => o.id !== item.id)
      this.occurrence.data.push(item)
      this.occurrence.isModalOpen = false

    },
    removeOccurrence (item) {
      this.occurrence.data = this.occurrence.data.filter(o => o.id !== item.id)
      this.occurrence.isModalOpen = false
    },
    addColor () {
      this.taskForm.data.colors = this.taskForm.data.colors ? [...this.taskForm.data.colors, this.color] : [this.color]
      this.color = '#FFFFFF'
    },
    removeColor (index) {
      this.taskForm.data.colors.splice(index, 1)
    },
    format,
    parseISO
  },
  watch: {
    'taskItem.success' (newValue) {
      if (!_.isNull(newValue)) {
        this.setTask(newValue)
        this.occurrence.data = newValue.occurrences.map((o, i) => ({ ...o, id: i + 1 }))
      }
    },
    'taskForm.success' (newValue) {
      if (!_.isNull(newValue)) {
        if (this.isModal) {
          this.$emit(this.$emitter.constructEmitMessage(this.mode, 'task'), newValue)
          this.setTask(null)
          this.$v.taskForm.$reset()
        } else {
          this.$router.push('/tasks')
        }
        this.$q.notify({
          message: this.$emitter.constructNotifyMessage(this.mode, newValue.title),
          color: 'positive'
        })
      }
    },
    'occurrence.selected' (newValue) {
      if (newValue.length === 1) {
        this.occurrence.propertyData = newValue[0]
        this.occurrence.isModalOpen = true
      }
    },
    'occurrence.isModalOpen' (newValue, oldValue) {
      if (newValue === false && oldValue === true) {
        this.occurrence.selected = []
      }
    }
  }
}
</script>

<style >
.modal {
  background-color: ivory;
  border-radius: 20px;
}
</style>