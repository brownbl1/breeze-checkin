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
  setNumParentTags: dispatch.settings.setNumParentTagsAsync,
})

type SelectDowNavigationProp = {
  navigation: StackNavigationProp<
    SettingsStackParamList,
    'Select Number of Parent Tags'
  >
  route: RouteProp<SettingsStackParamList, 'Select Number of Parent Tags'>
}

type Props = SelectDowNavigationProp & ReturnType<typeof mapDispatch>

const data = [
  { name: '1', selected: false },
  { name: '2', selected: false },
  { name: '3', selected: false },
]

const ScreenContents: React.FC<Props> = ({ route, setNumParentTags }) => {
  const initialData = data.map(({ name }, i) => {
    if (route.params.initialNumber === i + 1) return { name, selected: true }
    return { name, selected: false }
  })

  const [options, setOptions] = useState<DowOptions[]>(initialData)

  const onPress = (index: number) => {
    const newData = data.map(({ name }, i) => {
      if (index === i) return { name, selected: true }
      return { name, selected: false }
    })

    setOptions(newData)
    setNumParentTags(index + 1)
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

export const SelectParentTagsScreen: React.FC<SelectDowNavigationProp> = (
  props,
) => {
  return <ConnectedContents {...props} />
}
