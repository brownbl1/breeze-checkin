import React from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { View, Text, Image } from 'react-native'

const placeholder = require('../../assets/gray.png')

const bottomBorder = {
  borderColor: '#aaa',
  borderBottomWidth: 1,
}

const RowItem = ({ item, onPress, index, itemCount }) => (
  <TouchableOpacity onPress={() => onPress(item)}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 80,
        padding: 10,
        ...(itemCount - index > 1 ? bottomBorder : {}),
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
      {item.checked && (
        <Icon name="checkbox-marked" type="material-community" />
      )}
      {item.attendance && !item.checked && (
        <Icon name="checkbox-blank" type="material-community" />
      )}
      {!item.attendance && !item.checked && (
        <Icon name="checkbox-blank-outline" type="material-community" />
      )}
    </View>
  </TouchableOpacity>
)

export default ({ data, onPress }) => (
  <View
    style={{
      width: '50%',
      borderWidth: 1,
      borderColor: '#aaa',
      maxHeight: '85%',
    }}
  >
    <FlatList
      data={data}
      renderItem={({ item, index }) => (
        <RowItem
          item={item}
          onPress={onPress}
          index={index}
          itemCount={data.length}
        />
      )}
    />
  </View>
)
