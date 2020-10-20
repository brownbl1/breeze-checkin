import React, { useEffect } from 'react'
import { View, Image } from 'react-native'
import { connect } from 'react-redux'
import { Search } from './SearchBar'
import PeopleList from './PeopleList'
import { Dispatch, RootState } from '../../store'
import { BreezeEvent, Person } from '../../models/dataModel'
import { AttendanceState } from '../../models/attendance'
import { TeacherAttendanceState } from '../../models/teacherAttendance'
import { StackNavigationProp } from '@react-navigation/stack'
import { HomeStackParamList } from '../../navigation/AppNavigator'

const logo = require('../../assets/logo.png')

const mapState = ({
  event,
  eventPeople,
  searchText,
  attendance,
  teacherAttendance,
}: RootState) => ({
  event,
  eventPeople,
  searchText,
  attendance,
  teacherAttendance,
})

const mapDispatch = (dispatch: Dispatch) => ({
  onChangeText: dispatch.searchText.set,
  onSelectPerson: dispatch.selectedChild.selectAsync,
})

type UpdateHeader = {
  event: BreezeEvent
  date: string
  attendance: AttendanceState
  teacherAttendance: TeacherAttendanceState
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
  eventPeople: { filtered },
  onSelectPerson,
  event: { event },
  event: { date },
  attendance,
  teacherAttendance,
  goToFamily,
  updateHeader,
}) => {
  useEffect(() => {
    updateHeader({ event, date, attendance, teacherAttendance })
  }, [event, attendance, teacherAttendance])

  const onPress = async (item: Person) => {
    await onSelectPerson(item)
    goToFamily()
  }

  return (
    <View style={{ flex: 1 }}>
      <Search value={searchText} onChangeText={onChangeText} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!filtered.length && (
          <View style={{ width: '100%', height: '100%' }}>
            <Image
              source={logo}
              style={{
                resizeMode: 'center',
                flex: 1,
                width: undefined,
                height: undefined,
              }}
            />
          </View>
        )}
        {!!filtered.length && (
          <PeopleList people={filtered} onPress={onPress} />
        )}
      </View>
    </View>
  )
}

const ConnectedContents = connect(mapState, mapDispatch)(ScreenContents)

export const HomeScreen: React.FC<HomeNavigationProp> = (props) => {
  const goToFamily = () => props.navigation.navigate('Family')

  const updateHeader = ({
    event,
    date,
    attendance,
    teacherAttendance,
  }: UpdateHeader) => {
    if (event) {
      const title = `${event.name} - ${date} (${attendance.length}, ${teacherAttendance.length})`
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
