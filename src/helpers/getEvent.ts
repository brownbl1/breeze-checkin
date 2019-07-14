import { AsyncStorage } from 'react-native'

export const getEvent = async () => {
  const eventString = await AsyncStorage.getItem('event')
  if (eventString) {
    return JSON.parse(eventString)
  }

  return null
}

export const setEvent = async event => {
  AsyncStorage.setItem('event', JSON.stringify(event))
}
