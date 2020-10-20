import { createModel } from '@rematch/core'
import { Person } from './dataModel'
import { RootModel } from './models'

export const selectedChild = createModel<RootModel>()({
  state: null as Person,
  reducers: {
    select(_, child: Person) {
      return child
    },
  },
  effects: (dispatch) => ({
    selectAsync: async (child: Person) => {
      dispatch.printDetails.set(null)
      dispatch.selectedChild.select(child)
      dispatch.selectedChildRelationships.fetchRelationshipsAsync(child.id)
    },
  }),
})
