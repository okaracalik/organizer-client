<template>
  <q-page padding>
    <!-- content -->
    <div class="q-mt-lg" v-if="logForm.data">
      <!-- when -->
      <q-input label="When" v-model="logForm.data.when">
        <template v-slot:before>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date
                v-model="logForm.data.when"
                mask="YYYY-MM-DD"
                :first-day-of-week="1"
                v-close-popup
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <!-- Action -->
      <q-select
        label="Search"
        v-model="log.terms"
        use-input
        hide-selected
        fill-input
        input-debounce="1"
        :options="log.options"
        @filter="searchLog"
        hide-dropdown-icon
      >
        <template v-slot:before>
          <q-icon name="mdi-magnify" />
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">No results</q-item-section>
          </q-item>
        </template>
        <template v-slot:append>
          <q-icon
            v-if="log.terms !== null"
            class="cursor-pointer"
            name="clear"
            @click.stop="log.terms = null"
          />
        </template>
      </q-select>
      <!-- action -->
      <q-input label="Action" v-model="logForm.data.action" hint="Eat, cook, prepare, wash, clean...">
        <template v-slot:before>
          <q-icon name="mdi-walk" />
        </template>
        <template v-slot:prepend>
          <q-icon name="far fa-smile" class="cursor-pointer text-center">
            <q-popup-proxy
              class="text-center"
              transition-show="scale"
              transition-hide="scale"
              style="width:350px"
            >
              <picker
                set="google"
                :auto-focus="true"
                :showPreview="false"
                @select="(emoji) => logForm.data.action += `${emoji.native} `"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon
            v-if="logForm.data.action !== null"
            class="cursor-pointer"
            name="clear"
            @click.stop="logForm.data.action = null"
          />
        </template>
      </q-input>
      <!-- what -->
      <q-input
        label="What"
        v-model="logForm.data.what"
        @blur="logForm.data.what = sortString(logForm.data.what)"
      >
        <template v-slot:before>
          <q-icon name="mdi-circle" />
        </template>
        <template v-slot:prepend>
          <q-icon name="far fa-smile" class="cursor-pointer text-center">
            <q-popup-proxy
              class="text-center"
              transition-show="scale"
              transition-hide="scale"
              style="width:350px"
            >
              <picker
                set="google"
                :auto-focus="true"
                @select="(emoji) => logForm.data.what += `${emoji.native} `"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon
            v-if="logForm.data.what !== null"
            class="cursor-pointer"
            name="clear"
            @click.stop="logForm.data.what = null"
          />
        </template>
      </q-input>
      <!-- where -->
      <q-input label="Where" v-model="logForm.data.where">
        <template v-slot:before>
          <q-icon name="mdi-map-marker" />
        </template>
      </q-input>
      <!-- how -->
      <q-select
        label="How"
        v-model="logForm.data.how"
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        input-debounce="0"
        @new-value="createValue"
      >
        <template v-slot:before>
          <q-icon name="mdi-help" />
        </template>
        <template v-slot:prepend>
          <q-icon name="far fa-smile" class="cursor-pointer text-center">
            <q-popup-proxy
              class="text-center"
              transition-show="scale"
              transition-hide="scale"
              style="width:350px"
            >
              <picker
                set="google"
                :auto-focus="true"
                :showPreview="false"
                @select="(emoji) => logForm.data.how += `${emoji.native} `"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon
            v-if="logForm.data.how !== null"
            class="cursor-pointer"
            name="clear"
            @click.stop="logForm.data.how = null"
          />
        </template>
      </q-select>
      <!-- with -->
      <q-select
        label="With"
        v-model="logForm.data.with"
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        input-debounce="0"
        @new-value="createValue"
      >
        <template v-slot:before>
          <q-icon name="mdi-hand" />
        </template>
        <template v-slot:prepend>
          <q-icon name="far fa-smile" class="cursor-pointer text-center">
            <q-popup-proxy
              class="text-center"
              transition-show="scale"
              transition-hide="scale"
              style="width:350px"
            >
              <picker
                set="google"
                :auto-focus="true"
                :showPreview="false"
                @select="(emoji) => logForm.data.with += `${emoji.native} `"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon
            v-if="logForm.data.with !== null"
            class="cursor-pointer"
            name="clear"
            @click.stop="logForm.data.with = null"
          />
        </template>
      </q-select>
      <!-- tags -->
      <tag-property-form
        :tags="logForm.data.tags"
        @add-tag="(id) => {logForm.data.tags = [...logForm.data.tags, id]}"
        @remove-tag="(index) => {logForm.data.tags.splice(index, 1)}"
      />
      <!-- buttons -->
      <form-action-buttons
        :isModal="isModal"
        :isEmbedded="isEmbedded"
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
import Search from '../services/search'
import TagPropertyForm from '../components/TagPropertyForm'

