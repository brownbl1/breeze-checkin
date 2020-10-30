import { createModel } from '@rematch/core'
import { RootModel } from '.'
import { getPerson } from '../api'
import { Attendance, EventPerson, Person } from './dataModel'

type SelectedState = {
  person: EventPerson | null
  list: ListPerson[]
  head: Person | null
  children: Person[]
  parents: IPerson[]
}

export type IPerson = {
  id: string
  first_name: string
  last_name: string
  path: string
}

export type ListPerson = IPerson & {
  selected?: boolean
  checkedIn?: boolean
}

const mapAttendance = (attendance: Attendance[]) => (p: ListPerson) => ({
  ...p,
  checkedIn: p.checkedIn || !!attendance.find((a) => a.person_id === p.id),
})

const attendance = (state: SelectedState, attendance: Attendance[]) => ({
  ...state,
  list: state.list.map(mapAttendance(attendance)),
})

export const selected = createModel<RootModel>()({
  state: {
    person: null,
    list: [],
    head: null,
    children: [],
    parents: [],
  } as SelectedState,
  reducers: {
    clear: (state) => ({
      ...state,
      list: [],
      head: null,
      children: [],
      parents: [],
    }),
    setPerson: (state, person: EventPerson) => {
      return {
        ...state,
        person,
      }
    },
    setList: (state, list: ListPerson[]) => {
      return {
        ...state,
        list,
      }
    },
    setChildren: (state, children: Person[]) => {
      return {
        ...state,
        children,
      }
    },
    setHead: (state, head: Person) => {
      return {
        ...state,
        head,
      }
    },
    setParents: (state, parents: IPerson[]) => {
      return {
        ...state,
        parents,
      }
    },
    'attendance/setEntrust': attendance,
    'attendance/setTeacher': attendance,
    toggleChecked: (state, personId: string) => {
      return {
        ...state,
        list: state.list.map((p) => ({
          ...p,
          selected: personId === p.id ? !p.selected : p.selected,
        })),
      }
    },
  },
  effects: (dispatch) => ({
    selectRelatedAsync: async (_, rootState) => {
      dispatch.selected.clear()

      if (!rootState.selected.person) return

      const attendance = [
        ...rootState.attendance.entrustAttendance,
        ...rootState.attendance.teacherAttendance,
      ]

      const person = await getPerson(rootState.selected.person.id)
      if (!person.family.length) {
        dispatch.selected.setList([person].map(mapAttendance(attendance)))
        return
      }

      dispatch.selected.setList(
        person.family.map((f) => f.details).map(mapAttendance(attendance)),
      )

      const head = person.family.find(({ role_id }) => role_id === '4') // head of household
      const spouse = person.family.find(({ role_id }) => role_id === '5') // spouse
      const adult = person.family.find(({ role_id }) => role_id === '3') // adult

      const headPerson = head || spouse || adult
      if (headPerson) {
        const headDetails = await getPerson(headPerson.person_id)
        dispatch.selected.setHead(headDetails)

        const parents = spouse
          ? [headPerson.details, spouse.details]
          : [headPerson.details]
        dispatch.selected.setParents(parents)
      }

      const children = await Promise.all(
        person.family.filter((f) => f.role_id === '2').map((c) => getPerson(c.person_id)),
      )

      dispatch.selected.setChildren(children)
    },
  }),
})
