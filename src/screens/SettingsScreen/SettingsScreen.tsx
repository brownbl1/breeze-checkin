import { StackNavigationProp } from '@react-navigation/stack'
import Constants from 'expo-constants'
import { selectPrinterAsync } from 'expo-print'
import moment from 'moment'
import React from 'react'
import { Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { SettingsList } from '../../components/SettingsList'
import { DATE_FORMAT } from '../../env'
import { BreezeEvent } from '../../models/dataModel'
import { daysOfWeek } from '../../models/settings'
import { SettingsStackParamList } from '../../navigation/AppNavigator'
import { Dispatch, RootState } from '../../store'

const setPrinter = async () => {
  const selected = Constants?.platform?.ios
    ? await selectPrinterAsync()
    : { name: "Tom's Printer", url: 'ipps://someaddr' }

  return selected
}

const mapState = ({ settings, events }: RootState) => ({
  settings,
  events,
})

const mapDispatch = (dispatch: Dispatch) => ({
  onPressPrinter: async () => {
    try {
      const printer = await setPrinter()
      if (printer) {
        dispatch.settings.setPrinter(printer)
      }
    } catch (error) {
      const err = error as Error
      if (err.message !== 'Printer picker has been cancelled') throw err
    }
  },
})

type SettingsNavigationProp = {
  navigation: StackNavigationProp<SettingsStackParamList, 'Settings'>
}

type Props = SettingsNavigationProp &
  ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>

const getEventString = (event: BreezeEvent | null) => {
  if (event) {
    return `${event.name} - ${moment(event.start_datetime).format(DATE_FORMAT)}`
  }

  return 'None'
}

const ScreenContents: React.FC<Props> = ({
  settings,
  onPressPrinter,
  navigation,
  events,
}) => {
  const dateString =
    settings.date && moment(settings.date, DATE_FORMAT).format(`ddd, ${DATE_FORMAT}`)

  const data = [
    {
      setting: 'Printer',
      value: settings.printer?.name ?? 'None',
      showArrow: false,
      onPress: onPressPrinter,
    },
    {
      setting: 'Number of Parent Tags',
      value: settings.numParentTags,
      showArrow: true,
      onPress: () => {
        navigation.navigate('Select Number of Parent Tags', {
          initialNumber: settings.numParentTags,
        })
      },
    },
    {
      setting: 'Day of Week',
      value: daysOfWeek[settings.dayOfWeek],
      showArrow: true,
      onPress: () => {
        navigation.navigate('Select Day of Week', {
          initialDow: settings.dayOfWeek,
        })
      },
    },
    {
      setting: 'Event Date',
      value: dateString ?? 'None',
      showArrow: true,
      onPress: () => {
        navigation.navigate('Select Date')
      },
    },
    {
      setting: 'Entrust Event',
      value: getEventString(events.entrustEvent),
      showArrow: true,
      onPress: () => {
        navigation.navigate('Select Event', { eventType: 'Entrust' })
      },
    },
    {
      setting: 'Teacher Event',
      value: getEventString(events.teacherEvent),
      showArrow: true,
      onPress: () => {
        navigation.navigate('Select Event', { eventType: 'Entrust Teacher' })
      },
    },
    {
      setting: 'Doctrine 101 Event',
      value: getEventString(events.doctrine101Event),
      showArrow: true,
      onPress: () => {
        navigation.navigate('Select Event', { eventType: 'Doctrine 101' })
      },
    },
  ]

  return (
    <View
      style={{
        backgroundColor: '#eee',
        marginHorizontal: 25,
        height: '100%',
      }}
    >
      <SettingsList
        data={data}
        renderItem={({ item }) => (
          <React.Fragment>
            <Text>{item.setting}</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#888' }}>{item.value}</Text>
              {item.showArrow && <Icon name="keyboard-arrow-right" color="#888888" />}
            </View>
          </React.Fragment>
        )}
      />
    </View>
  )
}

const ConnectedContents = connect(mapState, mapDispatch)(ScreenContents)

export const SettingsScreen: React.FC<SettingsNavigationProp> = (props) => {
  return <ConnectedContents {...props} />
}
