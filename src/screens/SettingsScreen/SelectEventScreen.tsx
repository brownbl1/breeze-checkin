import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { getEventsForDate } from '../../api'
import { SettingsList } from '../../components/SettingsList'
import { BreezeEvent } from '../../models/dataModel'
import { SettingsStackParamList } from '../../navigation/AppNavigator'
import { Dispatch, RootState } from '../../store'

type Event = BreezeEvent & {
  selected?: boolean
  onPress?: (index: number) => void
}

const mapState = (state: RootState) => ({ date: state.settings.date })
const mapDispatch = (dispatch: Dispatch) => ({
  setEntrustEventId: dispatch.settings.setEntrustEventId,
  setTeacherEventId: dispatch.settings.setTeacherEventId,
})

type SelectEventNavigationProp = {
  navigation: StackNavigationProp<SettingsStackParamList, 'Select Event'>
  route: RouteProp<SettingsStackParamList, 'Select Event'>
}

type Props = SelectEventNavigationProp &
  ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>

const ScreenContents: React.FC<Props> = ({
  route,
  date,
  setEntrustEventId,
  setTeacherEventId,
}) => {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    getEventsForDate(date).then(setEvents)
  }, [date])

  const onPress = (index: number) => {
    const ev = events.map((e, i) => {
      if (index === i) {
        return { ...e, selected: true }
      }
      return { ...e, selected: false }
    })

    setEvents(ev)

    const fn =
      route.params.eventType === 'Entrust' ? setEntrustEventId : setTeacherEventId
    fn(events[index].event_id)
  }

  return (
    <View
      style={{
        backgroundColor: '#eee',
        marginHorizontal: 25,
        height: '100%',
      }}
    >
      {!date && <Text>Please select a date first</Text>}
      {date && (
        <SettingsList
          data={events}
          onPress={onPress}
          renderItem={({ item }) => (
            <React.Fragment>
              <Text>{item.name}</Text>
              {item.selected && <Icon name="done" color="rgb(32, 137, 220)" />}
            </React.Fragment>
          )}
        />
      )}
    </View>
  )
}

const ConnectedContents = connect(mapState, mapDispatch)(ScreenContents)

export const SelectEventScreen: React.FC<SelectEventNavigationProp> = (props) => {
  return <ConnectedContents {...props} />
}
