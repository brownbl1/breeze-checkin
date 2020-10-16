import { useEffect, useState } from 'react'

import { getPrinter } from '../helpers/getPrinter'
import { getEvent } from '../helpers/getEvent'
import { store } from '../store'

export enum StartingScreen {
  Loading,
  Home,
  SelectDate,
}

export const useStartingScreen = () => {
  const [startingScreen, setStartingScreen] = useState<StartingScreen>(
    StartingScreen.Loading,
  )

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
          setStartingScreen(StartingScreen.Home)
          return
        }

        setStartingScreen(StartingScreen.SelectDate)
      },
    )
  }, [])

  return startingScreen
}
