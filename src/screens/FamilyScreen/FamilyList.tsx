import React from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { source } from '../../helpers'
import { ListPerson } from '../../models/selected'

const placeholder = require('../../assets/gray.png')

const bottomBorder = {
  borderColor: '#aaa',
  borderBottomWidth: 1,
}

type RowItemProps = {
  item: ListPerson
  index: number
  onPress: (item: ListPerson) => void
  itemCount: number
}

const FamilyRowItem: React.FC<RowItemProps> = ({ item, onPress, index, itemCount }) => (
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
              height: undefined,
              width: undefined,
            }}
            defaultSource={placeholder}
            source={source(item)}
            resizeMode="contain"
          />
        </View>
        <Text>{`${item.first_name} ${item.last_name}`}</Text>
      </View>
      {item.selected && <Icon name="checkbox-marked" type="material-community" />}
      {item.checkedIn && !item.selected && (
        <Icon name="checkbox-intermediate" type="material-community" />
      )}
      {!item.checkedIn && !item.selected && (
        <Icon name="checkbox-blank-outline" type="material-community" />
      )}
    </View>
  </TouchableOpacity>
)

type Props = {
  data: ListPerson[]
  onPress: (item: ListPerson) => void
}

export const FamilyList: React.FC<Props> = ({ data, onPress }) => (
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
        <FamilyRowItem
          item={item}
          onPress={onPress}
          index={index}
          itemCount={data.length}
        />
      )}
    />
  </View>
)
