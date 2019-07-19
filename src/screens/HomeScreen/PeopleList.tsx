import React from 'react'
import {
  Keyboard,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native'
import { Icon } from 'react-native-elements'

const placeholder = require('../../assets/gray.png')

const RowItem = ({ item, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)}>
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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 90,
            height: '100%',
            marginRight: 10,
          }}
        >
          <Image
            style={{
              flex: 1,
              height: null,
              width: null,
              resizeMode: 'contain',
            }}
            defaultSource={placeholder}
            source={item.source}
            resizeMode="contain"
          />
        </View>
        <Text>{item.name}</Text>
      </View>
      <Icon name="keyboard-arrow-right" />
    </View>
  </TouchableOpacity>
)

const PeopleList = ({ people, onPress }) => (
  <View style={{ flex: 1, width: '100%', backgroundColor: '#fff' }}>
    <FlatList
      data={people}
      renderItem={({ item }) => <RowItem item={item} onPress={onPress} />}
      keyboardShouldPersistTaps="always"
      onScrollBeginDrag={() => Keyboard.dismiss()}
    />
  </View>
)

export default PeopleList
