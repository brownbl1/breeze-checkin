import { useEffect, useState } from 'react'
import { missingSettings } from '../models/settings'
import { store } from '../store'

export enum StartingScreen {
  Loading,
  Home,
  Settings,
}

export const useStartingScreen = (): StartingScreen => {
  const [startingScreen, setStartingScreen] = useState<StartingScreen>(
    StartingScreen.Loading,
  )

  useEffect(() => {
    const { settings } = store.getState()

    setStartingScreen(
      missingSettings(settings) ? StartingScreen.Settings : StartingScreen.Home,
    )
  }, [])

  return startingScreen
}
