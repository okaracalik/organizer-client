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
  startOfToday,
  format
} from 'date-fns'
import _ from 'lodash'

const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const eachWeek = (days, n) => {
  return _.flatMap(days, d => {
    return n.map(r => {
      return endOfDay(addDays(d, WEEKDAYS.indexOf(r)))
    })
  })
}

const generateOccurrences = (begins, ends, n, frequency, isOnLastDayOfMonth, weekdays) => {
  let temp = []
  let today = begins
  switch (frequency) {
    case 'once':
      temp.push(endOfDay(ends))
      return temp
    case 'day':
      while (!isAfter(today, ends)) {
        temp.push(endOfDay(today))
        today = addDays(today, n)
      }
      return temp
    case 'week':
      today = startOfISOWeek(begins)
      while (!isAfter(today, ends)) {
        temp.push(endOfDay(today))
        today = addWeeks(today, n)
      }
      return _.sortBy(eachWeek(temp, weekdays)).filter(d => !isBefore(d, begins) && !isAfter(d, ends))
    case 'month':
      today = isOnLastDayOfMonth ? startOfMonth(today) : today
      while (!isAfter(today, ends)) {
        temp.push(endOfDay(isOnLastDayOfMonth ? endOfMonth(today) : today))
        today = addMonths(today, n)
      }
      return temp
    case 'year':
      today = isOnLastDayOfMonth ? startOfMonth(today) : today
      while (!isAfter(today, ends)) {
        temp.push(endOfDay(isOnLastDayOfMonth ? endOfMonth(today) : today))
        today = addYears(today, n)
      }
      return temp
  }
}

export const getInstance = () => ({
  id: null,
  task_id: null,
  begins: format(startOfToday(), 'YYYY-MM-DD HH:mm'),
  ends: format(endOfToday(), 'YYYY-MM-DD HH:mm'),
  n: 1,
  frequency: 'once', // once, day, week, month, year, custom
  is_on_last_day_of_month: false, // for month and year
  weekdays: [], // for week
  next: [],
  succeeded: [],
  failed: [],
  skipped: []
})

export const observer = {
  set: function (obj, prop, value) {
    obj[prop] = value
    // any change on properties below will generate new occurrences
    if (_.includes(['begins', 'ends', 'n', 'frequency', 'is_on_last_day_of_month', 'weekdays'], prop)) {
      obj.next = generateOccurrences(obj.begins, obj.ends, obj.n, obj.frequency, obj.is_on_last_day_of_month, obj.weekdays)
    }
    return true
  }
}
