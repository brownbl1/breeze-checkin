import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { ImageView } from '../../components/ImageView'
import { EventPerson } from '../../models/dataModel'
import { HomeStackParamList } from '../../navigation/AppNavigator'
import { Dispatch, RootState } from '../../store'
import PeopleList from './PeopleList'
import { Search } from './SearchBar'

const mapState = (state: RootState) => ({
  events: state.events,
  searchText: state.searchText,
  attendance: state.attendance,
  date: state.settings.date,
})

const mapDispatch = (dispatch: Dispatch) => ({
  setText: dispatch.searchText.set,
  setPerson: dispatch.selected.setPerson,
})

type HomeNavigationProp = {
  navigation: StackNavigationProp<HomeStackParamList, 'Home'>
}

type Props = HomeNavigationProp &
  ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>

const ScreenContents: React.FC<Props> = ({
  navigation,
  searchText,
  setText,
  setPerson,
  events,
  attendance,
  date,
}) => {
  useEffect(() => {
    if (events.entrustEvent) {
      const { entrustAttendance, teacherAttendance, doctrine101Attendance } = attendance
      const title = `${events.entrustEvent.name} - ${date} (${entrustAttendance.length}, ${teacherAttendance.length}, ${doctrine101Attendance.length})`
      navigation.setOptions({ title })
    }
  }, [
    events.entrustEvent,
    date,
    attendance.entrustAttendance,
    attendance.teacherAttendance,
    attendance.doctrine101Attendance,
  ])

  const onPress = (person: EventPerson) => {
    setPerson(person)
    navigation.navigate('Family', {
      childName: `${person.first_name} ${person.last_name}`,
    })
  }

  return (
    <View style={{ height: '100%' }}>
      <Search value={searchText} onChangeText={setText} />
      {!events.filtered.length && <ImageView />}
      {!!events.filtered.length && (
        <PeopleList people={events.filtered} onPress={onPress} />
      )}
    </View>
  )
}

const ConnectedContents = connect(mapState, mapDispatch)(ScreenContents)

export const HomeScreen: React.FC<HomeNavigationProp> = (props) => {
  return <ConnectedContents {...props} />
}
