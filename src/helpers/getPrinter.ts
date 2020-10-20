import { AsyncStorage } from 'react-native'
import Constants from 'expo-constants'
import * as Print from 'expo-print'

export const getPrinter = async () => {
  const printerString = await AsyncStorage.getItem('printer')
  return printerString ? JSON.parse(printerString) : ''
}

export const setPrinter = async () => {
  const selected = Constants.platform.ios
    ? await Print.selectPrinterAsync()
    : { name: "Tom's Printer", url: 'ipps://someaddr' }

  await AsyncStorage.setItem('printer', JSON.stringify(selected))
  return selected
}
