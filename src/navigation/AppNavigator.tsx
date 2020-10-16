import React from 'react'
import { AppLoading } from 'expo'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native'

import { MenuButton } from './MenuButton'
import {
  useStartingScreen,
  HomeScreen,
  FamilyScreen,
  SelectDateScreen,
  SettingsScreen,
  StartingScreen,
} from '../screens'

const leftNavOpts = (navigation) => ({
  headerLeft: () => (
    <MenuButton
      onPress={() => {
        navigation.toggleDrawer()
      }}
    />
  ),
})

const Stack = createStackNavigator()
const RootHomeStack = () => {
  const navigation = useNavigation()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={leftNavOpts(navigation)}
      />
      <Stack.Screen name="Family" component={FamilyScreen} />
    </Stack.Navigator>
  )
}

const RootDateStack = () => {
  const navigation = useNavigation()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Select Date"
        component={SelectDateScreen}
        options={leftNavOpts(navigation)}
      />
    </Stack.Navigator>
  )
}

const RootSettingsStack = () => {
  const navigation = useNavigation()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={leftNavOpts(navigation)}
      />
    </Stack.Navigator>
  )
}

const Drawer = createDrawerNavigator()

type RootDrawerProps = {
  initialRouteName: 'Home' | 'Select Date'
}

const RootDrawer: React.FC<RootDrawerProps> = ({ initialRouteName }) => {
  return (
    <Drawer.Navigator initialRouteName={initialRouteName}>
      <Drawer.Screen name="Home" component={RootHomeStack} />
      <Drawer.Screen name="Select Date" component={RootDateStack} />
      <Drawer.Screen name="Settings" component={RootSettingsStack} />
    </Drawer.Navigator>
  )
}

export const SwitchRoot = () => {
  const screen = useStartingScreen()

  switch (screen) {
    case StartingScreen.Loading:
      return <AppLoading />
    case StartingScreen.Home:
      return <RootDrawer initialRouteName="Home" />
    case StartingScreen.SelectDate:
      return <RootDrawer initialRouteName="Select Date" />
  }
}
