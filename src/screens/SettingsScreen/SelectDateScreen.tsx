import React, { useState, useCallback } from 'react'
import { View } from 'react-native'
import DatePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'

import { Dispatch, RootState } from '../../store'
import { StackNavigationProp } from '@react-navigation/stack'
import { SettingsStackParamList } from '../../navigation/AppNavigator'
import { DATE_FORMAT } from '../../env'

const mapState = ({ settings }: RootState) => ({ settings })

const mapDispatch = (dispatch: Dispatch) => ({
  saveDate: dispatch.settings.setDate,
})

type SelectDateNavigationProp = {
  navigation: StackNavigationProp<SettingsStackParamList, 'Select Date'>
}

type Props = SelectDateNavigationProp &
  ReturnType<typeof mapDispatch> &
  ReturnType<typeof mapState>

const ScreenContents: React.FC<Props> = ({
  navigation,
  settings,
  saveDate,
}) => {
  const d = settings.date
    ? moment(settings.date, DATE_FORMAT).toDate()
    : new Date()
  const [date, setDate] = useState(d)

  const fetchEventsForDate = useCallback(async () => {
    saveDate(moment(date).format(DATE_FORMAT))
    // TODO: initialize event info if possible
    navigation.goBack()
  }, [date])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{ width: '50%' }}>
        <DatePicker
          mode="date"
          value={date}
          onChange={(e, date) => setDate(date as Date)}
        />
      </View>
      <View style={{ margin: 20 }}>
        <Button
          disabled={moment(date).day() != settings.dayOfWeek}
          title={`Select ${moment(date).format(`ddd, ${DATE_FORMAT}`)}`}
          onPress={fetchEventsForDate}
        />
      </View>
    </View>
  )
}

const ConnectedContents = connect(mapState, mapDispatch)(ScreenContents)

export const SelectDateScreen: React.FC<SelectDateNavigationProp> = (props) => {
  return <ConnectedContents {...props} />
}
