import React from 'react'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface MenuButtonProps {
  onPress: () => void
}

export const MenuButton: React.FC<MenuButtonProps> = ({ onPress }) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <Icon
          name="menu"
          iconStyle={{
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 15,
            paddingRight: 15,
          }}
        />
      </TouchableOpacity>
    </View>
  )
}
