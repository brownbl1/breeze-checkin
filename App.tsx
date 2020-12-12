import { getPersistor } from '@rematch/persist'
import AppLoading from 'expo-app-loading'
import Constants from 'expo-constants'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import * as Sentry from 'sentry-expo'
import { SentryBoundary } from './src/components/SentryBoundary'
import { NavigationRoot } from './src/navigation/AppNavigator'
import { store } from './src/store'

Sentry.init({
  dsn: Constants.manifest.extra.SENTRY_DSN,
  enableInExpoDevelopment: false,
  debug: __DEV__,
})

const persistor = getPersistor()

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const App = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={<AppLoading />}>
      <SentryBoundary>
        <NavigationRoot />
      </SentryBoundary>
    </PersistGate>
  </Provider>
)

export default App
