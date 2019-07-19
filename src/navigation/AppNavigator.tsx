import React from 'react'
import {
  createAppContainer,
  createSwitchNavigator,
  createDrawerNavigator,
  createStackNavigator,
} from 'react-navigation'

import { MenuButton } from './MenuButton'
import {
  LoadingScreen,
  HomeScreen,
  FamilyScreen,
  SelectDateScreen,
  SettingsScreen,
} from '../screens'

const getTitle = titleOrFn => ({ navigation }) => ({
  title: typeof titleOrFn === 'string' ? titleOrFn : titleOrFn(navigation),
})

const getNavOptions = titleOrFn => ({ navigation }) => ({
  ...getTitle(titleOrFn)({ navigation }),
  headerLeft: <MenuButton onPress={() => navigation.toggleDrawer()} />,
})

const titleOrEmpty = ({ state }) => (state.params ? state.params.title : '')

const RootStack = createDrawerNavigator({
  Home: createStackNavigator({
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: getNavOptions(titleOrEmpty),
    },
    FamilyScreen: {
      screen: FamilyScreen,
      navigationOptions: getTitle(titleOrEmpty),
    },
  }),
  'Select Date': createStackNavigator({
    SelectDateScreen: {
      screen: SelectDateScreen,
      navigationOptions: getNavOptions('Select Date'),
    },
  }),
  Settings: createStackNavigator({
    SettingsScreen: {
      screen: SettingsScreen,
      navigationOptions: getNavOptions('Settings'),
    },
  }),
})

export const AppNavigator = createAppContainer(
  createSwitchNavigator({
    Loading: LoadingScreen,
    RootStack,
  })
)
