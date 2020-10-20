import React from 'react'
import Sentry from 'sentry-expo'
import { Provider } from 'react-redux'

import { NavigationRoot } from './src/navigation/AppNavigator'
import { SENTRY_DSN } from './src/env'
import { SentryBoundary } from './src/SentryBoundary'
import { store } from './src/store'

Sentry.config(SENTRY_DSN).install()

export default function App() {
  return (
    <Provider store={store}>
      <SentryBoundary>
        <NavigationRoot />
      </SentryBoundary>
    </Provider>
  )
}
