import React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { View, Text } from 'react-native'

import { styles } from './styles'

export const HomeScreen: React.FC<NavigationScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
    </View>
  )
}
