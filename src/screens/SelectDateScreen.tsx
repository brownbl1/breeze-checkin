import React, { useState, useCallback } from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { View, DatePickerIOS } from 'react-native'
import moment from 'moment'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'

import { DOW } from '../env'
import { Dispatch } from '../store'

const mapDispatch = (dispatch: Dispatch) => ({
  fetchEvents: dispatch.event.selectAsync,
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
        <DatePickerIOS mode="date" date={date} onDateChange={setDate} />
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

const ConnectedContents = connect(
  null,
  mapDispatch
)(ScreenContents)

export const SelectDateScreen: React.FC<NavigationScreenProps> = ({
  navigation,
}) => {
  const goHome = () => navigation.navigate('Home')
  return <ConnectedContents goHome={goHome} />
}
