import React, { useState, useCallback } from 'react'
import { View } from 'react-native'
import DatePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'

import { Dispatch, RootState } from '../../store'
import { StackNavigationProp } from '@react-navigation/stack'
import { SettingsStackParamList } from '../../navigation/AppNavigator'

const mapState = ({ settings }: RootState) => ({ settings })

const mapDispatch = (dispatch: Dispatch) => ({
  setDateAsync: dispatch.settings.setDateAsync,
})

type SelectDateNavigationProp = {
  navigation: StackNavigationProp<SettingsStackParamList, 'Select Date'>
}

type Props = {
  goBack: () => void
} & SelectDateNavigationProp &
  ReturnType<typeof mapDispatch> &
  ReturnType<typeof mapState>

const ScreenContents: React.FC<Props> = ({
  settings,
  setDateAsync,
  goBack,
}) => {
  const d = settings.date
    ? moment(settings.date, 'M/D/YYYY').toDate()
    : new Date()
  const [date, setDate] = useState(d)

  const fetchEventsForDate = useCallback(async () => {
    await setDateAsync(date)
    goBack()
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
          onChange={(e, date) => setDate(date)}
        />
      </View>
      <View style={{ margin: 20 }}>
        <Button
          disabled={moment(date).day() != settings.dayOfWeek}
          title={`Select ${moment(date).format('ddd, M/D/YYYY')}`}
          onPress={fetchEventsForDate}
        />
      </View>
    </View>
  )
}

const ConnectedContents = connect(mapState, mapDispatch)(ScreenContents)

export const SelectDateScreen: React.FC<SelectDateNavigationProp> = (props) => {
  const goBack = () => props.navigation.goBack()
  return <ConnectedContents {...props} goBack={goBack} />
}
