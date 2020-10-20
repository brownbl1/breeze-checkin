import { AsyncStorage } from 'react-native'
import { BreezeEvent } from '../models/dataModel'

export const getEvent = async () => {
  const eventString = await AsyncStorage.getItem('event')
  if (eventString) {
    return JSON.parse(eventString)
  }

  return null
}

type EventArgs = {
  event: BreezeEvent
  teacherId: string
}

export const setEvent = async (event: EventArgs) => {
  AsyncStorage.setItem('event', JSON.stringify(event))
}
