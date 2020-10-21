import { createModel, RematchDispatch } from '@rematch/core'
import moment from 'moment'
import { RootModel, baseUrl, options, mapPerson } from './models'
import { Attendance, BreezeEvent, EventPerson } from './dataModel'

export type EventState = {
  entrustEvent: BreezeEvent
  teacherEventId: string
  entrustEventPeople: EventPerson[]
  teacherEventPeople: EventPerson[]
  loading: boolean
}

let attendanceInterval: number

export const events = createModel<RootModel>()({
  state: {
    entrustEvent: null,
    teacherEventId: null,
    entrustEventPeople: null,
    teacherEventPeople: null,
    loading: false,
  } as EventState,
  reducers: {
    select: (
      _,
      events: {
        entrustEvent: BreezeEvent
        teacherEventId: string
        entrustEventPeople: EventPerson[]
        teacherEventPeople: EventPerson[]
      },
    ) => ({
      ...events,
      loading: false,
    }),
    loading: (state) => ({ ...state, loading: true }),
  },
  effects: (dispatch) => ({
    selectAsync: async (_, { settings }) => {
      dispatch.events.loading()

      const dateString = moment(settings.date, 'M/D/YYYY').format('YYYY-M-D')
      const events = (await fetch(
        `${baseUrl}/api/events?start=${dateString}&end=${dateString}`,
        options,
      ).then((res) => res.json())) as BreezeEvent[]

      const entrustEventId = events.find(
        (e) => e.event_id === settings.entrustEventId,
      ).id
      const teacherEventId = events.find(
        (e) => e.event_id === settings.teacherEventId,
      ).id

      const entrustEventPromise = fetch(
        `${baseUrl}/api/events/list_event?instance_id=${entrustEventId}`,
        options,
      ).then((res) => res.json()) as Promise<BreezeEvent>

      const teacherEventPeoplePromise = fetch(
        `${baseUrl}/api/events/attendance/eligible?instance_id=${teacherEventId}`,
        options,
      ).then((res) => res.json()) as Promise<EventPerson[]>

      const entrustEventPeoplePromise = fetch(
        `${baseUrl}/api/events/attendance/eligible?instance_id=${entrustEventId}`,
        options,
      ).then((res) => res.json()) as Promise<EventPerson[]>

      const [
        entrustEvent,
        teacherEventPeople,
        entrustEventPeople,
      ] = await Promise.all([
        entrustEventPromise,
        teacherEventPeoplePromise,
        entrustEventPeoplePromise,
      ])

      const entrustEventPeopleCleaned = entrustEventPeople
        .filter(({ first_name }) => first_name)
        .map(mapPerson)

      dispatch.events.select({
        entrustEvent,
        teacherEventId,
        entrustEventPeople: entrustEventPeopleCleaned,
        teacherEventPeople,
      })

      dispatch.searchList.select(entrustEventPeopleCleaned)

      clearInterval(attendanceInterval)
      const repeat = () =>
        fetchAttendance(dispatch, entrustEventId, teacherEventId)
      attendanceInterval = setInterval(repeat, 1000 * 60 * 1)
      repeat()
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
