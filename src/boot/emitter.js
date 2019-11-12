const INIT = 0
const CREATE = 1
const UPDATE = 2
const REMOVE = 3
const ADD = 4

const constructEmitMessage = (mode, module) => {
  switch (mode) {
    case CREATE:
      return `create-${module}`
    case UPDATE:
      return `update-${module}`
    case REMOVE:
      return `remove-${module}`
    case ADD:
      return `add-${module}`
    default:
      return 'Unhandled message!!!'
  }
}

const constructNotifyMessage = (mode, value) => {
  switch (mode) {
    case CREATE:
      return `${value} successfully created.`
    case UPDATE:
      return `${value} successfully updated.`
    case REMOVE:
      return `${value} successfully deleted.`
    case ADD:
      return `${value} successfully added.`
    default:
      return 'Unhandled message!!!'
  }
}

export default ({ Vue }) => {
  Vue.prototype.$emitter = {
    modes: {
      INIT,
      CREATE,
      UPDATE,
      REMOVE,
      ADD
    },
    constructEmitMessage,
    constructNotifyMessage
  }
}
