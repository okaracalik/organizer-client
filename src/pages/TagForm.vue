<template>
  <q-page padding>
    <!-- form -->
    <div v-if="tagForm.data">
      <div class="row">
        <!-- name -->
        <q-field
          class="col-md-9 col-xs-12 q-pr-lg"
          :error="$v.tagForm.data.name.$error"
          error-label="Please enter valid input."
        >
          <q-input
            type="text"
            float-label="Name"
            v-model.trim="tagForm.data.name"
            @input="$v.tagForm.data.name.$touch"
            :error="$v.tagForm.data.name.$error"
            :autofocus="!isEdit"
          />
        </q-field>
        <!-- color -->
        <q-field class="col-md-2 col-xs-12 q-pr-lg">
          <q-color
            stack-label="Color"
            v-model="color"
            format-model="hex"
            :after="[
              {
                icon: 'fas fa-plus',
                content: true,
                handler () {
                  tagForm.data.colors.push(color)
                  color = '#FFFFFF'
                }
              }
            ]"
          />
        </q-field>
        <q-field class="col-md-1 col-xs-12 items-center q-my-md">
          <q-toggle
            v-model="tagForm.data.active"
            :label="tagForm.data.active ? 'Active' : 'Inactive'"
          />
        </q-field>
      </div>
      <!-- colors -->
      <div class="q-mt-md">
        <q-chip
          v-for="(color, index) in tagForm.data.colors"
          v-bind:key="color"
          closable
          @hide="removeColor(index)"
          :style="{ backgroundColor: color, color: '#FFF' }"
        >{{ color }}</q-chip>
      </div>
      <!-- buttons -->
      <div class="q-mt-md row justify-between">
        <q-btn color="positive" @click="save()" icon="fas fa-save"/>
        <q-btn v-if="id" color="negative" @click="erase()" icon="fas fa-trash"/>
      </div>
    </div>
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'
import _ from 'lodash'
import form from '../mixins/form'

const { mapState, mapActions } = createNamespacedHelpers('tag')

export default {
  name: 'TagForm',
  mixins: [form],
  data () {
    return {
      color: '#FFFFFF'
    }
  },
  computed: {
    ...mapState({
      tagItem: state => state.item,
      tagForm: state => state.form
    }),
    isProperty () {
      return !_.isUndefined(this.$route.name) && !_.isUndefined(this.$route.color) && !_.isUndefined(this.$route.active)
    }
  },
  methods: {
    ...mapActions({
      getTag: 'get',
      createTag: 'create',
      updateTag: 'update',
      removeTag: 'remove',
      setTag: 'set'
    }),
    init () {
      if (this.isEdit) {
        this.getTag(this.id)
      }
      else {
        this.setTag(null)
      }
    },
    save () {
      if (this.$v.tagForm.$invalid) {
        this.$q.notify({
          message: 'Please fill the form correctly.',
          type: 'warning'
        })
      }
      else {
        if (this.color !== '#FFFFFF') {
          this.tagForm.data.colors.push(this.color)
        }
        if (this.isProperty) {
          this.$emit(this.$emitter.constructEmitMessage(this.mode, 'tag'), this.tagForm.data)
          this.setTag(null)
          this.$v.tagForm.$reset()
        }
        else if (this.isEdit) {
          this.mode = this.$emitter.modes.UPDATE
          this.updateTag({ id: this.id, data: this.tagForm.data })
        }
        else {
          this.mode = this.$emitter.modes.CREATE
          this.createTag(this.tagForm.data)
        }
      }
    },
    erase () {
      this.mode = this.$emitter.modes.REMOVE
      this.removeTag(this.id)
    },
    myFilter (terms, { field, list }) {
      const token = terms.toLowerCase()
      return list.filter(item => item[field].includes(token))
    },
    removeColor (index) {
      this.tagForm.data.colors.splice(index, 1)
    }
  },
  watch: {
    'tagItem.success' (newValue) {
      if (!_.isNull(newValue)) {
        this.setTag(newValue)
      }
    },
    'tagForm.success' (newValue) {
      if (!_.isNull(newValue)) {
        if (this.isModal) {
          this.$emit(this.$emitter.constructEmitMessage(this.mode, 'tag'), newValue)
          this.setTag(null)
          this.$v.tagForm.$reset()
        }
        else {
          this.$router.push('/tags')
        }
        this.$q.notify({
          message: this.$emitter.constructNotifyMessage(this.mode, 'Tag'),
          type: 'positive'
        })
      }
    },
    isProperty (newValue) {
      if (newValue) {
        this.setTag({ name: newValue.name, color: newValue.color, active: newValue.color })
      }
    }
  },
  created () {
    this.init()
  },
  validations: {
    tagForm: {
      data: {
        name: { required, minLength: minLength(2) },
        active: { required }
      }
    }
  }
}
</script>
