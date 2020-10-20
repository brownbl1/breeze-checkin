import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { setPrinter } from '../../helpers/getPrinter'
import { SettingsStackParamList } from '../../navigation/AppNavigator'
import { Dispatch, RootState } from '../../store'

type Setting = {
  setting: string
  value: string
  onPress: () => Promise<void>
}

type ItemProps = {
  item: Setting
}

const SettingsRowItem = ({ item }: ItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        item.onPress()
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderColor: '#aaa',
          borderBottomWidth: 1,
          height: 80,
          padding: 10,
        }}
      >
        <Text>{item.setting}</Text>
        <Text>{item.value}</Text>
      </View>
    </TouchableOpacity>
  )
}

type ListProps = {
  data: Setting[]
}

const List = ({ data }: ListProps) => (
  <View style={{ flex: 1, width: '100%', backgroundColor: '#fff' }}>
    <FlatList
      data={data}
      renderItem={({ item }) => <SettingsRowItem item={item} />}
      keyExtractor={(item) => item.setting}
      // keyboardShouldPersistTaps="always"
    />
  </View>
)

const mapState = ({ printer }: RootState) => ({ printer })

const mapDispatch = (dispatch: Dispatch) => ({
  onPressPrinter: async () => {
    const printer = await setPrinter()
    if (printer) {
      dispatch.printer.select(printer)
    }
  },
  onPressDate: async () => {
    // dispatch.
  },
})

type SettingsNavigationProp = {
  navigation: StackNavigationProp<SettingsStackParamList, 'Settings'>
}

type Props = SettingsNavigationProp &
  ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>

const ScreenContents: React.FC<Props> = ({
  onPressPrinter,
  printer,
  onPressDate,
}) => {
  const printerName = printer.name ?? 'None'

  const data = [
    {
      setting: 'Printer',
      value: printerName,
      onPress: onPressPrinter,
    },
    {
      setting: 'Event Date',
      value: 'None',
      onPress: onPressDate,
    },
  ]

  return <List data={data} />
}

const ConnectedContents = connect(mapState, mapDispatch)(ScreenContents)

export const SettingsScreen: React.FC<SettingsNavigationProp> = (props) => {
  return <ConnectedContents {...props} />
}
