const INIT = 0
const CREATE = 1
const UPDATE = 2
const REMOVE = 3

const constructEmitMessage = (mode, module) => {
  switch (mode) {
    case CREATE:
      return `create-${module}`
    case UPDATE:
      return `update-${module}`
    case REMOVE:
      return `remove-${module}`
    default:
      return 'Unhandled message!!!'
  }
}

const constructNotifyMessage = (mode, value) => {
  switch (mode) {
    case CREATE:
      return `${value} has been successfully created.`
    case UPDATE:
      return `${value} has been successfully updated.`
    case REMOVE:
      return `${value} has been successfully removed.`
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
      REMOVE
    },
    constructEmitMessage,
    constructNotifyMessage
  }
}
