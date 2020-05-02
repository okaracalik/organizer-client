import { startOfToday, endOfMonth } from 'date-fns'

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
