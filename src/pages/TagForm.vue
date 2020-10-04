<template>
  <component
    :is="componentId"
    :padding="componentId === 'q-page'"
    :class="(isEmbedded || isModal) ? 'div' : 'q-page'"
  >
    <!-- form -->
    <div class="q-mt-lg" v-if="tagForm.data">
      <q-banner class="bg-teal-11 text-black" rounded>
        <strong> <q-icon name="las la-info-circle" /> Features:</strong>
          <ul>
            <li>A form to create or update a tag.</li>
            <li>You can specify various features: title, color.</li>
          </ul>
      </q-banner>
      <!-- title -->
      <q-input class="col-md-6 col-xs-12" type="text" label="Title" v-model="tagForm.data.title">
        <template v-slot:before>
          <q-icon name="las la-font" />
        </template>
      </q-input>
      <!-- color-input -->
      <q-input
        v-model="color"
        label="Color"
        :rules="['anyColor']"
        class="col-md-6 col-xs-12"
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
      <div class="q-mt-md q-pl-md col-md-6 col-xs-12">
        <q-chip
          v-for="(color, index) in tagForm.data.colors"
          :key="color"
          removable
          @remove="removeColor(index)"
          :style="getChipStyle(color)"
          :text-color=" color.toUpperCase() === '#FFFFFF' ? 'black' : 'white'"
          :label="color"
        />
      </div>
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

const { mapState, mapActions } = createNamespacedHelpers('tag')

export default {
  name: 'TagForm',
  mixins: [form],
  props: {
    tagPropertyData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      mode: this.$emitter.modes.INIT,
      formName: 'tagForm',
      color: '#FFFFFF'
    }
  },
  computed: {
    ...mapState({
      tagItem: state => state.item,
      tagForm: state => state.form
    })
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
      } else {
        this.setTag(null)
      }
    },
    save () {
      if (this.$v.tagForm.$invalid) {
        this.$q.notify({
          message: 'Please fill the form correctly.',
          color: 'warning'
        })
      } else {
        // if (this.color !== '#FFFFFF') {
        //   this.tagForm.data.colors.push(this.color)
        // }
        if (this.isModal) {
          this.mode = this.isEdit ? this.$emitter.modes.UPDATE : this.$emitter.modes.CREATE
          this.$emit(this.$emitter.constructEmitMessage(this.mode, 'tag'), this.tagForm.data)
          this.setTag(null)
          this.$v.tagForm.$reset()
        } else if (this.isEdit) {
          this.mode = this.$emitter.modes.UPDATE
          this.updateTag({ id: this.id, data: this.tagForm.data })
        } else {
          this.mode = this.$emitter.modes.CREATE
          this.createTag(this.tagForm.data)
        }
      }
    },
    erase () {
      this.mode = this.$emitter.modes.REMOVE
      this.removeTag(this.id)
    },
    removeColor (index) {
      this.tagForm.data.colors.splice(index, 1)
    },
    addColor () {
      this.tagForm.data.colors.push(this.color)
      this.color = '#FFFFFF'
    },
    getChipStyle (color) {
      return {
        backgroundColor: color,
        color: color.toUpperCase() === '#FFFFFF' ? 'black' : 'white',
        borderStyle: color.toUpperCase() === '#FFFFFF' ? 'solid' : '',
        borderWidth: color.toUpperCase() === '#FFFFFF' ? '1px' : '',
        borderColor: color.toUpperCase() === '#FFFFFF' ? 'black' : ''
      }
    }
  },
  watch: {
    'tagItem.success' (newValue) {
      if (!isNull(newValue)) {
        this.setTag(newValue)
      }
    },
    'tagForm.success' (newValue) {
      if (!isNull(newValue)) {
        if (this.isModal) {
          this.$emit(this.$emitter.constructEmitMessage(this.mode, 'tag'), newValue)
          this.setTag(null)
          this.$v.tagForm.$reset()
        } else {
          this.$router.push('/tags')
        }
        this.$q.notify({
          message: this.$emitter.constructNotifyMessage(this.mode, 'Tag'),
          color: 'positive'
        })
      }
    }
  }
}
</script>