const { mapState, mapActions } = createNamespacedHelpers('log')

export default {
  name: 'LogForm',
  mixins: [form],
  components: {
    TagPropertyForm,
    Picker
  },
  data () {
    return {
      formName: 'logForm',
      log: {
        terms: null,
        options: [],
        isListEmpty: false
      }
    }
  },
  computed: {
    ...mapState({
      logItem: state => state.item,
      logForm: state => state.form
    })
  },
  methods: {
    ...mapActions({
      getLog: 'get',
      createLog: 'create',
      updateLog: 'update',
      removeLog: 'remove',
      setLog: 'set'
    }),
    init () {
      if (this.isEdit) {
        this.getLog(this.id)
      }
      else {
        this.setLog(null)
      }
    },
    save () {
      if (this.$v.logForm.$invalid) {
        this.$q.notify({
          message: 'Please fill the form correctly.',
          color: 'warning'
        })
      }
      else {
        if (this.isEdit) {
          this.mode = this.$emitter.modes.UPDATE
          this.updateLog({ id: this.id, data: this.logForm.data })
        }
        else {
          this.mode = this.$emitter.modes.CREATE
          this.createLog(this.logForm.data)
        }
      }
    },
    erase () {
      this.mode = this.$emitter.modes.REMOVE
      this.removeLog(this.id)
    },
    searchLog (terms, update, abort) {
      if (terms.length < 2) {
        abort()
        return
      }
      update(() => {
        Search.apply('logs', terms).then((res) => {
          this.log.isListEmpty = _.isEqual(res.data.total, 0)
          this.log.options = Search.prepareSearchResult(res, ['when', 'tags'])
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
    },
    createValue (val, done) {
      val = val.trim()
      if (val !== '') {
        done(val, 'add-unique')
      }
      else {
        this.$q.notify({
          message: 'Please do not add empty string values.',
          color: 'warning',
          textColor: 'black',
          icon: 'mdi-alert-circle'
        })
      }
    },
    sortString (text) {
      return text.replace(', ', ',').split(',').sort().join(', ')
    }
  },
  watch: {
    'logItem.success' (newValue) {
      if (!_.isNull(newValue)) {
        this.setLog(newValue)
      }
    },
    'logForm.success' (newValue) {
      if (!_.isNull(newValue)) {
        if (this.isModal) {
          this.$emit(this.$emitter.constructEmitMessage(this.mode, 'log'), newValue)
          this.setLog(null)
          this.$v.logForm.$reset()
        }
        else {
          this.$router.push('/logs')
        }
        this.$q.notify({
          message: this.$emitter.constructNotifyMessage(this.mode, [newValue.action, newValue.what].join(' ')),
          color: 'positive'
        })
      }
    },
    'log.terms' (newValue) {
      if (_.has(newValue, 'id')) {
        this.logForm.data = {
          ...this.logForm.data,
          action: newValue.action,
          what: newValue.what,
          where: newValue.where,
          how: newValue.how,
          with: newValue.with,
          tags: newValue.tags
        }
      }
    }
  }
}
</script>
