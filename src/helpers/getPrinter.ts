import { AsyncStorage } from 'react-native'
import Constants from 'expo-constants'
import * as Print from 'expo-print'

export const getPrinter = async (clearCache = false) => {
  if (clearCache) {
    await AsyncStorage.removeItem('printer')
  }

  if (!clearCache) {
    const printerString = await AsyncStorage.getItem('printer')
    if (printerString) {
      return JSON.parse(printerString)
    }
  }

  try {
    const selected = Constants.platform.ios
      ? await Print.selectPrinterAsync()
      : { name: "Tom's Printer", url: 'ipps://someaddr' }

    await AsyncStorage.setItem('printer', JSON.stringify(selected))
    return selected
  } catch (error) {
    return null
  }
}
