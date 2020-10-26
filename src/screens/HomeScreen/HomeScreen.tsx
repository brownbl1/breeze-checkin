import React, { useEffect } from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { StackNavigationProp } from '@react-navigation/stack'

import { Search } from './SearchBar'
import PeopleList from './PeopleList'
import { Dispatch, RootState } from '../../store'
import { Person } from '../../models/dataModel'
import { AttendanceState } from '../../models/attendance'
import { HomeStackParamList } from '../../navigation/AppNavigator'
import { EventState } from '../../models/events'

const logo = require('../../assets/logo.png')

const mapState = (state: RootState) => ({
  events: state.events,
  searchText: state.searchText,
  attendance: state.attendance,
  date: state.settings.date,
  searchList: state.searchList,
})

const mapDispatch = (dispatch: Dispatch) => ({
  onChangeText: dispatch.searchText.set,
  // onSelectPerson: dispatch.selectedChild.selectAsync,
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

const ScreenContents: React.FC<Props> = ({
  navigation,
  searchText,
  onChangeText,
  searchList: { filtered },
  // onSelectPerson,
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

  const onPress = async (item: Person) => {
    // await onSelectPerson(item)
    // props.navigation.navigate('Family')
  }

  const ImageView = () => (
    <View style={{ flex: 1 }}>
      <Image
        style={{ flex: 1, height: undefined, width: undefined }}
        source={logo}
        resizeMode="contain"
      />
    </View>
  )

  return (
    <View style={{ height: '100%' }}>
      <Search value={searchText} onChangeText={onChangeText} />
      {!filtered.length && <ImageView />}
      {!!filtered.length && <PeopleList people={filtered} onPress={onPress} />}
    </View>
  )
}

const getHeaderString = ({ events, attendance, date }: UpdateHeader) => {
  const { entrustAttendance, teacherAttendance } = attendance

  const title = `${events.entrustEvent?.name} - ${date}`
  if (entrustAttendance && teacherAttendance) {
    return `${title} (${entrustAttendance.length}, ${teacherAttendance.length})`
  }

  return title
}

const ConnectedContents = connect(mapState, mapDispatch)(ScreenContents)

export const HomeScreen: React.FC<HomeNavigationProp> = (props) => {
  return <ConnectedContents {...props} />
}
