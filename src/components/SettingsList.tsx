import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native'

function Spacer() {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <View
        style={{
          backgroundColor: 'white',
          height: 1,
          width: 13,
        }}
      />
      <View
        style={{
          backgroundColor: '#eee',
          height: 1,
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  topBorder: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderTopWidth: 1,
    marginTop: 25,
  },
  bottomBorder: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomWidth: 1,
  },
})

type ItemProps = {
  onPress?: (index: number) => void
  index: number
  itemCount: number
}

const RowItem: React.FC<ItemProps> = ({
  onPress,
  index,
  itemCount,
  children,
}) => {
  return (
    <TouchableOpacity onPress={() => onPress && onPress(index)}>
      <React.Fragment>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: 13,
            height: 50,
            borderColor: 'white',
            ...(index === 0 && styles.topBorder),
            ...(index === itemCount - 1 && styles.bottomBorder),
          }}
        >
          {children}
        </View>
        {index !== itemCount - 1 && <Spacer />}
      </React.Fragment>
    </TouchableOpacity>
  )
}

type Base = {
  onPress?: (index: number) => void
}

type Props<T extends Base> = {
  data: T[]
  onPress?: (index: number) => void
  renderItem: ListRenderItem<T>
}

export class SettingsList<T extends Base> extends Component<Props<T>> {
  render() {
    return (
      <FlatList
        data={this.props.data}
        renderItem={({ item, index, separators }) => (
          <RowItem
            onPress={item.onPress ?? this.props.onPress}
            index={index}
            itemCount={this.props.data.length}
          >
            {this.props.renderItem({ item, index, separators })}
          </RowItem>
        )}
        keyExtractor={(_, index) => index.toString()}
        keyboardShouldPersistTaps="always"
      />
    )
  }
}
