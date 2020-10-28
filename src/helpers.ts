import { Alert } from 'react-native'
import { baseUrl } from './api'
import placeholder from './assets/gray.png'

type Stringable = {
  toString(): string
}

export const mapData = (a: Stringable[], index?: number) =>
  a.map((n, i) => {
    const name = n.toString()
    if (index === i) return { name, selected: true }
    return { name, selected: false }
  })

interface IPath {
  path: string
}

export const source = (person: IPath) =>
  person.path.includes('generic') ? placeholder : { uri: `${baseUrl}/${person.path}` }

export const prompt = async (name: string, pin?: string) => {
  return new Promise((resolve, reject) => {
    Alert.prompt(
      'Enter PIN',
      `Enter the Entrust PIN for\n${name}:`,
      (text) => {
        if (pin === text) resolve()
        else reject()
      },
      'secure-text',
    )
  })
}
