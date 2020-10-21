import { Models } from '@rematch/core'
import Constants from 'expo-constants'

import { SUB } from '../env'
import { selectedChild } from './selectedChild'
import { printDetails } from './printDetails'
import { selectedChildRelationships } from './selectedChildRelationships'
import { events } from './events'
import { searchList } from './searchList'
import { attendance } from './attendance'
import { searchText } from './searchText'
import { EventPerson } from './dataModel'
import { settings } from './settings'

const placeholder = require('../assets/gray.png')

export interface RootModel extends Models<RootModel> {
  selectedChild: typeof selectedChild
  printDetails: typeof printDetails
  selectedChildRelationships: typeof selectedChildRelationships
  events: typeof events
  attendance: typeof attendance
  settings: typeof settings
  searchText: typeof searchText
  searchList: typeof searchList
}

export const models: RootModel = {
  selectedChild,
  printDetails,
  selectedChildRelationships,
  events,
  attendance,
  settings,
  searchText,
  searchList,
}

export const baseUrl = `https://${SUB}.breezechms.com`
export const options = {
  headers: { 'Api-key': Constants.manifest.extra.API_KEY },
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
