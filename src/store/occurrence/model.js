import { startOfToday, endOfMonth } from 'date-fns'
import { generateOnce, generateDays, generateWeeks, generateMonths, generateYears } from './generator'

export const getInstance = () => ({
  begins: startOfToday(),
  ends: endOfMonth(startOfToday()),
  n: 1,
  frequency: 'once', // once, day, week, month, year, custom
  if_on_working_day: null, // 'previous', 'closest', 'next' for day, month, year
  is_on_last_day_of_month: false, // for month and year
  weekdays: [], // for week
  next: [],
  done: [],
  failed: [],
  skipped: []
})

export const observer = {
  set: function (obj, prop, value) {
    console.log('observer')
    obj[prop] = value
    if (['begins', 'ends', 'frequency', 'n', 'weekdays', 'is_on_last_day_of_month', 'is_on_business_day'].includes(prop)) {
      switch (obj.frequency) {
        case 'once':
          obj.next = generateOnce(obj.begins, obj.ends)
          return true
        case 'day':
          obj.next = generateDays(obj.begins, obj.ends, obj.n)
          return true
        case 'week':
          obj.next = generateWeeks(obj.begins, obj.ends, obj.n, obj.weekdays)
          return true
        case 'month':
          obj.next = generateMonths(obj.begins, obj.ends, obj.n, obj.isOnLastDayOfMonth)
          return true
        case 'year':
          obj.next = generateYears(obj.begins, obj.ends, obj.n, obj.isOnLastDayOfMonth)
          return true
        default:
          obj.next = generateOnce(obj.begins, obj.ends)
          return true
      }
    }
  }
}
