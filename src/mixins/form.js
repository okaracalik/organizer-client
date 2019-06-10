import _ from 'lodash'
import { required, minLength } from 'vuelidate/lib/validators'

import FormActionButtons from '../components/FormActionButtons'

export default {
  props: {
    id: {
      type: String,
      default: null
    },
    isModal: {
      type: Boolean,
      default: false
    },
    isEmbedded: {
      type: Boolean,
      default: false
    }
  },
  components: {
    FormActionButtons
  },
  data () {
    return {
      mode: this.$emitter.modes.INIT
    }
  },
  computed: {
    isEdit () {
      return !_.isNull(this.id)
    },
    componentId () {
      if (this.isModal) {
        return 'q-card'
      }
      else if (this.isEmbedded) {
        return 'div'
      }
      else {
        return 'q-page'
      }
    },
    componentClass () {
      if (this.isModal) {
        return 'q-pa-lg'
      }
      else if (this.isEmbedded) {
        return 'q-pa-lg'
      }
      else {
        return ''
      }
    },
    canShowCancel () {
      return this.isEdit || this.$v[this.formName].$anyDirty
    }
  },
  methods: {
    cancel () {
      this.$router.go(-1)
    }
  },
  created () {
    this.init()
  },
  beforeRouteLeave (to, from, next) {
    if (!this.isModal && this.mode === this.$emitter.modes.INIT && this.$v[this.formName].$anyDirty) {
      this.$q.dialog({
        title: 'Warning',
        message: 'You are about to leave the page without saving. Are you sure?',
        color: 'warning',
        cancel: true
      })
        .onOk(() => {
          next()
        })
        .onCancel(() => {
          next(false)
        })
    }
    else {
      next()
    }
  },
  validations: {
    occurrenceForm: {
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
    },
    tagForm: {
      data: {
        name: { required, minLength: minLength(2) },
        active: { required }
      }
    },
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