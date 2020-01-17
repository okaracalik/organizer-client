import { startOfToday, endOfMonth } from 'date-fns'
import { generateOnce, generateDays, generateWeeks, generateMonths, generateYears } from './generator'

export const getInstance = () => ({
  id: null,
  task_id: null,
  begins: startOfToday(),
  ends: endOfMonth(startOfToday()),
  frequency: 'once',
  repeats: 1,
  weekdays: [],
  is_on_last_day_of_month: false,
  is_on_business_day: false,
  next: [],
  succeeded: [],
  failed: [],
  skipped: []
})

export const observer = {
  set: function (obj, prop, value) {
    console.log('observer')
    obj[prop] = value
    if (['begins', 'ends', 'frequency', 'repeats', 'weekdays', 'is_on_last_day_of_month', 'is_on_business_day'].includes(prop)) {
      switch (obj.frequency) {
        case 'once':
          obj.next = generateOnce(obj.begins, obj.ends)
          return true
        case 'day':
          obj.next = generateDays(obj.begins, obj.ends, obj.repeats)
          return true
        case 'week':
          obj.next = generateWeeks(obj.begins, obj.ends, obj.repeats, obj.weekdays)
          return true
        case 'month':
          obj.next = generateMonths(obj.begins, obj.ends, obj.repeats, obj.isOnLastDayOfMonth)
          return true
        case 'year':
          obj.next = generateYears(obj.begins, obj.ends, obj.repeats, obj.isOnLastDayOfMonth)
          return true
        default:
          obj.next = generateOnce(obj.begins, obj.ends)
          return true
      }
    }
  }
}
