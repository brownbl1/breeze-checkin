import React from 'react'
import * as Sentry from 'sentry-expo'
import { Provider } from 'react-redux'
import Constants from 'expo-constants'
import { getPersistor } from '@rematch/persist'
import { PersistGate } from 'redux-persist/lib/integration/react'

import { NavigationRoot } from './src/navigation/AppNavigator'
import { SentryBoundary } from './src/components/SentryBoundary'
import { store } from './src/store'
import { AppLoading } from 'expo'

Sentry.init({
  dsn: Constants.manifest.extra.SENTRY_DSN,
  enableInExpoDevelopment: false,
  debug: __DEV__,
})

const persistor = getPersistor()

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<AppLoading />}>
        <SentryBoundary>
          <NavigationRoot />
        </SentryBoundary>
      </PersistGate>
    </Provider>
  )
}
