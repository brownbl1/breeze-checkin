import * as Print from 'expo-print'
import Toast from 'react-native-root-toast'
import {
  getChildLabelHtml,
  getParentLabelHtml,
  getAdultLabelHtml,
} from './htmlBuilder'
import { ALLERGIES_KEY, ENTRUST_KEY } from '../../env'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export const printLabels = async ({
  selectedChildRelationships,
  printDetails,
  isTeacher,
  printer,
  checkIn,
  checkInTeacher,
}) => {
  Toast.show('Your badges are being printed.')
  await sleep(500)

  const checked = selectedChildRelationships.filter(
    ({ details }) => details.checked
  )

  const parentNames =
    printDetails.parents.map(({ first_name }) => first_name).join(' & ') +
    ' ' +
    printDetails.parents[0].last_name

  const selectedChildrenNames = checked
    .filter(person =>
      printDetails.children.find(
        ({ id }) => id === person.person_id && !isTeacher(id)
      )
    )
    .map(({ details }) => `${details.first_name} ${details.last_name}`)

  const printAsync = html =>
    Print.printAsync({
      // printerUrl: printer.url,
      printerUrl: printer.url.replace('ipps', 'ipp'),
      orientation: Print.Orientation.landscape,
      markupFormatterIOS: html,
    })

  if (selectedChildrenNames.length) {
    await printAsync(getParentLabelHtml({ selectedChildrenNames, parentNames }))
  }

  for (let i = 0; i < checked.length; i++) {
    const person = checked[i]

    const child = printDetails.children.find(
      ({ id }) => id === person.person_id && !isTeacher(id)
    )

    if (child) {
      const name = `${child.first_name} ${child.last_name}`
      const entrustId = child.details[ENTRUST_KEY]
      const medical = child.details[ALLERGIES_KEY]

      await printAsync(
        getChildLabelHtml({
          name,
          entrustId,
          medical,
          parentNames,
        })
      )

      checkIn(child.id)
    } else {
      const { details } = person
      await printAsync(
        getAdultLabelHtml(`${details.first_name} ${details.last_name}`)
      )

      checkInTeacher(details.id)
    }
  }
}
