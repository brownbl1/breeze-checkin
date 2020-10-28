import React from 'react'
import { FlatList, Image, Keyboard, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import placeholder from '../../assets/gray.png'
import { source } from '../../helpers'
import { EventPerson } from '../../models/dataModel'

type OnPress = (item: EventPerson) => void

type RowProps = {
  item: EventPerson
  onPress: OnPress
}

const PeopleRowItem: React.FC<RowProps> = ({ item, onPress }) => (
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
              height: undefined,
              width: undefined,
              resizeMode: 'contain',
            }}
            defaultSource={placeholder}
            source={source(item)}
            resizeMode="contain"
          />
        </View>
        <Text>{`${item.first_name} ${item.last_name}`}</Text>
      </View>
      <Icon name="keyboard-arrow-right" />
    </View>
  </TouchableOpacity>
)

type Props = {
  people: EventPerson[]
  onPress: OnPress
}

const PeopleList: React.FC<Props> = ({ people, onPress }) => (
  <View style={{ flex: 1, width: '100%', backgroundColor: '#fff' }}>
    <FlatList
      data={people}
      renderItem={({ item }) => <PeopleRowItem item={item} onPress={onPress} />}
      keyboardShouldPersistTaps="always"
      onScrollBeginDrag={() => Keyboard.dismiss()}
    />
  </View>
)

export default PeopleList
