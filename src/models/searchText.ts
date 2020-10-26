import { createModel } from '@rematch/core'
import { RootModel } from './models'

type State = string | null

export const searchText = createModel<RootModel>()({
  state: null as State,
  reducers: {
    set: (_, text: string) => text,
    'events/loading': () => null,
  },
})
