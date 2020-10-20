import { createModel } from '@rematch/core'
import { Person, FamilyPerson } from './dataModel'
import { RootModel, baseUrl, options } from './models'

const getSpouse = (spouse: FamilyPerson, headId: string): Promise<Person> => {
  if (spouse && spouse.person_id !== headId) {
    return fetch(
      `${baseUrl}/api/people/${spouse.person_id}`,
      options,
    ).then((res) => res.json()) as Promise<Person>
  }

  return Promise.resolve(null)
}

export type PrintDetailsState = {
  head: Person
  children: Person[]
  parents: Person[]
}

export const printDetails = createModel<RootModel>()({
  state: { head: null, children: [], parents: [] } as PrintDetailsState,
  reducers: {
    set: (_, details: PrintDetailsState) => details,
  },
  effects: (dispatch) => ({
    fetchAsync: async (family: FamilyPerson[]) => {
      dispatch.printDetails.set(null)

      const head = family.find(({ role_id }) => role_id === '4') // head of household
      const spouse = family.find(({ role_id }) => role_id === '5') // spouse
      const adult = family.find(({ role_id }) => role_id === '3') // adult

      const { person_id: headId } = head || spouse || adult

      const headPromise = fetch(
        `${baseUrl}/api/people/${headId}`,
        options,
      ).then((res) => res.json()) as Promise<Person>

      const spousePromise = getSpouse(spouse, headId)

      const childrenPromise = Promise.all(
        family
          .filter(({ role_id }) => role_id === '2') // child
          .map(({ person_id }) =>
            fetch(`${baseUrl}/api/people/${person_id}`, options).then(
              (res) => res.json() as Promise<Person>,
            ),
          ),
      )

      const [headJson, spouseJson, children] = await Promise.all([
        headPromise,
        spousePromise,
        childrenPromise,
      ])

      const parents = spouseJson ? [headJson, spouseJson] : [headJson]
      dispatch.printDetails.set({ head: headJson, children, parents })
    },
  }),
})
