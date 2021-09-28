import { createModel } from '@rematch/core'
import { Printer } from 'expo-print'
import moment from 'moment'
import { RootModel } from '.'
import { DATE_FORMAT } from '../env'

export type Settings = {
  numParentTags: number
  dayOfWeek: number
  date: string
  entrustEventId: string | null
  teacherEventId: string | null
  doctrine101EventId: string | null
  printer: Printer | null
}

export const missingSettings = (settings: Settings): boolean =>
  !settings.entrustEventId ||
  !settings.teacherEventId ||
  !settings.doctrine101EventId ||
  !settings.date ||
  !settings.printer ||
  typeof settings.numParentTags !== 'number' ||
  typeof settings.dayOfWeek !== 'number'

export const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const getNextDate = (dayINeed: number, currentDate?: string): string => {
  if (currentDate && moment(currentDate, DATE_FORMAT).day() === dayINeed) {
    return currentDate
  }

  const today = moment().day()
  const date =
    today <= dayINeed ? moment().day(dayINeed) : moment().add(1, 'weeks').day(dayINeed)

  return date.format(DATE_FORMAT)
}

export const settings = createModel<RootModel>()({
  state: {
    date: getNextDate(0),
    dayOfWeek: 0,
    numParentTags: 2,
    entrustEventId: null,
    teacherEventId: null,
    doctrine101EventId: null,
    printer: null,
  } as Settings,
  reducers: {
    setAll: (_, settings: Settings) => settings,
    setPrinter: (state, printer: Printer) => ({
      ...state,
      printer,
    }),
    setDow: (state, dayOfWeek: number) => ({
      ...state,
      dayOfWeek,
      date: getNextDate(dayOfWeek, state.date),
      entrustEventId: null,
      teacherEventId: null,
      doctrine101EventId: null,
    }),
    setNumParentTags: (state, numParentTags: number) => ({
      ...state,
      numParentTags,
    }),
    setDate: (state, date: string) => ({
      ...state,
      date,
    }),
    setEntrustEventId: (state, entrustEventId: string) => ({
      ...state,
      entrustEventId,
    }),
    setTeacherEventId: (state, teacherEventId: string) => ({
      ...state,
      teacherEventId,
    }),
    setDoctrine101EventId: (state, doctrine101EventId: string) => ({
      ...state,
      doctrine101EventId,
    }),
  },
})
