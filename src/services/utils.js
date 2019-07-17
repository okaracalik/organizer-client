import _ from 'lodash'

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
    let labels = keys.reduce((acc, k) => {
      if (k) {
        if (_.isArray(item[k])) {
          return item[k] ? [...acc, ...item[k].map(upperFirst)] : acc
        }
        else if (!_.isObject(item[k])) {
          return item[k] ? [...acc, upperFirst(item[k])] : acc
        }
        else {
          return acc
        }
      }
      else {
        return acc
      }
    }, [])
    return labels.filter(l => !_.isNull(l)).join(', ')
  }
  else {
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
