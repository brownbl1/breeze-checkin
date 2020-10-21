import { useEffect, useState } from 'react'
import { getSettings, missingSettings } from '../helpers/getSettings'
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
        const defaultedSettings = {
          ...settings,
          dayOfWeek: settings.dayOfWeek ?? 0,
        }

        await store.dispatch.settings.setAllAsync(defaultedSettings)
        setStartingScreen(
          missingSettings(defaultedSettings)
            ? StartingScreen.Settings
            : StartingScreen.Home,
        )

        return
      }

      setStartingScreen(StartingScreen.Settings)
    })
  }, [])

  return startingScreen
}
