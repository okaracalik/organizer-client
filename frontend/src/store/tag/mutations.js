export const listSuccess = (state, payload) => {
  state.list.success = payload
}

export const listError = (state, payload) => {
  state.list.error = payload
}

export const itemSuccess = (state, payload) => {
  state.item.success = payload
}

export const itemError = (state, payload) => {
  state.item.error = payload
}

export const formSuccess = (state, payload) => {
  state.form.success = payload
}

export const formError = (state, payload) => {
  state.form.error = payload
}

export const formData = (state, payload) => {
  state.form.data = payload
  state.form.success = null
  state.form.error = null
}
