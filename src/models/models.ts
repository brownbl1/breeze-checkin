import { Models } from '@rematch/core'

import { API_KEY, SUB } from '../env'
import { selectedChild } from './selectedChild'
import { printDetails } from './printDetails'
import { selectedChildRelationships } from './selectedChildRelationships'
import { teachers } from './teachers'
import { event } from './event'
import { eventPeople } from './eventPeople'
import { teacherAttendance } from './teacherAttendance'
import { attendance } from './attendance'
import { printer } from './printer'
import { searchText } from './searchText'
import { EventPerson } from './dataModel'

const placeholder = require('../assets/gray.png')

export interface RootModel extends Models<RootModel> {
  selectedChild: typeof selectedChild
  printDetails: typeof printDetails
  selectedChildRelationships: typeof selectedChildRelationships
  teachers: typeof teachers
  event: typeof event
  eventPeople: typeof eventPeople
  attendance: typeof attendance
  teacherAttendance: typeof teacherAttendance
  printer: typeof printer
  searchText: typeof searchText
}

export const models: RootModel = {
  selectedChild,
  printDetails,
  selectedChildRelationships,
  teachers,
  event,
  eventPeople,
  attendance,
  teacherAttendance,
  printer,
  searchText,
}

export const baseUrl = `https://${SUB}.breezechms.com`
export const options = {
  headers: { 'Api-key': API_KEY },
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
