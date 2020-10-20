import { createModel } from '@rematch/core'
import { RootModel } from './models'

export const searchText = createModel<RootModel>()({
  state: null as string,
  reducers: {
    set: (_, text: string) => text,
    'event/loading': () => null,
  },
})
