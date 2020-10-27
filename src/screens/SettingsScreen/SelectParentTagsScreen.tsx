import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { SettingsList } from '../../components/SettingsList'
import { mapData } from '../../helpers'
import { SettingsStackParamList } from '../../navigation/AppNavigator'
import { Dispatch } from '../../store'

type DowOptions = {
  name: string
  selected: boolean
  onPress?: (index: number) => void
}

const mapDispatch = (dispatch: Dispatch) => ({
  setNumParentTags: dispatch.settings.setNumParentTags,
})

type SelectDowNavigationProp = {
  navigation: StackNavigationProp<SettingsStackParamList, 'Select Number of Parent Tags'>
  route: RouteProp<SettingsStackParamList, 'Select Number of Parent Tags'>
}

type Props = SelectDowNavigationProp & ReturnType<typeof mapDispatch>

const data = [0, 1, 2, 3]

const ScreenContents: React.FC<Props> = ({ route, setNumParentTags }) => {
  const initialData = mapData(data, route.params?.initialNumber)
  const [options, setOptions] = useState<DowOptions[]>(initialData)

  const onPress = (index: number) => {
    const newData = mapData(data, index)

    setOptions(newData)
    setNumParentTags(index)
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

export const SelectParentTagsScreen: React.FC<SelectDowNavigationProp> = (props) => {
  return <ConnectedContents {...props} />
}
