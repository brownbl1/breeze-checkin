import React from 'react'
import { Image, View } from 'react-native'

const logo = require('../assets/logo.png')

export const ImageView = () => (
  <View style={{ flex: 1 }}>
    <Image
      style={{ flex: 1, height: undefined, width: undefined }}
      source={logo}
      resizeMode="contain"
    />
  </View>
)
