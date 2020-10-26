import React, { useRef } from 'react'
import { SearchBar } from 'react-native-elements'

type Props = {
  value: string
  onChangeText: (text: string) => void
}

export const Search: React.FC<Props> = (props) => {
  const searchRef = useRef<SearchBar>(null)

  const clearOnPress = () => {
    searchRef.current?.clear()
    searchRef.current?.focus()
  }

  return (
    <SearchBar
      ref={searchRef}
      lightTheme
      placeholder="Search for first or last name..."
      clearIcon={{ name: 'close', onPress: clearOnPress }}
      {...props}
    />
  )
}
