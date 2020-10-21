import { Printer } from 'expo-print'
import { AsyncStorage } from 'react-native'

export type Settings = {
  printer: Printer
  date: string
  entrustEventId: string
  teacherEventId: string
}

export const getSettings = async (): Promise<Settings | null> => {
  const settingsString = await AsyncStorage.getItem('settings')
  return settingsString ?? JSON.parse(settingsString)
}

export const setSettings = async (settings: Settings) => {
  await AsyncStorage.setItem('settings', JSON.stringify(settings))
}
