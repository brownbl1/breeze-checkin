import React, { useState, useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'
import DatePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'

import { DOW } from '../env'
import { Dispatch } from '../store'

const mapDispatch = (dispatch: Dispatch) => ({
  fetchEvents: dispatch.settings.setDateAsync,
})

type Props = {
  goHome: () => void
} & ReturnType<typeof mapDispatch>

const ScreenContents: React.FC<Props> = ({ fetchEvents, goHome }) => {
  const [date, setDate] = useState(new Date())

  const fetchEventsForDate = useCallback(async () => {
    await fetchEvents(date)
    goHome()
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
          disabled={moment(date).day() != DOW}
          title={`Select ${moment(date).format('ddd, M/D/YYYY')}`}
          onPress={fetchEventsForDate}
        />
      </View>
    </View>
  )
}

const ConnectedContents = connect(null, mapDispatch)(ScreenContents)

export const SelectDateScreen: React.FC = () => {
  const navigation = useNavigation()
  const goHome = () => navigation.navigate('Home')
  return <ConnectedContents goHome={goHome} />
}
