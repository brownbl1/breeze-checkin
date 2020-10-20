import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'
import { setPrinter } from '../../helpers/getPrinter'
import { SettingsStackParamList } from '../../navigation/AppNavigator'
import { Dispatch, RootState } from '../../store'

function Spacer() {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <View
        style={{
          backgroundColor: 'white',
          height: 1,
          width: 13,
        }}
      />
      <View
        style={{
          backgroundColor: '#eee',
          height: 1,
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  topBorder: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderTopWidth: 1,
    marginTop: 25,
  },
  bottomBorder: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomWidth: 1,
  },
})

type Setting = {
  setting: string
  value: string
  onPress: () => Promise<void>
}

type ItemProps = {
  item: Setting
  index: number
  itemCount: number
}

const SettingsRowItem = ({ item, index, itemCount }: ItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        item.onPress()
      }}
    >
      <React.Fragment>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            padding: 13,
            borderColor: 'white',
            ...(index === 0 && styles.topBorder),
            ...(index === itemCount - 1 && styles.bottomBorder),
          }}
        >
          <Text>{item.setting}</Text>
          <Text style={{ color: '#888' }}>{item.value}</Text>
        </View>
        {index !== itemCount - 1 && <Spacer />}
      </React.Fragment>
    </TouchableOpacity>
  )
}

type ListProps = {
  data: Setting[]
}

const List = ({ data }: ListProps) => (
  <View
    style={{
      backgroundColor: '#eee',
      marginHorizontal: 25,
      height: '100%',
    }}
  >
    <FlatList
      data={data}
      renderItem={({ item, index }) => (
        <SettingsRowItem item={item} index={index} itemCount={data.length} />
      )}
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
