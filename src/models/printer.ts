import { createModel } from '@rematch/core'
import { RootModel } from './models'

export type Printer = {
  name: string
  url: string
}

export const printer = createModel<RootModel>()({
  state: null as Printer,
  reducers: {
    select: (_, printer: Printer) => printer,
  },
})
