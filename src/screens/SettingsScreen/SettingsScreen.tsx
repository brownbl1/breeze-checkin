import { StackNavigationProp } from '@react-navigation/stack'
import Print from 'expo-print'
import Constants from 'expo-constants'
import React, { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'
import { SettingsStackParamList } from '../../navigation/AppNavigator'
import { Dispatch, RootState } from '../../store'
import { DateModal } from './DateModal'

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
  const onPress = () => {
    item.onPress()
  }

  return (
    <TouchableOpacity onPress={onPress}>
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
      keyboardShouldPersistTaps="always"
    />
  </View>
)

const mapState = ({ settings }: RootState) => ({
  settings,
})

const setPrinter = async () => {
  const selected = Constants.platform.ios
    ? await Print.selectPrinterAsync()
    : { name: "Tom's Printer", url: 'ipps://someaddr' }

  return selected
}

const mapDispatch = (dispatch: Dispatch) => ({
  onPressPrinter: async () => {
    try {
      const printer = await setPrinter()
      if (printer) {
        dispatch.printer.select(printer)
      }
    } catch (error) {
      const err = error as Error
      if (err.message !== 'Printer picker has been cancelled') throw err
    }
  },
  onPressDate: async (date: Date) => {
    dispatch.settings.setDateAsync(date)
  },
})

type SettingsNavigationProp = {
  navigation: StackNavigationProp<SettingsStackParamList, 'Settings'>
}

type Props = SettingsNavigationProp &
  ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>

const ScreenContents: React.FC<Props> = ({
  settings,
  onPressPrinter,
  onPressDate,
}) => {
  const [dateModalVisible, setDateModalVisible] = useState(false)

  const dateModalOnClose = (date: Date) => {
    onPressDate(date)
  }

  const printerName = settings.printer.name ?? 'None'

  const data = [
    {
      setting: 'Printer',
      value: printerName,
      onPress: onPressPrinter,
    },
    {
      setting: 'Event Date',
      value: settings.date,
      onPress: async () => {
        setDateModalVisible(true)
      },
    },
  ]

  return (
    <React.Fragment>
      <List data={data} />
      <DateModal modalVisible={dateModalVisible} onClose={dateModalOnClose} />
    </React.Fragment>
  )
}

const ConnectedContents = connect(mapState, mapDispatch)(ScreenContents)

export const SettingsScreen: React.FC<SettingsNavigationProp> = (props) => {
  return <ConnectedContents {...props} />
}
