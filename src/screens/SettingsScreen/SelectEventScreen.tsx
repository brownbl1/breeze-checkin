import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements'
import { RouteProp } from '@react-navigation/native'

import { SettingsStackParamList } from '../../navigation/AppNavigator'
import { Dispatch, RootState } from '../../store'
import { SettingsList } from '../../components/SettingsList'
import { BreezeEvent } from '../../models/dataModel'

type Event = BreezeEvent & {
  selected?: boolean
  onPress?: (index: number) => void
}

const mapState = ({ settings }: RootState) => ({ date: settings.date })

const mapDispatch = (dispatch: Dispatch) => ({
  getEvents: dispatch.events.getEventsForDate,
  setEntrustEventId: dispatch.settings.setEntrustEventIdAsync,
  setTeacherEventId: dispatch.settings.setTeacherEventIdAsync,
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
  getEvents,
  setEntrustEventId,
  setTeacherEventId,
}) => {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    getEvents().then((ev) => setEvents(ev))
  }, [])

  const onPress = (index: number) => {
    const ev = events.map((e, i) => {
      if (index === i) {
        return { ...e, selected: true }
      }
      return { ...e, selected: false }
    })

    setEvents(ev)

    const fn =
      route.params.eventType === 'Entrust'
        ? setEntrustEventId
        : setTeacherEventId
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
    </View>
  )
}

const ConnectedContents = connect(mapState, mapDispatch)(ScreenContents)

export const SelectEventScreen: React.FC<SelectEventNavigationProp> = (
  props,
) => {
  return <ConnectedContents {...props} />
}
