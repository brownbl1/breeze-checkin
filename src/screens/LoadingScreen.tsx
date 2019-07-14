import React, { useEffect } from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { AppLoading } from 'expo'

import { getPrinter } from '../helpers/getPrinter'
import { getEvent } from '../helpers/getEvent'
import { store } from '../store'

export const LoadingScreen: React.FC<NavigationScreenProps> = ({
  navigation,
}) => {
  useEffect(() => {
    Promise.all([getPrinter(), getEvent()]).then(
      async ([printer, eventData]) => {
        if (printer) {
          store.dispatch.printer.select(printer)
        }

        if (eventData && eventData.event) {
          store.dispatch.event.select(eventData.event)
          store.dispatch.event.selectTeacher(eventData.teacherId)
          store.dispatch.teachers.setAsync(eventData.teacherId)
          await store.dispatch.eventPeople.selectAsync(eventData.event.id)
          navigation.navigate('Home')
          return
        }

        navigation.navigate('Select Date')
      }
    )
  }, [])

  return <AppLoading />
}
