import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { ImageView } from '../../components/ImageView'
import { AttendanceState } from '../../models/attendance'
import { EventPerson } from '../../models/dataModel'
import { EventState } from '../../models/events'
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

type UpdateHeader = {
  events: EventState
  date: string
  attendance: AttendanceState
}

type HomeNavigationProp = {
  navigation: StackNavigationProp<HomeStackParamList, 'Home'>
}

type Props = HomeNavigationProp &
  ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>

const getHeaderString = ({ events, attendance, date }: UpdateHeader) => {
  const { entrustAttendance, teacherAttendance } = attendance

  const title = `${events.entrustEvent?.name} - ${date}`
  if (entrustAttendance && teacherAttendance) {
    return `${title} (${entrustAttendance.length}, ${teacherAttendance.length})`
  }

  return title
}

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
      const title = getHeaderString({ events, date, attendance })
      navigation.setOptions({ title })
    }
  }, [
    events.entrustEvent,
    date,
    attendance.entrustAttendance,
    attendance.teacherAttendance,
  ])

  const onPress = (person: EventPerson) => {
    setPerson(person)
    navigation.navigate('Family', {
      childName: `${person.first_name} ${person.last_name}`,
    })

    setTimeout(() => setText(''), 500)
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
