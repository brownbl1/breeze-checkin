import {
  createDrawerNavigator,
  DrawerContent,
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerNavigationProp,
} from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AppLoading from 'expo-app-loading'
import Constants from 'expo-constants'
import React from 'react'
import { Text, View } from 'react-native'
import {
  FamilyScreen,
  HomeScreen,
  SelectDateScreen,
  SelectDowScreen,
  SelectEventScreen,
  SelectParentTagsScreen,
  SettingsScreen,
  StartingScreen,
  useStartingScreen,
} from '../screens'
import { MenuButton } from './MenuButton'

type NavProps = {
  navigation: RootNavigationProp
}

const leftNavOpts = ({ navigation }: NavProps) => ({
  headerLeft: () => (
    <MenuButton
      onPress={() => {
        navigation.toggleDrawer()
      }}
    />
  ),
})

export type HomeStackParamList = {
  Home: undefined
  Family: { childName: string }
}

const HomeStack = createStackNavigator<HomeStackParamList>()
const RootHomeStack = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} options={leftNavOpts} />
      <HomeStack.Screen name="Family" component={FamilyScreen} />
    </HomeStack.Navigator>
  )
}

export type SettingsStackParamList = {
  Settings: undefined
  'Select Date': undefined
  'Select Day of Week': { initialDow: number } | undefined
  'Select Number of Parent Tags': { initialNumber: number } | undefined
  'Select Event': { eventType: 'Entrust' | 'Entrust Teacher' | 'Doctrine 101' }
}

const SettingsStack = createStackNavigator<SettingsStackParamList>()

const RootSettingsStack = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={leftNavOpts}
      />
      <SettingsStack.Screen name="Select Date" component={SelectDateScreen} />
      <SettingsStack.Screen name="Select Event" component={SelectEventScreen} />
      <SettingsStack.Screen name="Select Day of Week" component={SelectDowScreen} />
      <SettingsStack.Screen
        name="Select Number of Parent Tags"
        component={SelectParentTagsScreen}
      />
    </SettingsStack.Navigator>
  )
}

type DrawerParamList = {
  Home: undefined
  Settings: undefined
}

const Drawer = createDrawerNavigator<DrawerParamList>()

type RootDrawerProps = {
  initialRouteName: 'Home' | 'Settings'
}

type RootNavigationProp = DrawerNavigationProp<DrawerParamList>

const CustomDrawerContent = (
  props: DrawerContentComponentProps<DrawerContentOptions>,
) => {
  return (
    <React.Fragment>
      <DrawerContent {...props} />
      <View style={{ padding: 10 }}>
        <Text style={{ color: '#555555' }}>v{Constants.manifest.version}</Text>
      </View>
    </React.Fragment>
  )
}

const RootDrawer: React.FC<RootDrawerProps> = ({ initialRouteName }) => {
  return (
    <Drawer.Navigator
      initialRouteName={initialRouteName}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={RootHomeStack} />
      <Drawer.Screen name="Settings" component={RootSettingsStack} />
    </Drawer.Navigator>
  )
}

const SwitchRoot = () => {
  const screen = useStartingScreen()

  switch (screen) {
    case StartingScreen.Loading:
      return <AppLoading />
    case StartingScreen.Home:
      return <RootDrawer initialRouteName="Home" />
    case StartingScreen.Settings:
      return <RootDrawer initialRouteName="Settings" />
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const NavigationRoot = () => {
  return (
    <NavigationContainer>
      <SwitchRoot />
    </NavigationContainer>
  )
}
