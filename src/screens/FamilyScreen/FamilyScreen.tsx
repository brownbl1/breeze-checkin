import React, { useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Alert } from 'react-native'
import { Button } from 'react-native-elements'
import { PIN_KEY } from '../../env'
import Toast from 'react-native-root-toast'
import FamilyList from './FamilyList'
import { NavigationScreenProps } from 'react-navigation'
import { printLabels } from './printLabels'

const mapState = ({
  selectedChild,
  selectedChildRelationships,
  attendance,
  printDetails,
  printer,
  teachers,
}) => ({
  selectedChild,
  selectedChildRelationships,
  attendance,
  printDetails,
  printer,
  teachers,
})

const mapDispatch = dispatch => ({
  toggleChecked: dispatch.selectedChildRelationships.toggleChecked,
  checkIn: dispatch.attendance.checkInAsync,
  checkInTeacher: dispatch.attendance.checkInTeacherAsync,
  setText: dispatch.searchText.set,
})

type Props = {
  goHome: () => void
  setTitle: (name: string) => void
} & ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>

const hasPin = ({ printDetails }) =>
  hasDetails({ printDetails }) && printDetails.head.details[PIN_KEY]

const requirePin = ({ printDetails, selectedChildRelationships, isChild }) =>
  (hasPin({ printDetails }) &&
    childSelected({ selectedChildRelationships, isChild })) ||
  childSelected({ selectedChildRelationships, isChild })

const _onPressPrint = ({
  printDetails,
  isChild,
  selectedChildRelationships,
  setText,
  goHome,
  checkIn,
  checkInTeacher,
  isTeacher,
  printer,
}) => () => {
  const { head } = printDetails
  const name = `${head.first_name} ${head.last_name}`

  const _print = async () => {
    await printLabels({
      printDetails,
      selectedChildRelationships,
      checkIn,
      checkInTeacher,
      isTeacher,
      printer,
    })
    setText('')
    goHome()
  }

  requirePin({ printDetails, isChild, selectedChildRelationships })
    ? Alert.prompt(
        'Enter PIN',
        `Enter the Entrust PIN for\n${name}:`,
        text =>
          head.details[PIN_KEY] === text
            ? _print()
            : Toast.show('The PIN you entered was incorrect.'),
        'secure-text',
      )
    : _print()
}

const hasDetails = ({ printDetails }) => printDetails && printDetails.head

const listContainsChildren = ({ selectedChildRelationships, isChild }) =>
  selectedChildRelationships && selectedChildRelationships.some(isChild)

const childSelected = ({ selectedChildRelationships, isChild }) => {
  return (
    selectedChildRelationships &&
    selectedChildRelationships
      .filter(({ details }) => details.checked)
      .some(isChild)
  )
}

const enablePrint = ({
  data,
  printDetails,
  selectedChildRelationships,
  isChild,
}) => {
  const personSelected = data && data.filter(({ checked }) => checked).length

  const disableDueToChildSelectedAndMissingPin =
    childSelected({ selectedChildRelationships, isChild }) &&
    !hasPin({ printDetails })

  return personSelected && !disableDueToChildSelectedAndMissingPin
}

const ScreenContents: React.FC<Props> = ({
  selectedChildRelationships,
  attendance,
  printDetails,
  toggleChecked,
  teachers,
  printer,
  setText,
  goHome,
  checkIn,
  checkInTeacher,
  selectedChild: { name },
  setTitle,
}) => {
  useEffect(() => {
    setTitle(name)
  }, [name])

  const isTeacher = person_id => teachers.find(({ id }) => id === person_id)
  const isChild = ({ role_id, person_id }) =>
    role_id === '2' && !isTeacher(person_id)

  const data =
    selectedChildRelationships &&
    selectedChildRelationships.map(({ details }) => ({
      attendance: attendance.find(({ person_id }) => person_id === details.id),
      ...details,
    }))

  const printDisabled = !enablePrint({
    data,
    printDetails,
    selectedChildRelationships,
    isChild,
  })

  const showNotice =
    listContainsChildren({ selectedChildRelationships, isChild }) &&
    hasDetails({ printDetails }) &&
    !hasPin({ printDetails })

  const onPressPrint = _onPressPrint({
    printDetails,
    isChild,
    selectedChildRelationships,
    setText,
    goHome,
    checkIn,
    checkInTeacher,
    isTeacher,
    printer,
  })

  const onPressRow = item => toggleChecked(item.id)

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      {showNotice && (
        <Toast visible={true}>
          In order to print child tags, you are required to set a PIN. Please
          see the Welcome Desk for assistance with creating a PIN.
        </Toast>
      )}
      <View style={{ margin: 20 }}>
        <Button
          title="Print Selected"
          icon={{ name: 'print', color: 'white' }}
          onPress={onPressPrint}
          disabled={printDisabled}
        />
      </View>
      {data && data.length && <FamilyList data={data} onPress={onPressRow} />}
    </View>
  )
}

const ConnectedContents = connect(mapState, mapDispatch)(ScreenContents)

export const FamilyScreen: React.FC<NavigationScreenProps> = ({
  navigation,
}) => {
  const goHome = () => navigation.goBack()
  const setTitle = (name: string) => navigation.setParams({ title: name })
  return <ConnectedContents goHome={goHome} setTitle={setTitle} />
}
