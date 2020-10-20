import { createModel } from '@rematch/core'
import moment from 'moment'
import { RootModel, baseUrl, options } from './models'
import { setEvent } from '../helpers/getEvent'
import { EVENT_ID, TEACHER_EVENT_ID } from '../env'
import { BreezeEvent } from './dataModel'

type EventState = {
  event: BreezeEvent
  date: string
  teacherId: string
  loading: boolean
}

export const event = createModel<RootModel>()({
  state: {
    event: null,
    date: null,
    teacherId: null,
    loading: false,
  } as EventState,
  reducers: {
    select: (
      { teacherId },
      { event, date }: { event: BreezeEvent; date: string },
    ) => ({
      event,
      date,
      teacherId,
      loading: false,
    }),
    selectTeacher: ({ event, date }, teacherId: string) => ({
      event,
      date,
      teacherId,
      loading: false,
    }),
    loading: (state) => ({ ...state, loading: true }),
  },
  effects: (dispatch) => ({
    selectAsync: async (date: Date) => {
      dispatch.event.loading()

      const dateString = moment(date).format('YYYY-M-D')
      const events = (await fetch(
        `${baseUrl}/api/events?start=${dateString}&end=${dateString}`,
        options,
      ).then((res) => res.json())) as BreezeEvent[]

      const entrustEvent = events.find((e) => e.event_id === EVENT_ID)

      const event = (await fetch(
        `${baseUrl}/api/events/list_event?instance_id=${entrustEvent.id}`,
        options,
      ).then((res) => res.json())) as BreezeEvent

      const teacherEvent = events.find((e) => e.event_id === TEACHER_EVENT_ID)

      dispatch.event.select({
        event,
        date: moment(event.start_datetime).format('M/D/YYYY'),
      })
      dispatch.event.selectTeacher(teacherEvent.id)

      dispatch.eventPeople.selectAsync(event.id)
      dispatch.teachers.setAsync(teacherEvent.id)
      setEvent({ event, teacherId: teacherEvent.id })
    },
  }),
})
