import React, { useState, useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'
import DatePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'

import { DOW } from '../env'
import { Dispatch, RootState } from '../store'

const mapState = ({ settings }: RootState) => ({ settings })

const mapDispatch = (dispatch: Dispatch) => ({
  setDateAsync: dispatch.settings.setDateAsync,
})

type Props = {
  goBack: () => void
} & ReturnType<typeof mapDispatch> &
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
          disabled={moment(date).day() != DOW}
          title={`Select ${moment(date).format('ddd, M/D/YYYY')}`}
          onPress={fetchEventsForDate}
        />
      </View>
    </View>
  )
}

const ConnectedContents = connect(mapState, mapDispatch)(ScreenContents)

export const SelectDateScreen: React.FC = () => {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()
  return <ConnectedContents goBack={goBack} />
}
