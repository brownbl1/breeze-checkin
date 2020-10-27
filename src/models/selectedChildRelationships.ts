import { createModel } from '@rematch/core'
import { FamilyPerson, Person } from './dataModel'
import { baseUrl, mapPerson, options, RootModel } from './models'

export type RelationshipsState = FamilyPerson[] | null

export const selectedChildRelationships = createModel<RootModel>()({
  state: null as RelationshipsState,
  reducers: {
    set: (_, relationships: RelationshipsState) => relationships,
    toggleChecked: (state, id: string) =>
      state &&
      state.map((person) => {
        const { details, ...restPerson } = person
        if (details.id !== id) {
          return person
        }

        const { checked, ...restDetails } = details
        return {
          details: {
            checked: !checked,
            ...restDetails,
          },
          ...restPerson,
        }
      }),
  },
  effects: (dispatch) => ({
    fetchRelationshipsAsync: async (personId: string) => {
      dispatch.selectedChildRelationships.set(null)

      const { family } = (await fetch(
        `${baseUrl}/api/people/${personId}`,
        options,
      ).then((res) => res.json())) as Person

      const withDetails = family.map(({ details, ...rest }) => ({
        details: mapPerson(details),
        ...rest,
      }))

      dispatch.selectedChildRelationships.set(withDetails)
      dispatch.printDetails.fetchAsync(family)
    },
  }),
})
