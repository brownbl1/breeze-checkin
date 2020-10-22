import { createModel } from '@rematch/core'
import { EventPerson } from './dataModel'
import { RootModel } from './models'

const startsWith = (text: string) => (name: string) => name.startsWith(text)

type EventPeopleState = {
  cache: EventPerson[]
  filtered: EventPerson[]
}

export const searchList = createModel<RootModel>()({
  state: { cache: [], filtered: [] } as EventPeopleState,
  reducers: {
    select: (_, payload: EventPerson[]) => {
      return { cache: payload || [], filtered: [] }
    },
    'events/loading': () => ({ cache: [], filtered: [] }),
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
})
