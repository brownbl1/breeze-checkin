import React from 'react'
import * as Sentry from 'sentry-expo'
import { Provider } from 'react-redux'
import Constants from 'expo-constants'

import { NavigationRoot } from './src/navigation/AppNavigator'
import { SentryBoundary } from './src/SentryBoundary'
import { store } from './src/store'

Sentry.init({
  dsn: Constants.manifest.extra.SENTRY_DSN,
  enableInExpoDevelopment: false,
  debug: __DEV__,
})

export default function App() {
  return (
    <Provider store={store}>
      <SentryBoundary>
        <NavigationRoot />
      </SentryBoundary>
    </Provider>
  )
}
