<template>
  <q-page padding>
    <!-- content -->
    <div class="q-mt-lg" v-if="taskForm.data">
      <!-- title -->
      <div class="row justify-between">
        <q-input class="col-md-10" type="text" label="Title" v-model.trim="taskForm.data.title">
          <template v-slot:before>
            <q-icon name="fas fa-font" />
          </template>
          <template v-slot:prepend>
            <q-icon name="far fa-smile" class="cursor-pointer text-center">
              <q-popup-proxy
                class="text-center"
                transition-show="scale"
                transition-hide="scale"
                style="width:350px"
              >
                <picker set="google" @select="(emoji) => taskForm.data.title += emoji.native" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-toggle class="self-end" v-model="showDescriptionInput" label="Show Description Field" />
      </div>
      <!-- description -->
      <q-input
        v-if="showDescriptionInput"
        type="textarea"
        label="Description"
        v-model.trim="taskForm.data.description"
      >
        <template v-slot:before>
          <q-icon name="fas fa-paragraph" />
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
            <q-icon name="mdi-format-color-fill" />
          </template>
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer text-center">
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
                    @click.native="addColor"
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
            :style="{ backgroundColor: color, color: 'white' }"
            text-color="white"
            :label="color"
          />
        </div>
      </div>
      <!-- tag-search -->
      <q-select
        v-model="tag.terms"
        use-input
        hide-selected
        fill-input
        input-debounce="1"
        :options="tag.options"
        @filter="searchTag"
        hide-dropdown-icon
        hint="Please type at least 2 characters to search tag."
      >
        <template v-slot:before>
          <q-icon name="fas fa-tag" />
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">No results</q-item-section>
          </q-item>
        </template>
        <template v-slot:append>
          <q-icon
            v-if="tag.isListEmpty"
            class="cursor-pointer"
            name="add"
            @click.stop="tag.isModalOpen = true"
          />
          <q-icon
            v-if="tag.terms !== null"
            class="cursor-pointer"
            name="clear"
            @click.stop="tag.terms = null"
          />
        </template>
      </q-select>
      <tag-property-list
        class="q-my-md"
        :tags="taskForm.data.tags ? taskForm.data.tags : []"
        :editable="true"
        @remove-tag="(index) => taskForm.data.tags.splice(index, 1)"
      />
      <!-- occurrences -->
      <q-list class="q-mt-md" bordered separator>
        <q-item-label header>Occurrences</q-item-label>
        <q-item v-if="taskForm.data.occurrences.length === 0" clickable>
          <q-item-section>
            <q-item-label>No occurrences inserted.</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-for="(item, index) in taskForm.data.occurrences"
          :key="index"
          clickable
          @click.native="pickOccurrence(item)"
        >
          <q-item-section>
            <q-item-label>{{ item.id }} | {{ item.begins }} | {{ item.ends }} | {{ item.n }} | {{ item.frequency }} | {{ item.next.length }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <!-- occurrence-form -->
      <occurrence-form
        :id="occurrence.pickedId"
        :is-embedded="true"
        :task-id="isEdit ? id : null"
        @create-occurrence="createOccurrence"
        @update-occurrence="updateOccurrence"
        @remove-occurrence="removeOccurrence"
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
import { Picker } from 'emoji-mart-vue-fast'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
import form from '../mixins/form'
import OccurrenceForm from '../pages/OccurrenceForm'

import { findIndexById } from '../services/utils.js'
import Search from '../services/search'
import TagPropertyList from '../components/TagPropertyList'

const { mapState, mapActions } = createNamespacedHelpers('task')

// TODO: make it have children
// TODO: multiple occurrences should not have same elements for each category
export default {
  name: 'TaskForm',
  mixins: [form],
  components: {
    OccurrenceForm,
    TagPropertyList,
    Picker
  },
  data () {
    return {
      formName: 'taskForm',
      showDescriptionInput: false,
      occurrence: {
        pickedId: null
      },
      color: '#FFFFFF',
      tag: {
        terms: null,
        options: [],
        isListEmpty: false,
        isModalOpen: false
      }
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
      }
      else {
        this.setTask(null)
      }
    },
    save () {
      if (this.$v.taskForm.$invalid) {
        this.$q.notify({
          message: 'Please fill the form correctly.',
          type: 'warning'
        })
      }
      else {
        if (this.isEdit) {
          this.mode = this.$emitter.modes.UPDATE
          this.updateTask({ id: this.id, data: this.preSave(this.taskForm.data) })
        }
        else {
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
      data.path = this.$route.query.path ? this.$route.query.path : data.path
      data.parent_id = this.$route.query.parent_id ? this.$route.query.parent_id : data.parent_id
      return data
    },
    pickOccurrence (item) {
      this.occurrence.pickedId = item.id
    },
    createOccurrence (item) {
      this.taskForm.data.occurrences.push(item)
      this.occurrence.pickedId = null
    },
    updateOccurrence (item) {
      this.taskForm.data.occurrences.splice(findIndexById(this.taskForm.data.occurrences, item.id), 1, item)
      this.occurrence.pickedId = null
    },
    removeOccurrence (item) {
      this.taskForm.data.occurrences.splice(findIndexById(this.taskForm.data.occurrences, item.id), 1)
      this.occurrence.pickedId = null
    },
    addColor () {
      this.taskForm.data.colors = this.taskForm.data.colors ? [...this.taskForm.data.colors, this.color] : [this.color]
      this.color = '#FFFFFF'
    },
    removeColor (index) {
      this.taskForm.data.colors.splice(index, 1)
    },
    searchTag (terms, update, abort) {
      if (terms.length < 2) {
        abort()
        return
      }
      update(() => {
        Search.apply('tags', terms).then((res) => {
          this.tag.isListEmpty = _.isEqual(res.data.total, 0)
          this.tag.options = Search.prepareSearchResult(res, ['colors', 'enabled'])
        }).catch((err) => {
          this.$q.notify({
            message: `${err}.`,
            color: 'negative',
            icon: 'mdi-close-circle',
            timeout: 0,
            closeBtn: true
          })
        })
      })
    }
  },
  watch: {
    'taskItem.success' (newValue) {
      if (!_.isNull(newValue)) {
        this.setTask(newValue)
      }
    },
    'taskForm.success' (newValue) {
      if (!_.isNull(newValue)) {
        if (this.isModal) {
          this.$emit(this.$emitter.constructEmitMessage(this.mode, 'task'), newValue)
          this.setTask(null)
          this.$v.taskForm.$reset()
        }
        else {
          this.$router.push('/tasks')
        }
        this.$q.notify({
          message: this.$emitter.constructNotifyMessage(this.mode, 'Task'),
          type: 'positive'
        })
      }
    },
    'tag.terms' (newValue) {
      if (_.has(newValue, 'id')) {
        this.taskForm.data.tags = this.taskForm.data.tags ? [...this.taskForm.data.tags, newValue.id] : [newValue.id]
        this.tag.terms = ''
      }
    }
  }
}
</script>
