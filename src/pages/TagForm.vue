<template>
  <q-page padding>
    <!-- form -->
    <div class="q-mt-lg" v-if="tagForm.data">
      <div class="row justify-between">
        <!-- name -->
        <q-input class="col-md-11" type="text" label="Name" v-model="tagForm.data.name">
          <template v-slot:before>
            <q-icon name="fas fa-font" />
          </template>
        </q-input>
        <!-- enabled -->
        <q-toggle
          class="self-end"
          v-model="tagForm.data.enabled"
          :label="tagForm.data.enabled ? 'Enabled' : 'Disabled'"
        />
      </div>
      <div class="row">
        <!-- color -->
        <q-input v-model="color" :rules="['anyColor']" class="text-center col-md-6">
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
                    @click.native="() => {tagForm.data.colors.push(color); color='#FFFFFF'}"
                  />
                </div>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <!-- colors -->
        <div class="q-mt-md q-pl-md col-md-6">
          <q-chip
            v-for="(color, index) in tagForm.data.colors"
            :key="color"
            removable
            @remove="removeColor(index)"
            :style="{ backgroundColor: color, color: 'white' }"
            text-color="white"
            :label="color"
          />
        </div>
      </div>
      <!-- icon -->
      <div class="row q-mb-md">
        <q-select
          class="col-md-2"
          :options="iconSet.options"
          v-model="iconSet.selected"
          map-options
          emit-value
        >
          <template v-slot:before>
            <q-icon name="mdi-information-outline" />
          </template>
        </q-select>
        <q-input class="col-md-9" v-model="iconFilter" label="Icon">
          <template v-slot:before>
            <q-icon name="mdi-information-variant" />
          </template>
        </q-input>
      </div>
      <q-icon-picker
        v-model="tagForm.data.icon"
        :filter="iconFilter"
        :icon-set="iconSet.selected"
        :pagination.sync="iconPagination"
        tooltips
        style="height: 150px;"
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
import { createNamespacedHelpers } from 'vuex'
import { isUndefined, isNull } from 'lodash'
import form from '../mixins/form'

const { mapState, mapActions } = createNamespacedHelpers('tag')

export default {
  name: 'TagForm',
  mixins: [form],
  data () {
    return {
      formName: 'tagForm',
      color: '#FFFFFF',
      iconSet: {
        selected: 'mdi-v3',
        options: [
          { label: 'MDI', value: 'mdi-v3' },
          { label: 'Font Awesome', value: 'fontawesome-v5' },
          { label: 'Material Icons', value: 'material-icons' }
        ]
      },
      iconFilter: '',
      iconPagination: {
        itemsPerPage: 60,
        page: 0
      }
    }
  },
  computed: {
    ...mapState({
      tagItem: state => state.item,
      tagForm: state => state.form
    }),
    isProperty () {
      return !isUndefined(this.$route.name) && !isUndefined(this.$route.color) && !isUndefined(this.$route.active)
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
  }
}
</script>
