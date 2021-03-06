<template>
  <q-page padding>
    <!-- content -->
    <div class="q-mt-lg" v-if="taskForm.data">
      <q-banner class="bg-teal-11 text-black" rounded>
        <strong> <q-icon name="las la-info-circle" /> Features:</strong>
          <ul>
            <li>A form to create or update a task.</li>
            <li>You can specify various features: title, note(if enabled), color, tag and its occurrences.</li>
          </ul>
      </q-banner>
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
      <!-- search-tags -->
      <search
        ref="tagSearch"
        module="tags"
        :config="{ optionLabel: 'title', icon:'las la-tags' }"
        @open-tag-modal="tag.isModalOpen = true"
        @change="createTag"
      />
      <!-- tags -->
      <div class="row q-my-md">
        <q-chip
          removable
          v-for="(tag, index) in tag.data"
          :key="index"
          :label="tag.title"
          :style="{ backgroundColor: tag.colors[0], border: '0.5px solid black'}"
          :text-color="tag.colors.length === 2 ? tag.colors[1] : 'white'"
          @remove="removeTag(tag)"
        />
        <q-chip
          icon="las la-plus-circle"
          label="Add"
          color="blue"
          text-color="white"
          @click="tag.isModalOpen = true"
          class="cursor-pointer"
          clickable
        />
      </div>
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
        <q-card class="q-pa-md" style="width: 950px; max-width: 90vw;">
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
      <!-- tag-form -->
      <q-dialog v-model="tag.isModalOpen" transition-show="slide-up" transition-hide="slide-down">
        <q-card class="q-pa-md" style="width: 750px; max-width: 80vw;">
          <tag-form
            class="modal"
            :is-modal="true"
            :tag-property-data="tag.propertyData"
            @create-tag="createTag"
            @update-tag="updateTag"
            @remove-tag="removeTag"
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
import _ from 'lodash'
import { createNamespacedHelpers } from 'vuex'
import { format, parseISO } from 'date-fns'

import form from '../mixins/form'
import OccurrenceForm from '../pages/OccurrenceForm'
import TagForm from '../pages/TagForm'
import Search from '../components/Search'

const { mapState, mapActions } = createNamespacedHelpers('task')

export default {
  name: 'TaskForm',
  mixins: [form],
  components: {
    OccurrenceForm,
    TagForm,
    Search
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
          { name: 'skipped', field: 'skipped', label: 'Skipped' }
        ],
        data: []
      },
      tag: {
        selected: [],
        propertyData: null,
        isModalOpen: false,
        columns: [
          { name: 'title', field: 'title', label: 'Title' },
          { name: 'colors', field: 'colors', label: 'Colors' }
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
        tags: null,
        old_tags: this.tag.data.filter(o => o.pk_tags).map(o => ({ ...o, id })),
        new_tags: this.tag.data.filter(o => !o.pk_tags).map(o => ({ ...o, id }))
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
    createTag (item) {
      const id = this.tag.data.length > 0 ? _.maxBy(this.tag.data, 'id').id + 1 : 1
      this.tag.data.push({ ...item, id })
      this.tag.isModalOpen = false
      this.$refs.tagSearch.reset()
    },
    updateTag (item) {
      this.tag.data = this.tag.data.filter(o => o.id !== item.id)
      this.tag.data.push(item)
      this.tag.isModalOpen = false
    },
    removeTag (item) {
      this.tag.data = this.tag.data.filter(o => o.id !== item.id)
      this.tag.isModalOpen = false
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
        this.tag.data = newValue.tags.map((o, i) => ({ ...o, id: i + 1 }))
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
