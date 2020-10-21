import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements'
import { RouteProp } from '@react-navigation/native'

import { SettingsStackParamList } from '../../navigation/AppNavigator'
import { Dispatch } from '../../store'
import { SettingsList } from '../../components/SettingsList'

type DowOptions = {
  name: string
  selected: boolean
  onPress?: (index: number) => void
}

const mapDispatch = (dispatch: Dispatch) => ({
  setDowAsync: dispatch.settings.setDowAsync,
})

type SelectDowNavigationProp = {
  navigation: StackNavigationProp<SettingsStackParamList, 'Select Event'>
  route: RouteProp<SettingsStackParamList, 'Select Day of Week'>
}

type Props = SelectDowNavigationProp & ReturnType<typeof mapDispatch>

const data = [
  { name: 'Sunday', selected: false },
  { name: 'Monday', selected: false },
  { name: 'Tuesday', selected: false },
  { name: 'Wednesday', selected: false },
  { name: 'Thursday', selected: false },
  { name: 'Friday', selected: false },
  { name: 'Saturday', selected: false },
]

const ScreenContents: React.FC<Props> = ({ route, setDowAsync }) => {
  const initialData = data.map(({ name }, i) => {
    if (route.params.initialDow === i) return { name, selected: true }
    return { name, selected: false }
  })

  const [options, setOptions] = useState<DowOptions[]>(initialData)

  const onPress = (index: number) => {
    const newData = data.map(({ name }, i) => {
      if (index === i) return { name, selected: true }
      return { name, selected: false }
    })

    setOptions(newData)
    setDowAsync(index)
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
