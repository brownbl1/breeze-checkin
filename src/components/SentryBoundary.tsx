/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { Text, View } from 'react-native'
import * as Sentry from 'sentry-expo'
import { store } from '../store'

type State = {
  hasError: boolean
  eventId: string | null
  error?: Error | null
  errorInfo?: unknown
}

export class SentryBoundary extends React.Component<unknown, State> {
  state = { hasError: false, eventId: null }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    }
  }

  componentDidCatch = (error: Error | null, errorInfo: unknown) => {
    if (!__DEV__) {
      const eventId = Sentry.Native.captureException(error, {
        extra: {
          state: store.getState(),
          errorInfo,
        },
      })

      this.setState({
        error,
        errorInfo,
        eventId,
      })
    }
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
        {this.state.eventId && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text>Event Id: </Text>
            <View
              style={{
                backgroundColor: 'rgba(27,31,35,.05)',
                borderColor: 'rgba(27,31,35,.05)',
                borderRadius: 3,
                paddingTop: 3.2,
                paddingBottom: 3.2,
                paddingLeft: 6.4,
                paddingRight: 6.4,
              }}
            >
              <Text>{this.state.eventId}</Text>
            </View>
          </View>
        )}
      </View>
    ) : (
      this.props.children
    )
}
