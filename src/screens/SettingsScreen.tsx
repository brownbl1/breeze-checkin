import React from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import { getPrinter } from '../helpers/getPrinter'

const mapState = ({ printer }) => ({ printer })

const mapDispatch = dispatch => ({
  onPress: async () => {
    const printer = await getPrinter(true)
    if (printer) {
      dispatch.printer.select(printer)
    }
  },
})

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

const ScreenContents: React.FC<Props> = ({ onPress, printer }) => {
  const printerName = printer && printer.name

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={onPress} title="Select Printer" />
      <Text style={{ marginTop: 10 }}>{printerName}</Text>
    </View>
  )
}

const ConnectedContents = connect(
  mapState,
  mapDispatch
)(ScreenContents)

export const SettingsScreen: React.FC = () => {
  return <ConnectedContents />
}
