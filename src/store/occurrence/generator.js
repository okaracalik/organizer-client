import { addDays, endOfMonth, addMonths, addWeeks, addYears, endOfDay, isAfter, isBefore, startOfISOWeek } from 'date-fns'

const getDay = (day) => {
  switch (day) {
    case 'mon': return 0
    case 'tue': return 1
    case 'wed': return 2
    case 'thu': return 3
    case 'fri': return 4
    case 'sat': return 5
    case 'sun': return 6
    default: return day
  }
}

export const generateOnce = (begins, ends) => {
  if (!isAfter(begins, ends)) {
    return [endOfDay(ends)]
  }
  else {
    return []
  }
}

export const generateDays = (begins, ends, repeats = 1) => {
  let temp = []
  let today = begins

  while (!isAfter(today, ends)) {
    temp.push(endOfDay(today))
    today = addDays(today, repeats)
  }
  console.log(temp)
  return temp
}

export const generateWeeks = (begins, ends, repeats = 1, weekdays = []) => {
  let temp = []
  let today = startOfISOWeek(begins)
  let days = []
  weekdays = weekdays.length < 1 ? [begins.getDay() - 1] : weekdays.map(getDay)

  while (!isAfter(today, ends)) {
    days = weekdays.map(wd => endOfDay(addDays(today, wd)))
    temp.push(...days)
    today = addWeeks(today, repeats)
  }

  temp = temp.filter(d => !isBefore(d, begins) && !isAfter(d, ends))
  return temp
}

export const generateMonths = (begins, ends, repeats = 1, isOnLastDayOfMonth = false) => {
  let temp = []
  let today = begins

  while (!isAfter(today, ends)) {
    today = isOnLastDayOfMonth ? endOfMonth(today) : today
    temp.push(endOfDay(today))
    today = addMonths(today, repeats)
  }

  return temp
}

export const generateYears = (begins, ends, repeats = 1, isOnLastDayOfMonth = false) => {
  let temp = []
  let today = begins

  while (!isAfter(today, ends)) {
    today = isOnLastDayOfMonth ? endOfMonth(today) : today
    temp.push(endOfDay(today))
    today = addYears(today, repeats)
  }

  return temp
}
