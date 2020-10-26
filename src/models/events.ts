import { createModel } from '@rematch/core'

import { RootModel } from './models'
import { BreezeEvent, EventPerson } from './dataModel'
import { getEligibleForEvent, getEvent, getEventsForDate } from '../api'

export type EventState = {
  entrustEvent: BreezeEvent | null
  teacherEvent: BreezeEvent | null
  entrustEventPeople: EventPerson[] | null
  teacherEventPeople: EventPerson[] | null
  loading: boolean
}

enum Clear {
  All,
  EntrustEvent,
  TeacherEvent,
}

export const events = createModel<RootModel>()({
  state: {
    entrustEvent: null,
    teacherEvent: null,
    entrustEventPeople: null,
    teacherEventPeople: null,
    loading: false,
  } as EventState,
  reducers: {
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
            entrustEventPeople: null,
            teacherEventPeople: null,
          }
        case Clear.EntrustEvent:
          return {
            ...state,
            entrustEvent: null,
            entrustEventPeople: null,
          }
        case Clear.TeacherEvent:
          return {
            ...state,
            teacherEvent: null,
            teacherEventPeople: null,
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
