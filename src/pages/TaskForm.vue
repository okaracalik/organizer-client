<template>
  <q-page padding>
    <!-- content -->
    <!-- title -->
    <q-field class="col-md-12 col-xs-12">
      <q-input type="text" float-label="Title" v-model.trim="taskForm.data.title"/>
    </q-field>
    <!-- description -->
    <q-field class="col-md-12 col-xs-12">
      <q-input type="textarea" float-label="Description" v-model.trim="taskForm.data.description"/>
    </q-field>
  </q-page>
</template>

<script>
import _ from 'lodash'
import { createNamespacedHelpers } from 'vuex'
import form from '../mixins/form'

const { mapState, mapActions } = createNamespacedHelpers('task')

// TODO: include occurrence
export default {
  name: 'TaskForm',
  mixins: [form],
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
          this.updateTask({ id: this.id, data: this.taskForm.data })
        }
        else {
          this.mode = this.$emitter.modes.CREATE
          this.taskForm.data.parent = this.parentId
          this.createTask(this.taskForm.data)
        }
      }
    },
    erase () {
      this.mode = this.$emitter.modes.REMOVE
      this.removeTask(this.id)
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
    }
  },
  created () {
    this.init()
  },
  validations: {
    taskForm: {
      data: {
        begins: {},
        ends: {},
        repeats: {},
        frequency: {},
        isOnLastDayOfMonth: {},
        weekdays: {},
        next: {},
        succeeded: {},
        failed: {},
        skipped: {}
      }
    }
  }
}
</script>
