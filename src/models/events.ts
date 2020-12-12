import { createModel, RematchDispatch } from '@rematch/core'
import { RootModel } from '.'
import { getAttendance, getEligibleForEvent, getEvent, getEventsForDate } from '../api'
import { BreezeEvent, EventPerson } from './dataModel'

export type EventState = {
  entrustEvent: BreezeEvent | null
  teacherEvent: BreezeEvent | null
  entrustEventPeople: EventPerson[]
  teacherEventPeople: EventPerson[]
  filtered: EventPerson[]
}

enum Clear {
  All,
  EntrustEvent,
  TeacherEvent,
}

const INTERVAL = 1000 * 60 * 1 // 1 minute
const startsWith = (text: string) => (name: string) => name.startsWith(text)

export const events = createModel<RootModel>()({
  state: {
    entrustEvent: null,
    teacherEvent: null,
    entrustEventPeople: [],
    teacherEventPeople: [],
    filtered: [],
  } as EventState,
  reducers: {
    'searchText/set': (state, text: string) => {
      if (text.length < 3) return { ...state, filtered: [] }

      const matcher = startsWith(text.trim().toLowerCase())

      const people = [...state.entrustEventPeople, ...state.teacherEventPeople]
      const unique = [...new Map(people.map((item) => [item.id, item])).values()]
      const filtered = unique.filter((person) => {
        const name = `${person.first_name} ${person.last_name}`.toLowerCase()
        return name.split(' ').some(matcher) || matcher(name)
      })

      return { ...state, filtered }
    },
    selectEntrustEvent: (
      state,
      payload: { entrustEvent: BreezeEvent; entrustEventPeople: EventPerson[] },
    ) => ({
      ...state,
      entrustEvent: payload.entrustEvent,
      entrustEventPeople: payload.entrustEventPeople,
    }),
    selectTeacherEvent: (
      state,
      payload: { teacherEvent: BreezeEvent; teacherEventPeople: EventPerson[] },
    ) => ({
      ...state,
      teacherEvent: payload.teacherEvent,
      teacherEventPeople: payload.teacherEventPeople,
    }),
    clear: (state, payload: Clear) => {
      switch (payload) {
        case Clear.All:
          return {
            ...state,
            entrustEvent: null,
            teacherEvent: null,
            entrustEventPeople: [],
            teacherEventPeople: [],
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
      }
    },
  },
  effects: (dispatch) => ({
    selectEntrustEventAsync: async (_, { settings }) => {
      clearInterval(entrustAttendanceInt)

      const events = await getEventsForDate(settings.date)
      const entrustEventId = events.find((e) => e.event_id === settings.entrustEventId)
        ?.id

      if (!entrustEventId) {
        dispatch.events.clear(Clear.EntrustEvent)
        return
      }

      const [entrustEvent, entrustEventPeople] = await Promise.all([
        getEvent(entrustEventId),
        getEligibleForEvent(entrustEventId),
      ])
      dispatch.events.selectEntrustEvent({ entrustEvent, entrustEventPeople })

      entrustAttendanceInt = setInterval(
        () => pollEntrustAttendance(dispatch, entrustEventId),
        INTERVAL,
      )
      pollEntrustAttendance(dispatch, entrustEventId)
    },
    selectTeacherEventAsync: async (_, { settings }) => {
      clearInterval(teacherAttendanceInt)

      const events = await getEventsForDate(settings.date)
      const teacherEventId = events.find((e) => e.event_id === settings.teacherEventId)
        ?.id

      if (!teacherEventId) {
        dispatch.events.clear(Clear.TeacherEvent)
        return
      }

      const [teacherEvent, teacherEventPeople] = await Promise.all([
        getEvent(teacherEventId),
        getEligibleForEvent(teacherEventId),
      ])
      dispatch.events.selectTeacherEvent({ teacherEvent, teacherEventPeople })

      teacherAttendanceInt = setInterval(
        () => pollTeacherAttendance(dispatch, teacherEventId),
        INTERVAL,
      )
      pollTeacherAttendance(dispatch, teacherEventId)
    },
  }),
})

let entrustAttendanceInt: NodeJS.Timeout
let teacherAttendanceInt: NodeJS.Timeout

const pollEntrustAttendance = async (
  dispatch: RematchDispatch<RootModel>,
  eventId: string,
) => {
  const attendance = await getAttendance(eventId)
  dispatch.attendance.setEntrust(attendance)
}

const pollTeacherAttendance = async (
  dispatch: RematchDispatch<RootModel>,
  eventId: string,
) => {
  const attendance = await getAttendance(eventId)
  dispatch.attendance.setTeacher(attendance)
}
