import React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { View, Text } from 'react-native'

import { styles } from './styles'

export const SettingsScreen: React.FC<NavigationScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text>SettingsScreen</Text>
    </View>
  )
}
