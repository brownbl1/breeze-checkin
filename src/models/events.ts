/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createModel } from '@rematch/core'
import { RootModel } from '.'
import { getAttendance, getEligibleForEvent, getEvent, getEventsForDate } from '../api'
import { Dispatch } from '../store'
import { BreezeEvent, EventPerson } from './dataModel'
import { Settings } from './settings'

export type EventState = {
  entrustEvent: BreezeEvent | null
  teacherEvent: BreezeEvent | null
  doctrine101Event: BreezeEvent | null
  entrustEventPeople: EventPerson[]
  teacherEventPeople: EventPerson[]
  doctrine101EventPeople: EventPerson[]
  filtered: EventPerson[]
}

enum Clear {
  All,
  EntrustEvent,
  TeacherEvent,
  Doctrine101Event,
}

type SelectDto = {
  event: BreezeEvent
  eventPeople: EventPerson[]
}

const startsWith = (text: string) => (name: string) => name.startsWith(text)

type Timeout = { id?: NodeJS.Timeout }

const entrustAttendanceInt: Timeout = {}
const teacherAttendanceInt: Timeout = {}
const doctrine101AttendanceInt: Timeout = {}

export const events = createModel<RootModel>()({
  state: {
    entrustEvent: null,
    teacherEvent: null,
    doctrine101Event: null,
    entrustEventPeople: [],
    teacherEventPeople: [],
    doctrine101EventPeople: [],
    filtered: [],
  } as EventState,
  reducers: {
    'searchText/set': (state, text: string) => {
      if (text.length < 3) return { ...state, filtered: [] }

      const matcher = startsWith(text.trim().toLowerCase())

      const people = [
        ...state.entrustEventPeople,
        ...state.teacherEventPeople,
        ...state.doctrine101EventPeople,
      ]
      const unique = [...new Map(people.map((item) => [item.id, item])).values()]
      const filtered = unique.filter((person) => {
        const name = `${person.first_name} ${person.last_name}`.toLowerCase()
        return name.split(' ').some(matcher) || matcher(name)
      })

      return { ...state, filtered }
    },
    selectEntrustEvent: (state, payload: SelectDto) => ({
      ...state,
      entrustEvent: payload.event,
      entrustEventPeople: payload.eventPeople,
    }),
    selectTeacherEvent: (state, payload: SelectDto) => ({
      ...state,
      teacherEvent: payload.event,
      teacherEventPeople: payload.eventPeople,
    }),
    selectDoctrine101Event: (state, payload: SelectDto) => ({
      ...state,
      doctrine101Event: payload.event,
      doctrine101EventPeople: payload.eventPeople,
    }),
    clear: (state, payload: Clear) => {
      switch (payload) {
        case Clear.All:
          return {
            ...state,
            entrustEvent: null,
            teacherEvent: null,
            doctrine101Event: null,
            entrustEventPeople: [],
            teacherEventPeople: [],
            doctrine101EventPeople: [],
          }
        case Clear.EntrustEvent:
          return {
            ...state,
            entrustEvent: null,
            entrustEventPeople: [],
          }
        case Clear.TeacherEvent:
          return {
            ...state,
            teacherEvent: null,
            teacherEventPeople: [],
          }
        case Clear.Doctrine101Event:
          return {
            ...state,
            doctrine101Event: null,
            doctrine101EventPeople: [],
          }
      }
    },
  },
  effects: (dispatch) => ({
    selectEntrustEventAsync: async (_, { settings }) => {
      await setEvent(
        dispatch,
        settings,
        'entrustEventId',
        Clear.EntrustEvent,
        'selectEntrustEvent',
        entrustAttendanceInt,
        'setEntrust',
      )
    },
    selectTeacherEventAsync: async (_, { settings }) => {
      await setEvent(
        dispatch,
        settings,
        'teacherEventId',
        Clear.TeacherEvent,
        'selectTeacherEvent',
        teacherAttendanceInt,
        'setTeacher',
      )
    },
    selectDoctrine101EventAsync: async (_, { settings }) => {
      await setEvent(
        dispatch,
        settings,
        'doctrine101EventId',
        Clear.Doctrine101Event,
        'selectDoctrine101Event',
        doctrine101AttendanceInt,
        'setDoctrine101',
      )
    },
  }),
})

async function setEvent(
  dispatch: Dispatch,
  settings: Settings,
  eventIdKey: keyof Settings,
  clear: Clear,
  reducerName: keyof Dispatch['events'],
  interval: Timeout,
  pollingReducer: keyof Dispatch['attendance'],
) {
  const events = await getEventsForDate(settings.date)
  const eventId = events.find((e) => e.event_id === settings[eventIdKey])?.id

  if (!eventId) {
    dispatch.events.clear(clear)
    return
  }

  const [event, eventPeople] = await Promise.all([
    getEvent(eventId),
    getEligibleForEvent(eventId),
  ])

  // @ts-ignore
  dispatch.events[reducerName]({ event, eventPeople })

  const pollAttendance = async () => {
    const attendance = await getAttendance(eventId)

    // @ts-ignore
    dispatch.attendance[pollingReducer](attendance)
  }

  interval.id && clearInterval(interval.id)
  interval.id = setInterval(() => pollAttendance(), 1000 * 60 * 1)
  pollAttendance()
}
