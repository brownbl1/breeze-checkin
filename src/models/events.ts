import { createModel, RematchDispatch } from '@rematch/core'
import moment from 'moment'
import { RootModel, baseUrl, options, mapPerson } from './models'
import { Attendance, BreezeEvent, EventPerson } from './dataModel'
import { store } from '../store'

export type EventState = {
  entrustEvent: BreezeEvent
  teacherEvent: BreezeEvent
  entrustEventPeople: EventPerson[]
  teacherEventPeople: EventPerson[]
  loading: boolean
}

let attendanceInterval: number

const noop = new Promise((resolve) => resolve(null))

export const events = createModel<RootModel>()({
  state: {
    entrustEvent: null,
    teacherEvent: null,
    entrustEventPeople: null,
    teacherEventPeople: null,
    loading: false,
  } as EventState,
  reducers: {
    select: (
      _,
      events: {
        entrustEvent: BreezeEvent
        teacherEvent: BreezeEvent
        entrustEventPeople: EventPerson[]
        teacherEventPeople: EventPerson[]
      },
    ) => ({
      ...events,
      loading: false,
    }),
    loading: (state) => ({ ...state, loading: true }),
    clear: (state) => ({
      ...state,
      entrustEvent: null,
      teacherEvent: null,
      entrustEventPeople: null,
      teacherEventPeople: null,
    }),
  },
  effects: (dispatch) => ({
    getEventsForDate: async (_, { settings }) => {
      const dateString = moment(settings.date, 'M/D/YYYY').format('YYYY-M-D')
      const events = (await fetch(
        `${baseUrl}/api/events?start=${dateString}&end=${dateString}`,
        options,
      ).then((res) => res.json())) as BreezeEvent[]

      return events
    },
    selectAsync: async (_, { settings }) => {
      dispatch.events.loading()

      if (!settings.date) return

      const dateString = moment(settings.date, 'M/D/YYYY').format('YYYY-M-D')
      const events = (await fetch(
        `${baseUrl}/api/events?start=${dateString}&end=${dateString}`,
        options,
      ).then((res) => res.json())) as BreezeEvent[]

      const promises = []

      if (settings.entrustEventId) {
        const entrustEventId = events.find(
          (e) => e.event_id === settings.entrustEventId,
        ).id

        const entrustEventPromise = fetch(
          `${baseUrl}/api/events/list_event?instance_id=${entrustEventId}`,
          options,
        ).then((res) => res.json()) as Promise<BreezeEvent>

        promises.push(entrustEventPromise)

        const entrustEventPeoplePromise = fetch(
          `${baseUrl}/api/events/attendance/eligible?instance_id=${entrustEventId}`,
          options,
        ).then((res) => res.json()) as Promise<EventPerson[]>

        promises.push(entrustEventPeoplePromise)
      } else {
        promises.push(noop, noop)
      }

      if (settings.teacherEventId) {
        const teacherEventId = events.find(
          (e) => e.event_id === settings.teacherEventId,
        ).id

        const teacherEventPromise = fetch(
          `${baseUrl}/api/events/list_event?instance_id=${teacherEventId}`,
          options,
        ).then((res) => res.json()) as Promise<BreezeEvent>

        promises.push(teacherEventPromise)

        const teacherEventPeoplePromise = fetch(
          `${baseUrl}/api/events/attendance/eligible?instance_id=${teacherEventId}`,
          options,
        ).then((res) => res.json()) as Promise<EventPerson[]>

        promises.push(teacherEventPeoplePromise)
      } else {
        promises.push(noop, noop)
      }

      type Results = [
        entrustEvent: BreezeEvent,
        entrustEventPeople: EventPerson[],
        teacherEvent: BreezeEvent,
        teacherEventPeople: EventPerson[],
      ]

      const [
        entrustEvent,
        entrustEventPeople,
        teacherEvent,
        teacherEventPeople,
      ] = (await Promise.all(promises)) as Results

      const entrustEventPeopleCleaned =
        entrustEventPeople &&
        entrustEventPeople.filter(({ first_name }) => first_name).map(mapPerson)

      dispatch.events.select({
        entrustEvent,
        teacherEvent,
        entrustEventPeople: entrustEventPeopleCleaned,
        teacherEventPeople,
      })

      dispatch.searchList.select(entrustEventPeopleCleaned)

      if (entrustEvent && teacherEvent) {
        clearInterval(attendanceInterval)
        const repeat = () =>
          fetchAttendance(dispatch, entrustEvent.id, teacherEvent.id)
        attendanceInterval = setInterval(repeat, 1000 * 60 * 1)
        repeat()
      }
    },
  }),
})

const fetchAttendance = async (
  dispatch: RematchDispatch<RootModel>,
  entrustEventId: string,
  teacherEventId: string,
) => {
  const entrustAttendanceProm = fetch(
    `${baseUrl}/api/events/attendance/list?instance_id=${entrustEventId}`,
    options,
  )
    .then((res) => res.json())
    .catch(() => []) as Promise<Attendance[]>

  const teacherAttendanceProm = fetch(
    `${baseUrl}/api/events/attendance/list?instance_id=${teacherEventId}`,
    options,
  )
    .then((res) => res.json())
    .catch(() => []) as Promise<Attendance[]>

  const [entrustAttendance, teacherAttendance] = await Promise.all([
    entrustAttendanceProm,
    teacherAttendanceProm,
  ])

  dispatch.attendance.set({ entrustAttendance, teacherAttendance })
}
