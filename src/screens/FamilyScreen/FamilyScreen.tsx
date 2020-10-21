import React, { useEffect } from 'react'
import { ImageSourcePropType, View } from 'react-native'
import { connect } from 'react-redux'
import { Alert } from 'react-native'
import { Button } from 'react-native-elements'
import { Action } from '@rematch/core'
import Toast from 'react-native-root-toast'

import { FamilyList } from './FamilyList'
import { printLabels } from './printLabels'
import { PIN_KEY } from '../../env'
import { Dispatch, RootState } from '../../store'
import { Attendance, CommonPersonDetails } from '../../models/dataModel'
import { PrintDetailsState } from '../../models/printDetails'
import { RelationshipsState } from '../../models/selectedChildRelationships'
import { StackNavigationProp } from '@react-navigation/stack'
import { HomeStackParamList } from '../../navigation/AppNavigator'
import { Printer } from 'expo-print'

export type FamilyRowData = {
  thumb_path: string
  checked: boolean
  id: string
  first_name: string
  force_first_name: string
  last_name: string
  path: string
  name: string
  source: ImageSourcePropType
  attendance: Attendance
}

const mapState = ({
  selectedChild,
  selectedChildRelationships,
  attendance,
  printDetails,
  settings: { printer },
  events: { teacherEventPeople },
}: RootState) => ({
  selectedChild,
  selectedChildRelationships,
  attendance,
  printDetails,
  printer,
  teacherEventPeople,
})

const mapDispatch = (dispatch: Dispatch) => ({
  toggleChecked: dispatch.selectedChildRelationships.toggleChecked,
  checkIn: dispatch.attendance.checkInChildAsync,
  checkInTeacher: dispatch.attendance.checkInTeacherAsync,
  setText: dispatch.searchText.set,
})

type FamilyNavigationProp = {
  navigation: StackNavigationProp<HomeStackParamList, 'Family'>
}

type Props = {
  goHome: () => void
  setTitle: (name: string) => void
} & FamilyNavigationProp &
  ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>

const hasPin = ({ printDetails }: { printDetails: PrintDetailsState }) =>
  hasDetails({ printDetails }) && printDetails.head.details[PIN_KEY]

const requirePin = ({
  printDetails,
  selectedChildRelationships,
  isChild,
}: {
  printDetails: PrintDetailsState
  selectedChildRelationships: RelationshipsState
  isChild: IsChild
}) =>
  (hasPin({ printDetails }) &&
    childSelected({ selectedChildRelationships, isChild })) ||
  childSelected({ selectedChildRelationships, isChild })

type PrintProps = {
  printDetails: PrintDetailsState
  isChild: IsChild
  selectedChildRelationships: RelationshipsState
  setText: (payload: string) => Action<string>
  goHome: () => void
  checkIn: (payload: string) => Promise<void>
  checkInTeacher: (payload: string) => Promise<void>
  isTeacher: (person_id: string) => CommonPersonDetails
  printer: Printer
}

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
}: PrintProps) => () => {
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
        (text) =>
          head.details[PIN_KEY] === text
            ? _print()
            : Toast.show('The PIN you entered was incorrect.'),
        'secure-text',
      )
    : _print()
}

const hasDetails = ({ printDetails }: { printDetails: PrintDetailsState }) =>
  printDetails && printDetails.head

const listContainsChildren = ({
  selectedChildRelationships,
  isChild,
}: {
  selectedChildRelationships: RelationshipsState
  isChild: IsChild
}) => selectedChildRelationships && selectedChildRelationships.some(isChild)

const childSelected = ({
  selectedChildRelationships,
  isChild,
}: {
  selectedChildRelationships: RelationshipsState
  isChild: IsChild
}) => {
  return (
    selectedChildRelationships &&
    selectedChildRelationships
      .filter(({ details }) => details.checked)
      .some(isChild)
  )
}

type IsChild = ({
  role_id,
  person_id,
}: {
  role_id: string
  person_id: string
}) => boolean

type PrintData = {
  data: FamilyRowData[]
  printDetails: PrintDetailsState
  selectedChildRelationships: RelationshipsState
  isChild: IsChild
}

const enablePrint = ({
  data,
  printDetails,
  selectedChildRelationships,
  isChild,
}: PrintData) => {
  const personSelected = data && data.filter(({ checked }) => checked).length

  const disableDueToChildSelectedAndMissingPin =
    childSelected({ selectedChildRelationships, isChild }) &&
    !hasPin({ printDetails })

  return personSelected && !disableDueToChildSelectedAndMissingPin
}

const ScreenContents: React.FC<Props> = ({
  selectedChildRelationships,
  attendance: { entrustAttendance },
  printDetails,
  toggleChecked,
  teacherEventPeople,
  setText,
  goHome,
  checkIn,
  checkInTeacher,
  selectedChild: { name },
  setTitle,
  printer,
}) => {
  useEffect(() => {
    setTitle(name)
  }, [name])

  const isTeacher = (person_id: string) =>
    teacherEventPeople.find(({ id }) => id === person_id)
  const isChild = ({
    role_id,
    person_id,
  }: {
    role_id: string
    person_id: string
  }) => role_id === '2' && !isTeacher(person_id)

  const data =
    selectedChildRelationships &&
    selectedChildRelationships.map(({ details }) => ({
      attendance: entrustAttendance.find(
        ({ person_id }) => person_id === details.id,
      ),
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

  const onPressRow = (item: FamilyRowData) => toggleChecked(item.id)

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

export const FamilyScreen: React.FC<FamilyNavigationProp> = (props) => {
  const goHome = () => props.navigation.goBack()
  const setTitle = (name: string) =>
    props.navigation.setOptions({ title: name })
  return <ConnectedContents {...props} goHome={goHome} setTitle={setTitle} />
}
