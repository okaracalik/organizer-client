import _ from 'lodash'

export default {
  props: {
    id: {
      type: String,
      default: null
    },
    isModal: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      mode: this.$emitter.modes.INIT
    }
  },
  computed: {
    isEdit () {
      return !_.isNull(this.id)
    }
  }
}
