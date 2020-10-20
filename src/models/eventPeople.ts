import { createModel } from '@rematch/core'
import { EventPerson } from './dataModel'
import { RootModel, baseUrl, options, mapPerson } from './models'

let attendanceInterval: number

const startsWith = (text: string) => (name: string) => name.startsWith(text)

type EventPeopleState = {
  cache: EventPerson[]
  filtered: EventPerson[]
}

export const eventPeople = createModel<RootModel>()({
  state: { cache: [], filtered: [] } as EventPeopleState,
  reducers: {
    select: (_, payload: EventPerson[]) => {
      return { cache: payload, filtered: [] }
    },
    'event/loading': () => ({ cache: [], filtered: [] }),
    'searchText/set': ({ cache }, text: string) => {
      const t = text.trim().toLowerCase()
      if (!t || t.length < 3) {
        return { cache, filtered: [] }
      }

      const matcher = startsWith(t)
      const filtered = cache.filter((item) => {
        const name = item.name.toLowerCase()
        return name.split(' ').some(matcher) || matcher(name)
      })

      return { cache, filtered }
    },
  },
  effects: (dispatch) => ({
    selectAsync: async (eventId: string) => {
      const json = (await fetch(
        `${baseUrl}/api/events/attendance/eligible?instance_id=${eventId}`,
        options,
      ).then((res) => res.json())) as EventPerson[]

      const people = json.filter(({ first_name }) => first_name).map(mapPerson)

      dispatch.eventPeople.select(people)

      clearInterval(attendanceInterval)

      dispatch.attendance.fetchAsync(eventId)
      attendanceInterval = setInterval(
        () => dispatch.attendance.fetchAsync(eventId),
        1000 * 60 * 1, // 5 minutes
      )
    },
  }),
})
