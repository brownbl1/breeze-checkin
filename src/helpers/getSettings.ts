import { Printer } from 'expo-print'
import { AsyncStorage } from 'react-native'

export type Settings = {
  printer: Printer
  numParentTags: number
  date: string
  dayOfWeek: number
  entrustEventId: string
  teacherEventId: string
}

export const missingSettings = (settings: Settings) =>
  !settings.entrustEventId ||
  !settings.teacherEventId ||
  !settings.date ||
  !settings.printer ||
  typeof settings.numParentTags !== 'number' ||
  typeof settings.dayOfWeek !== 'number'

export const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const getSettings = async (): Promise<Settings | null> => {
  const settingsString = await AsyncStorage.getItem('settings')
  return settingsString && JSON.parse(settingsString)
}

export const setSettings = async (settings: Settings) => {
  await AsyncStorage.setItem('settings', JSON.stringify(settings))
}
