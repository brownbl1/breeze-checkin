import React from 'react'
import { View, Text } from 'react-native'
import Sentry from 'sentry-expo'
import { store } from './store'

export class SentryBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    }
  }

  componentDidCatch = (error: any, errorInfo: any) => {
    this.setState({
      error,
      errorInfo,
    })

    Sentry.captureException(error, {
      extra: {
        state: store.getState(),
        errorInfo,
      },
    })
  }

  render = () =>
    this.state.hasError ? (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text>Something went wrong.</Text>
      </View>
    ) : (
      this.props.children
    )
}
