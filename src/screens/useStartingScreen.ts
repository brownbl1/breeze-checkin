import { useEffect, useState } from 'react'
import { getSettings } from '../helpers/getSettings'
import { store } from '../store'

export enum StartingScreen {
  Loading,
  Home,
  Settings,
}

export const useStartingScreen = () => {
  const [startingScreen, setStartingScreen] = useState<StartingScreen>(
    StartingScreen.Loading,
  )

  useEffect(() => {
    getSettings().then(async (settings) => {
      console.log('SETTINGS', settings)

      if (settings) {
        store.dispatch.settings.setAll(settings)

        if (
          !settings.entrustEventId ||
          !settings.teacherEventId ||
          !settings.date ||
          !settings.printer
        ) {
          setStartingScreen(StartingScreen.Settings)
          return
        }

        await store.dispatch.events.selectAsync()

        setStartingScreen(StartingScreen.Home)
        return
      }

      setStartingScreen(StartingScreen.Settings)
    })
  }, [startingScreen])

  return startingScreen
}
