import React from 'react'
import { View, Text } from 'react-native'
import Sentry from 'sentry-expo'

export class SentryBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    }
  }

  componentDidCatch = (error, errorInfo) => {
    this.setState({
      error,
      errorInfo,
    })

    Sentry.captureException(error, {
      extra: {
        // state: this.props.store.getState(),
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
        <Text>
          Something went wrong. Please pray for help with this error and you
          might be assisted.
        </Text>
      </View>
    ) : (
      this.props.children
    )
}
