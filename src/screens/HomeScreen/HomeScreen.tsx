import React, { useEffect } from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { View, Image } from 'react-native'
import { connect } from 'react-redux'
import { Search } from './SearchBar'
import PeopleList from './PeopleList'
import { Dispatch, iRootState } from '../../store'

const logo = require('../../assets/logo.png')

const mapState = ({
  event,
  eventPeople,
  searchText,
  attendance,
  teacherAttendance,
}: iRootState) => ({
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

type Props = {
  goToFamily: () => void
  updateHeader: (args: any) => void
} & ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>

const ScreenContents: React.FC<Props> = ({
  searchText,
  onChangeText,
  eventPeople: { filtered },
  onSelectPerson,
  event: { event },
  attendance,
  teacherAttendance,
  goToFamily,
  updateHeader,
}) => {
  useEffect(() => {
    updateHeader({ event, attendance, teacherAttendance })
  }, [event, attendance, teacherAttendance])

  const onPress = async item => {
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

export const HomeScreen: React.FC<NavigationScreenProps> = ({ navigation }) => {
  const goToFamily = () => navigation.push('FamilyScreen')

  const updateHeader = ({ event, attendance, teacherAttendance }) => {
    if (event) {
      const title = `${event.name} - ${event.date} (${attendance.length}, ${teacherAttendance.length})`

      const { params } = navigation.state
      if (!params || title != params.title) {
        navigation.setParams({ title })
      }
    }
  }

  return (
    <ConnectedContents goToFamily={goToFamily} updateHeader={updateHeader} />
  )
}
