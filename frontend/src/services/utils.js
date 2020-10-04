import _ from 'lodash'

export const getTaskColor = type => {
  switch (type) {
    case 'next':
      return 'blue-6'
    case 'done':
      return 'green-6'
    case 'failed':
      return 'red-6'
    case 'skipped':
      return 'deep-orange-6'
    case 'removed':
      return 'brown-6'
    default:
      return 'white'
  }
}

export const getTaskColorDarker = type => {
  switch (type) {
    case 'next':
      return 'blue-10'
    case 'done':
      return 'green-10'
    case 'failed':
      return 'red-10'
    case 'skipped':
      return 'deep-orange-10'
    case 'removed':
      return 'brown-10'
    default:
      return 'white'
  }
}

export const getTaskIcon = type => {
  switch (type) {
    case 'next':
      return 'mdi-checkbox-blank-outline'
    case 'done':
      return 'mdi-checkbox-marked-outline'
    case 'failed':
      return 'mdi-close-circle-outline'
    case 'skipped':
      return 'mdi-cancel'
    case 'removed':
      return 'mdi-trash-can-outline'
    default:
      return 'mdi-exclamation'
  }
}

export const getTaskIconAlt = type => {
  switch (type) {
    case 'next':
      return 'mdi-checkbox-blank-outline'
    case 'done':
      return 'mdi-check-bold'
    case 'failed':
      return 'mdi-close-circle'
    case 'skipped':
      return 'mdi-skip-forward'
    case 'removed':
      return 'mdi-trash-can'
    default:
      return 'mdi-exclamation'
  }
}

export const getStyleColors = colors => ({
  backgroundColor: colors && colors.length > 0 ? colors[0] : 'black',
  color: colors && colors.length > 1 ? colors[1] : 'white',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: colors && colors.length > 1 ? colors[1] : colors[0]
})

export const uniqDates = arr =>
  arr.filter(
    (date, i, self) => self.findIndex(d => d.getTime() === date.getTime()) === i
  )

export const shorten = (text, len) => {
  return text.length > len ? `${text.substring(0, len)}...` : text
}

export const getCurrencySymbol = currency => {
  switch (_.upperCase(currency)) {
    case 'TRY':
      return '\u20ba'
    case 'EUR':
      return '€'
    case 'USD':
      return '$'
    default:
      return currency
  }
}

export const findIndexById = (data, id) => {
  return _.findIndex(data, item => _.isEqual(item.id, id))
}

export const getLabels = (item, removedKeys = []) => {
  if (item) {
    const keys = _.keys(item).filter(
      k => !k.endsWith('id') && !removedKeys.includes(k)
    )
    const labels = keys.reduce((acc, k) => {
      if (k) {
        if (_.isArray(item[k])) {
          return item[k] ? [...acc, ...item[k].map(upperFirst)] : acc
        } else if (!_.isObject(item[k])) {
          return item[k] ? [...acc, upperFirst(item[k])] : acc
        } else {
          return acc
        }
      } else {
        return acc
      }
    }, [])
    return labels.filter(l => !_.isNull(l)).join(', ')
  } else {
    return '-'
  }
}

const upperFirst = text => {
  text = text
    .split(' ')
    .map(_.upperFirst)
    .join(' ')
  text = text
    .split('-')
    .map(_.upperFirst)
    .join('-')
  return text
}
