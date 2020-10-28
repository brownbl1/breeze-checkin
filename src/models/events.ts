import { createModel } from '@rematch/core'
import { getEligibleForEvent, getEvent, getEventsForDate } from '../api'
import { BreezeEvent, EventPerson } from './dataModel'
import { RootModel } from './models'

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
    loading: (state) => ({ ...state, loading: true }),
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
    },
    selectTeacherEventAsync: async (_, { settings }) => {
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
    },
  }),
})

// const fetchAttendance = async (
//   dispatch: RematchDispatch<RootModel>,
//   entrustEventId: string,
//   teacherEventId: string,
// ) => {
//   const entrustAttendanceProm = fetch(
//     `${baseUrl}/api/events/attendance/list?instance_id=${entrustEventId}`,
//     options,
//   )
//     .then((res) => res.json())
//     .catch(() => []) as Promise<Attendance[]>

//   const teacherAttendanceProm = fetch(
//     `${baseUrl}/api/events/attendance/list?instance_id=${teacherEventId}`,
//     options,
//   )
//     .then((res) => res.json())
//     .catch(() => []) as Promise<Attendance[]>

//   const [entrustAttendance, teacherAttendance] = await Promise.all([
//     entrustAttendanceProm,
//     teacherAttendanceProm,
//   ])

//   dispatch.attendance.set({ entrustAttendance, teacherAttendance })
// }
