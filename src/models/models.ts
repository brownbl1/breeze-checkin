import { Models } from '@rematch/core'
import { attendance } from './attendance'
import { EventPerson } from './dataModel'
import { events } from './events'
import { printDetails } from './printDetails'
import { searchList } from './searchList'
import { searchText } from './searchText'
import { selectedChildRelationships } from './selectedChildRelationships'
import { settings } from './settings'

const placeholder = require('../assets/gray.png')

export interface RootModel extends Models<RootModel> {
  printDetails: typeof printDetails
  selectedChildRelationships: typeof selectedChildRelationships
  events: typeof events
  attendance: typeof attendance
  settings: typeof settings
  searchText: typeof searchText
  searchList: typeof searchList
}

export const models: RootModel = {
  printDetails,
  selectedChildRelationships,
  events,
  attendance,
  settings,
  searchText,
  searchList,
}

type DetailsPerson = {
  thumb_path: string
  checked: boolean
} & EventPerson

type MapArgs = DetailsPerson | EventPerson

export function mapPerson<T extends MapArgs>(person: T): T {
  return {
    ...person,
    name: `${person.first_name} ${person.last_name}`.trim(),
    source: person.path.includes('generic')
      ? placeholder
      : { uri: `${baseUrl}/${person.path}` },
  }
}
