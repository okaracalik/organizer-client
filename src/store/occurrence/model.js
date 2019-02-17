import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfDay,
  endOfMonth,
  endOfToday,
  isAfter,
  isBefore,
  startOfISOWeek,
  startOfMonth,
  startOfToday
} from 'date-fns'
import _ from 'lodash'

const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const eachWeek = (days, repeats) => {
  return _.flatMap(days, d => {
    return repeats.map(r => {
      return endOfDay(addDays(d, WEEKDAYS.indexOf(r)))
    })
  })
}

const generateOccurrences = (begins, ends, frequency, repeats, isOnLastDayOfMonth, weekdays) => {
  let temp = []
  let today = begins
  switch (frequency) {
    case 'once':
      temp.push(endOfDay(ends))
      return temp
    case 'day':
      while (!isAfter(today, ends)) {
        temp.push(endOfDay(today))
        today = addDays(today, repeats)
      }
      return temp
    case 'week':
      today = startOfISOWeek(begins)
      while (!isAfter(today, ends)) {
        temp.push(today)
        today = addWeeks(today, repeats)
      }
      return _.sortBy(eachWeek(temp, weekdays)).filter(d => !isBefore(d, begins) && !isAfter(d, ends))
    case 'month':
      today = isOnLastDayOfMonth ? startOfMonth(today) : today
      while (!isAfter(today, ends)) {
        temp.push(endOfDay(isOnLastDayOfMonth ? endOfMonth(today) : today))
        today = addMonths(today, repeats)
      }
      return temp
    case 'year':
      today = isOnLastDayOfMonth ? startOfMonth(today) : today
      while (!isAfter(today, ends)) {
        temp.push(endOfDay(isOnLastDayOfMonth ? endOfMonth(today) : today))
        today = addYears(today, repeats)
      }
      return temp
  }
}

export const getInstance = () => ({
  begins: startOfToday(),
  ends: endOfToday(),
  repeats: 1,
  frequency: 'once', // once, day, week, month, year, custom
  isOnLastDayOfMonth: false, // for month and year
  weekdays: [],
  next: [],
  succeeded: [],
  failed: [],
  skipped: []
})

export const observer = {
  set: function (obj, prop, value) {
    obj[prop] = value
    // any change on properties below will generate new occurrences
    if (_.includes(['begins', 'ends', 'frequency', 'repeats', 'isOnLastDayOfMonth', 'weekdays'], prop)) {
      obj.next = generateOccurrences(obj.begins, obj.ends, obj.frequency, obj.repeats, obj.isOnLastDayOfMonth, obj.weekdays)
    }
    return true
  }
}
