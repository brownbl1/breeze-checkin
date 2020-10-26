import React, { useEffect } from 'react'
import { View, Image } from 'react-native'
import { connect } from 'react-redux'
import { Search } from './SearchBar'
import PeopleList from './PeopleList'
import { Dispatch, RootState } from '../../store'
import { Person } from '../../models/dataModel'
import { AttendanceState } from '../../models/attendance'
import { StackNavigationProp } from '@react-navigation/stack'
import { HomeStackParamList } from '../../navigation/AppNavigator'
import { EventState } from '../../models/events'

const logo = require('../../assets/logo.png')

const mapState = ({
  events,
  searchText,
  searchList,
  attendance,
  settings: { date },
}: RootState) => ({
  events,
  searchText,
  attendance,
  date,
  searchList,
})

const mapDispatch = (dispatch: Dispatch) => ({
  onChangeText: dispatch.searchText.set,
  onSelectPerson: dispatch.selectedChild.selectAsync,
})

type UpdateHeader = {
  events: EventState
  date: string
  attendance: AttendanceState
}

type HomeNavigationProp = {
  navigation: StackNavigationProp<HomeStackParamList, 'Home'>
}

type Props = {
  goToFamily: () => void
  updateHeader: (args: UpdateHeader) => void
} & HomeNavigationProp &
  ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>

const ScreenContents: React.FC<Props> = ({
  searchText,
  onChangeText,
  searchList: { filtered },
  onSelectPerson,
  events,
  attendance,
  goToFamily,
  updateHeader,
  date,
}) => {
  useEffect(() => {
    updateHeader({ events, date, attendance })
  }, [
    events.entrustEvent,
    events.teacherEvent,
    date,
    attendance.entrustAttendance,
    attendance.teacherAttendance,
  ])

  const onPress = async (item: Person) => {
    await onSelectPerson(item)
    goToFamily()
  }

  return (
    <View style={{ display: 'flex', height: '100%' }}>
      <View style={{ backgroundColor: 'red', height: 100 }}>
        <Search value={searchText} onChangeText={onChangeText} />
      </View>
      <View
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'blue',
        }}
      >
        {!filtered.length && (
          <Image source={logo} style={{ resizeMode: 'center' }} />
        )}
        {!!filtered.length && (
          <PeopleList people={filtered} onPress={onPress} />
        )}
      </View>
    </View>
  )
}

const getHeaderString = ({ events, attendance, date }: UpdateHeader) => {
  const { entrustAttendance, teacherAttendance } = attendance
  const title = `${events.entrustEvent.name} - ${date}`
  if (entrustAttendance && teacherAttendance) {
    return `${title} (${entrustAttendance.length}, ${teacherAttendance.length})`
  }

  return title
}

const ConnectedContents = connect(mapState, mapDispatch)(ScreenContents)

export const HomeScreen: React.FC<HomeNavigationProp> = (props) => {
  const goToFamily = () => props.navigation.navigate('Family')

  const updateHeader = ({ events, date, attendance }: UpdateHeader) => {
    if (events.entrustEvent) {
      const title = getHeaderString({ events, date, attendance })
      props.navigation.setOptions({ title })
    }
  }

  return (
    <ConnectedContents
      {...props}
      goToFamily={goToFamily}
      updateHeader={updateHeader}
    />
  )
}
