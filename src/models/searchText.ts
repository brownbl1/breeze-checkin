import { createModel } from '@rematch/core'
import { RootModel } from './models'

export const searchText = createModel<RootModel>()({
  state: '',
  reducers: {
    set: (_, text: string) => text,
  },
})
