import { Models } from '@rematch/core'
import { attendance } from './attendance'
import { events } from './events'
import { searchText } from './searchText'
import { selected } from './selected'
import { settings } from './settings'

export interface RootModel extends Models<RootModel> {
  events: typeof events
  attendance: typeof attendance
  settings: typeof settings
  searchText: typeof searchText
  selected: typeof selected
}

export const models: RootModel = {
  events,
  attendance,
  settings,
  searchText,
  selected,
}
