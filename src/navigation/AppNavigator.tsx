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

const getNavOptions = titleOrFn => ({ navigation }) => ({
  title: typeof titleOrFn === 'string' ? titleOrFn : titleOrFn(navigation),
  headerLeft: <MenuButton onPress={() => navigation.toggleDrawer()} />,
})

const RootStack = createDrawerNavigator({
  Home: createStackNavigator({
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: getNavOptions(({ state }) =>
        state.params ? state.params.title : ''
      ),
    },
    FamilyScreen: {
      screen: FamilyScreen,
      navigationOptions: { title: 'Family Screen' },
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
