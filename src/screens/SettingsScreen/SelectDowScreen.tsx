import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { SettingsList } from '../../components/SettingsList'
import { mapData } from '../../helpers'
import { daysOfWeek } from '../../models/settings'
import { SettingsStackParamList } from '../../navigation/AppNavigator'
import { Dispatch } from '../../store'

type DowOptions = {
  name: string
  selected: boolean
  onPress?: (index: number) => void
}

const mapDispatch = (dispatch: Dispatch) => ({
  setDow: dispatch.settings.setDow,
})

type SelectDowNavigationProp = {
  navigation: StackNavigationProp<SettingsStackParamList, 'Select Day of Week'>
  route: RouteProp<SettingsStackParamList, 'Select Day of Week'>
}

type Props = SelectDowNavigationProp & ReturnType<typeof mapDispatch>

const ScreenContents: React.FC<Props> = ({ route, setDow }) => {
  const initialData = mapData(daysOfWeek, route.params?.initialDow)
  const [options, setOptions] = useState<DowOptions[]>(initialData)

  const onPress = (index: number) => {
    const newData = mapData(daysOfWeek, index)
    setOptions(newData)
    setDow(index)
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
        data={options}
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

const ConnectedContents = connect(null, mapDispatch)(ScreenContents)

export const SelectDowScreen: React.FC<SelectDowNavigationProp> = (props) => {
  return <ConnectedContents {...props} />
}
