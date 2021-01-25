import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import * as Print from 'expo-print'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import Toast from 'react-native-root-toast'
import { connect } from 'react-redux'
import { ALLERGIES_KEY, ENTRUST_KEY, PIN_KEY } from '../../env'
import { prompt } from '../../helpers'
import { ListPerson } from '../../models/selected'
import { HomeStackParamList } from '../../navigation/AppNavigator'
import { Dispatch, RootState } from '../../store'
import { FamilyList } from './FamilyList'
import {
  getAdultLabelHtml,
  getChildLabelHtml,
  getParentLabelHtml,
  getStyle,
} from './htmlBuilder'

const mapState = (state: RootState) => ({
  printer: state.settings.printer,
  numParentTags: state.settings.numParentTags,
  selected: state.selected,
  events: state.events,
})

const mapDispatch = (dispatch: Dispatch) => ({
  toggleChecked: dispatch.selected.toggleChecked,
  checkIn: dispatch.attendance.checkInChildAsync,
  checkInTeacher: dispatch.attendance.checkInTeacherAsync,
  clearSearch: () => dispatch.searchText.set(''),
})

type FamilyNavigationProp = {
  navigation: StackNavigationProp<HomeStackParamList, 'Family'>
  route: RouteProp<HomeStackParamList, 'Family'>
}

type Props = FamilyNavigationProp &
  ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>

const ScreenContents: React.FC<Props> = ({
  navigation,
  selected,
  events,
  numParentTags,
  printer,
  checkIn,
  checkInTeacher,
  toggleChecked,
  clearSearch,
}) => {
  const personIsSelected = selected.list.filter((p) => p.selected).length > 0
  const childIsSelected =
    selected.list.filter(
      (p) =>
        p.selected &&
        selected.children.find((c) => c.id === p.id) &&
        !events.teacherEventPeople.find((t) => t.id === p.id),
    ).length > 0

  const headHasPin = !!selected.head?.details[PIN_KEY]
  const missingPinAndChildSelected = !headHasPin && childIsSelected
  const disablePrint = selected.loading || !personIsSelected || missingPinAndChildSelected

  const showNotice =
    selected.list.length > 0 && !headHasPin && selected.children.length > 0

  const showNotEligible =
    !selected.loading &&
    personIsSelected &&
    selected.list
      .filter((l) => l.selected)
      .some(
        (p) =>
          !selected.children.find((c) => c.id === p.id) &&
          !events.teacherEventPeople.find((t) => t.id === p.id),
      )

  const notEligibleText = showNotEligible
    ? `A selected person is not eligible for either the ${events.entrustEvent?.name} or ${events.teacherEvent?.name} events and will not be printed.`
    : ''

  const print = async () => {
    if (!printer?.url) {
      Toast.show('Please select printer')
      return
    }

    Toast.show('Your badges are being printed.')

    const checked = selected.list.filter((p) => p.selected)
    const parentNames =
      selected.parents.map((p) => p.first_name).join(' & ') +
      ' ' +
      selected.parents[0].last_name

    const html = [getStyle()]
    if (childIsSelected) {
      const selectedChildren = selected.children.filter(
        (c) =>
          checked.find((k) => k.id === c.id) &&
          !events.teacherEventPeople.find((t) => t.id === c.id),
      )

      const names = selectedChildren.map((p) => `${p.first_name} ${p.last_name}`)

      const adultHtml = getParentLabelHtml(names, parentNames)
      for (let i = 0; i < numParentTags; i++) html.push(adultHtml)

      selectedChildren.forEach((c) => {
        const childHtml = getChildLabelHtml(
          `${c.first_name} ${c.last_name}`,
          parentNames,
          c.details[ALLERGIES_KEY],
          c.details[ENTRUST_KEY],
        )
        html.push(childHtml)
        checkIn(c.id)
      })
    }

    const selectedHelpers = checked.filter((c) =>
      events.teacherEventPeople.find((t) => t.id === c.id),
    )

    selectedHelpers.forEach((s) => {
      html.push(getAdultLabelHtml(`${s.first_name} ${s.last_name}`))
      checkInTeacher(s.id)
    })

    await Print.printAsync({
      printerUrl: printer.url.replace('ipps', 'ipp'),
      orientation: Print.Orientation.landscape,
      markupFormatterIOS: html.join(''),
    })

    clearSearch()
    navigation.goBack()
  }

  const onPressPrint = () => {
    const name = `${selected.head?.first_name} ${selected.head?.last_name}`
    if (childIsSelected)
      prompt(name, selected.head?.details[PIN_KEY])
        .then(print)
        .catch(() => Toast.show('The PIN you entered was incorrect.'))
    else print()
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      {showNotice && (
        <Toast visible hideOnPress={false}>
          In order to print child tags, you are required to set a PIN. Please see the
          Welcome Desk for assistance with creating a PIN.
        </Toast>
      )}

      <View style={{ margin: 20 }}>
        <Button
          title="Print Selected"
          icon={{ name: 'print', color: 'white' }}
          onPress={onPressPrint}
          disabled={disablePrint}
        />
      </View>

      <Text style={{ marginBottom: 15 }}>{notEligibleText}</Text>

      {!!selected.list.length && (
        <FamilyList
          data={selected.list}
          onPress={(item: ListPerson) => toggleChecked(item.id)}
        />
      )}
    </View>
  )
}

const ConnectedContents = connect(mapState, mapDispatch)(ScreenContents)

export const FamilyScreen: React.FC<FamilyNavigationProp> = (props) => {
  useEffect(() => {
    props.navigation.setOptions({ title: props.route.params.childName })
  }, [])
  return <ConnectedContents {...props} />
}
