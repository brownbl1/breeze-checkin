import React from 'react'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'

interface MenuButtonProps {
  onPress: () => void
}

export const MenuButton: React.FC<MenuButtonProps> = ({ onPress }) => {
  return (
    <View style={{ paddingLeft: 15 }}>
      <Icon name="menu" onPress={onPress} />
    </View>
  )
}
