import { createModel } from '@rematch/core'
import { EventPerson } from './dataModel'
import { RootModel, baseUrl, options } from './models'

type TeachersState = EventPerson[]

export const teachers = createModel<RootModel>()({
  state: [] as TeachersState,
  reducers: {
    set: (_, teachers: EventPerson[]) => teachers,
  },
  effects: (dispatch) => ({
    setAsync: async (eventId: string) => {
      const json = (await fetch(
        `${baseUrl}/api/events/attendance/eligible?instance_id=${eventId}`,
        options,
      ).then((res) => res.json())) as EventPerson[]

      dispatch.teachers.set(json)
    },
  }),
})
