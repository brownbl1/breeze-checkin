import React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { View, Text } from 'react-native'

import { styles } from './styles'

export const FamilyScreen: React.FC<NavigationScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text>FamilyScreen</Text>
    </View>
  )
}
